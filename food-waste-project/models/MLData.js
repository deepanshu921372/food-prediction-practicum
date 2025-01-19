const mongoose = require('mongoose');

const mlDataSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  event_type: {
    type: String,
    required: true,
    enum: ['Wedding', 'Corporate Event', 'Birthday Party', 'Festival', 'Small Gathering']
  },
  attendees: {
    type: Number,
    required: true
  },
  food_prepared: {
    type: Number,
    required: true
  },
  food_consumed: {
    type: Number,
    required: true
  },
  wasted_food: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('MLData', mlDataSchema); 