import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const packageBookings = bookings.filter(b => b.type === "package");
  const productBookings = bookings.filter(b => b.type === "product");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ PRODUCT BOOKINGS
        const prodRes = await axios.get(
          "http://localhost:5000/api/product-bookings",
          {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        );

        // ✅ PACKAGE BOOKINGS
        const pkgRes = await axios.get(
          "http://localhost:5000/api/booking",
          {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        );

        // ✅ SAFE MERGE
        const merged = [
          ...(pkgRes.data || []).map((b) => ({ ...b, type: "package" })),
          ...(prodRes.data || []).map((b) => ({ ...b, type: "product" }))
        ];

        setBookings(merged);

      } catch (err) {
        console.log("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  return (
  <div style={{ padding: "30px", background: "#ffffff", minHeight: "100vh" }}>
    <h2 style={{ color: "#010101", marginBottom: "20px" }}>
      My Bookings
    </h2>

    {bookings.length === 0 ? (
      <p style={{ color: "#aaa" }}>No bookings found</p>
    ) : (
      <>
        {/* ================= PACKAGE SECTION ================= */}
        <h3 style={sectionTitle}>📦 Package Bookings</h3>

        {packageBookings.map((b, i) => (
          <div
  key={i}
  style={{ ...cardStyle, cursor: "pointer" }}
  onClick={() => navigate(`/packages/${b.packageId?._id || b.packageId}`)}
>

            <h3 style={titleStyle}>
              {b.packageId?.name || b.packageId}
            </h3>

            <p style={dateStyle}>
              📅 {new Date(b.startingDate).toLocaleDateString()} →{" "}
              {new Date(b.endingDate).toLocaleDateString()}
            </p>

            <div style={infoGrid}>
              <p>👤 {b.userName?.name || b.userName}</p>
              <p>📧 {b.email}</p>
              <p>📞 {b.phoneNumber}</p>
              <p>📍 {b.location}</p>
              <p>👥 {b.guestCount} Guests</p>
            </div>

          </div>
        ))}

        {/* ================= PRODUCT SECTION ================= */}
        <h3 style={sectionTitle}>🎉 Event Bookings</h3>

        {productBookings.map((b, i) => (
          <div
  key={i}
  style={{ ...cardStyle, cursor: "pointer" }}
  onClick={() => navigate(`/product/${b.productId}`)}
>

            <h3 style={titleStyle}>
              {b.productName?.name || b.productName}
            </h3>

            <p style={dateStyle}>
              📅 {new Date(b.date).toLocaleDateString()}
            </p>

            <div style={infoGrid}>
              <p>👤 {b.userName?.name || b.userName}</p>
              <p>📧 {b.email}</p>
              <p>📞 {b.phoneNumber}</p>
              <p>📍 {b.location}</p>
              <p>👥 {b.guestCount} Guests</p>
            </div>

            {b.customizations && (
              <div style={{ marginTop: "10px" }}>
                <b style={{ color: "#38bdf8" }}>Customization:</b>
                {Object.keys(b.customizations).map((key) => (
                  <p key={key} style={{ margin: "2px 0" }}>
                    {key}: {b.customizations[key]}
                  </p>
                ))}
              </div>
            )}

          </div>
        ))}
      </>
    )}
  </div>
);
}

const sectionTitle = {
  color: "#000000",
  marginTop: "25px",
  marginBottom: "10px",
  borderBottom: "1px solid #1e293b",
  paddingBottom: "5px"
};

const cardStyle = {
  background: "white",
  borderRadius: "12px",
  padding: "15px",
  marginBottom: "15px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
  color: "#000000"
};

const titleStyle = {
  margin: "0 0 5px 0"
};

const dateStyle = {
  color: "#080808",
  marginBottom: "10px"
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "5px"
};