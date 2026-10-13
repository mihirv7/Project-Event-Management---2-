import { FiMail } from "react-icons/fi";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {
          email: email.trim()
        }
      );

      setMessage(res.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Background Overlay */}
      <div className="login-overlay"></div>

      {/* Floating Background */}
      <div className="floating circle1"></div>
      <div className="floating circle2"></div>
      <div className="floating circle3"></div>
      <div className="floating circle4"></div>

      {/* Forgot Password Card */}
      <div className="login-card">

        {/* Sparkle */}
        <div className="sparkle"></div>

        {/* Heading */}
        <div className="login-header">
          <h2>Forgot Password?</h2>

          <p>
            Enter your email to reset your password
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div
            style={{
              background: "#e8f7ee",
              color: "#218838",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "15px",
              fontSize: "14px"
            }}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="input-group">

            <label>Email Address</label>

            <div className="input-box">

              <span className="input-icon">
                <FiMail />
              </span>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link →"}
          </button>

        </form>

        {/* Bottom Link */}
        <div className="bottom-links">
          <p>
            Remember your password?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
}