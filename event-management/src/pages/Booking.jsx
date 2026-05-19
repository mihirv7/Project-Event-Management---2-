import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Booking.css"; // ✅ import CSS for styling
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Booking() {
  const { id } = useParams();
  const [bookedDates, setBookedDates] = useState([]);
  const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);
const [disabledDates, setDisabledDates] = useState([]);
const [pkg, setPkg] = useState(null);
  
  const navigate = useNavigate();
  
  
useEffect(() => {

  const fetchDates = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/booking/package/${id}`
      );

      const dates = [];

      res.data.forEach((b) => {

        let start = new Date(b.startingDate);

        let end = new Date(b.endingDate);

        while (start <= end) {

          dates.push(new Date(start));

          start.setDate(start.getDate() + 1);
        }
      });

      setDisabledDates(dates);

    } catch (err) {

      console.log(err);
    }
  };

  fetchDates();

}, [id]);
useEffect(() => {

  const fetchPackage = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/packages/${id}`
      );

      console.log("PACKAGE DATA:", JSON.stringify(res.data, null, 2));
      setPkg(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  fetchPackage();

}, [id]);
const isDateBlocked = (start, end) => {
  return bookedDates.some((b) => {
    return (
      new Date(start) <= new Date(b.endingDate) &&
      new Date(end) >= new Date(b.startingDate)
    );
  });
};

 const [formData, setFormData] = useState({
  userId: "",
  userName: "",
  email: "",
  startingDate: "",
  endingDate: "",
  location: "",
  phoneNumber: "",
  guestCount: "",
  specialRequest: "",
  paymentId: "",
  orderId: "",
  paymentStatus: "Pending",
});

// ===============================
// AUTO FETCH LOGGED USER
// ===============================
useEffect(() => {

  const fetchUser = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/auth/me",
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      );

      setFormData((prev) => ({
        ...prev,

        userId: res.data._id,

        userName: res.data.fullName,

        email: res.data.email,

        phoneNumber: res.data.phone
      }));

    } catch (err) {

      console.log(err);
    }
  };

  fetchUser();

}, []);

const handleChange = (e) => {

  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};
