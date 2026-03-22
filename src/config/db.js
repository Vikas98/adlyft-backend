const mongoose = require('mongoose');
const { MONGODB_PRIMARY_URI, MONGODB_SECONDARY_URI } = require('./env');
const createLogger = require('../utils/logger');

const logger = createLogger('Database');

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Primary connection — used for all write operations
let primaryConnection = null;

// Secondary connection — used for read operations (reporting, analytics)
let secondaryConnection = null;

const connectPrimary = async () => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      primaryConnection = await mongoose.createConnection(MONGODB_PRIMARY_URI, {
        readPreference: 'primary',
      });
      logger.info('MongoDB Primary connected', { host: primaryConnection.host });
      return primaryConnection;
    } catch (error) {
      logger.error(`MongoDB Primary connection attempt ${attempt}/${MAX_RETRIES} failed`, {
        message: error.message,
      });
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        logger.info(`Retrying primary connection in ${delay}ms...`);
        await wait(delay);
      } else {
        throw error;
      }
    }
  }
};

const connectSecondary = async () => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      secondaryConnection = await mongoose.createConnection(MONGODB_SECONDARY_URI, {
        readPreference: 'secondaryPreferred',
      });
      logger.info('MongoDB Secondary connected', { host: secondaryConnection.host });
      return secondaryConnection;
    } catch (error) {
      logger.warn(`MongoDB Secondary connection attempt ${attempt}/${MAX_RETRIES} failed`, {
        message: error.message,
      });
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        await wait(delay);
      } else {
        // Secondary is optional — fall back to primary for reads
        logger.warn('MongoDB Secondary unavailable, falling back to primary for reads');
        secondaryConnection = primaryConnection;
        return secondaryConnection;
      }
    }
  }
};

// Also keep the default mongoose connection for backward compatibility
const connectDB = async () => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(MONGODB_PRIMARY_URI);
      logger.info('MongoDB Default connected', { host: mongoose.connection.host });
      break;
    } catch (error) {
      logger.error(`MongoDB Default connection attempt ${attempt}/${MAX_RETRIES} failed`, {
        message: error.message,
      });
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        logger.info(`Retrying default connection in ${delay}ms...`);
        await wait(delay);
      } else {
        logger.error('MongoDB Default connection failed after all retries — exiting');
        process.exit(1);
      }
    }
  }

  await connectPrimary();
  await connectSecondary();
};

const getPrimaryConnection = () => primaryConnection || mongoose.connection;
const getSecondaryConnection = () => secondaryConnection || mongoose.connection;

module.exports = {
  connectDB,
  getPrimaryConnection,
  getSecondaryConnection,
};
