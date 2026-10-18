const express = require("express");
const router = express.Router();

const ProductBooking = require("../models/ProductBooking");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const sendEmail = require("../utils/sendEmail");

// =====================================================
// 1. ADD PRODUCT BOOKING
// POST /api/product-bookings/add
// =====================================================

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const {
      userName,
      email,
      phoneNumber,
      productId,
      productName,
      price,
      paymentId,
      orderId,
      paymentStatus,
      amount,
      customizations,
      date,
      location,
      guestCount,
      specialRequest
    } = req.body;

    if (!productId || !date) {
      return res.status(400).json({
        message: "Product ID and booking date are required."
      });
    }

    const normalizedDate = new Date(date);

    if (Number.isNaN(normalizedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid booking date."
      });
    }

    const formattedDate = normalizedDate.toISOString().slice(0, 10);

    // Check whether this product is already booked for this date.
    const existingBooking = await ProductBooking.findOne({
      productId,
      date: formattedDate,
      bookingStatus: { $ne: "Cancelled" }
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "This product is already booked for the selected date."
      });
    }

    const booking = new ProductBooking({
      userId: req.user.id,
      userName,
      email,
      phoneNumber,
      productId,
      productName,
      price,
      paymentId,
      orderId,
      paymentStatus: paymentStatus || "Pending",
      amount: amount || price,
      customizations,
      date: formattedDate,
      location,
      guestCount,
      specialRequest,

      bookingStatus: "Confirmed",
      cancellationStatus: "NotRequested",
      refundAmount: 0,
      refundStatus: "NotRequested"
    });

    await booking.save();

    // Send confirmation email if the email utility is configured.
    if (email) {
      try {
        await sendEmail(
          email,
          "Product Booking Confirmation",
          `Hello ${userName || "Customer"},\n\nYour booking for ${
            productName || "the selected product"
          } has been received.\n\nBooking Date: ${formattedDate}\n\nThank you for booking with us.`
        );
      } catch (emailError) {
        console.error("Booking email failed:", emailError.message);
      }
    }

    return res.status(201).json({
      message: "Product booking created successfully.",
      data: booking
    });

  } catch (error) {
    console.error("Add product booking error:", error);

    return res.status(500).json({
      message: "Failed to create product booking.",
      error: error.message
    });
  }
});


// =====================================================
// 2. GET LOGGED-IN USER'S BOOKINGS
// GET /api/product-bookings
// =====================================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await ProductBooking.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    return res.status(200).json(bookings);

  } catch (error) {
    console.error("Get user bookings error:", error);

    return res.status(500).json({
      message: "Failed to fetch bookings."
    });
  }
});


// =====================================================
// 3. GET ALL BOOKINGS FOR ADMIN
// GET /api/product-bookings/admin
// =====================================================

router.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const bookings = await ProductBooking.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 });

      return res.status(200).json(bookings);

    } catch (error) {
      console.error("Get admin bookings error:", error);

      return res.status(500).json({
        message: "Failed to fetch all bookings."
      });
    }
  }
);


// =====================================================
// 4. GET BOOKED DATES FOR A PRODUCT
// GET /api/product-bookings/product/:id
// =====================================================

router.get("/product/:id", async (req, res) => {
  try {
    const bookings = await ProductBooking.find({
      productId: req.params.id,
      bookingStatus: { $ne: "Cancelled" }
    }).select("date");

    const bookedDates = bookings.map((booking) => booking.date);

    return res.status(200).json(bookedDates);

  } catch (error) {
    console.error("Get booked dates error:", error);

    return res.status(500).json({
      message: "Failed to fetch booked dates."
    });
  }
});


// =====================================================
// 5. USER REQUESTS BOOKING CANCELLATION
// PATCH /api/product-bookings/cancel-request/:id
// =====================================================

