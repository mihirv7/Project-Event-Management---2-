import React, { useEffect, useState } from 'react'
import axios from 'axios'
import SimpleTable from '../components/SimpleTable'

export default function Bookings() {

  const [eventBookings, setEventBookings] = useState([]);
  const [bookingList, setBookingList] = useState([]);

  const getNextDay = (date) => {
  if (!date) return "";
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};
  const fetchEventBookings = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/product-bookings/admin"
    );

    const formatted = res.data.map((b) => ({
      name: b.userName,
      email: b.email,
      phone: b.phoneNumber,
      product: b.productName,
      date: new Date(b.date).toLocaleDateString(),
      guests: b.guestCount,
      location: b.location
    }));

    setEventBookings(formatted);

  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    fetchBookings();
     fetchEventBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings/admin");

      // ✅ format data for table
    const formatted = res.data.map(b => ({
  customer: b.userName,
  email: b.email,
  phone: b.phoneNumber,
  package: b.packageId?.name || "N/A",
  location: b.location,
  guests: b.guestCount,
  bookingDate: new Date(b.createdAt).toLocaleDateString(),
  dates: `${b.startingDate?.slice(0,10)} → ${b.endingDate?.slice(0,10)}`
}));

      setBookingList(formatted);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '18px' }}>

      <SimpleTable
        title="Bookings Management"
        subtitle="Track all customer bookings and statuses"
        columns={[
  { key: 'customer', label: 'Customer' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'package', label: 'Package' },
  // { key: 'location', label: 'Location' },
  // { key: 'guests', label: 'Guests' },
  { key: 'bookingDate', label: 'Booked On' },
  { key: 'dates', label: 'Event Dates' },
]}
        data={bookingList}
      />
      {/* ===== EVENTS DIVIDER ===== */}
<h3 style={{
  marginTop: "20px",
  color: "#fff",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  paddingBottom: "8px"
}}>
  Events
</h3>

{/* ===== EVENTS TABLE ===== */}
<SimpleTable
  title="Event Bookings"
  subtitle="Track all event bookings"
  columns={[
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "product", label: "Product Name" },
    { key: "date", label: "Booked On" },
    { key: "guests", label: "Guests" },
    { key: "location", label: "Location" }
  ]}
  data={eventBookings}
/>

    </div>
  )
}