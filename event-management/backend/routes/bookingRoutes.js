const express = require("express");
const router = express.Router();

const sendEmail = require("../utils/sendEmail");
const Package = require("../models/Package");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");


// ============================
// ADMIN AUTHORIZATION
// ============================
const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only."
    });
  }

  next();
};
// ============================
// GET BOOKINGS (USER + ADMIN)
// ============================
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("USER FROM TOKEN:", req.user);

    let data;

    // ADMIN → ALL BOOKINGS
    if (req.user.role === "admin") {
      data = await Booking.find()
        .populate("packageId", "name");
    } else {
      // USER → ONLY THEIR BOOKINGS
      data = await Booking.find({
        userId: req.user.id
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
    ) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    // Check whether the package is already booked
    // for overlapping dates.
    // Cancelled bookings do not block dates.
    const existing = await Booking.findOne({
      packageId,
      bookingStatus: { $ne: "Cancelled" },
      startingDate: { $lte: new Date(endingDate) },
      endingDate: { $gte: new Date(startingDate) }
    });

    if (existing) {
      return res.status(400).json({
        message: "This package is already booked for selected dates"
      });
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

            <p><strong>Amount:</strong> ₹${amount}</p>

            <p><strong>Payment Status:</strong> ${paymentStatus || "Success"}</p>

            <hr>

            <p>Thank you for choosing Momento Event Management.</p>

            <p style="text-align: center; color: #777;">
              Momento Event Management
            </p>

          </div>
        `
      });

    } catch (emailError) {
      console.log(
        "Booking saved, but email could not be sent:",
        emailError
      );
    }

    res.status(201).json({
      message: "Booking successful",
      booking: newBooking
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// ============================
// USER - REQUEST BOOKING CANCELLATION
// ============================
router.patch(
  "/cancel-request/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const reason = req.body?.reason;

if (typeof reason !== "string" || !reason.trim()) {
  return res.status(400).json({
    message: "Please provide a valid cancellation reason"
  });
}

      // Find the booking belonging to the logged-in user
      const booking = await Booking.findOne({
        _id: req.params.id,
        userId: req.user.id
      });

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found"
        });
      }

      // Prevent duplicate cancellation requests
      if (
        booking.bookingStatus === "Cancelled" ||
        booking.cancellationStatus === "Requested" ||
        booking.cancellationStatus === "Approved"
      ) {
        return res.status(400).json({
          message: "This booking is already cancelled or has a cancellation request"
        });
      }

      // Only confirmed bookings can be cancelled
      if (
  booking.bookingStatus &&
  booking.bookingStatus !== "Confirmed"
) {
  return res.status(400).json({
    message: "Only confirmed bookings can be cancelled"
  });
}

      // Save cancellation request.
      // The admin will decide whether to approve or reject it.
      booking.cancellationStatus = "Requested";
      booking.cancellationReason = reason.trim();
      booking.cancellationDate = new Date();

      // Do not cancel the booking or refund money yet.
      await booking.save();

      res.json({
        message: "Cancellation request submitted successfully. Awaiting admin approval.",
        booking
      });

    } catch (error) {
      console.error("Cancellation request error:", error);

      res.status(500).json({
        message: error.message
      });
    }
  }
);


// ============================
// ADMIN - GET ALL BOOKINGS
// ============================
router.get("/admin", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("packageId", "name price")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
// ============================
// ADMIN - APPROVE / REJECT CANCELLATION
// ============================
router.patch(
  "/admin/cancellation/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { action } = req.body;

      if (!["approve", "reject"].includes(action)) {
        return res.status(400).json({
          message: "Action must be approve or reject"
        });
      }

      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found"
        });
      }

      if (booking.cancellationStatus !== "Requested") {
        return res.status(400).json({
          message: "No pending cancellation request found"
        });
      }

      if (action === "approve") {
        booking.cancellationStatus = "Approved";
        booking.bookingStatus = "Cancelled";

        // Do not automatically refund money.
        // Admin will process the refund manually.
        if (
          booking.paymentStatus === "Success" &&
          booking.paymentId &&
          booking.paymentId !== "TEST_PAYMENT_ID"
        ) {
          booking.refundStatus = "Pending";
          booking.refundAmount = 0;
        } else {
          booking.refundStatus = "NotRequested";
          booking.refundAmount = 0;
        }
      } else {
        booking.cancellationStatus = "Rejected";
        booking.refundStatus = "Rejected";
      }

      await booking.save();

      return res.json({
        message:
          action === "approve"
            ? "Cancellation approved successfully"
            : "Cancellation request rejected",
        booking
      });
    } catch (error) {
      console.error("Cancellation approval error:", error);

      res.status(500).json({
        message: error.message
      });
    }
  }
);
// ============================
// ADMIN - RECORD MANUAL REFUND
// ============================
router.patch(
  "/admin/refund/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { refundAmount, refundNote } = req.body;

      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found"
        });
      }

      if (
        booking.bookingStatus !== "Cancelled" ||
        booking.cancellationStatus !== "Approved"
      ) {
        return res.status(400).json({
          message: "The booking must have an approved cancellation"
        });
      }

      if (
        booking.paymentStatus !== "Success" ||
        !booking.paymentId ||
        booking.paymentId === "TEST_PAYMENT_ID"
      ) {
        return res.status(400).json({
          message: "This booking does not have an eligible real payment"
        });
      }

     const amountToRefund = Number(refundAmount);

if (
  refundAmount === undefined ||
  refundAmount === null ||
  refundAmount === "" ||
  !Number.isFinite(amountToRefund) ||
  amountToRefund <= 0 ||
  amountToRefund > booking.amount
) {
  return res.status(400).json({
    message: "Enter a valid refund amount not exceeding the booking amount"
  });
}

      if (booking.refundStatus === "Processed") {
        return res.status(400).json({
          message: "Refund has already been recorded"
        });
      }

      // The admin must first refund the payment manually
      // through the Razorpay Dashboard.
      booking.refundAmount = amountToRefund;
      booking.refundStatus = "Processed";
      booking.refundDate = new Date();
      booking.refundNote = refundNote || "";

      await booking.save();

      res.json({
        message: "Manual refund recorded successfully",
        booking
      });
    } catch (error) {
      console.error("Refund recording error:", error);

      res.status(500).json({
        message: error.message
      });
    }
  }
);

// ============================
// GET BOOKINGS FOR A PACKAGE
// ============================
router.get("/package/:id", async (req, res) => {
  try {
    const data = await Booking.find({
      packageId: req.params.id,
      bookingStatus: { $ne: "Cancelled" }
    }).select("startingDate endingDate");

    res.json(data);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;