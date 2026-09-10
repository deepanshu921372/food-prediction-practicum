const express = require("express");
const Data = require("../models/Data");
const MLData = require("../models/MLData");
const { runPythonScript } = require('../utils/pythonRunner');
const auth = require('../middleware/auth');

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { foodPrepared, foodWasted, eventType, attendees } = req.body;
    
    // Validate required fields
    if (!foodPrepared || !foodWasted || !eventType || !attendees) {
      return res.status(400).json({ 
        error: 'Missing required fields. Please provide foodPrepared, foodWasted, eventType, and attendees.' 
      });
    }

    // Save regular food waste data
    const newData = new Data({
      userId: req.user.id,
      date: req.body.date,
      foodPrepared: Number(foodPrepared),
      foodWasted: Number(foodWasted),
      eventType,
      attendees: Number(attendees),
      notes: req.body.notes
    });
    const savedData = await newData.save();
    
    // Calculate food consumed
    const foodConsumed = Number(foodPrepared) - Number(foodWasted);
    
    // Also save to ML data with the same event type
    const mlData = new MLData({
      date: req.body.date,
      event_type: eventType, // Use the same event type from the request
      attendees: Number(attendees),
      food_prepared: Number(foodPrepared),
      food_consumed: foodConsumed,
      wasted_food: Number(foodWasted)
    });
    await mlData.save();
    
    // Try to retrain model, but don't wait for it
    runPythonScript('train_model.py').catch(console.error);
    
    res.status(201).json(savedData);
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const data = await Data.find({ userId: req.user.id })
      .sort({ date: -1 });
    res.json(data);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    let data = await Data.findById(req.params.id);
    
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Check if the data belongs to the user
    if (data.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    data = await Data.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(data);
  } catch (err) {
    console.error('Error updating data:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const data = await Data.findById(req.params.id);
    
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Check if the data belongs to the logged-in user
    if (data.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Data.findByIdAndDelete(req.params.id);
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
