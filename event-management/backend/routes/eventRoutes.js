const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// ✅ ADD EVENT (save to DB)
router.post("/add", async (req, res) => {
  try {
    const { title, description, date, location, image } = req.body;

    if (!title || !description || !date || !location) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      image
    });

    await newEvent.save();

    res.status(201).json({
      message: "Event added successfully",
      event: newEvent
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET ALL EVENTS (from DB)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
