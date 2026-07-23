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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Mobile number must contain exactly 10 digits.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
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

          {/* Full Name */}

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
              />

            </div>

          </div>

          {/* Email */}

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

          {/* Password */}

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
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>

            </div>

          </div>

          {/* Confirm Password */}

          <div className="register-input-group">

            <label>Confirm Password</label>

            <div className="register-input-box">

              <span className="register-input-icon">
                <FiLock />
              </span>

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <span
                className="register-toggle-password"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
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

          {/* Phone */}

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
              />

            </div>

          </div>

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