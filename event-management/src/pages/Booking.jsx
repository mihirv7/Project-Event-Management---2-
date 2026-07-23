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
const [showTerms, setShowTerms] = useState(false);
const [agreed, setAgreed] = useState(false);
  
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
        <button
  type="button"
  onClick={() => setShowTerms(true)}
  onMouseEnter={(e) => {
    e.target.style.background =
      "linear-gradient(135deg,#FFC233,#FF9800)";
    e.target.style.transform = "translateY(-3px)";
    e.target.style.boxShadow =
      "0 12px 30px rgba(251,133,0,.45)";
  }}
  onMouseLeave={(e) => {
    e.target.style.background =
      "linear-gradient(135deg,#FFB703,#FB8500)";
    e.target.style.transform = "translateY(0)";
    e.target.style.boxShadow =
      "0 8px 20px rgba(251,133,0,.35)";
  }}
  style={{
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "50px",
    background: "linear-gradient(135deg,#FFB703,#FB8500)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "all .3s ease",
    boxShadow: "0 8px 20px rgba(251,133,0,.35)"
  }}
>
  View Terms & Conditions
</button>

<p
  style={{
    fontSize: "12px",
    color: "#777",
    textAlign: "center",
    marginTop: "8px"
  }}
>
  By continuing, you agree to our Terms & Conditions.
</p>

        <button
  onClick={() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");

      setTimeout(() => {
        navigate("/login");
      }, 300);

      return;
    }

    navigate(`/booking/${item._id}`);
  }}
  disabled={!agreed}
  onMouseEnter={(e) => {
    if (agreed) {
      e.target.style.background =
        "linear-gradient(135deg,#FFC233,#FF9800)";
      e.target.style.transform = "translateY(-3px)";
      e.target.style.boxShadow =
        "0 15px 35px rgba(251,133,0,.45)";
    }
  }}
  onMouseLeave={(e) => {
    if (agreed) {
      e.target.style.background =
        "linear-gradient(135deg,#FFB703,#FB8500)";
      e.target.style.transform = "translateY(0)";
      e.target.style.boxShadow =
        "0 10px 25px rgba(251,133,0,.35)";
    }
  }}
  style={{
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "50px",
    background: agreed
      ? "linear-gradient(135deg,#FFB703,#FB8500)"
      : "#999",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "600",
    cursor: agreed ? "pointer" : "not-allowed",
    marginTop: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    transition: "all .3s ease",
    boxShadow: agreed
      ? "0 10px 25px rgba(251,133,0,.35)"
      : "none"
  }}
>
  Confirm Booking
</button>
      </form>
      {showTerms && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999
    }}
  >
    <div
      style={{
        width: "90%",
        maxWidth: "500px",
        background: "#fff",
        borderRadius: "14px",
        padding: "25px",
        maxHeight: "100vh",
        overflowY: "auto"
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          textAlign: "center"
        }}
      >
        Terms & Conditions
      </h2>

      <ul
        style={{
          // paddingLeft: "20px",
          lineHeight: "1.8",
          color: "#444",
          listStyleType: "none"
        
          
        }}
      >
        <li>Advance payment is mandatory for booking confirmation.</li>

        <li>Booking amount is non-refundable after confirmation.</li>

        <li>Extra customization charges will apply separately.</li>

        <li>
          If guest count exceeds package limit, additional charges may apply.
        </li>

        <li>
          Venue size and space availability affect final decoration setup.
        </li>

        <li>
          Final event setup may slightly differ from website images.
        </li>

        <li>
          Client is responsible for venue permissions and approvals.
        </li>

        <li>
          Date changes are subject to availability of team and resources.
        </li>
      </ul>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />

        <span>I agree to the Terms & Conditions</span>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "25px"
        }}
      >
        <button
  onClick={() => setShowTerms(false)}
  onMouseEnter={(e) => {
    e.target.style.background =
      "linear-gradient(135deg,#FFC233,#FF9800)";
    e.target.style.transform = "translateY(-3px)";
    e.target.style.boxShadow =
      "0 12px 30px rgba(251,133,0,.45)";
  }}
  onMouseLeave={(e) => {
    e.target.style.background =
      "linear-gradient(135deg,#FFB703,#FB8500)";
    e.target.style.transform = "translateY(0)";
    e.target.style.boxShadow =
      "0 8px 20px rgba(251,133,0,.35)";
  }}
  style={{
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: "50px",
    background: "linear-gradient(135deg,#FFB703,#FB8500)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all .3s ease",
    boxShadow: "0 8px 20px rgba(251,133,0,.35)"
  }}
>
  Continue
</button>

        <button
  onClick={() => {
    setAgreed(false);
    setShowTerms(false);
  }}
  onMouseEnter={(e) => {
    e.target.style.background =
      "linear-gradient(135deg,#FFB703,#FB8500)";
    e.target.style.color = "#fff";
    e.target.style.transform = "translateY(-3px)";
    e.target.style.boxShadow =
      "0 12px 30px rgba(251,133,0,.35)";
  }}
  onMouseLeave={(e) => {
    e.target.style.background = "#fff";
    e.target.style.color = "#FFB703";
    e.target.style.transform = "translateY(0)";
    e.target.style.boxShadow = "none";
  }}
  style={{
    flex: 1,
    padding: "12px",
    border: "2px solid #FFB703",
    borderRadius: "50px",
    background: "#fff",
    color: "#FFB703",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all .3s ease"
  }}
>
  Cancel
</button>
      </div>
    </div>
  </div>
)}
    </div>
    </div>
  );
}