const CateringBooking = require("../models/CateringBooking");
const sendEmail = require("../utils/sendEmail");

const addBooking = async (req, res) => {
  try {
    const booking = await CateringBooking.create(req.body);

    // ===============================
    // SEND CATERING BOOKING EMAIL
    // ===============================
    try {
      await sendEmail({
        to: booking.email,
        subject: "Catering Booking Confirmation - Momento Event Management",
        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            border: 1px solid #ddd;
            padding: 25px;
            border-radius: 12px;
          ">

            <h2 style="text-align: center;">
              🎉 Catering Booking Confirmed!
            </h2>

            <p>
              Hello <strong>${booking.userName}</strong>,
            </p>

            <p>
              Your catering booking has been successfully confirmed with
              <strong>Momento Event Management</strong>.
            </p>

            <hr>

            <h3>Catering Booking Details</h3>

            <p>
              <strong>Event Date:</strong>
              ${new Date(booking.eventDate).toLocaleDateString("en-IN")}
            </p>

            <p>
              <strong>Event Time:</strong>
              ${booking.eventTime}
            </p>

            <p>
              <strong>Venue:</strong>
              ${booking.venue}
            </p>

            <p>
              <strong>Guest Count:</strong>
              ${booking.guestCount}
            </p>

            <p>
              <strong>Total Amount:</strong>
              ₹${booking.amount}
            </p>

            <p>
              <strong>Payment Status:</strong>
              ${booking.paymentStatus || "Success"}
            </p>

      

            ${
              booking.specialRequest
                ? `
                  <hr>
                  <h3>Special Request</h3>
                  <p>${booking.specialRequest}</p>
                `
                : ""
            }

            <hr>

            <p>
              Thank you for choosing
              <strong>Momento Event Management</strong> ❤️
            </p>

            <p>
              We look forward to making your event memorable!
            </p>

            <p style="text-align: center; color: #777;">
              Momento Event Management
            </p>

          </div>
        `,
      });

    } catch (emailError) {
      console.log(
        "Catering booking saved, but email could not be sent:",
        emailError
      );
    }

    // ===============================
    // RESPONSE
    // ===============================
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