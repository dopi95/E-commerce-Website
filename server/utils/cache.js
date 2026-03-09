const cache = new Map();
const CACHE_TTL = 300000; // 5 minutes

export const setCache = (key, value, ttl = CACHE_TTL) => {
  cache.set(key, {
    value,
    expiry: Date.now() + ttl
  });
};

export const getCache = (key) => {
  const item = cache.get(key);
  if (!item) return null;
  
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  
  return item.value;
};

export const clearCache = (key) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};
