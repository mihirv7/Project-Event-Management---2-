import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Booking.css";
import "./CateringBooking.css";

export default function CateringBooking() {

  const { menuId } = useParams();

  const navigate = useNavigate();

  const [menu, setMenu] = useState(null);

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

    paymentStatus: "Pending"

  });
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

      setFormData(prev => ({

        ...prev,

        userId: res.data._id,

        userName: res.data.fullName,

        email: res.data.email,

        phoneNumber: res.data.phone

      }));

    }

    catch(err){

      console.log(err);

    }

  };

  fetchUser();

}, []);
useEffect(() => {

    const fetchMenu = async () => {

        try{

            const res = await axios.get(

                `http://localhost:5000/api/catering/menu/${menuId}`

            );

            setMenu(res.data);
            console.log(res.data);

        }

        catch(err){

            console.log(err);

        }

    };

    fetchMenu();

}, [menuId]);
const handleChange = (e)=>{

    setFormData({

        ...formData,

        [e.target.name]:e.target.value

    });

};
const handleSubmit = async (e) => {
  e.preventDefault();

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

  if (!formData.guestCount || Number(formData.guestCount) <= 0) {
    alert("Enter valid guest count");
    return;
  }

  try {
    // Create Razorpay Order
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

          alert("Payment & Catering Booking Successful");

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

                paymentId: "TEST_PAYMENT_ID",

                orderId: orderRes.data.id,

                paymentStatus: "Success",
              };
              console.log("BOOKING DATA:", bookingData);
              await axios.post(
                "http://localhost:5000/api/catering-booking/add",
                bookingData,
                {
                  headers: {
                    authorization: `Bearer ${token}`,
                  },
                }
              );

              alert("Test Payment & Catering Booking Successful");

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

    const razor = new window.Razorpay(options);

    razor.on("payment.failed", function (response) {
      alert(response.error.description);
    });

    razor.open();
  } catch (err) {
    console.log(err);
    alert("Payment Failed");
  }
};
const totalAmount =
  (Number(menu?.price) || 0) *
  (Number(formData.guestCount) || 0);

return (
  <div className="booking-page">
    <div className="booking-container">

      {/* <h2>Book Catering</h2> */}

      {/* Booking Summary */}

      <div className="booking-summary">

  <h2>Booking Summary</h2>

  {/* <div className="summary-row">
    <span>Category</span>
    <strong>{menu?.categoryId?.name}</strong>
  </div> */}

  <div className="summary-row">
    <span>Food Type</span>
    <strong>{menu?.foodType}</strong>
  </div>

  <div className="summary-row">
    <span>Selected Thali</span>
    <strong>{menu?.thaliName}</strong>
  </div>

  <div className="summary-row">
    <span>Price / Plate</span>
    <strong>₹ {menu?.price}</strong>
  </div>

  <div className="summary-row">
    <span>Guests</span>
    <strong>{formData.guestCount || 0}</strong>
  </div>

  <hr />

  <div className="summary-row total-row">
    <span>Total Amount</span>
    <strong>₹ {totalAmount}</strong>
  </div>

</div>

      {/* Booking Form */}

      <form className="booking-form" onSubmit={handleSubmit}>

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

        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          readOnly
        />

        <input
          type="date"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="eventTime"
          value={formData.eventTime}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="venue"
          placeholder="Enter Event Venue"
          value={formData.venue}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="guestCount"
          placeholder="Enter Guest Count"
          value={formData.guestCount}
          onChange={handleChange}
          required
          min="1"
        />

        <textarea
          name="specialRequest"
          placeholder="Special Request"
          value={formData.specialRequest}
          onChange={handleChange}
          rows={4}
        />

        <button
          type="button"
          onClick={() => setShowTerms(true)}
        >
          View Terms & Conditions
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "10px",
            color: "#777",
            fontSize: "13px"
          }}
        >
          By continuing you agree to our Terms & Conditions.
        </p>

        <button
type="submit"
// disabled={!agreed}
>
Proceed To Payment
</button>

      </form>

    </div>
  </div>
);

}