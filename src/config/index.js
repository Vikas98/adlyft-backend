const { connectDB, getPrimaryConnection, getSecondaryConnection } = require('./db');
const { connectRedis, getCache, setCache, delCache, incrementCounter } = require('./redis');
const env = require('./env');

module.exports = {
  connectDB,
  getPrimaryConnection,
  getSecondaryConnection,
  connectRedis,
  getCache,
  setCache,
  delCache,
  incrementCounter,
  ...env,
};
