const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const MLData = require('../models/MLData');
require('dotenv').config();

async function populateData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await MLData.deleteMany({});
    console.log('Cleared existing data');

    const results = [];
    
    // Fix the path using path.resolve
    const csvPath = path.resolve(__dirname, '../../ml_model/dummy_food_data.csv');
    console.log('Looking for CSV file at:', csvPath);
    
    // Read CSV file
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => results.push({
        date: new Date(data.date),
        event_type: data.event_type,
        attendees: parseInt(data.attendees),
        food_prepared: parseFloat(data.food_prepared),
        food_consumed: parseFloat(data.food_consumed),
        wasted_food: parseFloat(data.wasted_food)
      }))
      .on('end', async () => {
        try {
          await MLData.insertMany(results);
          console.log('Data imported successfully');
          mongoose.connection.close();
        } catch (err) {
          console.error('Error importing data:', err);
          mongoose.connection.close();
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        mongoose.connection.close();
      });
  } catch (err) {
    console.error('Error:', err);
    mongoose.connection.close();
  }
}

populateData(); 