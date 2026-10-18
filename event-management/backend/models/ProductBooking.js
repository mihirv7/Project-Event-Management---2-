const mongoose = require("mongoose");

const productBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    userName: String,
    email: String,
    phoneNumber: String,

    productId: String,
    productName: String,

    price: Number,
    amount: Number,

    paymentId: {
      type: String,
    },

    orderId: {
      type: String,
    },

    paymentStatus: {
      type: String,
      default: "Pending",
    },

    // Booking information
    bookingStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Confirmed",
    },

    customizations: Object,
    date: String,
    location: String,
    guestCount: Number,
    specialRequest: String,

    // Cancellation information
    cancellationStatus: {
      type: String,
      enum: ["NotRequested", "Requested", "Approved", "Rejected"],
      default: "NotRequested",
    },

    cancellationReason: {
      type: String,
      default: "",
    },

    cancellationDate: {
      type: Date,
      default: null,
    },

    // Refund information
    refundAmount: {
      type: Number,
      default: 0,
    },

    refundStatus: {
      type: String,
      enum: [
        "NotRequested",
        "Pending",
        "Processing",
        "Processed",
        "Failed",
        "Rejected",
      ],
      default: "NotRequested",
    },

    refundDate: {
      type: Date,
      default: null,
    },

    refundNote: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductBooking", productBookingSchema);