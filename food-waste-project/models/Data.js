const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodPrepared: {
    type: Number,
    required: true
  },
  foodWasted: {
    type: Number,
    required: true
  },
  eventType: {
    type: String,
    required: true
  },
  attendees: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Data', dataSchema);
