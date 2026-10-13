import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!password || !confirmPassword) {
      setError("Please enter both passwords.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          password,
          confirmPassword,
        }
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.log("RESET PASSWORD ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to reset password. Please try again."
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

      {/* Reset Password Card */}
      <div className="login-card">

        {/* Sparkle */}
        <div className="sparkle"></div>

        {/* Header */}
        <div className="login-header">
          <h2>Reset Password</h2>

          <p>
            Create a new password for your account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {/* Success */}
        {message && (
          <div className="success-box">
            {message}
            <br />
            Redirecting to login...
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* New Password */}
          <div className="input-group">

            <label>New Password</label>

            <div className="input-box">

              <span className="input-icon">
                <FiLock />
              </span>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <span
                className="toggle-password"
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

          {/* Confirm Password */}
          <div className="input-group">

            <label>Confirm Password</label>

            <div className="input-box">

              <span className="input-icon">
                <FiLock />
              </span>

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />

              <span
                className="toggle-password"
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

          {/* Reset Button */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Resetting..."
              : "Reset Password →"}
          </button>

        </form>

        {/* Bottom */}
        <div className="bottom-links">

          <p>
            Remember your password?

            <Link to="/login">
              Login
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}