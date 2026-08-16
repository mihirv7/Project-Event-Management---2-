import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FiPackage,
  FiBox,
  FiCoffee,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiDollarSign
} from "react-icons/fi";

import "./MyBookings.css";

export default function MyBookings() {

  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [cateringBookings, setCateringBookings] = useState([]);

  const packageBookings = bookings.filter(
    (b) => b.type === "package"
  );

  const productBookings = bookings.filter(
    (b) => b.type === "product"
  );

  useEffect(() => {

    const fetchBookings = async () => {

      try {

        const token = localStorage.getItem("token");

        const userRes = await axios.get(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        );

        const user = userRes.data;

        const cateringRes = await axios.get(
          `http://localhost:5000/api/catering-booking/user/${user._id}`
        );

        setCateringBookings(cateringRes.data);

        const prodRes = await axios.get(
          "http://localhost:5000/api/product-bookings",
          {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        );

        const pkgRes = await axios.get(
          "http://localhost:5000/api/booking",
          {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        );

        const merged = [

          ...(pkgRes.data || []).map((b) => ({
            ...b,
            type: "package"
          })),

          ...(prodRes.data || []).map((b) => ({
            ...b,
            type: "product"
          }))

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

      {/* ================= HERO ================= */}

      <section className="booking-hero">

        <div className="hero-content">

          <span className="hero-badge">

            <FiPackage />

            Event Dashboard

          </span>

          <h1>

            My <span>Bookings</span>

          </h1>

          <p>

            Manage your Package, Event and Catering bookings in one
            beautiful dashboard.

          </p>

        </div>

      </section>

      {/* ================= MAIN CONTAINER ================= */}

      <div className="mybookings-container">

        {/* ================= EMPTY ================= */}

        {bookings.length === 0 &&
        cateringBookings.length === 0 ? (

          <div className="empty-booking">

            <FiPackage className="empty-icon" />

            <h3>No Bookings Yet</h3>

            <p>

              Looks like you haven't booked anything yet.
              Start exploring amazing event packages.

            </p>

          </div>

        ) : (

          <>
            {/* ================= PACKAGE BOOKINGS ================= */}

            <section className="booking-section">

              <div className="section-header">

                <div className="section-left">

                  <div className="section-icon package-icon">

                    <FiPackage />

                  </div>

                  <div>

                    <h2>Package Bookings</h2>

                    <p>
                      Your premium event package reservations
                    </p>

                  </div>

                </div>

                <span className="section-count">

                  {packageBookings.length}

                </span>

              </div>

              {packageBookings.length === 0 ? (

                <div className="no-section-data">

                  <FiPackage size={45} />

                  <h4>No Package Bookings</h4>

                  <p>
                    You haven't booked any packages yet.
                  </p>

                </div>

              ) : (

                packageBookings.map((b, i) => (

                  <div
                    key={i}
                    className="booking-card premium-card"
                    onClick={() =>
                      navigate(
                        `/packages/${b.packageId?._id || b.packageId}`
                      )
                    }
                  >

                    {/* Card Header */}

                    <div className="booking-header">

                      <div>

                        <h3>

                          {b.packageId?.name || b.packageId}

                        </h3>

                        <p className="booking-subtitle">

                          Premium Event Package

                        </p>

                      </div>

                      <span className="booking-badge package">

                        <FiBox />

                        Package

                      </span>

                    </div>

                    {/* Booking Date */}

                    <div className="booking-date">

                      <FiCalendar />

                      <span>

                        {new Date(
                          b.startingDate
                        ).toLocaleDateString()}

                        {"  "}—{"  "}

                        {new Date(
                          b.endingDate
                        ).toLocaleDateString()}

                      </span>

                    </div>

                    {/* Information */}

                    <div className="booking-grid">

                      <div className="info-box">

                        <FiUser />

                        <div>

                          <label>Customer</label>

                          <span>

                            {b.userName?.name ||
                              b.userName}

                          </span>

                        </div>

                      </div>

                      <div className="info-box">

                        <FiMail />

                        <div>

                          <label>Email</label>

                          <span>

                            {b.email}

                          </span>

                        </div>

                      </div>

                      <div className="info-box">

                        <FiPhone />

                        <div>

                          <label>Phone</label>

                          <span>

                            {b.phoneNumber}

                          </span>

                        </div>

                      </div>

                      <div className="info-box">

                        <FiMapPin />

                        <div>

                          <label>Venue</label>

                          <span>

                            {b.location}

                          </span>

                        </div>

                      </div>

                      <div className="info-box">

                        <FiUsers />

                        <div>

                          <label>Guests</label>

                          <span>

                            {b.guestCount} Guests

                          </span>

                        </div>

                      </div>

                    </div>

                    {/* Footer */}

                    <div className="booking-footer">

                      <div className="booking-status">

                        <FiCheckCircle />

                        Booking Confirmed

                      </div>

                      <button
                        className="view-btn"
                        onClick={(e) => {
                          e.stopPropagation();

                          navigate(
                            `/packages/${b.packageId?._id || b.packageId}`
                          );
                        }}
                      >

                        View Package

                      </button>

                    </div>

                  </div>

                ))

              )}

            </section>
                        {/* ================= EVENT BOOKINGS ================= */}

            <section className="booking-section">

              <div className="section-header">

                <div className="section-left">

                  <div className="section-icon event-icon">

                    <FiBox />

                  </div>

                  <div>

                    <h2>Event Bookings</h2>

                    <p>
                      Your customized event decorations
                    </p>

                  </div>

                </div>

                <span className="section-count">

                  {productBookings.length}

                </span>

              </div>

              {productBookings.length === 0 ? (

                <div className="no-section-data">

                  <FiBox size={45} />

                  <h4>No Event Bookings</h4>

                  <p>
                    No customized event bookings found.
                  </p>

                </div>

              ) : (

                productBookings.map((b, i) => (

                  <div
                    key={i}
                    className="booking-card premium-card"
                    onClick={() =>
                      navigate(`/product/${b.productId}`)
                    }
                  >

                    <div className="booking-header">

                      <div>

                        <h3>

                          {b.productName?.name || b.productName}

                        </h3>

                        <p className="booking-subtitle">

                          Customized Event

                        </p>

                      </div>

                      <span className="booking-badge event">

                        <FiBox />

                        Event

                      </span>

                    </div>

                    <div className="booking-date">

                      <FiCalendar />

                      <span>

                        {new Date(
                          b.date
                        ).toLocaleDateString()}

                      </span>

                    </div>

                    <div className="booking-grid">

                      <div className="info-box">

                        <FiUser />

                        <div>

                          <label>Customer</label>

                          <span>

                            {b.userName?.name || b.userName}

                          </span>

                        </div>

                      </div>

                      <div className="info-box">

                        <FiMail />

                        <div>

                          <label>Email</label>

                          <span>{b.email}</span>

                        </div>

                      </div>

                      <div className="info-box">

                        <FiPhone />

                        <div>

                          <label>Phone</label>

                          <span>{b.phoneNumber}</span>

                        </div>

                      </div>

                      <div className="info-box">

                        <FiMapPin />

                        <div>

                          <label>Location</label>

                          <span>{b.location}</span>

                        </div>

                      </div>

                      <div className="info-box">

                        <FiUsers />

                        <div>

                          <label>Guests</label>

                          <span>

                            {b.guestCount} Guests

                          </span>

                        </div>

                      </div>

                    </div>

                    {b.customizations && (

                      <div className="customization-box">

                        <h4>

                          Selected Customizations

                        </h4>

                        {Object.keys(b.customizations).map((key) => (

                          <div
                            className="custom-item"
                            key={key}
                          >

                            <strong>{key}</strong>

                            <span>

                              {b.customizations[key]}

                            </span>

                          </div>

                        ))}

                      </div>

                    )}

                  </div>

                ))

              )}

            </section>

            {/* ================= CATERING BOOKINGS ================= */}

            <section className="booking-section">

              <div className="section-header">

                <div className="section-left">

                  <div className="section-icon catering-icon">

                    <FiCoffee />

                  </div>

                  <div>

                    <h2>Catering Bookings</h2>

                    <p>
                      Delicious catering reservations
                    </p>

                  </div>

                </div>

                <span className="section-count">

                  {cateringBookings.length}

                </span>

              </div>

              {cateringBookings.length === 0 ? (

                <div className="no-section-data">

                  <FiCoffee size={45} />

                  <h4>No Catering Bookings</h4>

                  <p>

                    No catering bookings available.

                  </p>

                </div>

              ) : (

                cateringBookings.map((b, i) => (

                  <div
                    key={i}
                    className="booking-card premium-card"
                  >

                    <div className="booking-header">

                      <div>

                        <h3>

                          {b.menuId?.thaliName}

                        </h3>

                        <p className="booking-subtitle">

                          Premium Catering Service

                        </p>

                      </div>

                      <span className="booking-badge catering">

                        <FiCoffee />

                        Catering

                      </span>

                    </div>

                    <div className="booking-date">

                      <FiCalendar />

                      <span>

                        {new Date(
                          b.eventDate
                        ).toLocaleDateString()}

                      </span>

                    </div>

                    <div className="booking-grid">

                      <div className="info-box">

                        <FiUser />

                        <div>

                          <label>Customer</label>

                          <span>{b.userName}</span>

                        </div>

                      </div>

                      <div className="info-box">

                        <FiMail />

                        <div>

                          <label>Email</label>

                          <span>{b.email}</span>

                        </div>

                      </div>

                      <div className="info-box">

                        <FiPhone />

                        <div>

                          <label>Phone</label>

                          <span>{b.phoneNumber}</span>

                        </div>

                      </div>

                      <div className="info-box">

                        <FiMapPin />

                        <div>

                          <label>Venue</label>

                          <span>{b.venue}</span>

                        </div>

                      </div>

                      <div className="info-box">

                        <FiUsers />

                        <div>

                          <label>Guests</label>

                          <span>

                            {b.guestCount} Guests

                          </span>

                        </div>

                      </div>

                      <div className="info-box">

                        <FiCoffee />

                        <div>

                          <label>Food Type</label>

                          <span>

                            {b.menuId?.foodType}

                          </span>

                        </div>

                      </div>

                      <div className="info-box">

                        <FiDollarSign />

                        <div>

                          <label>Amount</label>

                          <span>

                            ₹{b.amount}

                          </span>

                        </div>

                      </div>

                      <div className="info-box">

                        <FiCheckCircle />

                        <div>

                          <label>Status</label>

                          <span>

                            {b.paymentStatus}

                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                ))

              )}

            </section>

          </>

        )}

      </div>

    </div>

  );

}