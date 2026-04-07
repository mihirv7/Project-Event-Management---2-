const mongoose = require("mongoose");

const productBookingSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  userName: String,
  email: String,
  phoneNumber: String,

  productId: String,
  productName: String,
  price: Number,

  customizations: Object,

  date: String,
  location: String,
  guestCount: Number,
  specialRequest: String

}, { timestamps: true });

module.exports = mongoose.model("ProductBooking", productBookingSchema);