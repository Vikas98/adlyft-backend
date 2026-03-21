const mongoose = require('mongoose');
const { MONGODB_PRIMARY_URI, MONGODB_SECONDARY_URI } = require('./env');

// Primary connection — used for all write operations
let primaryConnection = null;

// Secondary connection — used for read operations (reporting, analytics)
let secondaryConnection = null;

const connectPrimary = async () => {
  try {
    primaryConnection = await mongoose.createConnection(MONGODB_PRIMARY_URI, {
      readPreference: 'primary',
    });
    console.log(`MongoDB Primary Connected: ${primaryConnection.host}`);
    return primaryConnection;
  } catch (error) {
    console.error(`MongoDB Primary Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const connectSecondary = async () => {
  try {
    secondaryConnection = await mongoose.createConnection(MONGODB_SECONDARY_URI, {
      readPreference: 'secondaryPreferred',
    });
    console.log(`MongoDB Secondary Connected: ${secondaryConnection.host}`);
    return secondaryConnection;
  } catch (error) {
    console.error(`MongoDB Secondary Connection Error: ${error.message}`);
    // Secondary is optional — fall back to primary for reads if secondary fails
    console.warn('Falling back to primary connection for reads');
    secondaryConnection = primaryConnection;
    return secondaryConnection;
  }
};

// Also keep the default mongoose connection for backward compatibility
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_PRIMARY_URI);
    console.log(`MongoDB Default Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
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
