const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");
const auth = require("../middleware/authMiddleware"); // ✅ import middleware properly


// GET all package bookings


router.get("/", auth, async (req, res) => {
  try {
    console.log("USER:", req.user); // 🔍 DEBUG

    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "User not found in token" });
    }

    const data = await Booking.find({
      userId: req.user.id
    });

    res.json(data);

  } catch (err) {
    console.log("ERROR:", err); // 🔥 IMPORTANT
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

    // check required fields
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
      userId: req.user.id,   // from token
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

module.exports = router;   // ✅ only router exported