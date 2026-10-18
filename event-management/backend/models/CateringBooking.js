const mongoose = require("mongoose");

const cateringBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CateringCategory",
      required: true,
    },

    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CateringMenu",
      required: true,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    eventTime: {
      type: String,
      required: true,
    },

    venue: {
      type: String,
      required: true,
    },

    guestCount: {
      type: Number,
      required: true,
    },

    specialRequest: {
      type: String,
      default: "",
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentId: {
      type: String,
      default: "",
    },

    orderId: {
      type: String,
      default: "",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },

    bookingStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
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
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CateringBooking",
  cateringBookingSchema
);