router.patch(
  "/cancel-request/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const { reason } = req.body;

      const booking = await ProductBooking.findOne({
        _id: req.params.id,
        userId: req.user.id
      });

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found."
        });
      }

      if (booking.bookingStatus === "Cancelled") {
        return res.status(400).json({
          message: "This booking is already cancelled."
        });
      }

      if (booking.cancellationStatus === "Requested") {
        return res.status(400).json({
          message: "A cancellation request is already pending."
        });
      }

      if (!reason || !reason.trim()) {
        return res.status(400).json({
          message: "Please provide a cancellation reason."
        });
      }

      booking.cancellationStatus = "Requested";
      booking.cancellationReason = reason.trim();
      booking.cancellationDate = new Date();

      await booking.save();

      return res.status(200).json({
        message: "Cancellation request submitted. Please wait for admin approval.",
        data: booking
      });

    } catch (error) {
      console.error("Cancellation request error:", error);

      return res.status(500).json({
        message: "Failed to submit cancellation request."
      });
    }
  }
);


// =====================================================
// 6. ADMIN APPROVES OR REJECTS CANCELLATION
// PATCH /api/product-bookings/admin/cancellation/:id
// =====================================================

router.patch(
  "/admin/cancellation/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { action, note } = req.body;

      if (!["Approved", "Rejected"].includes(action)) {
        return res.status(400).json({
          message: "Action must be Approved or Rejected."
        });
      }

      const booking = await ProductBooking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found."
        });
      }

      if (booking.cancellationStatus !== "Requested") {
        return res.status(400).json({
          message: "No pending cancellation request exists."
        });
      }

      booking.cancellationStatus = action;

      if (note) {
        booking.refundNote = note;
      }

      if (action === "Approved") {
        booking.bookingStatus = "Cancelled";

        // Only eligible successful payments can proceed to refund.
        if (booking.paymentStatus === "Success") {
          booking.refundStatus = "Pending";
        } else {
          booking.refundStatus = "NotRequested";
        }
      } else {
        booking.refundStatus = "Rejected";
      }

      await booking.save();

      return res.status(200).json({
        message:
          action === "Approved"
            ? "Cancellation approved."
            : "Cancellation rejected.",
        data: booking
      });

    } catch (error) {
      console.error("Admin cancellation error:", error);

      return res.status(500).json({
        message: "Failed to process cancellation."
      });
    }
  }
);


// =====================================================
// 7. ADMIN RECORDS REFUND STATUS
// PATCH /api/product-bookings/admin/refund/:id
// =====================================================

router.patch(
  "/admin/refund/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { refundAmount, refundStatus, refundNote } = req.body;

      const allowedStatuses = [
        "Pending",
        "Processing",
        "Processed",
        "Failed",
        "Rejected"
      ];

      if (!allowedStatuses.includes(refundStatus)) {
        return res.status(400).json({
          message: "Invalid refund status."
        });
      }

      const booking = await ProductBooking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found."
        });
      }

      if (
        booking.cancellationStatus !== "Approved" ||
        booking.bookingStatus !== "Cancelled"
      ) {
        return res.status(400).json({
          message: "The booking cancellation must be approved first."
        });
      }

      if (booking.paymentStatus !== "Success") {
        return res.status(400).json({
          message: "A refund can only be recorded for a successful payment."
        });
      }

      if (booking.refundStatus === "Processed") {
        return res.status(400).json({
          message: "The refund has already been marked as processed."
        });
      }

      const maximumRefund = Number(booking.amount || booking.price || 0);

      const amountToRefund = Number(
        refundAmount !== undefined
          ? refundAmount
          : maximumRefund
      );

      if (
        !Number.isFinite(amountToRefund) ||
        amountToRefund <= 0 ||
        amountToRefund > maximumRefund
      ) {
        return res.status(400).json({
          message: `Refund amount must be greater than 0 and no more than ${maximumRefund}.`
        });
      }

      booking.refundAmount = amountToRefund;
      booking.refundStatus = refundStatus;
      booking.refundNote = refundNote || "";

      if (refundStatus === "Processed") {
        booking.refundDate = new Date();
      }

      await booking.save();

      return res.status(200).json({
        message: "Refund status updated successfully.",
        data: booking
      });

    } catch (error) {
      console.error("Admin refund error:", error);

      return res.status(500).json({
        message: "Failed to update refund status."
      });
    }
  }
);


module.exports = router;