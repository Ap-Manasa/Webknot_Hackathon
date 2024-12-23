const express = require('express');
const { Event } = require('.'); // Import the Event model
const router = express.Router();

// Create a new event
router.post('/', async (req, res) => {
  const { name, description, location, date } = req.body;
  try {
    const newEvent = await Event.create({ name, description, location, date });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
