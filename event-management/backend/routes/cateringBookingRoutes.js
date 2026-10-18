const express = require("express");
const router = express.Router();

const {
  addBooking,
  getUserBookings,
  getAllBookings,
  requestCancellation,
  handleCancellation,
  recordRefund,
} = require("../controllers/cateringBookingController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Create catering booking
router.post("/add", authMiddleware, addBooking);

// Get user's catering bookings
router.get("/user/:userId", authMiddleware, getUserBookings);

// Admin: get all catering bookings
router.get("/", authMiddleware, adminMiddleware, getAllBookings);

// User: request cancellation
router.patch(
  "/cancel-request/:id",
  authMiddleware,
  requestCancellation
);

// Admin: approve or reject cancellation
router.patch(
  "/admin/cancellation/:id",
  authMiddleware,
  adminMiddleware,
  handleCancellation
);

// Admin: record refund
router.patch(
  "/admin/refund/:id",
  authMiddleware,
  adminMiddleware,
  recordRefund
);

module.exports = router;