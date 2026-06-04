import axios from "axios";
import {
  getPlaceApiKey,
  getPlaceApiKeyCount,
  getActivePlaceApiKeyCount,
  getOrderedPlaceApiKeys,
  markPlaceKeyFailed,
  markPlaceKeySuccess,
  runThrottled,
  getApiErrorStatus,
} from "./placeApiKeyPool";

export { getPlaceApiKey, getPlaceApiKeyCount, getActivePlaceApiKeyCount };

const RAPIDAPI_HOST = "google-map-places-new-v2.p.rapidapi.com";
const RAPIDAPI_BASE = "https://google-map-places-new-v2.p.rapidapi.com/v1";

const photoDataUriCache = new Map();
const photoByNameCache = new Map();

const getHeaders = (apiKey, fieldMask) => ({
  "x-rapidapi-key": apiKey,
  "x-rapidapi-host": RAPIDAPI_HOST,
  ...(fieldMask ? { "X-Goog-FieldMask": fieldMask } : {}),
});

const BLOCKED_IMAGE_HOSTS = [
  "example.com",
  "example.org",
  "placeholder.com",
  "via.placeholder.com",
  "placehold.co",
  "dummyimage.com",
];

const isValidImageUrl = (url) => {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) return false;

  try {
    const host = new URL(trimmed).hostname.toLowerCase();
    if (
      BLOCKED_IMAGE_HOSTS.some(
        (blocked) => host === blocked || host.endsWith(`.${blocked}`)
      )
    ) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
};

const arrayBufferToBase64 = (buffer) => {
  if (!buffer) return "";
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    const slice = bytes.subarray(i, i + chunk);
    binary += String.fromCharCode.apply(null, slice);
  }
  return global.btoa(binary);
};

const downloadImageAsDataUri = async (url, headers) => {
  const response = await axios.get(url, {
    headers,
    responseType: "arraybuffer",
    maxRedirects: 10,
    timeout: 20000,
  });

  const contentType = response.headers["content-type"] || "image/jpeg";
  if (!contentType.startsWith("image/")) {
    return null;
  }

  const base64 = arrayBufferToBase64(response.data);
  if (!base64) return null;

  return `data:${contentType.split(";")[0]};base64,${base64}`;
};

const shouldTryNextKey = (error) => {
  const status = getApiErrorStatus(error);
  return status === 401 || status === 403 || status === 429;
};

async function withApiKeys(fn) {
  const keys = getOrderedPlaceApiKeys();
  if (!keys.length) {
    if (getActivePlaceApiKeyCount() === 0 && getPlaceApiKeyCount() > 0) {
      return { result: null, error: "invalid_key" };
    }
    return { result: null, error: "missing_key" };
  }

  let lastError = "api_error";
  let sawRateLimit = false;
  let sawInvalid = false;

  for (const apiKey of keys) {
    try {
      const result = await runThrottled(() => fn(apiKey));
      if (result != null) {
        markPlaceKeySuccess(apiKey);
        return { result, error: null };
      }
    } catch (error) {
      const status = getApiErrorStatus(error);
      if (shouldTryNextKey(error)) {
        markPlaceKeyFailed(apiKey, status);
        if (status === 429) sawRateLimit = true;
        if (status === 403 || status === 401) sawInvalid = true;
        continue;
      }
      lastError = "api_error";
    }
  }

  if (sawRateLimit) return { result: null, error: "rate_limit" };
  if (sawInvalid) return { result: null, error: "invalid_key" };
  return { result: null, error: lastError };
}

export const fetchPlacePhotoDataUri = async (photoReference) => {
  if (!photoReference?.startsWith("places/") || !getPlaceApiKeyCount()) {
    return null;
  }

  if (photoDataUriCache.has(photoReference)) {
    return photoDataUriCache.get(photoReference);
  }

  const mediaUrl = `${RAPIDAPI_BASE}/${photoReference}/media?maxWidthPx=800&maxHeightPx=800`;

  for (const apiKey of getOrderedPlaceApiKeys(6)) {
    try {
      const dataUri = await runThrottled(() =>
        downloadImageAsDataUri(mediaUrl, getHeaders(apiKey))
      );
      if (dataUri) {
        markPlaceKeySuccess(apiKey);
        photoDataUriCache.set(photoReference, dataUri);
        return dataUri;
      }
    } catch (error) {
      markPlaceKeyFailed(apiKey, getApiErrorStatus(error));
    }
  }

  const publicUrl = await fetchPlacePhotoUrl(photoReference);
  if (publicUrl) {
    try {
      const dataUri = await downloadImageAsDataUri(publicUrl);
      if (dataUri) {
        photoDataUriCache.set(photoReference, dataUri);
        return dataUri;
      }
    } catch {
      return null;
    }
  }

  return null;
};

const mapAutocompleteSuggestion = (suggestion) => {
  const prediction = suggestion?.placePrediction;
  if (!prediction?.placeId) return null;

  return {
    place_id: prediction.placeId,
    description: prediction.text?.text || "",
  };
};

