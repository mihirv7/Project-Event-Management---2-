import { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
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
  FiDollarSign,
  FiFileText,
  FiX,
  FiDownload
} from "react-icons/fi";

import "./MyBookings.css";

export default function MyBookings() {

  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [showCancellationInfo, setShowCancellationInfo] = useState({});
  const [cateringBookings, setCateringBookings] = useState([]);

  const [receiptUrl, setReceiptUrl] = useState(null);
const [receiptFileName, setReceiptFileName] = useState("");

  const packageBookings = bookings.filter(
    (b) => b.type === "package"
  );

  const productBookings = bookings.filter(
    (b) => b.type === "product"
  );

  const cateringBookingss = bookings.filter(
    (b) => b.type === "catering"
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

        // const token = localStorage.getItem("token");

        const cateringRes = await axios.get(
          `http://localhost:5000/api/catering-booking/user/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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

  // ============================
  // REQUEST PACKAGE CANCELLATION
  // ============================
  const handleCancelPackage = async (booking) => {
    const reason = window.prompt("Please enter your reason for cancelling this booking:");

    if (reason === null) return;

    if (!reason.trim()) {
      alert("Please enter a cancellation reason.");
      return;
    }

    const confirmed = window.confirm(
      "Submit a cancellation request? Your booking will remain confirmed until the admin reviews it."
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `http://localhost:5000/api/booking/cancel-request/${booking._id}`,
        { reason: reason.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setBookings((current) =>
        current.map((item) =>
          item._id === booking._id
            ? { ...item, ...response.data.booking, type: item.type }
            : item
        )
      );

      alert(response.data.message || "Cancellation request submitted.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to submit cancellation request. Please try again."
      );
    }
  };
  // =====================================
// REQUEST EVENT / PRODUCT CANCELLATION
// =====================================
const handleCancelProduct = async (booking) => {
  const reason = window.prompt(
    "Please enter your reason for cancelling this event booking:"
  );

  if (reason === null) return;

  if (!reason.trim()) {
    alert("Please enter a cancellation reason.");
    return;
  }

  const confirmed = window.confirm(
    "Submit a cancellation request? Your event booking will remain active until the admin reviews it."
  );

  if (!confirmed) return;

  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `http://localhost:5000/api/product-bookings/cancel-request/${booking._id}`,
      { reason: reason.trim() },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updatedBooking =
      response.data.data || response.data.booking;

    setBookings((current) =>
      current.map((item) =>
        item._id === booking._id
          ? {
              ...item,
              ...updatedBooking,
              type: item.type,
            }
          : item
      )
    );

    alert(
      response.data.message ||
        "Event cancellation request submitted successfully."
    );
  } catch (error) {
    console.error(
      "Event cancellation error:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
        "Unable to submit the cancellation request. Please try again."
    );
  }
};


  // ============================
  // REQUEST CATERING CANCELLATION
  // ============================
  const handleCancelCatering = async (booking) => {
    const reason = window.prompt(
      "Please enter your reason for cancelling this catering booking:"
    );

    if (reason === null) return;

    if (!reason.trim()) {
      alert("Please enter a cancellation reason.");
      return;
    }

    const confirmed = window.confirm(
      "Submit a cancellation request? Your catering booking will remain active until the admin reviews it."
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `http://localhost:5000/api/catering-booking/cancel-request/${booking._id}`,
        { reason: reason.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCateringBookings((current) =>
        current.map((item) =>
          item._id === booking._id
            ? { ...item, ...response.data.booking }
            : item
        )
      );

      alert(response.data.message || "Catering cancellation request submitted.");
    } catch (error) {
      console.error(
        "Catering cancellation error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to submit the catering cancellation request. Please try again."
      );
    }
  };

  const generateBookingReceipt = (booking, type) => {

  const doc = new jsPDF();

  const orange = [251, 133, 0];
  const dark = [35, 35, 35];
  const gray = [110, 110, 110];
  const light = [255, 248, 238];

  let y = 20;

  /* =========================
     HEADER
  ========================= */

  doc.setFillColor(...orange);
  doc.rect(0, 0, 210, 12, "F");

  doc.setTextColor(...dark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);

  doc.text("Momento.", 20, 32);

  doc.setFontSize(11);
  doc.setTextColor(...gray);

  doc.text(
    "Event Management System",
    20,
    40
  );

  /* =========================
     RECEIPT TITLE
  ========================= */

  doc.setTextColor(...dark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);

  doc.text(
    "BOOKING RECEIPT",
    20,
    57
  );

  doc.setDrawColor(...orange);
  doc.setLineWidth(1);

  doc.line(
    20,
    62,
    190,
    62
  );

  /* =========================
     BOOKING TYPE
  ========================= */

  y = 78;

  doc.setFillColor(...light);

  doc.roundedRect(
    20,
    y - 8,
    170,
    20,
    4,
    4,
    "F"
  );

  doc.setTextColor(...orange);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);

  doc.text(
    `${type} Booking`,
    28,
    y + 5
  );

  /* =========================
     HELPER
  ========================= */

  const addDetail = (label, value) => {

    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return;
    }

    y += 17;

    doc.setTextColor(...gray);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(
      label,
      25,
      y
    );

    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);

    const text = String(value);

    const lines = doc.splitTextToSize(
      text,
      105
    );

    doc.text(
      lines,
      80,
      y
    );

    if (lines.length > 1) {
      y += (lines.length - 1) * 5;
    }

    doc.setDrawColor(230, 230, 230);

    doc.line(
      25,
      y + 6,
      185,
      y + 6
    );
  };

  /* =========================
     PACKAGE BOOKING
  ========================= */

  if (type === "Package") {

    addDetail(
      "Package",
      booking.packageId?.name || booking.packageId
    );

    addDetail(
      "Customer",
      booking.userName?.name || booking.userName
    );

    addDetail(
      "Email",
      booking.email
    );

    addDetail(
      "Phone",
      booking.phoneNumber
    );

    addDetail(
      "Starting Date",
      booking.startingDate
        ? new Date(booking.startingDate).toLocaleDateString()
        : ""
    );

    addDetail(
      "Ending Date",
      booking.endingDate
        ? new Date(booking.endingDate).toLocaleDateString()
        : ""
    );

    addDetail(
      "Venue",
      booking.location
    );

    addDetail(
      "Guests",
      booking.guestCount
        ? `${booking.guestCount} Guests`
        : ""
    );

    addDetail(
      "Amount",
      booking.amount
        ? `₹${booking.amount}`
        : ""
    );

    addDetail(
      "Payment Status",
      booking.paymentStatus || "Success"
    );
  }

  /* =========================
     EVENT BOOKING
  ========================= */

  if (type === "Event") {

    addDetail(
      "Event",
      booking.productName?.name || booking.productName
    );

    addDetail(
      "Customer",
      booking.userName?.name || booking.userName
    );

    addDetail(
      "Email",
      booking.email
    );

    addDetail(
      "Phone",
      booking.phoneNumber
    );

    addDetail(
      "Event Date",
      booking.date
        ? new Date(booking.date).toLocaleDateString()
        : ""
    );

    addDetail(
      "Location",
      booking.location
    );

    addDetail(
      "Guests",
      booking.guestCount
        ? `${booking.guestCount} Guests`
        : ""
    );

    addDetail(
      "Amount",
      booking.amount
        ? `₹${booking.amount}`
        : ""
    );

    addDetail(
      "Payment Status",
      booking.paymentStatus || "Success"
    );

    /* =========================
       CUSTOMIZATIONS
    ========================= */

    if (
      booking.customizations &&
      Object.keys(booking.customizations).length > 0
    ) {

      y += 25;

      doc.setTextColor(...orange);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);

      doc.text(
        "Selected Customizations",
        25,
        y
      );

      Object.entries(
        booking.customizations
      ).forEach(([key, value]) => {

        y += 15;

        doc.setTextColor(...gray);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        doc.text(
          key,
          30,
          y
        );

        doc.setTextColor(...dark);
        doc.setFont("helvetica", "bold");

        doc.text(
          String(value),
          100,
          y
        );
      });
    }
  }

  /* =========================
     CATERING BOOKING
  ========================= */

  if (type === "Catering") {

    addDetail(
      "Menu",
      booking.menuId?.thaliName
    );

    addDetail(
      "Customer",
      booking.userName
    );

    addDetail(
      "Email",
      booking.email
    );

    addDetail(
      "Phone",
      booking.phoneNumber
    );

    addDetail(
      "Event Date",
      booking.eventDate
        ? new Date(booking.eventDate).toLocaleDateString()
        : ""
    );

    addDetail(
      "Venue",
      booking.venue
    );

    addDetail(
      "Guests",
      booking.guestCount
        ? `${booking.guestCount} Guests`
        : ""
    );

    addDetail(
      "Food Type",
      booking.menuId?.foodType
    );

    addDetail(
      "Amount",
      booking.amount
        ? `₹${booking.amount}`
        : ""
    );

    addDetail(
      "Payment Status",
      booking.paymentStatus || "Success"
    );
  }

  /* =========================
   CANCELLATION & REFUND POLICY
========================= */

