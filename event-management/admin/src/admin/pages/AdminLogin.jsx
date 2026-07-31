import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./AdminLogin.css";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const navigate = useNavigate();
const handleLogin = async (e) => {
  e.preventDefault();

  if (!email.trim()) {
    alert("Please enter email");
    return;
  }

  if (!password.trim()) {
    alert("Please enter password");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email,
        password,
      }
    );

    // Only admins can access the admin panel
    if (res.data.user.role !== "admin") {
      alert("Access denied! Admin account required.");
      setLoading(false);
      return;
    }

    // Save authentication
    localStorage.setItem("adminToken", res.data.token);
    localStorage.setItem(
      "adminUser",
      JSON.stringify(res.data.user)
    );

    alert("Login Successful!");

    navigate("/admin/dashboard");

  } catch (err) {
    alert(
      err.response?.data?.message || "Login failed"
    );
  } finally {
    setLoading(false);
  }
};
  return (

    
    <div className="login-page">

        <div className="bg-orb orb1"></div>
<div className="bg-orb orb2"></div>
<div className="bg-orb orb3"></div>

      <div className="login-left">
        <h1>Event Management</h1>
        <h2>Admin Control Center</h2>

        <p>
          Manage Events, Users, Packages,
          Bookings and Payments from one dashboard.
        </p>
        <div className="dashboard-preview">

    <div className="preview-header">
        Dashboard Overview
    </div>

    <div className="preview-grid">

        <div className="preview-box">
            <h3>250+</h3>
            <span>Users</span>
        </div>

        <div className="preview-box">
            <h3>65</h3>
            <span>Events</span>
        </div>

        <div className="preview-box">
            <h3>120</h3>
            <span>Bookings</span>
        </div>

        <div className="preview-box">
            <h3>₹4.2L</h3>
            <span>Revenue</span>
        </div>

    </div>

</div>
      </div>

      <div className="login-right">

        <div className="login-card">

    <div className="login-logo">
        EM
    </div>

    <h2>Welcome Back</h2>

    <p>
        Sign in to your administrator account.
    </p>

    <form onSubmit={handleLogin}>

        <div className="input-box">
  <label>Email</label>

  <div className="input-wrapper">
    <FiMail className="input-icon" />

    <input
  type="email"
  placeholder="Enter admin email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
  </div>
</div>

        <div className="input-box">
  <label>Password</label>

  <div className="input-wrapper">
    <FiLock className="input-icon" />

    <input
  type={showPassword ? "text" : "password"}
  placeholder="Enter password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

    <button
      type="button"
      className="eye-btn"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <FiEyeOff /> : <FiEye />}
    </button>

  </div>
</div>

        <div className="remember-row">

            <label>

                <input type="checkbox" />

                Remember Me

            </label>

            <a href="#">Forgot Password?</a>

        </div>

        <button
  type="submit"
  className="login-btn"
  disabled={loading}
>
  {loading ? "Signing In..." : "Login"}
</button>

    </form>

</div>

      </div>

    </div>
  );
}