const mapPlaceDetails = (place) => {
  if (!place) return null;

  const lat = place.location?.latitude;
  const lng = place.location?.longitude;
  const photoName = place.photos?.[0]?.name || null;
  const placeId = place.id;
  const name = place.displayName?.text || "";
  const mapsUrl = placeId
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        name
      )}&query_place_id=${placeId}`
    : null;

  return {
    name,
    formatted_address: place.formattedAddress,
    geometry:
      lat != null && lng != null
        ? { location: { lat, lng } }
        : undefined,
    photos: photoName ? [{ photo_reference: photoName }] : [],
    url: place.websiteUri || mapsUrl,
    place_id: placeId,
  };
};

export const fetchPlaceSuggestions = async (inputText) => {
  if (!inputText || !getPlaceApiKeyCount()) {
    return { predictions: [], error: "missing_key" };
  }

  const { result, error } = await withApiKeys(async (apiKey) => {
    const response = await axios.post(
      `${RAPIDAPI_BASE}/places:autocomplete`,
      { input: inputText },
      {
        headers: {
          ...getHeaders(apiKey),
          "Content-Type": "application/json",
        },
      }
    );

    const predictions = (response.data?.suggestions || [])
      .map(mapAutocompleteSuggestion)
      .filter(Boolean);

    return predictions.length ? { predictions } : null;
  });

  if (result?.predictions) {
    return { predictions: result.predictions, error: null };
  }
  return { predictions: [], error: error || "api_error" };
};

export const fetchPlaceDetailsById = async (placeId) => {
  if (!placeId || !getPlaceApiKeyCount()) return null;

  const { result } = await withApiKeys(async (apiKey) => {
    const response = await axios.get(
      `${RAPIDAPI_BASE}/places/${encodeURIComponent(placeId)}`,
      {
        headers: getHeaders(
          apiKey,
          "id,displayName,location,photos,formattedAddress,websiteUri"
        ),
      }
    );
    return mapPlaceDetails(response.data);
  });

  return result;
};

export const fetchPlacePhotoUrl = async (photoReference) => {
  if (!photoReference || !getPlaceApiKeyCount()) {
    return null;
  }

  const photoPath = photoReference.startsWith("places/")
    ? photoReference
    : null;

  if (!photoPath) {
    return null;
  }

  const mediaUrl = `${RAPIDAPI_BASE}/${photoPath}/media?maxWidthPx=800&maxHeightPx=800`;

  for (const apiKey of getOrderedPlaceApiKeys(4)) {
    try {
      const response = await runThrottled(() =>
        fetch(mediaUrl, {
          method: "GET",
          headers: getHeaders(apiKey),
          redirect: "manual",
        })
      );

      if (response.status === 301 || response.status === 302) {
        const location =
          response.headers.get("Location") ||
          response.headers.get("location");
        if (isValidImageUrl(location)) {
          markPlaceKeySuccess(apiKey);
          return location.trim();
        }
      }
    } catch {
      // try axios
    }

    try {
      const response = await axios.get(mediaUrl, {
        headers: getHeaders(apiKey),
        maxRedirects: 0,
        validateStatus: (status) => status === 302 || status === 301,
      });
      const location = response.headers?.location;
      if (isValidImageUrl(location)) {
        markPlaceKeySuccess(apiKey);
        return location.trim();
      }
    } catch (error) {
      markPlaceKeyFailed(apiKey, getApiErrorStatus(error));
    }
  }

  return null;
};

const searchPlacesByText = async (textQuery) => {
  if (!textQuery || !getPlaceApiKeyCount()) {
    return null;
  }

  const { result } = await withApiKeys(async (apiKey) => {
    const response = await axios.post(
      `${RAPIDAPI_BASE}/places:searchText`,
      { textQuery },
      {
        headers: {
          ...getHeaders(
            apiKey,
            "places.id,places.displayName,places.location,places.photos"
          ),
          "Content-Type": "application/json",
        },
      }
    );

    const places = response.data?.places || [];
    if (!places.length) return null;

    return {
      results: places.map((place) => ({
        name: place.displayName?.text,
        geometry: {
          location: {
            lat: place.location?.latitude,
            lng: place.location?.longitude,
          },
        },
        photos: (place.photos || []).map((photo) => ({
          photo_reference: photo.name,
        })),
      })),
    };
  });

  return result;
};

export const GetPhotoRef = async (placeName, locationHint) => {
  const textQuery = [placeName, locationHint].filter(Boolean).join(" ").trim();
  return searchPlacesByText(textQuery);
};

const buildSearchQueries = (placeName, locationHint, address) => {
  const queries = [
    [placeName, locationHint].filter(Boolean).join(" "),
    [placeName, address].filter(Boolean).join(" "),
    placeName,
    [placeName, locationHint?.split(",")[0]].filter(Boolean).join(" "),
  ]
    .map((q) => q?.trim())
    .filter(Boolean);

  return [...new Set(queries)];
};

export const fetchPlacePhotoByName = async (placeName, locationHint, address) => {
  if (!getPlaceApiKeyCount()) {
    console.warn("No RapidAPI keys in .env — add EXPO_GOOGLE_PLACE_KEYS");
    return { photoDataUri: null, photoUrl: null, geometry: null };
  }

  const cacheKey = buildSearchQueries(placeName, locationHint, address)[0];
  if (cacheKey && photoByNameCache.has(cacheKey)) {
    return photoByNameCache.get(cacheKey);
  }

  const queries = buildSearchQueries(placeName, locationHint, address);
  let photoReference = null;
  let geometry = null;

  for (const textQuery of queries) {
    const result = await searchPlacesByText(textQuery);
    const first = result?.results?.[0];
    if (first?.photos?.[0]?.photo_reference) {
      photoReference = first.photos[0].photo_reference;
      geometry = first.geometry?.location ?? null;
      break;
    }
  }

  if (!photoReference) {
    const empty = { photoDataUri: null, photoUrl: null, geometry };
    return empty;
  }

  const photoDataUri = await fetchPlacePhotoDataUri(photoReference);
  const photoUrl = photoDataUri ? null : await fetchPlacePhotoUrl(photoReference);
  const result = { photoDataUri, photoUrl, geometry };

  if (cacheKey && photoDataUri) {
    photoByNameCache.set(cacheKey, result);
  }

  return result;
};

export { isValidImageUrl };
