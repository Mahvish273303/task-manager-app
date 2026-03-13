const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/task_manager_db';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });

    // eslint-disable-next-line no-console
    console.log('MongoDB connected');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = { connectDB };

