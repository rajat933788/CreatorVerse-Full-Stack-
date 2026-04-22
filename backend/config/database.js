const mongoose = require('mongoose');
const seedDatabase = require('../utils/seed');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/creatorverse';
    const conn = await mongoose.connect(uri);
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
    await seedDatabase();
  } catch (err) {
    console.error(`❌  MongoDB connection error: ${err.message}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
