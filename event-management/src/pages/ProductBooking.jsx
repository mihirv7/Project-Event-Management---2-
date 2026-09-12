import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Booking.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ProductBooking() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // ===============================
  // PRODUCT DATA
  // ===============================
  const productId = state?.productId;
  const productName = state?.productName;
  const price = state?.price;
  const selectedOptions = state?.selectedOptions;

  // ===============================
  // TERMS & CONDITIONS
  // ===============================
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // ===============================
  // DATE
  // ===============================
  const [date, setDate] = useState(null);

  // ===============================
  // DISABLED / ALREADY BOOKED DATES
  // ===============================
  const [disabledDates, setDisabledDates] = useState([]);

  // ===============================
  // FETCH ALREADY BOOKED DATES
  // ===============================
  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/product-bookings/product/${productId}`
        );

        const dates = res.data.map(
          (b) => new Date(b.date)
        );

        // KEEP EXISTING DISABLED DATE LOGIC
        setDisabledDates(dates);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDates();
  }, [productId]);

  // ===============================
  // FORM DATA
  // ===============================
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    date: "",
    location: "",
    phoneNumber: "",
    guestCount: "",
    specialRequest: "",
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
              authorization: `Bearer ${token}`,
            },
          }
        );

        setFormData((prev) => ({
          ...prev,
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

  // ===============================
  // HANDLE CHANGE
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    // ===============================
    // GUEST COUNT
    // ONLY NUMBERS
    // ===============================
    if (name === "guestCount") {
      if (/^\d*$/.test(value)) {
        setFormData({
          ...formData,
          guestCount: value,
        });
      }

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ===============================
  // CUSTOMIZATION COUNT
  // ===============================
  const customizationCount = selectedOptions
    ? Object.keys(selectedOptions).length
    : 0;

  // ===============================
  // TOTAL PRICE
  // ===============================
  const totalPrice =
    Number(price) +
    customizationCount * 2000;

  // ===============================
  // HANDLE SUBMIT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===============================
    // CHECK DATE
    // ===============================
    if (!date) {
      alert("Please select date");
      return;
    }

    // ===============================
    // CHECK DATE IS TOMORROW OR LATER
    // ===============================
    const tomorrow = new Date();

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    tomorrow.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date);

    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < tomorrow) {
      alert(
        "Event date must be at least 1 day from today."
      );

      return;
    }

    // ===============================
    // CHECK GUEST COUNT
    // MINIMUM 50
    // ===============================
    if (
      !formData.guestCount ||
      Number(formData.guestCount) < 50
    ) {
      alert(
        "Guest count must be at least 50."
      );

      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      // ===============================
      // CREATE RAZORPAY ORDER
      // ===============================
      const orderRes = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {
          amount: Number(totalPrice),
        }
      );

      console.log(orderRes.data);

      // ===============================
      // RAZORPAY OPTIONS
      // ===============================
      const options = {
        key: "rzp_test_SokwTq2nrohRwW",

        amount: orderRes.data.amount,

        currency: "INR",

        name: "Momento Event",

        description:
          "Product Booking Payment",

        order_id: orderRes.data.id,

        // ===============================
        // PAYMENT SUCCESS
        // ===============================
        handler: async function (response) {
          try {
            await axios.post(
              "http://localhost:5000/api/product-bookings/add",
              {
                ...formData,

                productId,

                productName,

                price: totalPrice,

                amount: Number(totalPrice),

                customizations:
                  selectedOptions,

                date: date.toISOString(),

                paymentId:
                  response.razorpay_payment_id,

                orderId:
                  response.razorpay_order_id,

                paymentStatus: "Success",
              },
              {
                headers: {
                  authorization: `Bearer ${token}`,
                },
              }
            );

            alert(
              "Payment & Booking Successful"
            );

            navigate("/");
          } catch (err) {
            console.log(err);

            alert("Booking save failed");
          }
        },

        // ===============================
        // TEST MODE
        // ===============================
        modal: {
          ondismiss: async function () {
            const ok = window.confirm(
              "Simulate successful payment for testing?"
            );

            if (ok) {
              try {
                await axios.post(
                  "http://localhost:5000/api/product-bookings/add",
                  {
                    ...formData,

                    productId,

                    productName,

                    price: totalPrice,

                    amount: Number(totalPrice),

                    customizations:
                      selectedOptions,

                    date: date.toISOString(),

                    paymentId:
                      "TEST_PAYMENT_ID",

                    orderId:
                      orderRes.data.id,

                    paymentStatus: "Success",
                  },
                  {
                    headers: {
                      authorization: `Bearer ${token}`,
                    },
                  }
                );

                alert(
                  "Test Payment & Booking Successful"
                );

                navigate("/my-bookings");
              } catch (err) {
                console.log(err);

                alert(
                  "Booking save failed"
                );
              }
            }
          },
        },

        theme: {
          color: "#3399cc",
        },
      };

      const razor =
        new window.Razorpay(options);

      razor.open();
    } catch (err) {
      console.log(err);

      alert("Payment Failed");
    }
  };

  // ===============================
  // NO PRODUCT
  // ===============================
  if (!productId) {
    return <h2>No product selected</h2>;
  }

  return (
    <div className="booking-page">
      <div className="booking-container">

        <h2>Book Event</h2>

        {/* ===============================
            BOOKING SUMMARY
        =============================== */}
        <div
          style={{
            background: "#dedddd",
            borderRadius: "14px",
            padding: "18px",
            marginBottom: "20px",
            border: "1px solid #e5e5e5",
          }}
        >
          <h3
            style={{
              marginBottom: "15px",
              fontSize: "22px",
              color: "#222",
            }}
          >
            Booking Summary
          </h3>

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginBottom: "10px",
            }}
          >
            <span>Base Price</span>

            <strong>
              ₹ {price}
            </strong>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginBottom: "10px",
            }}
          >
            <span>
              Customization Charge
            </span>

            <strong>
              ₹ {customizationCount * 2000}
            </strong>
          </div>

          <hr
            style={{
              margin: "12px 0",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#000",
            }}
          >
            <span>Total Amount</span>

            <span>
              ₹ {totalPrice}
            </span>
          </div>

          {/* ===============================
              SELECTED CUSTOMIZATIONS
          =============================== */}
          {selectedOptions &&
            Object.keys(selectedOptions)
              .length > 0 && (
              <div
                style={{
                  marginTop: "18px",
                }}
              >
                <h4
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  Selected Customizations
                </h4>

                {Object.entries(
                  selectedOptions
                ).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      style={{
                        background: "#ffffff",
                        padding: "10px",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        border:
                          "1px solid #ddd",
                      }}
                    >
                      <strong>
                        {key}
                      </strong>{" "}
                      : {value}
                    </div>
                  )
                )}
              </div>
            )}
        </div>

        {/* ===============================
            BOOKING FORM
        =============================== */}
        <form
          onSubmit={handleSubmit}
          className="booking-form"
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

          {/* ===============================
              EVENT DATE
              TOMORROW ONWARD
              BOOKED DATES STILL DISABLED
          =============================== */}
          <DatePicker
            selected={date}
            onChange={(d) =>
              setDate(d)
            }

            // KEEP THIS LOGIC
            excludeDates={disabledDates}

            // START FROM TOMORROW
            minDate={
              new Date(
                new Date().setDate(
                  new Date().getDate() + 1
                )
              )
            }

            dateFormat="dd-MM-yyyy"

            placeholderText="Select event date"

            className="booking-input"
          />

          {/* EVENT LOCATION */}
          <input
            type="text"
            name="location"
            placeholder="Event Location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          {/* PHONE NUMBER */}
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            readOnly
          />

          {/* ===============================
              GUEST COUNT
              MINIMUM 50
          =============================== */}
          <input
            type="number"
            name="guestCount"
            placeholder="Guest Count (Minimum 50)"
            value={formData.guestCount}
            onChange={handleChange}
            required
            min="50"
            step="1"
            onInvalid={(e) =>
              e.target.setCustomValidity(
                "Guest count must be at least 50."
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
          />

          {/* ===============================
              TERMS BUTTON
          =============================== */}
          <button
            type="button"
            onClick={() =>
              setShowTerms(true)
            }
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
              justifyContent:
                "center",
              alignItems: "center",
              transition:
                "all .3s ease",
              boxShadow:
                "0 8px 20px rgba(251,133,0,.35)",
            }}
          >
            View Terms & Conditions
          </button>

          <p
            style={{
              fontSize: "12px",
              color: "#777",
              textAlign: "center",
              marginTop: "8px",
            }}
          >
            By continuing, you agree to our
            Terms & Conditions.
          </p>

          {/* ===============================
              CONFIRM BOOKING
          =============================== */}
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
              justifyContent:
                "center",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: agreed
                ? "0 10px 25px rgba(251,133,0,.35)"
                : "none",
              transition:
                "all .3s ease",
            }}
          >
            Confirm Booking
          </button>

        </form>

        {/* ===============================
            TERMS & CONDITIONS MODAL
        =============================== */}
        {showTerms && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent:
                "center",
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
                maxHeight: "100vh",
                overflowY: "auto",
              }}
            >
              <h2
                style={{
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                Terms & Conditions
              </h2>

              <ul
                style={{
                  lineHeight: "1.8",
                  color: "#444",
                  listStyleType: "none",
                }}
              >
                <li>
                  Advance payment is mandatory
                  for booking confirmation.
                </li>

                <li>
                  Booking amount is
                  non-refundable after
                  confirmation.
                </li>

                <li>
                  Extra customization charges
                  will apply separately.
                </li>

                <li>
                  If guest count exceeds
                  package limit, additional
                  charges may apply.
                </li>

                <li>
                  Venue size and space
                  availability affect final
                  decoration setup.
                </li>

                <li>
                  Final event setup may
                  slightly differ from website
                  images.
                </li>

                <li>
                  Client is responsible for
                  venue permissions and
                  approvals.
                </li>

                <li>
                  Date changes are subject
                  to availability of team and
                  resources.
                </li>
              </ul>

              {/* AGREEMENT */}
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
                    setAgreed(
                      e.target.checked
                    )
                  }
                />

                <span>
                  I agree to the Terms &
                  Conditions
                </span>
              </div>

              {/* MODAL BUTTONS */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "25px",
                }}
              >

                {/* CONTINUE */}
                <button
                  onClick={() =>
                    setShowTerms(false)
                  }
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
                    transition:
                      "all .3s ease",
                    boxShadow:
                      "0 10px 20px rgba(251,133,0,.35)",
                  }}
                >
                  Continue
                </button>

                {/* CANCEL */}
                <button
                  onClick={() => {
                    setAgreed(false);
                    setShowTerms(false);
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background =
                      "linear-gradient(135deg,#FFB703,#FB8500)";

                    e.target.style.color =
                      "#fff";

                    e.target.style.transform =
                      "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background =
                      "#fff";

                    e.target.style.color =
                      "#FFB703";

                    e.target.style.transform =
                      "translateY(0)";
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    border:
                      "2px solid #FFB703",
                    borderRadius: "50px",
                    background: "#fff",
                    color: "#FFB703",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition:
                      "all .3s ease",
                  }}
                >
                  Cancel
                </button>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}