// ===============================
// ===============================
// HANDLE SUBMIT
// ===============================
const handleSubmit = async (e) => {

  e.preventDefault();

  // CHECK PACKAGE
  if (!pkg) {

    alert("Package not loaded");

    return;
  }

  // CHECK DATES
  if (!startDate || !endDate) {

    alert("Please select dates");

    return;
  }

  try {

    // CREATE RAZORPAY ORDER
    const orderRes = await axios.post(
      "http://localhost:5000/api/payment/create-order",
      {
        amount: pkg.price,
      }
    );

    console.log("ORDER RESPONSE:", orderRes.data);

    const options = {

      key: "rzp_test_SokwTq2nrohRwW",

      amount: orderRes.data.amount,

      currency: "INR",

      name: "Momento Event",

      description: "Event Booking Payment",

      order_id: orderRes.data.id,

      method: {
        upi: false
      },

      // ===============================
      // PAYMENT SUCCESS
      // ===============================
      // ===============================
// PAYMENT SUCCESS
// ===============================
handler: async function (response) {

  try {

    const token = localStorage.getItem("token");

    const bookingData = {

      userId: formData.userId,

      userName: formData.userName,

      email: formData.email,

      packageId: id,

      startingDate: startDate,

      endingDate: endDate,

      location: pkg.venue,

      phoneNumber: formData.phoneNumber,

      guestCount: Number(pkg.guestCount),

      specialRequest: formData.specialRequest,
      amount: Number(pkg.price),

      paymentId: response.razorpay_payment_id,

      orderId: response.razorpay_order_id,

      paymentStatus: "Success"
    };

    console.log("BOOKING DATA:", bookingData);

    const saveBooking = await axios.post(
      "http://localhost:5000/api/booking/add",
      bookingData,
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    );

    console.log(saveBooking.data);

    alert("Payment & Booking Successful");

    navigate("/my-bookings");

  } catch (err) {

    console.log("BOOKING ERROR:", err.response?.data || err);

    alert("Booking save failed");
  }
},
// ===============================
// TEST MODE
// ===============================
modal: {

  ondismiss: async function () {

    const ok = window.confirm(
      "Simulate successful payment for testing?"
    );

    if (ok) {

      try {

        const token = localStorage.getItem("token");

        const bookingData = {

          userId: formData.userId,

          userName: formData.userName,

          email: formData.email,

          packageId: id,

          startingDate: startDate,

          endingDate: endDate,

          location: pkg.venue,

          phoneNumber: formData.phoneNumber,

          guestCount: Number(pkg.guestCount),

          specialRequest: formData.specialRequest,

          amount: Number(pkg.price),

          paymentId: "TEST_PAYMENT_ID",

          orderId: orderRes.data.id,

          paymentStatus: "Success"
        };

        console.log("TEST BOOKING:", bookingData);

        const saveBooking = await axios.post(
          "http://localhost:5000/api/booking/add",
          bookingData,
          {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        );

        console.log(saveBooking.data);

        alert("Test Payment & Booking Successful");

        navigate("/my-bookings");

      } catch (err) {

        console.log("TEST BOOKING ERROR:", err.response?.data || err);

        alert("Booking save failed");
      }
    }
  }
},
      theme: {
        color: "#3399cc"
      }
    };

    const razor = new window.Razorpay(options);

    razor.on("payment.failed", function (response) {

      console.log(response);

      alert(response.error.description);
    });

    razor.open();

  } catch (err) {

    console.log("PAYMENT ERROR:", err.response?.data || err);

    alert("Payment Failed");
  }
};
  return (
    <div className="booking-page">
      <div className="booking-container">
      <h2>Book Event</h2>

      <div
  style={{
    background: "#e9e6e6",
    padding: "20px",
    borderRadius: "15px",
    marginBottom: "25px"
  }}
>
  <h2
    style={{
      textAlign: "center",
      marginBottom: "20px",
      fontWeight: "bold"
    }}
  >
    Booking Summary
  </h2>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "12px",
      fontSize: "18px"
    }}
  >
    <span>Package Price</span>

    <strong>₹ {pkg?.price}</strong>
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "12px",
      fontSize: "18px"
    }}
  >
    
  </div>

  <hr />

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginTop: "18px",
      fontSize: "20px",
      fontWeight: "bold"
    }}
  >
    <span>Total Amount</span>

    <span>₹ {pkg?.price}</span>
  </div>
</div>

      <form onSubmit={handleSubmit} className="booking-form">

        <input
          type="text"
          name="userName"
          value={formData.userName}
          readOnly
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          readOnly
        />

       <DatePicker
  selected={startDate}
  onChange={(date) => setStartDate(date)}
  excludeDates={disabledDates}
  minDate={new Date()}
  dateFormat="dd-MM-yyyy"
  placeholderText="Select start date"
  className="booking-input"

/>

<DatePicker
  selected={endDate}
  onChange={(date) => setEndDate(date)}
  excludeDates={disabledDates}
  minDate={
    startDate
      ? new Date(startDate.getTime() + 86400000)
      : new Date()
  }
  dateFormat="dd-MM-yyyy"
  placeholderText="Select end date"
  className="booking-input"
 
/>

        {/* <input
          type="text"
          name="location"
          placeholder="Event Location"
          onChange={handleChange}
          required
        /> */}

        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          readOnly
        />

        {/* <input
          type="number"
          name="guestCount"
          placeholder="Guest Count"
          onChange={handleChange}
          required
        /> */}

        <textarea
          name="specialRequest"
          placeholder="Special Request"
          onChange={handleChange}
        />

        <button type="submit">Confirm Booking</button>
      </form>
    </div>
    </div>
  );
}