const mongoose = require('mongoose');
const Data = require('../models/Data');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function migrateData() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the first user (or specify a default user ID)
    const defaultUser = await User.findOne();
    
    if (!defaultUser) {
      console.error('No users found in the database');
      process.exit(1);
    }

    console.log('Updating data entries...');
    // Update all existing data to belong to the default user
    const result = await Data.updateMany(
      { userId: { $exists: false } },
      { $set: { userId: defaultUser._id } }
    );

    console.log(`Updated ${result.modifiedCount} documents`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

migrateData(); 