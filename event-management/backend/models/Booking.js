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

    specialRequest: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);