import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

// ======================================
// AUTHENTICATION
// ======================================
const getAuthConfig = () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    throw new Error("Admin token not found. Please log in again.");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ======================================
// COMMON TABLE STYLES
// ======================================
const cellStyle = {
  padding: "14px 16px",
  whiteSpace: "nowrap",
  borderBottom: "1px solid rgba(255,255,255,0.07)",
  verticalAlign: "top",
};

const buttonStyle = {
  padding: "7px 10px",
  border: 0,
  borderRadius: "6px",
  color: "#fff",
  cursor: "pointer",
  fontSize: "13px",
};

const panelStyle = {
  marginTop: "20px",
  padding: "18px",
  borderRadius: "12px",
  background: "#1f2937",
  border: "1px solid #374151",
  minWidth: 0,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  color: "#e5e7eb",
};

const headingStyle = {
  position: "sticky",
  top: 0,
  zIndex: 1,
  background: "#252d3d",
  padding: "14px 16px",
  textAlign: "left",
  whiteSpace: "nowrap",
  borderBottom: "1px solid #3b4558",
};
// Booking status badge styles
const getBookingStatusStyle = (status) => {
  const normalizedStatus = (status || "Pending").toLowerCase();

  let color = "#f59e0b";
  let background = "rgba(245, 158, 11, 0.12)";

  if (normalizedStatus === "cancelled") {
    color = "#ef4444";
    background = "rgba(239, 68, 68, 0.15)";
  } else if (normalizedStatus === "confirmed") {
    color = "#22c55e";
    background = "rgba(34, 197, 94, 0.12)";
  }

  return {
    color,
    background,
    padding: "5px 10px",
    borderRadius: "6px",
    fontWeight: 600,
    display: "inline-block",
    whiteSpace: "nowrap",
  };
};

