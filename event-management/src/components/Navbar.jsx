import {
  FiUser,
  FiLogOut,
  FiLogIn,
  FiUserPlus
} from "react-icons/fi";
import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [showProfile, setShowProfile] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      {/* ================= LOGO ================= */}
      <div className="logo">
        <NavLink to="/" end className="logo-text">
          Momento
        </NavLink>
      </div>

      {/* ================= MENU ================= */}
      <ul className="nav-links">
        <li>
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
        </li>

        {/* Scroll to Packages section on Home */}
        <li>
          <a href="/#packages" className="nav-link">
            Packages
          </a>
        </li>

        <li>
          <NavLink to="/custom" className="nav-link">
            Custom
          </NavLink>
        </li>

        <li>
          <NavLink to="/my-bookings" className="nav-link">
            My Bookings
          </NavLink>
        </li>

        <li>
          <NavLink to="/contact" className="nav-link">
            Contact Us
          </NavLink>
        </li>

        <li>
          <NavLink to="/about" className="nav-link">
            About Us
          </NavLink>
        </li>
      </ul>

      {/* ================= PROFILE ================= */}
<div style={{ position: "relative" }}>
  <button
    className="profile-btn"
    onClick={() => setShowProfile(!showProfile)}
  >
    <FiUser style={{ marginRight: "8px" }} />
    Profile
  </button>

  {showProfile && (
  <div className="profile-dropdown">

    {user ? (
      <>
        <div className="profile-header">
  <FiUser style={{ marginRight: "8px" }} />
  {user?.fullName || user?.email?.split("@")[0] || "User"}
</div>

        <button
          className="profile-item"
          onClick={handleLogout}
        >
          <FiLogOut size={18} style={{ marginRight: "10px" }} />
          Logout
        </button>
      </>
    ) : (
      <button
        className="profile-item"
        onClick={() => {
          setShowProfile(false);
          window.location.href = "/login";
        }}
      >
        <FiLogIn size={18} style={{ marginRight: "10px" }} />
        Login
      </button>
    )}

  </div>
)}
</div>
    </nav>
  );
}