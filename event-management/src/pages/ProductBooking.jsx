import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Booking.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function ProductBooking() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [bookedDates, setBookedDates] = useState([]);
  const productId = state?.productId;
  const productName = state?.productName;
  const [date, setDate] = useState(null);
  const [disabledDates, setDisabledDates] = useState([]);
  
  const price = state?.price;
  const selectedOptions = state?.selectedOptions;

  useEffect(() => {
  const fetchDates = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/product-bookings/product/${productId}`
      );

      const dates = res.data.map((b) => new Date(b.date));

      setDisabledDates(dates);

    } catch (err) {
      console.log(err);
    }
  };

  fetchDates();
}, [productId]);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    date: "",
    location: "",
    phoneNumber: "",
    guestCount: "",
    specialRequest: ""
  });

  // ===============================
  // AUTO FETCH LOGGED USER (SAME AS PACKAGE)
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

  // ===============================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ===============================
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!date) {
    alert("Please select date");
    return;
  }

  try {
   const token = localStorage.getItem("token");

// ===============================
// CREATE RAZORPAY ORDER
// ===============================
const orderRes = await axios.post(
  "http://localhost:5000/api/payment/create-order",
  {
    amount: Number(price)
  }
);

console.log(orderRes.data);

// ===============================
// RAZORPAY OPTIONS
// ===============================
const options = {

  key: "rzp_test_SokwTq2nrohRwW",

  amount: orderRes.data.amount,

  currency: "INR",

  name: "Momento Event",

  description: "Product Booking Payment",

  order_id: orderRes.data.id,

  handler: async function (response) {

    try {

      await axios.post(
        "http://localhost:5000/api/product-bookings/add",
        {

          ...formData,

          productId,

          productName,

          price,

          amount: Number(price),

          customizations: selectedOptions,

          date: date.toISOString(),

          paymentId: response.razorpay_payment_id,

          orderId: response.razorpay_order_id,

          paymentStatus: "Success"

        },
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      );

      alert("Payment & Booking Successful");

      navigate("/");

    } catch (err) {

      console.log(err);

      alert("Booking save failed");
    }
  },

  modal: {

    ondismiss: async function () {

      const ok = window.confirm(
        "Simulate successful payment for testing?"
      );

      if (ok) {

        try {

          await axios.post(
            "http://localhost:5000/api/product-bookings/add",
            {

              ...formData,

              productId,

              productName,

              price,

              amount: Number(price),

              customizations: selectedOptions,

              date: date.toISOString(),

              paymentId: "TEST_PAYMENT_ID",

              orderId: orderRes.data.id,

              paymentStatus: "Success"

            },
            {
              headers: {
                authorization: `Bearer ${token}`
              }
            }
          );

          alert("Test Payment & Booking Successful");

          navigate("/");

        } catch (err) {

          console.log(err);

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

razor.open();
  } catch (err) {

    console.log(err);
};
  };
  if (!productId) return <h2>No product selected</h2>;

  return (
    <div className="booking-page">
      <div className="booking-container">

        <h2>Book Event</h2>

        {/* PRODUCT INFO */}
        <p><b>Product:</b> {productName}</p>
        <p><b>Price:</b> ₹ {price}</p>

        {/* CUSTOMIZATION */}
        <div style={{ marginBottom: "10px" }}>
          <b>Selected Customization:</b>
          {selectedOptions &&
            Object.keys(selectedOptions).map((key) => (
              <p key={key}>
                {key}: {selectedOptions[key]}
              </p>
            ))}
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

          {/* ✅ SINGLE DATE */}
          <DatePicker
  selected={date}
  onChange={(d) => setDate(d)}
  excludeDates={disabledDates}
  minDate={new Date()}
  dateFormat="dd-MM-yyyy"
  placeholderText="Select event date"
  className="booking-input"
/>

          <input
            type="text"
            name="location"
            placeholder="Event Location"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            readOnly
          />

          <input
            type="number"
            name="guestCount"
            placeholder="Guest Count"
            onChange={handleChange}
            required
          />

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