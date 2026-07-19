import { Link } from "react-router-dom";
import "./Navbar.css";
import { useState } from "react";

export default function Navbar() {
  // =========================
  // STATES
  // =========================
  const [showProfile, setShowProfile] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="logo">
        <Link to="/" className="logo-text">
          Momento
        </Link>
      </div>

      {/* MENU */}
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <a href="/#packages">Packages</a>
        </li>

        <li>
          <Link to="/custom">Custom</Link>
        </li>

        <li>
          <Link to="/my-bookings">My Bookings</Link>
        </li>

        <li>
          <Link to="/contact">Contact Us</Link>
        </li>

        <li>
          <Link to="/about">About Us</Link>
        </li>
      </ul>

      {/* PROFILE */}
      <div style={{ position: "relative" }}>
        <button
          className="profile-btn"
          onClick={() => setShowProfile(!showProfile)}
        >
          👤 Profile
        </button>

        {showProfile && (
          <div className="profile-dropdown">
            {user ? (
              <>
                <div className="profile-header">
                  👋 {user.fullName || "User"}
                </div>

                <button
                  className="profile-item"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="profile-item"
                >
                  🔑 Login
                </Link>

                <Link
                  to="/register"
                  className="profile-item"
                >
                  📝 Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}