const { createClient } = require('redis');
const { REDIS_URL } = require('./env');

let client = null;
let isConnected = false;

// In-memory fallback cache
const memoryCache = new Map();

const connectRedis = async () => {
  try {
    client = createClient({ url: REDIS_URL });
    client.on('error', (err) => {
      console.warn('Redis error, falling back to in-memory cache:', err.message);
      isConnected = false;
    });
    client.on('connect', () => {
      console.log('Redis Connected');
      isConnected = true;
    });
    await client.connect();
  } catch (error) {
    console.warn('Redis not available, using in-memory cache fallback:', error.message);
    isConnected = false;
  }
};

const getCache = async (key) => {
  try {
    if (isConnected && client) {
      const val = await client.get(key);
      return val ? JSON.parse(val) : null;
    }
  } catch (e) {
    // fall through to memory cache
  }
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (entry.expiry && Date.now() > entry.expiry) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value;
};

const setCache = async (key, value, ttlSeconds = 300) => {
  try {
    if (isConnected && client) {
      await client.setEx(key, ttlSeconds, JSON.stringify(value));
      return;
    }
  } catch (e) {
    // fall through to memory cache
  }
  memoryCache.set(key, { value, expiry: Date.now() + ttlSeconds * 1000 });
};

const delCache = async (key) => {
  try {
    if (isConnected && client) {
      await client.del(key);
      return;
    }
  } catch (e) {
    // fall through
  }
  memoryCache.delete(key);
};

const incrementCounter = async (key) => {
  try {
    if (isConnected && client) {
      return await client.incr(key);
    }
  } catch (e) {
    // fall through
  }
  const current = memoryCache.get(key) || { value: 0 };
  const newVal = (typeof current.value === 'number' ? current.value : 0) + 1;
  memoryCache.set(key, { value: newVal });
  return newVal;
};

module.exports = { connectRedis, getCache, setCache, delCache, incrementCounter };
