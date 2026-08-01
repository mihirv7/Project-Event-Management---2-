const express = require("express");

const router = express.Router();

const {
  addBooking,
  getUserBookings,
  getAllBookings,
} = require("../controllers/cateringBookingController");

router.post("/add", addBooking);
router.get("/user/:userId", getUserBookings);
router.get("/", getAllBookings);

module.exports = router;