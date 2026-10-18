const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    userName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    },

    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true
    },

    startingDate: {
      type: Date,
      required: true
    },

    endingDate: {
      type: Date,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    phoneNumber: {
      type: String,
      required: true
    },

    guestCount: {
      type: Number,
      required: true
    },

    // Existing payment details
    paymentId: {
      type: String
    },

    orderId: {
      type: String
    },

    paymentStatus: {
      type: String,
      default: "Pending"
    },

    amount: {
      type: Number,
      required: true
    },

    specialRequest: String,

    // NEW: Booking status
    bookingStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Confirmed"
    },

    // NEW: Cancellation details
    cancellationStatus: {
      type: String,
      enum: ["NotRequested", "Requested", "Approved", "Rejected"],
      default: "NotRequested"
    },

    cancellationReason: {
      type: String,
      default: ""
    },

    cancellationDate: {
      type: Date,
      default: null
    },

    // NEW: Manual refund details
    refundAmount: {
      type: Number,
      default: 0
    },

    refundStatus: {
      type: String,
      enum: [
        "NotRequested",
        "Pending",
        "Processing",
        "Processed",
        "Failed",
        "Rejected"
      ],
      default: "NotRequested"
    },

    refundDate: {
      type: Date,
      default: null
    },

    refundNote: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);