if (y > 220) {
  doc.addPage();
  y = 25;
}

y += 18;

doc.setTextColor(...orange);
doc.setFont("helvetica", "bold");
doc.setFontSize(13);

doc.text(
  "Cancellation & Refund Policy",
  25,
  y
);

y += 12;

const refundPolicy = [
  ["More than 7 days before event", "100%"],
  ["3–7 days before event", "75%"],
  ["1–2 days before event", "50%"],
  ["Same day", "0%"]
];

refundPolicy.forEach(([period, refund]) => {

  y += 13;

  doc.setTextColor(...gray);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(period, 30, y);

  doc.setTextColor(...dark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text(refund, 170, y);

  doc.setDrawColor(230, 230, 230);
  doc.line(25, y + 6, 185, y + 6);
});

  /* =========================
     FOOTER
  ========================= */

  const pageHeight =
    doc.internal.pageSize.height;

  doc.setTextColor(...gray);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.text(
    "Thank you for choosing Momento Event Management.",
    20,
    pageHeight - 20
  );

  doc.text(
    `Generated on ${new Date().toLocaleDateString()}`,
    20,
    pageHeight - 13
  );

  /* =========================
     CREATE PDF
  ========================= */

  const pdfBlob = doc.output("blob");

  const url = URL.createObjectURL(
    pdfBlob
  );

  const fileName =
    `${type}-Booking-Receipt.pdf`;

  setReceiptUrl(url);
  setReceiptFileName(fileName);
};