// ======================================
// MAIN COMPONENT
// ======================================
export default function Bookings() {
  const [packageBookings, setPackageBookings] = useState([]);
  const [eventBookings, setEventBookings] = useState([]);
  const [cateringBookings, setCateringBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // ======================================
  // FETCH PACKAGE BOOKINGS
  // ======================================
  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `${API}/booking/admin`,
        getAuthConfig()
      );

      setPackageBookings(
        Array.isArray(res.data) ? res.data : []
      );
    } catch (error) {
      console.error(
        "Error fetching package bookings:",
        error.response?.data || error.message
      );
    }
  };

  // ======================================
  // FETCH PRODUCT / EVENT BOOKINGS
  // ======================================
  const fetchEventBookings = async () => {
    try {
      const res = await axios.get(
        `${API}/product-bookings/admin`,
        getAuthConfig()
      );

      const bookings = Array.isArray(res.data)
        ? res.data
        : [];

      // Preserve ALL original database fields.
      // This includes cancellation and refund information.
      const formatted = bookings.map((b) => ({
        ...b,

        name:
          b.userName?.name ||
          b.userName ||
          "N/A",

        phone:
          b.phoneNumber ||
          "N/A",

        product:
          b.productName?.name ||
          b.productName ||
          "N/A",

        date: b.date
          ? new Date(b.date).toLocaleDateString("en-IN")
          : "N/A",

        guests: b.guestCount ?? "N/A",
      }));

      setEventBookings(formatted);
    } catch (error) {
      console.error(
        "Error fetching product bookings:",
        error.response?.data || error.message
      );
    }
  };

  // ======================================
  // FETCH CATERING BOOKINGS
  // ======================================
  const fetchCateringBookings = async () => {
    try {
      const res = await axios.get(
        `${API}/catering-booking`,
        getAuthConfig()
      );

      setCateringBookings(
        Array.isArray(res.data) ? res.data : []
      );
    } catch (error) {
      console.error(
        "Error fetching catering bookings:",
        error.response?.data || error.message
      );
    }
  };

  // ======================================
  // FETCH ALL BOOKINGS
  // ======================================
  const fetchAllBookings = async () => {
    await Promise.all([
      fetchBookings(),
      fetchEventBookings(),
      fetchCateringBookings(),
    ]);
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  // ======================================
  // APPROVE / REJECT PACKAGE CANCELLATION
  // ======================================
  const handleCancellation = async (bookingId, action) => {
    const confirmed = window.confirm(
      action === "approve"
        ? "Approve this package cancellation request?"
        : "Reject this package cancellation request?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await axios.patch(
        `${API}/booking/admin/cancellation/${bookingId}`,
        { action },
        getAuthConfig()
      );

      alert(
        res.data.message ||
          `Package cancellation ${action}d successfully.`
      );

      await fetchBookings();
    } catch (error) {
      console.error(
        "Package cancellation error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to process package cancellation."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // RECORD PACKAGE REFUND
  // ======================================
  const handleRefund = async (bookingId) => {
    const amount = window.prompt(
      "Enter the refund amount after processing the refund:"
    );

    if (amount === null) return;

    const refundAmount = Number(amount);

    if (
      !Number.isFinite(refundAmount) ||
      refundAmount <= 0
    ) {
      alert("Please enter a valid refund amount.");
      return;
    }

    const note = window.prompt(
      "Enter a refund note (optional):"
    );

    if (
      !window.confirm(
        "Have you actually processed this refund through your payment provider?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      const res = await axios.patch(
        `${API}/booking/admin/refund/${bookingId}`,
        {
          refundAmount,
          refundNote: note || "",
          refundStatus: "Processed",
        },
        getAuthConfig()
      );

      alert(
        res.data.message || "Package refund status updated."
      );

      await fetchBookings();
    } catch (error) {
      console.error(
        "Package refund error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to update package refund."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // APPROVE / REJECT PRODUCT CANCELLATION
  // ======================================
  const handleProductCancellation = async (
    bookingId,
    action
  ) => {
    const confirmed = window.confirm(
      action === "Approved"
        ? "Approve this product cancellation request?"
        : "Reject this product cancellation request?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await axios.patch(
        `${API}/product-bookings/admin/cancellation/${bookingId}`,
        { action },
        getAuthConfig()
      );

      alert(
        res.data.message ||
          `Product cancellation ${action.toLowerCase()}.`
      );

      await fetchEventBookings();
    } catch (error) {
      console.error(
        "Product cancellation error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to process product cancellation."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // RECORD PRODUCT REFUND
  // ======================================
  const handleProductRefund = async (bookingId) => {
    const amount = window.prompt(
      "Enter the refund amount after processing the refund:"
    );

    if (amount === null) return;

    const refundAmount = Number(amount);

    if (
      !Number.isFinite(refundAmount) ||
      refundAmount <= 0
    ) {
      alert("Please enter a valid refund amount.");
      return;
    }

    const note = window.prompt(
      "Enter a refund note (optional):"
    );

    if (
      !window.confirm(
        "Have you actually processed this refund through your payment provider?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      const res = await axios.patch(
        `${API}/product-bookings/admin/refund/${bookingId}`,
        {
          refundAmount,
          refundNote: note || "",
          refundStatus: "Processed",
        },
        getAuthConfig()
      );

      alert(
        res.data.message || "Product refund status updated."
      );

      await fetchEventBookings();
    } catch (error) {
      console.error(
        "Product refund error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to update product refund."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // APPROVE / REJECT CATERING CANCELLATION
  // ======================================
  const handleCateringCancellation = async (
    bookingId,
    action
  ) => {
    const confirmed = window.confirm(
      action === "approve"
        ? "Approve this catering cancellation request?"
        : "Reject this catering cancellation request?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await axios.patch(
        `${API}/catering-booking/admin/cancellation/${bookingId}`,
        { action },
        getAuthConfig()
      );

      alert(
        res.data.message ||
          `Catering cancellation ${action}d.`
      );

      await fetchCateringBookings();
    } catch (error) {
      console.error(
        "Catering cancellation error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to process catering cancellation."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // RECORD CATERING REFUND
  // ======================================
  const handleCateringRefund = async (bookingId) => {
    const amount = window.prompt(
      "Enter the refund amount after processing the refund:"
    );

    if (amount === null) return;

    const refundAmount = Number(amount);

    if (
      !Number.isFinite(refundAmount) ||
      refundAmount <= 0
    ) {
      alert("Please enter a valid refund amount.");
      return;
    }

    const note = window.prompt(
      "Enter a refund note (optional):"
    );

    if (
      !window.confirm(
        "Have you actually processed this refund through your payment provider?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      const res = await axios.patch(
        `${API}/catering-booking/admin/refund/${bookingId}`,
        {
          refundAmount,
          refundNote: note || "",
          refundStatus: "Processed",
        },
        getAuthConfig()
      );

      alert(
        res.data.message || "Catering refund status updated."
      );

      await fetchCateringBookings();
    } catch (error) {
      console.error(
        "Catering refund error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to update catering refund."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // SHARED REFUND DISPLAY
  // ======================================
  const RefundDetails = ({ booking }) => (
    <>
      {booking.refundStatus || "NotRequested"}

      {Number(booking.refundAmount) > 0 && (
        <>
          <br />
          ₹{booking.refundAmount}
        </>
      )}

      {booking.refundNote && (
        <>
          <br />
          <small>{booking.refundNote}</small>
        </>
      )}
    </>
  );

  // ======================================
  // RENDER
  // ======================================
  return (
    <div
      style={{
        display: "grid",
        gap: "18px",
        minWidth: 0,
        color: "#e5e7eb",
      }}
    >
      {/* ==================================
          PACKAGE BOOKINGS
      ================================== */}

      <div style={panelStyle}>
        <h3 style={{ color: "#fff", marginTop: 0 }}>
          Package Bookings
        </h3>

        {packageBookings.length === 0 ? (
          <p style={{ color: "#bbb" }}>
            No package bookings found.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                ...tableStyle,
                minWidth: "1350px",
              }}
            >
              <thead>
                <tr>
                  {[
                    "Customer",
                    "Email",
                    "Package",
                    "Event Dates",
                    "Guests",
                    "Amount",
                    "Payment",
                    "Booking Status",
                    "Cancellation",
                    "Reason",
                    "Refund",
                    "Actions",
                  ].map((heading) => (
                    <th key={heading} style={headingStyle}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {packageBookings.map((b) => (
                  <tr key={b._id}>
                    <td style={cellStyle}>
                      {b.userName || "N/A"}
                    </td>

                    <td style={cellStyle}>
                      {b.email || "N/A"}
                    </td>

                    <td style={cellStyle}>
                      {b.packageId?.name || "N/A"}
                    </td>

                    <td style={cellStyle}>
                      {b.startingDate
                        ? new Date(
                            b.startingDate
                          ).toLocaleDateString("en-IN")
                        : "N/A"}
                      {" → "}
                      {b.endingDate
                        ? new Date(
                            b.endingDate
                          ).toLocaleDateString("en-IN")
                        : "N/A"}
                    </td>

                    <td style={cellStyle}>
                      {b.guestCount ?? "N/A"}
                    </td>

                    <td style={cellStyle}>
                      ₹{b.amount ?? 0}
                    </td>

                    <td style={cellStyle}>
                      {b.paymentStatus || "Pending"}
                    </td>

                    <td style={cellStyle}>
                      <span style={getBookingStatusStyle(b.bookingStatus || "Confirmed")}>
                        {b.bookingStatus || "Confirmed"}
                      </span>
                    </td>

                    <td style={cellStyle}>
                      {b.cancellationStatus || "NotRequested"}
                    </td>

                    <td style={cellStyle}>
                      {b.cancellationReason || "—"}
                    </td>

                    <td style={cellStyle}>
                      <RefundDetails booking={b} />
                    </td>

                    <td style={cellStyle}>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        {b.cancellationStatus === "Requested" && (
                          <>
                            <button
                              disabled={loading}
                              onClick={() =>
                                handleCancellation(
                                  b._id,
                                  "approve"
                                )
                              }
                              style={{
                                ...buttonStyle,
                                background: "#16a34a",
                              }}
                            >
                              Approve
                            </button>

                            <button
                              disabled={loading}
                              onClick={() =>
                                handleCancellation(
                                  b._id,
                                  "reject"
                                )
                              }
                              style={{
                                ...buttonStyle,
                                background: "#dc2626",
                              }}
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {b.cancellationStatus === "Approved" &&
                          b.bookingStatus === "Cancelled" &&
                          b.refundStatus !== "Processed" &&
                          b.paymentStatus === "Success" && (
                            <button
                              disabled={loading}
                              onClick={() =>
                                handleRefund(b._id)
                              }
                              style={{
                                ...buttonStyle,
                                background: "#f59e0b",
                                color: "#111",
                              }}
                            >
                              Record Refund
                            </button>
                          )}

                        {b.refundStatus === "Processed" && (
                          <span style={{ color: "#22c55e" }}>
                            Refund recorded
                          </span>
                        )}

                        {b.cancellationStatus === "Rejected" && (
                          <span style={{ color: "#f87171" }}>
                            Request rejected
                          </span>
                        )}

                        {(!b.cancellationStatus ||
                          b.cancellationStatus === "NotRequested") && (
                          <span style={{ color: "#bbb" }}>
                            No request
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==================================
          PRODUCT / EVENT BOOKINGS
      ================================== */}

      <div style={panelStyle}>
        <h3 style={{ color: "#fff", marginTop: 0 }}>
          Product Bookings
        </h3>

        <p
          style={{
            color: "#aebbd0",
            marginTop: "-4px",
            marginBottom: "14px",
          }}
        >
          Track product bookings, cancellation requests, and refunds.
        </p>

        {eventBookings.length === 0 ? (
          <p style={{ color: "#bbb" }}>
            No product bookings found.
          </p>
        ) : (
          <div
            style={{
              width: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              border: "1px solid #374151",
              borderRadius: "10px",
              background: "#1b2433",
            }}
          >
            <table
              style={{
                ...tableStyle,
                minWidth: "1600px",
              }}
            >
              <thead>
                <tr>
                  {[
                    "Customer",
                    "Email",
                    "Phone",
                    "Product Name",
                    "Booked On",
                    "Guests",
                    "Amount",
                    "Location",
                    "Booking Status",
                    "Cancellation",
                    "Reason",
                    "Refund",
                    "Actions",
                  ].map((heading) => (
                    <th key={heading} style={headingStyle}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {eventBookings.map((b, index) => (
                  <tr
                    key={b._id || `${b.email}-${index}`}
                    style={{ background: "#1b2433" }}
                  >
                    <td style={cellStyle}>
                      {b.name}
                    </td>

                    <td style={cellStyle}>
                      {b.email || "N/A"}
                    </td>

                    <td style={cellStyle}>
                      {b.phone}
                    </td>

                    <td style={cellStyle}>
                      {b.product}
                    </td>

                    <td style={cellStyle}>
                      {b.date}
                    </td>

                    <td style={cellStyle}>
                      {b.guests}
                    </td>

                    <td style={cellStyle}>
                      {b.amount ? `₹${b.amount}` : "N/A"}
                    </td>

                    <td style={cellStyle}>
                      {b.location || "N/A"}
                    </td>

                    <td style={cellStyle}>
                      <span style={getBookingStatusStyle(b.bookingStatus || "Confirmed")}>
                        {b.bookingStatus || "Confirmed"}
                      </span>
                    </td>

                    <td style={cellStyle}>
                      {b.cancellationStatus || "NotRequested"}
                    </td>

                    <td
                      style={{
                        ...cellStyle,
                        whiteSpace: "normal",
                        minWidth: "160px",
                      }}
                    >
                      {b.cancellationReason || "—"}
                    </td>

                    <td style={cellStyle}>
                      <RefundDetails booking={b} />
                    </td>

                    <td style={cellStyle}>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                          minWidth: "180px",
                        }}
                      >
                        {b.cancellationStatus === "Requested" && (
                          <>
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() =>
                                handleProductCancellation(
                                  b._id,
                                  "Approved"
                                )
                              }
                              style={{
                                ...buttonStyle,
                                background: "#16a34a",
                              }}
                            >
                              Approve
                            </button>

                            <button
                              type="button"
                              disabled={loading}
                              onClick={() =>
                                handleProductCancellation(
                                  b._id,
                                  "Rejected"
                                )
                              }
                              style={{
                                ...buttonStyle,
                                background: "#dc2626",
                              }}
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {b.cancellationStatus === "Approved" &&
                          b.bookingStatus === "Cancelled" &&
                          b.refundStatus !== "Processed" &&
                          b.paymentStatus === "Success" && (
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() =>
                                handleProductRefund(b._id)
                              }
                              style={{
                                ...buttonStyle,
                                background: "#f59e0b",
                                color: "#111",
                              }}
                            >
                              Record Refund
                            </button>
                          )}

                        {b.cancellationStatus === "Approved" &&
                          b.refundStatus === "Processed" && (
                            <span style={{ color: "#22c55e" }}>
                              Refund recorded
                            </span>
                          )}

                        {b.cancellationStatus === "Rejected" && (
                          <span style={{ color: "#f87171" }}>
                            Request rejected
                          </span>
                        )}

                        {(!b.cancellationStatus ||
                          b.cancellationStatus === "NotRequested") && (
                          <span style={{ color: "#bbb" }}>
                            No request
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==================================
          CATERING BOOKINGS
      ================================== */}

      <div style={panelStyle}>
        <h3 style={{ color: "#fff", marginTop: 0 }}>
          Catering Bookings
        </h3>

        {cateringBookings.length === 0 ? (
          <p style={{ color: "#bbb" }}>
            No catering bookings found.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                ...tableStyle,
                minWidth: "1250px",
              }}
            >
              <thead>
                <tr>
                  {[
                    "Customer",
                    "Email",
                    "Menu",
                    "Event Date",
                    "Guests",
                    "Amount",
                    "Payment",
                    "Booking Status",
                    "Cancellation",
                    "Reason",
                    "Refund",
                    "Actions",
                  ].map((heading) => (
                    <th key={heading} style={headingStyle}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {cateringBookings.map((b) => (
                  <tr key={b._id}>
                    <td style={cellStyle}>
                      {b.userName || "N/A"}
                    </td>

                    <td style={cellStyle}>
                      {b.email || "N/A"}
                    </td>

                    <td style={cellStyle}>
                      {b.menuId?.thaliName || "N/A"}
                    </td>

                    <td style={cellStyle}>
                      {b.eventDate
                        ? new Date(
                            b.eventDate
                          ).toLocaleDateString("en-IN")
                        : "N/A"}
                    </td>

                    <td style={cellStyle}>
                      {b.guestCount ?? "N/A"}
                    </td>

                    <td style={cellStyle}>
                      ₹{b.amount ?? 0}
                    </td>

                    <td style={cellStyle}>
                      {b.paymentStatus || "Pending"}
                    </td>

                    <td style={cellStyle}>
                      <span style={getBookingStatusStyle(b.bookingStatus || "Pending")}>
                        {b.bookingStatus || "Pending"}
                      </span>
                    </td>

                    <td style={cellStyle}>
                      {b.cancellationStatus || "NotRequested"}
                    </td>

                    <td style={cellStyle}>
                      {b.cancellationReason || "—"}
                    </td>

                    <td style={cellStyle}>
                      <RefundDetails booking={b} />
                    </td>

                    <td style={cellStyle}>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                          minWidth: "180px",
                        }}
                      >
                        {b.cancellationStatus === "Requested" && (
                          <>
                            <button
                              disabled={loading}
                              onClick={() =>
                                handleCateringCancellation(
                                  b._id,
                                  "approve"
                                )
                              }
                              style={{
                                ...buttonStyle,
                                background: "#16a34a",
                              }}
                            >
                              Approve
                            </button>

                            <button
                              disabled={loading}
                              onClick={() =>
                                handleCateringCancellation(
                                  b._id,
                                  "reject"
                                )
                              }
                              style={{
                                ...buttonStyle,
                                background: "#dc2626",
                              }}
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {b.cancellationStatus === "Approved" &&
                          b.bookingStatus === "Cancelled" &&
                          b.refundStatus !== "Processed" &&
                          b.paymentStatus === "Success" && (
                            <button
                              disabled={loading}
                              onClick={() =>
                                handleCateringRefund(b._id)
                              }
                              style={{
                                ...buttonStyle,
                                background: "#f59e0b",
                                color: "#111",
                              }}
                            >
                              Record Refund
                            </button>
                          )}

                        {b.cancellationStatus === "Approved" &&
                          b.refundStatus === "Processed" && (
                            <span style={{ color: "#22c55e" }}>
                              Refund recorded
                            </span>
                          )}

                        {b.cancellationStatus === "Rejected" && (
                          <span style={{ color: "#f87171" }}>
                            Request rejected
                          </span>
                        )}

                        {(!b.cancellationStatus ||
                          b.cancellationStatus === "NotRequested") && (
                          <span style={{ color: "#bbb" }}>
                            No request
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}