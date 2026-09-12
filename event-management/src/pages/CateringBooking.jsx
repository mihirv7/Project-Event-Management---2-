import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Booking.css";
import "./CateringBooking.css";

export default function CateringBooking() {
  const { menuId } = useParams();
  const navigate = useNavigate();

  const [menu, setMenu] = useState(null);

  // ==========================
  // TERMS & CONDITIONS
  // ==========================
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    email: "",
    phoneNumber: "",
    eventDate: "",
    eventTime: "",
    venue: "",
    guestCount: "",
    specialRequest: "",
    paymentId: "",
    orderId: "",
    paymentStatus: "Pending",
  });

  // ==========================
  // FETCH LOGGED USER
  // ==========================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        setFormData((prev) => ({
          ...prev,
          userId: res.data._id,
          userName: res.data.fullName,
          email: res.data.email,
          phoneNumber: res.data.phone,
        }));
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  // ==========================
  // FETCH CATERING MENU
  // ==========================
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/catering/menu/${menuId}`
        );

        setMenu(res.data);

        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMenu();
  }, [menuId]);

  // ==========================
  // HANDLE INPUT CHANGE
  // ==========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // TOTAL AMOUNT
  // ==========================
  const totalAmount =
    (Number(menu?.price) || 0) *
    (Number(formData.guestCount) || 0);

  // ==========================
  // HANDLE SUBMIT
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ==========================
    // TERMS VALIDATION
    // ==========================
    if (!agreed) {
      alert("Please accept the Terms & Conditions before proceeding.");
      return;
    }

    if (!menu) {
      alert("Menu not loaded");
      return;
    }

    if (!formData.eventDate) {
      alert("Please select event date");
      return;
    }

    if (!formData.eventTime) {
      alert("Please select event time");
      return;
    }

    if (!formData.venue) {
      alert("Please enter venue");
      return;
    }

    if (
      !formData.guestCount ||
      Number(formData.guestCount) <= 0
    ) {
      alert("Enter valid guest count");
      return;
    }

    try {
      // ==========================
      // CREATE RAZORPAY ORDER
      // ==========================
      const orderRes = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {
          amount: totalAmount,
        }
      );

      const options = {
        key: "rzp_test_SokwTq2nrohRwW",

        amount: orderRes.data.amount,

        currency: "INR",

        name: "Momento Event",

        description: "Catering Booking Payment",

        order_id: orderRes.data.id,

        method: {
          upi: false,
        },

        // ==========================
        // PAYMENT SUCCESS
        // ==========================
        handler: async function (response) {
          try {
            const token = localStorage.getItem("token");

            const bookingData = {
              userId: formData.userId,

              userName: formData.userName,

              email: formData.email,

              phoneNumber: formData.phoneNumber,

              menuId: menu._id,

              categoryId: menu.categoryId,

              eventDate: formData.eventDate,

              eventTime: formData.eventTime,

              venue: formData.venue,

              guestCount: Number(formData.guestCount),

              specialRequest: formData.specialRequest,

              amount: totalAmount,

              paymentId: response.razorpay_payment_id,

              orderId: response.razorpay_order_id,

              paymentStatus: "Success",
            };

            await axios.post(
              "http://localhost:5000/api/catering-booking/add",
              bookingData,
              {
                headers: {
                  authorization: `Bearer ${token}`,
                },
              }
            );

            alert(
              "Payment & Catering Booking Successful"
            );

            navigate("/my-bookings");
          } catch (err) {
            console.log(err);

            alert("Booking save failed");
          }
        },

        // ==========================
        // TEST MODE
        // ==========================
        modal: {
          ondismiss: async function () {
            const ok = window.confirm(
              "Simulate successful payment for testing?"
            );

            if (ok) {
              try {
                const token =
                  localStorage.getItem("token");

                const bookingData = {
                  userId: formData.userId,

                  userName: formData.userName,

                  email: formData.email,

                  phoneNumber:
                    formData.phoneNumber,

                  menuId: menu._id,

                  categoryId: menu.categoryId,

                  eventDate:
                    formData.eventDate,

                  eventTime:
                    formData.eventTime,

                  venue: formData.venue,

                  guestCount: Number(
                    formData.guestCount
                  ),

                  specialRequest:
                    formData.specialRequest,

                  amount: totalAmount,

                  paymentId:
                    "TEST_PAYMENT_ID",

                  orderId:
                    orderRes.data.id,

                  paymentStatus: "Success",
                };

                console.log(
                  "BOOKING DATA:",
                  bookingData
                );

                await axios.post(
                  "http://localhost:5000/api/catering-booking/add",
                  bookingData,
                  {
                    headers: {
                      authorization: `Bearer ${token}`,
                    },
                  }
                );

                alert(
                  "Test Payment & Catering Booking Successful"
                );

                navigate("/my-bookings");
              } catch (err) {
                console.log(err);

                alert("Booking save failed");
              }
            }
          },
        },

        theme: {
          color: "#f59e0b",
        },
      };

      const razor =
        new window.Razorpay(options);

      razor.on(
        "payment.failed",
        function (response) {
          alert(
            response.error.description
          );
        }
      );

      razor.open();
    } catch (err) {
      console.log(err);

      alert("Payment Failed");
    }
  };

  // ==========================
  // TERMS MODAL
  // ==========================
  const termsModal = showTerms && (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "500px",
          background: "#fff",
          borderRadius: "14px",
          padding: "25px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* ==========================
            TITLE
        ========================== */}
        <h2
          style={{
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Terms & Conditions
        </h2>

        {/* ==========================
            TERMS
        ========================== */}
        <ul
          style={{
            lineHeight: "1.8",
            color: "#444",
            listStyleType: "none",
            padding: 0,
          }}
        >
          <li>
            Advance payment is mandatory for
            catering booking confirmation.
          </li>

          <li>
            Booking amount is non-refundable
            after confirmation.
          </li>

          <li>
            Final catering charges depend on
            the selected menu and guest count.
          </li>

          <li>
            Guest count must be entered
            correctly while booking.
          </li>

          <li>
            Any additional food or service
            requirement may attract extra
            charges.
          </li>

          <li>
            Catering service availability
            depends on the selected event date
            and time.
          </li>

          <li>
            The final menu and food arrangement
            may vary slightly depending on
            ingredient availability.
          </li>

          <li>
            Date or time changes are subject
            to catering team availability.
          </li>
        </ul>

        {/* ==========================
            CHECKBOX
        ========================== */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) =>
              setAgreed(e.target.checked)
            }
          />

          <span>
            I agree to the Terms & Conditions
          </span>
        </div>

        {/* ==========================
            BUTTONS
        ========================== */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "25px",
          }}
        >
          {/* CONTINUE */}
          <button
            type="button"
            onClick={() => {
              if (!agreed) {
                alert(
                  "Please agree to the Terms & Conditions."
                );
                return;
              }

              setShowTerms(false);
            }}
            onMouseEnter={(e) => {
              e.target.style.background =
                "linear-gradient(135deg,#FFC233,#FF9800)";
              e.target.style.transform =
                "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background =
                "linear-gradient(135deg,#FFB703,#FB8500)";
              e.target.style.transform =
                "translateY(0)";
            }}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              borderRadius: "50px",
              background:
                "linear-gradient(135deg,#FFB703,#FB8500)",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all .3s ease",
              boxShadow:
                "0 10px 20px rgba(251,133,0,.35)",
            }}
          >
            Continue
          </button>

          {/* CANCEL */}
          <button
            type="button"
            onClick={() => {
              setAgreed(false);
              setShowTerms(false);
            }}
            onMouseEnter={(e) => {
              e.target.style.background =
                "linear-gradient(135deg,#FFB703,#FB8500)";
              e.target.style.color = "#fff";
              e.target.style.transform =
                "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#fff";
              e.target.style.color = "#FFB703";
              e.target.style.transform =
                "translateY(0)";
            }}
            style={{
              flex: 1,
              padding: "12px",
              border: "2px solid #FFB703",
              borderRadius: "50px",
              background: "#fff",
              color: "#FFB703",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all .3s ease",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // ==========================
  // PAGE
  // ==========================
  return (
    <div className="booking-page">
      <div className="booking-container">

        {/* ==========================
            BOOKING SUMMARY
        ========================== */}
        <div className="booking-summary">

          <h2>Booking Summary</h2>

          <div className="summary-row">
            <span>Food Type</span>

            <strong>
              {menu?.foodType}
            </strong>
          </div>

          <div className="summary-row">
            <span>Selected Thali</span>

            <strong>
              {menu?.thaliName}
            </strong>
          </div>

          <div className="summary-row">
            <span>Price / Plate</span>

            <strong>
              ₹ {menu?.price}
            </strong>
          </div>

          <div className="summary-row">
            <span>Guests</span>

            <strong>
              {formData.guestCount || 0}
            </strong>
          </div>

          <hr />

          <div className="summary-row total-row">
            <span>Total Amount</span>

            <strong>
              ₹ {totalAmount}
            </strong>
          </div>

        </div>

        {/* ==========================
            BOOKING FORM
        ========================== */}
        <form
          className="booking-form"
          onSubmit={handleSubmit}
        >

          {/* USER NAME */}
          <input
            type="text"
            name="userName"
            value={formData.userName}
            readOnly
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
          />

          {/* PHONE */}
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            readOnly
          />

          {/* EVENT DATE */}
          <input
  type="date"
  name="eventDate"
  value={formData.eventDate}
  onChange={handleChange}
  min={new Date(Date.now() + 86400000)
    .toISOString()
    .split("T")[0]}
  required
/>

          {/* EVENT TIME */}
          <input
            type="time"
            name="eventTime"
            value={formData.eventTime}
            onChange={handleChange}
            required
          />

          {/* VENUE */}
          <input
            type="text"
            name="venue"
            placeholder="Enter Event Venue"
            value={formData.venue}
            onChange={handleChange}
            required
          />

          {/* GUEST COUNT */}
         <input
  type="number"
  name="guestCount"
  placeholder="Enter Guest Count (Minimum 25)"
  value={formData.guestCount}
  onChange={(e) => {
    const value = e.target.value;

    // Allow only whole positive numbers
    if (/^\d*$/.test(value)) {
      setFormData({
        ...formData,
        guestCount: value,
      });
    }
  }}
  required
  min="25"
  step="1"
  onInvalid={(e) =>
    e.target.setCustomValidity(
      "Please enter a valid guest count"
    )
  }
  onInput={(e) =>
    e.target.setCustomValidity("")
  }
/>

          {/* SPECIAL REQUEST */}
          <textarea
            name="specialRequest"
            placeholder="Special Request"
            value={formData.specialRequest}
            onChange={handleChange}
            rows={4}
          />

          {/* ==========================
              VIEW TERMS BUTTON
          ========================== */}
          <button
            type="button"
            onClick={() => setShowTerms(true)}
            onMouseEnter={(e) => {
              e.target.style.background =
                "linear-gradient(135deg,#FFC233,#FF9800)";

              e.target.style.transform =
                "translateY(-3px)";

              e.target.style.boxShadow =
                "0 12px 30px rgba(251,133,0,.45)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background =
                "linear-gradient(135deg,#FFB703,#FB8500)";

              e.target.style.transform =
                "translateY(0)";

              e.target.style.boxShadow =
                "0 8px 20px rgba(251,133,0,.35)";
            }}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "50px",
              background:
                "linear-gradient(135deg,#FFB703,#FB8500)",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "all .3s ease",
              boxShadow:
                "0 8px 20px rgba(251,133,0,.35)",
            }}
          >
            View Terms & Conditions
          </button>

          {/* INFO */}
          <p
            style={{
              textAlign: "center",
              marginTop: "10px",
              color: "#777",
              fontSize: "13px",
            }}
          >
            By continuing you agree to our
            Terms & Conditions.
          </p>

          {/* ==========================
              PROCEED TO PAYMENT
          ========================== */}
          <button
            type="submit"
            disabled={!agreed}
            onMouseEnter={(e) => {
              if (agreed) {
                e.target.style.background =
                  "linear-gradient(135deg,#FFC233,#FF9800)";

                e.target.style.transform =
                  "translateY(-3px)";

                e.target.style.boxShadow =
                  "0 15px 35px rgba(251,133,0,.45)";
              }
            }}
            onMouseLeave={(e) => {
              if (agreed) {
                e.target.style.background =
                  "linear-gradient(135deg,#FFB703,#FB8500)";

                e.target.style.transform =
                  "translateY(0)";

                e.target.style.boxShadow =
                  "0 10px 25px rgba(251,133,0,.35)";
              }
            }}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "50px",
              background: agreed
                ? "linear-gradient(135deg,#FFB703,#FB8500)"
                : "#999",
              color: "#fff",
              fontSize: "18px",
              fontWeight: "600",
              cursor: agreed
                ? "pointer"
                : "not-allowed",
              marginTop: "15px",
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: agreed
                ? "0 10px 25px rgba(251,133,0,.35)"
                : "none",
              transition: "all .3s ease",
            }}
          >
            Proceed To Payment
          </button>

        </form>

        {/* ==========================
            TERMS MODAL
        ========================== */}
        {termsModal}

      </div>
    </div>
  );
}