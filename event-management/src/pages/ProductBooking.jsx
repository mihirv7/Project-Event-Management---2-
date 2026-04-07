import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Booking.css";

export default function ProductBooking() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const product = state?.product;
  const selectedOptions = state?.selectedOptions;

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

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/product-bookings/add", // ✅ different API
        {
          ...formData,
          productId: product._id,
          productName: product.name,
          price: product.price,
          customizations: selectedOptions
        },
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      );

      alert("Booking successful");
      navigate("/");

    } catch (err) {
      alert("Booking failed");
    }
  };

  if (!product) return <h2>No product selected</h2>;

  return (
    <div className="booking-page">
      <div className="booking-container">

        <h2>Book Event</h2>

        {/* PRODUCT INFO */}
        <p><b>Product:</b> {product.name}</p>
        <p><b>Price:</b> ₹ {product.price}</p>

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
          <input
            type="date"
            name="date"
            min={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            required
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