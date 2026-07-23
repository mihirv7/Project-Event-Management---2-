import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Booking.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function ProductBooking() {
  const navigate = useNavigate();
  const { state } = useLocation();
  // const [bookedDates, setBookedDates] = useState([]);
  const productId = state?.productId;
  const productName = state?.productName;
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);
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

  const customizationCount = selectedOptions
  ? Object.keys(selectedOptions).length
  : 0;

  const totalPrice =
  Number(price) + (customizationCount * 2000);
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
    amount: Number(totalPrice)
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

          price : totalPrice,

          amount: Number(totalPrice),

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

              price:totalPrice,

              amount: Number(totalPrice),

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

          navigate("/my-bookings");

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

       <div
  style={{
    background: "#dedddd",
    borderRadius: "14px",
    padding: "18px",
    marginBottom: "20px",
    border: "1px solid #e5e5e5"
  }}
>
  <h3
    style={{
      marginBottom: "15px",
      fontSize: "22px",
      color: "#222"
    }}
  >
    Booking Summary
  </h3>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px"
    }}
  >
    <span>Base Price</span>
    <strong>₹ {price}</strong>
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px"
    }}
  >
    <span>Customization Charge</span>
    <strong>
      ₹ {customizationCount * 2000}
    </strong>
  </div>

  <hr style={{ margin: "12px 0" }} />

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      fontSize: "20px",
      fontWeight: "bold",
      color: "#000"
    }}
  >
    <span>Total Amount</span>
    <span>₹ {totalPrice}</span>
  </div>

  {selectedOptions &&
    Object.keys(selectedOptions).length > 0 && (
      <div style={{ marginTop: "18px" }}>
        <h4 style={{ marginBottom: "10px" }}>
          Selected Customizations
        </h4>

        {Object.entries(selectedOptions).map(
          ([key, value]) => (
            <div
              key={key}
              style={{
                background: "#ffffff",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "8px",
                border: "1px solid #ddd"
              }}
            >
              <strong>{key}</strong> : {value}
            </div>
          )
        )}
      </div>
    )}
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
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: agreed
      ? "0 10px 25px rgba(251,133,0,.35)"
      : "none",
    transition: "all .3s ease"
  }}
>
  Confirm Booking
</button>
          {/* <button type="submit">Confirm Booking</button> */}

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
  }}
  onMouseLeave={(e) => {
    e.target.style.background =
      "linear-gradient(135deg,#FFB703,#FB8500)";
    e.target.style.transform = "translateY(0)";
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
    boxShadow: "0 10px 20px rgba(251,133,0,.35)"
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
  }}
  onMouseLeave={(e) => {
    e.target.style.background = "#fff";
    e.target.style.color = "#FFB703";
    e.target.style.transform = "translateY(0)";
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