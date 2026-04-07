import { useEffect, useState } from "react";
import axios from "axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

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
    <div style={{ padding: "30px" }}>
      <h2>My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((b, i) => (
          <div key={i} style={cardStyle}>

            <h3>
              {b.type === "package"
                ? "📦 Package Booking"
                : "🎉 Product Booking"}
            </h3>

            <p><b>Name:</b> {b.userName}</p>
            <p><b>Email:</b> {b.email}</p>
            <p><b>Phone:</b> {b.phoneNumber}</p>

            {b.type === "package" ? (
              <>
                <p><b>Package ID:</b> {b.packageId}</p>

                <p>
                  <b>Start:</b>{" "}
                  {new Date(b.startingDate).toLocaleDateString()}
                </p>

                <p>
                  <b>End:</b>{" "}
                  {new Date(b.endingDate).toLocaleDateString()}
                </p>
              </>
            ) : (
              <>
                <p><b>Product:</b> {b.productName}</p>

                <p>
                  <b>Date:</b>{" "}
                  {new Date(b.date).toLocaleDateString()}
                </p>

                <div>
                  <b>Customization:</b>
                  {b.customizations &&
                    Object.keys(b.customizations).map((key) => (
                      <p key={key}>
                        {key}: {b.customizations[key]}
                      </p>
                    ))}
                </div>
              </>
            )}

            <p><b>Location:</b> {b.location}</p>
            <p><b>Guests:</b> {b.guestCount}</p>

          </div>
        ))
      )}
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ccc",
  padding: "15px",
  margin: "15px 0",
  borderRadius: "10px",
  background: "#fff"
};