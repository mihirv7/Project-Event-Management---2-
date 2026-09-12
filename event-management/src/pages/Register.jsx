import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  // ==========================
  // HANDLE CHANGE
  // ==========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    // ==========================
    // FULL NAME
    // ONLY CHARACTERS + SPACE
    // ==========================
    if (name === "fullName") {
      if (/^[A-Za-z ]*$/.test(value)) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }

      return;
    }

    // ==========================
    // PHONE
    // ONLY NUMBERS
    // MAX 10 DIGITS
    // ==========================
    if (name === "phone") {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }

      return;
    }

    // ==========================
    // OTHER FIELDS
    // ==========================
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ==========================
  // HANDLE SUBMIT
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ==========================
    // FULL NAME VALIDATION
    // ==========================
    const name = formData.fullName.trim();

    if (!name) {
      alert("Please enter your full name.");
      return;
    }

    if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(name)) {
      alert(
        "Full Name should contain only characters and spaces."
      );
      return;
    }

    // ==========================
    // EMAIL VALIDATION
    // ==========================
    const email = formData.email.trim();

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
        email
      )
    ) {
      alert("Please enter a valid email address.");
      return;
    }

    // ==========================
    // PASSWORD
    // KEEPING YOUR ORIGINAL
    // PASSWORD FIELD / BEHAVIOR
    // ==========================

    if (!formData.password) {
      alert("Please enter your password.");
      return;
    }

    // ==========================
    // CONFIRM PASSWORD
    // ==========================
    if (!formData.confirmPassword) {
      alert("Please confirm your password.");
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert(
        "Password and Confirm Password do not match."
      );
      return;
    }

    // ==========================
    // MOBILE VALIDATION
    // ==========================
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      alert(
        "Mobile number must contain exactly 10 digits."
      );
      return;
    }

    // ==========================
    // REGISTER
    // ==========================
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          ...formData,
          fullName: name,
          email: email,
        }
      );

      alert(res.data.message);

      navigate("/login");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="register-page">

      <div className="register-overlay"></div>

      <div className="floating circle1"></div>
      <div className="floating circle2"></div>
      <div className="floating circle3"></div>
      <div className="floating circle4"></div>

      <div className="register-card">

        <div className="sparkle"></div>

        <div className="register-header">
          <h2>Create Account</h2>

          <p>
            Join us and start planning unforgettable events
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* ==========================
              FULL NAME
          ========================== */}
          <div className="register-input-group">

            <label>Full Name</label>

            <div className="register-input-box">

              <span className="register-input-icon">
                <FiUser />
              </span>

              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
                pattern="[A-Za-z]+( [A-Za-z]+)*"
                title="Full Name should contain only characters and spaces."
              />

            </div>

          </div>

          {/* ==========================
              EMAIL
          ========================== */}
          <div className="register-input-group">

            <label>Email Address</label>

            <div className="register-input-box">

              <span className="register-input-icon">
                <FiMail />
              </span>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* ==========================
              PASSWORD
              ORIGINAL FIELD
          ========================== */}
          <div className="register-input-group">

            <label>Password</label>

            <div className="register-input-box">

              <span className="register-input-icon">
                <FiLock />
              </span>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <span
                className="register-toggle-password"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <FiEyeOff />
                ) : (
                  <FiEye />
                )}
              </span>

            </div>

          </div>

          {/* ==========================
              CONFIRM PASSWORD
          ========================== */}
          <div className="register-input-group">

            <label>Confirm Password</label>

            <div className="register-input-box">

              <span className="register-input-icon">
                <FiLock />
              </span>

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <span
                className="register-toggle-password"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? (
                  <FiEyeOff />
                ) : (
                  <FiEye />
                )}
              </span>

            </div>

          </div>

          {/* ==========================
              PHONE
          ========================== */}
          <div className="register-input-group">

            <label>Mobile Number</label>

            <div className="register-input-box">

              <span className="register-input-icon">
                <FiPhone />
              </span>

              <input
                type="tel"
                name="phone"
                placeholder="Enter mobile number"
                value={formData.phone}
                onChange={handleChange}
                required
                maxLength="10"
                pattern="[0-9]{10}"
                title="Enter a valid 10-digit mobile number."
              />

            </div>

          </div>

          {/* ==========================
              REGISTER BUTTON
          ========================== */}
          <button
            type="submit"
            className="register-btn"
          >
            Create Account →
          </button>

        </form>

        <div className="register-bottom-links">

          <p>
            Already have an account?

            <Link to="/login">
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}