const express = require('express');
const MLData = require('../models/MLData');
const { runPythonScript } = require('../utils/pythonRunner');
const router = express.Router();
const auth = require('../middleware/auth');

// Get all ML data
router.get('/', auth, async (req, res) => {
  try {
    const data = await MLData.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    console.error('Error fetching ML data:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new ML data
router.post('/', async (req, res) => {
  try {
    const newData = new MLData(req.body);
    await newData.save();
    
    // Retrain model with new data
    try {
      await runPythonScript('train_model.py');
    } catch (pythonError) {
      console.error('Error running ML model:', pythonError);
    }
    
    res.status(201).json({ message: 'Data added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Predict endpoint
router.post('/predict', auth, async (req, res) => {
  try {
    console.log('Prediction request body:', req.body);
    
    // Validate input
    if (!req.body.date || !req.body.event_type || !req.body.attendees) {
      return res.status(400).json({ 
        message: 'Missing required fields: date, event_type, and attendees are required' 
      });
    }

    // Validate event type
    const validEventTypes = [
      'Wedding',
      'Corporate Event',
      'Birthday Party',
      'Festival',
      'Small Gathering'
    ];

    if (!validEventTypes.includes(req.body.event_type)) {
      return res.status(400).json({ 
        message: `Invalid event type. Must be one of: ${validEventTypes.join(', ')}` 
      });
    }

    // Validate attendees
    const attendees = parseInt(req.body.attendees);
    if (isNaN(attendees) || attendees <= 0) {
      return res.status(400).json({ 
        message: 'Attendees must be a positive number' 
      });
    }

    // Format date
    const date = new Date(req.body.date).toISOString().split('T')[0];

    const prediction = await runPythonScript('predict.py', [
      JSON.stringify({
        date: date,
        event_type: req.body.event_type,
        attendees: attendees
      })
    ]);
    
    console.log('Python script response:', prediction);

    if (prediction && prediction.length > 0) {
      const predictionValue = parseFloat(prediction[0]);
      if (!isNaN(predictionValue)) {
        res.json({ 
          prediction: predictionValue,
          message: 'Prediction successful'
        });
      } else {
        throw new Error('Invalid prediction value returned');
      }
    } else {
      throw new Error('No prediction value returned');
    }
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ message: 'Error making prediction', error: error.message });
  }
});

module.exports = router; 