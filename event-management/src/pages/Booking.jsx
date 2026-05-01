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

  if (!startDate || !endDate) {
    alert("Please select dates");
    return;
  }

  if (startDate >= endDate) {
    alert("End date must be greater than start date");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/booking/add",
      {
        ...formData,
        packageId: id,
        startingDate: startDate.toISOString(),
        endingDate: endDate.toISOString()
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
    alert(err.response?.data?.message || "Booking failed");
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