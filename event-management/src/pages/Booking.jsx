import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Booking.css"; // ✅ import CSS for styling

export default function Booking() {
  const { id } = useParams();
  const [bookedDates, setBookedDates] = useState([]);
  // const disabledDates = getDisabledDates();
  const navigate = useNavigate();
   const getNextDay = (date) => {
    if (!date) return "";
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };
  
  useEffect(() => {
  const fetchDates = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/booking/package/${id}`
      );
      setBookedDates(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchDates();
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
        "http://localhost:5000/api/booking/add",
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
      alert(err.response?.data?.message || "Booking failed");
    }
    if (isDateBlocked(formData.startDate, formData.endDate)) {
  alert("This package is already booked for selected dates");
  return;
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
          min={new Date().toISOString().split("T")[0]}
          required
        />

        <input
          type="date"
          name="endingDate"
          onChange={handleChange}
          min={getNextDay(formData.startingDate)}
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