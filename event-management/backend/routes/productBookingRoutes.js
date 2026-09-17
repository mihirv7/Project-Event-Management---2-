const express = require("express");
const router = express.Router();
const ProductBooking = require("../models/ProductBooking");
const auth = require("../middleware/authMiddleware"); 
const sendEmail = require("../utils/sendEmail");

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
  price,
  amount,
  paymentId,
  orderId,
  paymentStatus,
  date,
  location,
  guestCount,
  specialRequest,
  customizations
} = req.body;

   const newBooking = new ProductBooking({

  userId: req.user.id,

  userName,

  email,

  phoneNumber,

  productId,

  productName,

  price: Number(price),

  amount: Number(amount),

  paymentId,

  orderId,

  paymentStatus,

  date: new Date(date),

  location,

  guestCount: Number(guestCount),

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
    console.log(newBooking);

await newBooking.save();

// ===============================
// SEND PRODUCT BOOKING EMAIL
// ===============================
try {
  await sendEmail({
    to: email,
    subject: "Product Booking Confirmation - Momento Event Management",
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        border: 1px solid #ddd;
        padding: 25px;
        border-radius: 12px;
      ">

        <h2 style="text-align: center;">
          🎉 Product Booking Confirmed!
        </h2>

        <p>
          Hello <strong>${userName}</strong>,
        </p>

        <p>
          Your event product/design has been successfully booked with
          <strong>Momento Event Management</strong>.
        </p>

        <hr>

        <h3>Booking Details</h3>

        <p>
          <strong>Product:</strong> ${productName}
        </p>

        <p>
          <strong>Event Date:</strong>
          ${new Date(date).toLocaleDateString("en-IN")}
        </p>

        <p>
          <strong>Venue:</strong> ${location}
        </p>

        <p>
          <strong>Guest Count:</strong> ${guestCount}
        </p>

        <p>
          <strong>Product Price:</strong> ₹${price}
        </p>

        <p>
          <strong>Total Amount:</strong> ₹${amount}
        </p>

        <p>
          <strong>Payment Status:</strong>
          ${paymentStatus || "Success"}
        </p>

        ${
          customizations
            ? `
              <hr>

              <h3>Customizations</h3>

              <p>
                ${typeof customizations === "string"
                  ? customizations
                  : JSON.stringify(customizations)}
              </p>
            `
            : ""
        }

        ${
          specialRequest
            ? `
              <hr>

              <h3>Special Request</h3>

              <p>${specialRequest}</p>
            `
            : ""
        }

        <hr>

        <p>
          Thank you for choosing
          <strong>Momento Event Management</strong> ❤️
        </p>

        <p>
          We look forward to making your event memorable!
        </p>

        <p style="text-align: center; color: #777;">
          Momento Event Management
        </p>

      </div>
    `
  });

} catch (emailError) {
  console.log(
    "Product booking saved, but email could not be sent:",
    emailError
  );
}

res.json({
  message: "Product booking successful",
  data: newBooking
});

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