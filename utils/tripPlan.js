const stripMarkdownJson = (text) => {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    return fenced[1].trim();
  }
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end !== -1) {
    return trimmed.slice(start, end + 1);
  }
  return trimmed;
};

/** Gemini sometimes returns control chars (U+0000–U+001F) that break JSON.parse */
const sanitizeAiJsonText = (text) => {
  let cleaned = stripMarkdownJson(text);

  cleaned = cleaned
    .replace(/\uFEFF/g, "")
    .replace(/\u0000/g, "")
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");

  return cleaned.trim();
};

/** Firestore rejects `undefined`; strip it recursively before setDoc */
export const stripUndefinedForFirestore = (value) => {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => stripUndefinedForFirestore(item))
      .filter((item) => item !== undefined);
  }
  if (typeof value === "object") {
    const cleaned = {};
    Object.entries(value).forEach(([key, nested]) => {
      if (nested === undefined) {
        return;
      }
      const next = stripUndefinedForFirestore(nested);
      if (next !== undefined) {
        cleaned[key] = next;
      }
    });
    return cleaned;
  }
  return value;
};

const str = (value) => {
  if (value == null) return "";
  return String(value);
};

const normalizeLocation = (slot) => {
  if (!slot || typeof slot !== "object") {
    return null;
  }
  const location = slot.location || slot;
  if (!location || typeof location !== "object") {
    return null;
  }

  return {
    name: str(location.name),
    details: str(location.details),
    image_url: str(location.image_url || location.imageUrl),
    geo_coordinates: str(
      location.geo_coordinates || location.geoCoordinates || location.coordinates
    ),
    ticket_pricing: str(location.ticket_pricing || location.ticketPricing),
    time_to_travel: str(location.time_to_travel || location.timeToTravel),
  };
};

const normalizeTimeSlot = (slot) => {
  if (!slot || typeof slot !== "object") {
    return null;
  }
  const location = normalizeLocation(slot);
  if (!location?.name && !slot.time) {
    return null;
  }
  return {
    time: str(slot.time),
    location,
  };
};

const normalizeDayPlan = (day) => {
  if (!day || typeof day !== "object") {
    return null;
  }
  const normalized = {
    morning: normalizeTimeSlot(day.morning),
    afternoon: normalizeTimeSlot(day.afternoon),
    evening: normalizeTimeSlot(day.evening),
  };
  if (!normalized.morning && !normalized.afternoon && !normalized.evening) {
    return null;
  }
  return normalized;
};

export const parseAiTripResponse = (responseText) => {
  const jsonText = sanitizeAiJsonText(responseText);

  try {
    const parsed = JSON.parse(jsonText);
    return normalizeTripPlan(parsed);
  } catch (firstError) {
    const relaxed = jsonText
      .replace(/[\n\t]/g, " ")
      .replace(/\s+/g, " ")
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]");

    try {
      const parsed = JSON.parse(relaxed);
      return normalizeTripPlan(parsed);
    } catch {
      throw new Error(
        `Invalid JSON format: ${firstError.message || "Could not parse AI response"}`
      );
    }
  }
};

export const normalizeTripPlan = (data) => {
  if (!data || typeof data !== "object") {
    return { flight: null, hotels: [], itinerary: null };
  }

  if (data.text && !data.flight && !data.hotels && !data.itinerary) {
    return { flight: null, hotels: [], itinerary: null, text: data.text };
  }

  const source = data.tripPlan || data.trip_plan || data.plan || data;

  const rawFlight =
    source.flight ||
    source.Flight ||
    source.flights?.[0] ||
    source.flight_details ||
    null;

  const rawHotelsInput =
    source.hotels ||
    source.Hotels ||
    source.hotel_recommendations ||
    source.hotelRecommendations ||
    source.hotel_list ||
    [];

  const rawHotels = (() => {
    if (Array.isArray(rawHotelsInput)) return rawHotelsInput;
    if (!rawHotelsInput || typeof rawHotelsInput !== "object") return [];
    if (Array.isArray(rawHotelsInput.list)) return rawHotelsInput.list;
    if (Array.isArray(rawHotelsInput.recommendations)) {
      return rawHotelsInput.recommendations;
    }
    return Object.values(rawHotelsInput).filter(
      (item) => item && typeof item === "object" && !Array.isArray(item)
    );
  })();

  const rawItinerary =
    source.itinerary ||
    source.Itinerary ||
    source.day_plan ||
    source.days ||
    source.planned_trip ||
    null;

  const flightDetails = rawFlight?.details || rawFlight;
  const flight = rawFlight
    ? stripUndefinedForFirestore({
        details:
          flightDetails && typeof flightDetails === "object"
            ? {
                airline: str(flightDetails.airline),
                departure_city: str(
                  flightDetails.departure_city || flightDetails.departureCity
                ),
                arrival_city: str(
                  flightDetails.arrival_city || flightDetails.arrivalCity
                ),
                departure_date: str(
                  flightDetails.departure_date || flightDetails.departureDate
                ),
                return_date: str(
                  flightDetails.return_date || flightDetails.returnDate
                ),
                flight_number: str(
                  flightDetails.flight_number || flightDetails.flightNumber
                ),
                class: str(flightDetails.class),
              }
            : { airline: str(rawFlight.airline) },
        price: str(rawFlight.price || rawFlight.flight_price || rawFlight.cost),
        booking_url: str(
          rawFlight.booking_url ||
            rawFlight.bookingUrl ||
            rawFlight.booking_link
        ),
      })
    : null;

  const hotels = (Array.isArray(rawHotels) ? rawHotels : [rawHotels])
    .filter(Boolean)
    .map((hotel) => ({
      name: str(hotel.name || hotel.HotelName || hotel.hotel_name),
      address: str(hotel.address || hotel.Address || hotel.hotel_address),
      price: str(hotel.price || hotel.Price),
      image_url: str(
        hotel.image_url || hotel.imageUrl || hotel.hotel_image_url || hotel.photo
      ),
      rating: hotel.rating ?? hotel.Rating ?? "",
      geo_coordinates: str(
        hotel.geo_coordinates || hotel.geoCoordinates || hotel.coordinates
      ),
      description: str(hotel.description || hotel.Description),
    }))
    .filter((hotel) => hotel.name);

  return stripUndefinedForFirestore({
    flight,
    hotels,
    itinerary: normalizeItinerary(rawItinerary),
  });
};

const normalizeItinerary = (itinerary) => {
  if (!itinerary || typeof itinerary !== "object") {
    return null;
  }

  let days = itinerary;
  if (Array.isArray(itinerary)) {
    days = {};
    itinerary.forEach((dayPlan, index) => {
      days[`day${index + 1}`] = dayPlan;
    });
  }

  const normalized = {};
  Object.entries(days).forEach(([dayKey, dayPlan]) => {
    const day = normalizeDayPlan(dayPlan);
    if (day) {
      normalized[dayKey] = day;
    }
  });

  return Object.keys(normalized).length ? normalized : null;
};
