const CateringBooking = require("../models/CateringBooking");

const addBooking = async (req, res) => {
  try {
    const booking = await CateringBooking.create(req.body);

    res.status(201).json({
      success: true,
      message: "Booking Successful",
      booking,
    });
  } catch (err) {
  console.log("BOOKING ERROR:");
  console.log(err);

  res.status(500).json({
    success: false,
    message: err.message,
    error: err,
  });
}
};


const getUserBookings = async (req, res) => {
  try {

    const bookings = await CateringBooking.find({
      userId: req.params.userId,
    })
      .populate("menuId")
      .populate("categoryId")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};


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
      message: "Error fetching catering bookings"
    });

  }
};

module.exports = {
  addBooking,
  getUserBookings,
  getAllBookings,
};