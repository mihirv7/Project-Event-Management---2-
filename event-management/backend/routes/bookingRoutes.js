const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");

// ============================
// GET BOOKINGS (USER + ADMIN)
// ============================
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("USER FROM TOKEN:", req.user);

    let data;

    // ✅ ADMIN → ALL BOOKINGS
    if (req.user.role === "admin") {
      data = await Booking.find().populate("packageId", "name");
    } 
    // ✅ USER → ONLY HIS BOOKINGS
    else {
      data = await Booking.find({
        userId: req.user.id   // 🔥 FIXED
      }).populate("packageId", "name");
    }

    res.json(data);

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ============================
// CREATE BOOKING
// ============================
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const {
      userName,
      email,
      packageId,
      startingDate,
      endingDate,
      location,
      phoneNumber,
      guestCount,
      specialRequest
    } = req.body;

    if (
      !userName ||
      !email ||
      !packageId ||
      !startingDate ||
      !endingDate ||
      !location ||
      !phoneNumber ||
      !guestCount
    ) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newBooking = new Booking({
      userId: req.user.id,   // 🔥 FIXED
      userName,
      email,
      packageId,
      startingDate,
      endingDate,
      location,
      phoneNumber,
      guestCount,
      specialRequest
    });

    await newBooking.save();

    res.status(201).json({ message: "Booking successful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================
// ADMIN - GET ALL BOOKINGS
// ============================
router.get("/admin", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("packageId", "name price")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;