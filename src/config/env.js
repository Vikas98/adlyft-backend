require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/adlyft',
  MONGODB_PRIMARY_URI: process.env.MONGODB_PRIMARY_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/adlyft',
  MONGODB_SECONDARY_URI: process.env.MONGODB_SECONDARY_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/adlyft',
  JWT_SECRET: process.env.JWT_SECRET || 'adlyft-super-secret-key-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
