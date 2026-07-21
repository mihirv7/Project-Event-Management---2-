import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyBookings.css";


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
  <div className="mybookings-page">

    <div className="mybookings-container">

      <h1 className="page-title">
        My Bookings
      </h1>

      {bookings.length === 0 ? (

        <div className="empty-booking">

          <h3>No Bookings Found</h3>

          <p>
            You haven't booked any package or event yet.
          </p>

        </div>

      ) : (

        <>

          {/* ================= PACKAGE ================= */}

          <div className="booking-section">

            <h2 className="section-title">
              📦 Package Bookings
            </h2>

            {packageBookings.map((b, i) => (

              <div
                key={i}
                className="booking-card"
                onClick={() =>
                  navigate(`/packages/${b.packageId?._id || b.packageId}`)
                }
              >

                <div className="booking-header">

                  <h3>
                    {b.packageId?.name || b.packageId}
                  </h3>

                  <span className="booking-type">
                    Package
                  </span>

                </div>

                <p className="booking-date">
                  📅 {new Date(b.startingDate).toLocaleDateString()} →
                  {" "}
                  {new Date(b.endingDate).toLocaleDateString()}
                </p>

                <div className="booking-grid">

                  <div>
                    👤 {b.userName?.name || b.userName}
                  </div>

                  <div>
                    📧 {b.email}
                  </div>

                  <div>
                    📞 {b.phoneNumber}
                  </div>

                  <div>
                    📍 {b.location}
                  </div>

                  <div>
                    👥 {b.guestCount} Guests
                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* ================= PRODUCT ================= */}

          <div className="booking-section">

            <h2 className="section-title">
              🎉 Event Bookings
            </h2>

            {productBookings.map((b, i) => (

              <div
                key={i}
                className="booking-card"
                onClick={() =>
                  navigate(`/product/${b.productId}`)
                }
              >

                <div className="booking-header">

                  <h3>
                    {b.productName?.name || b.productName}
                  </h3>

                  <span className="booking-type">
                    Event
                  </span>

                </div>

                <p className="booking-date">
                  📅 {new Date(b.date).toLocaleDateString()}
                </p>

                <div className="booking-grid">

                  <div>
                    👤 {b.userName?.name || b.userName}
                  </div>

                  <div>
                    📧 {b.email}
                  </div>

                  <div>
                    📞 {b.phoneNumber}
                  </div>

                  <div>
                    📍 {b.location}
                  </div>

                  <div>
                    👥 {b.guestCount} Guests
                  </div>

                </div>

                {b.customizations && (

                  <div className="customization-box">

                    <h4>
                      Selected Customizations
                    </h4>

                    {Object.keys(b.customizations).map((key) => (

                      <p key={key}>
                        <strong>{key}</strong> :
                        {" "}
                        {b.customizations[key]}
                      </p>

                    ))}

                  </div>

                )}

              </div>

            ))}

          </div>

        </>

      )}

    </div>

  </div>
);
}

