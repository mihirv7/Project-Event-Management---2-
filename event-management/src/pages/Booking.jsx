import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Booking.css"; // ✅ import CSS for styling

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    startingDate: "",
    endingDate: "",
    location: "",
    phoneNumber: "",
    guestCount: "",
    specialRequest: ""
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
        "http://localhost:5000/api/bookings/add",
        { ...formData, packageId: id },
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

  return (
    <div className="booking-page">
      <div className="booking-container">
      <h2>Book Event</h2>

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

        <input
          type="date"
          name="startingDate"
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="endingDate"
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