const downloadReceipt = () => {

  if (!receiptUrl) return;

  const link = document.createElement("a");

  link.href = receiptUrl;
  link.download = receiptFileName;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};

const closeReceipt = () => {

  if (receiptUrl) {
    URL.revokeObjectURL(receiptUrl);
  }

  setReceiptUrl(null);
  setReceiptFileName("");
};

  return (

    <div className="mybookings-page">

      {/* ================= HERO ================= */}

      <section className="booking-hero">

        <div className="hero-content">

          {/* <span className="hero-badge">

            <FiPackage />

            {/* Event Dashboard */}

          {/* </span> */} 

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

                        View Package

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

                      <div
  className="info-box venue-box"
  onClick={(e) => {
    e.stopPropagation();

    const venue = encodeURIComponent(b.location);

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${venue}`,
      "_blank",
      "noopener,noreferrer"
    );
  }}
  title="Open venue in Google Maps"
>

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

                          <label>Payment Status</label>

                          <span>

                            {b.paymentStatus || "Success"}

                          </span>

                        </div>

                      </div>



                    </div>

                    {(showCancellationInfo[b._id] ||
                      b.cancellationStatus === "Requested" ||
                      b.cancellationStatus === "Approved" ||
                      b.cancellationStatus === "Rejected" ||
                      b.bookingStatus === "Cancelled") && (
                      <div className="cancellation-info" style={{ marginTop: "14px" }}>
                        <p>
                          <strong>Booking Status:</strong> {b.bookingStatus || "Confirmed"}
                        </p>

                        <p>
                          <strong>Cancellation:</strong> {b.cancellationStatus || "NotRequested"}
                        </p>

                        {b.cancellationStatus === "Requested" && (
                          <p>Your cancellation request is waiting for admin approval.</p>
                        )}

                        {b.cancellationStatus === "Rejected" && (
                          <p>
                            Your cancellation request was rejected. Please contact support if you need help.
                          </p>
                        )}

                        {b.bookingStatus === "Cancelled" && (
                          <p>
                            <strong>Refund Status:</strong> {b.refundStatus || "NotRequested"}
                            {Number(b.refundAmount) > 0 && ` — ₹${b.refundAmount}`}
                          </p>
                        )}
                      </div>
                    )}

                   <div className="booking-actions">

                    {b.bookingStatus !== "Cancelled" &&
                      b.cancellationStatus !== "Requested" &&
                      b.cancellationStatus !== "Approved" && (
                        <button
                          className="receipt-btn"
                          onClick={(e) => {
                            setShowCancellationInfo((prev) => ({
                              ...prev,
                              [b._id]: true,
                            }))
                            e.stopPropagation();
                            handleCancelPackage(b);
                          }}
                          style={{ background: "#dc2626", marginRight: "10px" }}
                        >
                          Cancel Booking
                        </button>
                      )}

                    <button
                      className="receipt-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        generateBookingReceipt(b, "Package");
                      }}
                    >
                      <FiFileText />
                      Booking Receipt
                    </button>

                    

                  </div>

                  </div>

                ))

              )}

            </section>
                        {/* ================= EVENT BOOKINGS ================= */}

            {/* ================= EVENT BOOKINGS ================= */}

      <section className="booking-section">
        <div className="section-header">
          <div className="section-left">
            <div className="section-icon event-icon">
              <FiBox />
            </div>

            <div>
              <h2>Event Bookings</h2>
              <p>Your customized event decorations</p>
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
            <p>No customized event bookings found.</p>
          </div>
        ) : (
          productBookings.map((b, i) => (
            <div
              key={b._id || i}
              className="booking-card premium-card"
              onClick={() => navigate(`/product/${b.productId}`)}
            >
              {/* HEADER */}
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
                  View Event
                </span>
              </div>

              {/* EVENT DATE */}
              <div className="booking-date">
                <FiCalendar />
                <span>
                  {b.date
                    ? new Date(b.date).toLocaleDateString()
                    : "Date not available"}
                </span>
              </div>

              {/* BOOKING DETAILS */}
              <div className="booking-grid">
                <div className="info-box">
                  <FiUser />
                  <div>
                    <label>Customer</label>
                    <span>{b.userName?.name || b.userName || "N/A"}</span>
                  </div>
                </div>

                <div className="info-box">
                  <FiMail />
                  <div>
                    <label>Email</label>
                    <span>{b.email || "N/A"}</span>
                  </div>
                </div>

                <div className="info-box">
                  <FiPhone />
                  <div>
                    <label>Phone</label>
                    <span>{b.phoneNumber || "N/A"}</span>
                  </div>
                </div>

                <div className="info-box">
                  <FiMapPin />
                  <div>
                    <label>Location</label>
                    <span>{b.location || "N/A"}</span>
                  </div>
                </div>

                <div className="info-box">
                  <FiUsers />
                  <div>
                    <label>Guests</label>
                    <span>{b.guestCount || 0} Guests</span>
                  </div>
                </div>

                <div className="info-box">
                  <FiDollarSign />
                  <div>
                    <label>Amount</label>
                    <span>₹{b.amount ?? b.price ?? 0}</span>
                  </div>
                </div>

                <div className="info-box">
                  <FiCheckCircle />
                  <div>
                    <label>Payment Status</label>
                    <span>{b.paymentStatus || "Pending"}</span>
                  </div>
                </div>
              </div>

        {/* CANCELLATION INFORMATION */}
        {(
          (b.cancellationStatus &&
            b.cancellationStatus !== "NotRequested") ||
          b.bookingStatus === "Cancelled"
        ) && (
          <div
            className="cancellation-info"
            style={{ marginTop: "14px" }}
          >
            <p>
              <strong>Booking Status:</strong>{" "}
              {b.bookingStatus || "Confirmed"}
            </p>

            <p>
              <strong>Cancellation Status:</strong>{" "}
              {b.cancellationStatus || "NotRequested"}
            </p>

            {b.cancellationReason && (
              <p>
                <strong>Reason:</strong>{" "}
                {b.cancellationReason}
              </p>
            )}

            {b.cancellationStatus === "Requested" && (
              <p>
                Your cancellation request is waiting for admin approval.
              </p>
            )}

            {b.cancellationStatus === "Rejected" && (
              <p>
                Your cancellation request was rejected. You can submit a
                new request if needed.
              </p>
            )}

            {b.bookingStatus === "Cancelled" && (
              <p>
                <strong>Refund Status:</strong>{" "}
                {b.refundStatus || "NotRequested"}
                {Number(b.refundAmount) > 0 &&
                  ` — ₹${b.refundAmount}`}
              </p>
            )}
          </div>
        )}

        {/* SELECTED CUSTOMIZATIONS */}
        {b.customizations &&
          Object.keys(b.customizations).length > 0 && (
            <div className="customization-box">
              <h4>Selected Customizations</h4>

              {Object.entries(b.customizations).map(([key, value]) => (
                <div className="custom-item" key={key}>
                  <strong>{key}</strong>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          )}

        {/* EVENT BOOKING ACTIONS */}
        <div className="booking-actions">
          {b.bookingStatus !== "Cancelled" &&
            b.cancellationStatus !== "Requested" &&
            b.cancellationStatus !== "Approved" && (
              <button
                type="button"
                className="receipt-btn"
                style={{
                  background: "#dc2626",
                  marginRight: "10px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelProduct(b);
                }}
              >
                <FiX />
                Cancel Event Booking
              </button>
            )}

          <button
            type="button"
            className="receipt-btn"
            onClick={(e) => {
              e.stopPropagation();
              generateBookingReceipt(b, "Event");
            }}
          >
            <FiFileText />
            Booking Receipt
          </button>
        </div>
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
                    onClick={() =>
                      navigate(
                        `/catering/${b.menuId?._id || b.menuIdId}`
                      )
                    }
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

                        View Catering

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

                    {(b.cancellationStatus === "Requested" ||
                      b.cancellationStatus === "Approved" ||
                      b.cancellationStatus === "Rejected" ||
                      b.bookingStatus === "Cancelled") && (
                      <div className="cancellation-info" style={{ marginTop: "14px" }}>
                        <p>
                          <strong>Booking Status:</strong>{" "}
                          {b.bookingStatus || "Pending"}
                        </p>
                        <p>
                          <strong>Cancellation Status:</strong>{" "}
                          {b.cancellationStatus || "NotRequested"}
                        </p>

                        {b.cancellationStatus === "Requested" && (
                          <p>Your cancellation request is waiting for admin approval.</p>
                        )}

                        {b.cancellationStatus === "Rejected" && (
                          <p>Your cancellation request was rejected. Please contact support if you need help.</p>
                        )}

                        {b.bookingStatus === "Cancelled" && (
                          <p>
                            <strong>Refund Status:</strong>{" "}
                            {b.refundStatus || "NotRequested"}
                            {Number(b.refundAmount) > 0 && ` — ₹${b.refundAmount}`}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="booking-actions">
                      {b.bookingStatus !== "Cancelled" &&
                        b.cancellationStatus !== "Requested" &&
                        b.cancellationStatus !== "Approved" && (
                          <button
                            type="button"
                            className="receipt-btn"
                            style={{ background: "#dc2626", marginRight: "10px" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelCatering(b);
                            }}
                          >
                            <FiX />
                            Cancel Catering Booking
                          </button>
                        )}

                      <button
                        type="button"
                        className="receipt-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          generateBookingReceipt(b, "Catering");
                        }}
                      >
                        <FiFileText />
                        Booking Receipt
                      </button>
                    </div>

                  </div>

                ))

              )}

            </section>

          </>

        )}

      </div>

      {/* ================= PDF RECEIPT MODAL ================= */}

{receiptUrl && (

  <div className="receipt-modal">

    <div className="receipt-modal-content">

      {/* Header */}

      <div className="receipt-modal-header">

        <div>

          <FiFileText />

          <h3>
            Booking Receipt
          </h3>

        </div>

        <button
          className="receipt-close"
          onClick={closeReceipt}
        >
          <FiX />
        </button>

      </div>


      {/* PDF */}

      <div className="receipt-pdf-container">

        <iframe
          src={receiptUrl}
          title="Booking Receipt"
          className="receipt-pdf"
        />

      </div>


      {/* Footer */}

      <div className="receipt-modal-footer">

        <button
          className="receipt-download-btn"
          onClick={downloadReceipt}
        >
          <FiDownload />

          Download PDF

        </button>

        <button
          className="receipt-close-btn"
          onClick={closeReceipt}
        >
          Close
        </button>

      </div>

    </div>

  </div>

)}  

    </div>

  );

}