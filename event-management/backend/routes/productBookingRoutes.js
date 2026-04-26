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

module.exports = router;