const express = require("express");
const router = express.Router();
const ProductBooking = require("../models/ProductBooking");
const auth = require("../middleware/authMiddleware"); // ✅ import auth

// ===============================
// ADD PRODUCT BOOKING
// ===============================
router.post("/add", auth, async (req, res) => {
  try {
    const {
      userName,
      email,
      phoneNumber,
      productId,
      productName,
      date,
      location,
      guestCount,
      specialRequest,
      customizations
    } = req.body;

    const newBooking = new ProductBooking({
      userId: req.user.id, // ✅ IMPORTANT (logged-in user)

      userName,
      email,
      phoneNumber,
      productId,
      productName,
      date,
      location,
      guestCount,
      specialRequest,

      customizations
    });
    const existing = await ProductBooking.findOne({
  productId,
  date: req.body.date   // single date
});

if (existing) {
  return res.status(400).json({
    message: "This event is already booked on this date"
  });
}

    await newBooking.save();

    res.json({ message: "Product booking successful", data: newBooking });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ===============================
// GET ONLY LOGGED USER BOOKINGS
// ===============================
router.get("/", auth, async (req, res) => {
  try {
    const data = await ProductBooking.find({
      userId: req.user.id // ✅ FILTER
    });

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/admin", async (req, res) => {
  try {
    const data = await ProductBooking.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/product/:id", async (req, res) => {
  try {
    const data = await ProductBooking.find({
      productId: req.params.id
    }).select("date");

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// console.log("KEY:", process.env.RAZORPAY_KEY_ID);
// console.log("SECRET:", process.env.RAZORPAY_SECRET);
module.exports = router;