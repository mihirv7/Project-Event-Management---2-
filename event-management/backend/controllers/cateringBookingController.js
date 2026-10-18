const CateringBooking = require("../models/CateringBooking");
const sendEmail = require("../utils/sendEmail");

// ========================================
// ADD CATERING BOOKING
// ========================================
const addBooking = async (req, res) => {
  try {
    const booking = await CateringBooking.create(req.body);

    // Send booking confirmation email
    try {
      await sendEmail({
        to: booking.email,
        subject: "Catering Booking Confirmation - Momento Event Management",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 25px; border-radius: 12px;">
            <h2 style="text-align: center;">Catering Booking Confirmed!</h2>

            <p>Hello <strong>${booking.userName}</strong>,</p>

            <p>Your catering booking has been successfully confirmed with Momento Event Management.</p>

            <hr>

            <h3>Catering Booking Details</h3>

            <p><strong>Event Date:</strong> ${new Date(booking.eventDate).toLocaleDateString("en-IN")}</p>
            <p><strong>Event Time:</strong> ${booking.eventTime}</p>
            <p><strong>Venue:</strong> ${booking.venue}</p>
            <p><strong>Guest Count:</strong> ${booking.guestCount}</p>
            <p><strong>Total Amount:</strong> ₹${booking.amount}</p>
            <p><strong>Payment Status:</strong> ${booking.paymentStatus || "Pending"}</p>

            ${
              booking.specialRequest
                ? `<hr><h3>Special Request</h3><p>${booking.specialRequest}</p>`
                : ""
            }

            <hr>
            <p>Thank you for choosing <strong>Momento Event Management</strong>!</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.log(
        "Catering booking saved, but email could not be sent:",
        emailError
      );
    }

    res.status(201).json({
      success: true,
      message: "Booking Successful",
      booking,
    });
  } catch (err) {
    console.log("CATERING BOOKING ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ========================================
// GET USER CATERING BOOKINGS
// ========================================
const getUserBookings = async (req, res) => {
  try {
    // Use the authenticated user's ID
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({
        message: "You can only view your own bookings",
      });
    }

    const bookings = await CateringBooking.find({
      userId: req.user.id,
    })
      .populate("menuId")
      .populate("categoryId")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.log("GET USER CATERING BOOKINGS ERROR:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ========================================
// GET ALL CATERING BOOKINGS (ADMIN)
// ========================================
const getAllBookings = async (req, res) => {
  try {
    const bookings = await CateringBooking.find()
      .populate("menuId")
      .populate("categoryId")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error fetching catering bookings",
    });
  }
};

// ========================================
// USER REQUESTS CANCELLATION
// ========================================
const requestCancellation = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        message: "Cancellation reason is required",
      });
    }

    // Find booking belonging to the logged-in user
    const booking = await CateringBooking.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Catering booking not found",
      });
    }

    if (booking.bookingStatus === "Cancelled") {
      return res.status(400).json({
        message: "This booking is already cancelled",
      });
    }

    if (
      booking.cancellationStatus === "Requested" ||
      booking.cancellationStatus === "Approved"
    ) {
      return res.status(400).json({
        message: "Cancellation has already been requested",
      });
    }

    booking.cancellationStatus = "Requested";
    booking.cancellationReason = reason.trim();
    booking.cancellationDate = new Date();

    await booking.save();

    res.json({
      success: true,
      message: "Catering cancellation request submitted",
      booking,
    });
  } catch (err) {
    console.log("CATERING CANCELLATION ERROR:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
// ========================================
// ADMIN APPROVES OR REJECTS CANCELLATION
// ========================================
const handleCancellation = async (req, res) => {
  try {
    const { action } = req.body;

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({
        message: "Action must be approve or reject",
      });
    }

    const booking = await CateringBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Catering booking not found",
      });
    }

    if (booking.cancellationStatus !== "Requested") {
      return res.status(400).json({
        message: "No pending cancellation request exists",
      });
    }

    if (action === "approve") {
      booking.cancellationStatus = "Approved";
      booking.bookingStatus = "Cancelled";
      booking.refundStatus = "Pending";
    } else {
      booking.cancellationStatus = "Rejected";
      booking.refundStatus = "Rejected";
    }

    await booking.save();

    res.json({
      success: true,
      message:
        action === "approve"
          ? "Catering cancellation approved"
          : "Catering cancellation rejected",
      booking,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ========================================
// ADMIN RECORDS MANUAL REFUND
// ========================================
const recordRefund = async (req, res) => {
  try {
    const { refundAmount, refundNote } = req.body;

    const amount = Number(refundAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        message: "Enter a valid refund amount",
      });
    }

    const booking = await CateringBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Catering booking not found",
      });
    }

    if (
      booking.bookingStatus !== "Cancelled" ||
      booking.cancellationStatus !== "Approved"
    ) {
      return res.status(400).json({
        message: "Only approved cancellations can receive a refund",
      });
    }

    if (booking.refundStatus === "Processed") {
      return res.status(400).json({
        message: "Refund has already been recorded as processed",
      });
    }

    if (amount > booking.amount) {
      return res.status(400).json({
        message: "Refund amount cannot exceed the booking amount",
      });
    }

    booking.refundAmount = amount;
    booking.refundStatus = "Processed";
    booking.refundDate = new Date();
    booking.refundNote = refundNote || "";

    await booking.save();

    res.json({
      success: true,
      message: "Catering refund status recorded",
      booking,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  addBooking,
  getUserBookings,
  getAllBookings,
  requestCancellation,
  handleCancellation,
  recordRefund,
};