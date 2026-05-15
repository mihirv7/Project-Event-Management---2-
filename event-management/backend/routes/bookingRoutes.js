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
  specialRequest,
  paymentId,
  orderId,
  paymentStatus,
  amount
} = req.body;

    if (
  !userName ||
  !email ||
  !packageId ||
  !startingDate ||
  !endingDate ||
  !location ||
  !phoneNumber ||
  !guestCount ||
  !amount
){
      return res.status(400).json({ message: "All fields required" });
    }

    const newBooking = new Booking({

  userId: req.user.id,

  userName,

  email,

  packageId,

  startingDate: new Date(startingDate),

  endingDate: new Date(endingDate),

  location,

  phoneNumber,

  guestCount: Number(guestCount),

  specialRequest,

  paymentId,

  orderId,

  paymentStatus,

  amount: Number(amount)

});
    const existing = await Booking.findOne({
  packageId,
  $or: [
    {
      startingDate: { $lte: endingDate },
      endingDate: { $gte: startingDate }
    }
  ]
});

if (existing) {
  return res.status(400).json({
    message: "This package is already booked for selected dates"
  });
}
  console.log(newBooking);
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
router.get("/package/:id", async (req, res) => {
  try {
    const data = await Booking.find({
      packageId: req.params.id
    }).select("startingDate endingDate");

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;