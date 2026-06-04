import {
  EXPO_GOOGLE_PLACE_KEYS,
  EXPO_GOOGLE_PLACE_KEY_SAYMYNAME,
  EXPO_GOOGLE_PLACE_KEY_SUMIT,
  EXPO_GOOGLE_PLACE_KEY_2,
  EXPO_GOOGLE_PLACE_KEY_107,
  EXPO_GOOGLE_MAP_KEY_774,
  EXPO_GOOGLE_MAP_KEY_479,
  EXPO_GOOGLE_PLACE_KEY_EXTRA_1,
  EXPO_GOOGLE_PLACE_KEY_EXTRA_2,
  EXPO_GOOGLE_PLACE_KEY_EXTRA_3,
  EXPO_GOOGLE_PLACE_KEY_EXTRA_4,
  EXPO_GOOGLE_PLACE_KEY_EXTRA_5,
} from "@env";

const COOLDOWN_MS = 45_000;
const MAX_CONCURRENT = 3;
const MAX_KEYS_PER_REQUEST = 4;

let rotateIndex = 0;
let inFlight = 0;
const waitQueue = [];
const cooldownUntil = new Map();
const blockedKeys = new Set();

const normalizeKey = (key) =>
  (key || "").trim().replace(/image\.png$/i, "");

const collectKeys = () => {
  const prioritized = [
    EXPO_GOOGLE_PLACE_KEY_2,
    EXPO_GOOGLE_MAP_KEY_774,
    EXPO_GOOGLE_PLACE_KEY_107,
    EXPO_GOOGLE_MAP_KEY_479,
    EXPO_GOOGLE_PLACE_KEY_EXTRA_1,
    EXPO_GOOGLE_PLACE_KEY_EXTRA_2,
    EXPO_GOOGLE_PLACE_KEY_EXTRA_3,
    EXPO_GOOGLE_PLACE_KEY_EXTRA_4,
    EXPO_GOOGLE_PLACE_KEY_EXTRA_5,
    EXPO_GOOGLE_PLACE_KEY_SAYMYNAME,
  ].map(normalizeKey);

  const fromList = (EXPO_GOOGLE_PLACE_KEYS || "")
    .split(",")
    .map(normalizeKey)
    .filter((key) => key.length > 12);

  const extras = [
    EXPO_GOOGLE_PLACE_KEY_EXTRA_1,
    EXPO_GOOGLE_PLACE_KEY_EXTRA_2,
    EXPO_GOOGLE_PLACE_KEY_EXTRA_3,
    EXPO_GOOGLE_PLACE_KEY_EXTRA_4,
    EXPO_GOOGLE_PLACE_KEY_EXTRA_5,
  ].map(normalizeKey);

  return [...new Set([...prioritized, ...fromList, ...extras].filter(Boolean))];
};

let cachedKeys = null;

export const getPlaceApiKeys = () => {
  if (!cachedKeys) {
    cachedKeys = collectKeys();
  }
  return cachedKeys;
};

export const getPlaceApiKeyCount = () => getPlaceApiKeys().length;

export const getActivePlaceApiKeyCount = () =>
  getPlaceApiKeys().filter((key) => !blockedKeys.has(key)).length;

export const getPlaceApiKey = () => getOrderedPlaceApiKeys()[0] || "";

const isKeyOnCooldown = (key) => (cooldownUntil.get(key) || 0) > Date.now();

export const markPlaceKeySuccess = (key) => {
  cooldownUntil.delete(key);
};

/** Only 429 = temporary rate limit. 403 = not subscribed → block key for this session. */
export const markPlaceKeyFailed = (key, status) => {
  if (!key) return;

  if (status === 403 || status === 401) {
    blockedKeys.add(key);
    return;
  }

  if (status === 429) {
    cooldownUntil.set(key, Date.now() + COOLDOWN_MS);
  }
};

export const getOrderedPlaceApiKeys = (limit = MAX_KEYS_PER_REQUEST) => {
  const all = getPlaceApiKeys().filter((key) => !blockedKeys.has(key));
  if (!all.length) return [];

  const available = all.filter((key) => !isKeyOnCooldown(key));
  const pool = available.length ? available : all;

  const start = rotateIndex % pool.length;
  rotateIndex += 1;

  const ordered = [];
  for (let i = 0; i < pool.length && ordered.length < limit; i += 1) {
    ordered.push(pool[(start + i) % pool.length]);
  }
  return ordered;
};

export const runThrottled = async (task) => {
  while (inFlight >= MAX_CONCURRENT) {
    await new Promise((resolve) => {
      waitQueue.push(resolve);
    });
  }

  inFlight += 1;
  try {
    return await task();
  } finally {
    inFlight -= 1;
    const next = waitQueue.shift();
    if (next) next();
  }
};

export const getApiErrorStatus = (error) => error?.response?.status;
