const multer = require("multer");
const path = require("path");
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
// ✅ ADD EVENT (save to DB)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      image: req.file ? req.file.filename : ""
    });

    await newEvent.save();
    res.json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
// DELETE event
router.delete("/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// UPDATE event
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    const updateData = {
      title,
      description,
      date,
      location
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
