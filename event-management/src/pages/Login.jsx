import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      formData
    );

    console.log("LOGIN 👉", res.data);

    // ✅ store correctly
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);

    // ✅ FIX HERE (IMPORTANT)
    if (res.data.user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }

  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
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

    {/* Login Card */}

    <div className="login-card">

      {/* Sparkle */}
      <div className="sparkle"></div>

      {/* Logo */}

      

      {/* Heading */}

      <div className="login-header">

        <h2>Welcome Back</h2>

        <p>
          Login to continue your event journey
        </p>

      </div>

      {/* Error */}

      {error && (

        <div className="error-box">

          {error}

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
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

        </div>

        {/* Password */}

        <div className="input-group">

          <label>Password</label>

          <div className="input-box">

  <span className="input-icon">
    <FiLock />
  </span>

  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Enter your password"
    value={formData.password}
    onChange={handleChange}
    required
  />

  <span
    className="toggle-password"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FiEyeOff /> : <FiEye />}
  </span>

</div>

        </div>

        {/* Login */}

        <button
          type="submit"
          className="login-btn"
        >
          Login →
        </button>

      </form>

      {/* Bottom */}

      <div className="bottom-links">

        <p>

          Don't have an account?

          <Link to="/register">

            Create Account

          </Link>

        </p>

      </div>

    </div>

  </div>
);
}
