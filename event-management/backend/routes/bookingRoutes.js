const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");
const Package = require("../models/Package");
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

// ============================
// SEND BOOKING CONFIRMATION EMAIL
// ============================
try {
  const pkg = await Package.findById(packageId);

  await sendEmail({
    to: email,
    subject: "Booking Confirmation - Momento Event Management",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 25px; border-radius: 10px;">

        <h2 style="text-align: center;">
          🎉 Booking Confirmed!
        </h2>

        <p>Hello <strong>${userName}</strong>,</p>

        <p>
          Your package booking has been successfully confirmed with
          <strong>Momento Event Management</strong>.
        </p>

        <hr>

        <h3>Booking Details</h3>

        <p><strong>Package:</strong> ${pkg ? pkg.name : "Selected Package"}</p>

        <p><strong>Starting Date:</strong> 
          ${new Date(startingDate).toLocaleDateString("en-IN")}
        </p>

        <p><strong>Ending Date:</strong> 
          ${new Date(endingDate).toLocaleDateString("en-IN")}
        </p>

        <p><strong>Venue:</strong> ${location}</p>

        <p><strong>Guest Count:</strong> ${guestCount}</p>

        <p><strong>Amount Paid:</strong> ₹${amount}</p>

        <p><strong>Payment Status:</strong> ${paymentStatus || "Success"}</p>

        <hr>

        <p>
          Thank you for choosing <strong>Momento Event Management</strong>.
        </p>

        <p>
          We look forward to making your event memorable! ❤️
        </p>

        <p style="text-align: center; color: #777;">
          Momento Event Management
        </p>

      </div>
    `,
  });

} catch (emailError) {
  console.log("Booking saved, but email could not be sent:", emailError);
}

res.status(201).json({
  message: "Booking successful",
});
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