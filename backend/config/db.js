const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error('Missing MONGO_URI environment variable');
    }

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });

    // eslint-disable-next-line no-console
    console.log('MongoDB connected');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
};

module.exports = { connectDB };

