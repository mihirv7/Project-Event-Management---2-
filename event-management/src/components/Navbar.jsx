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

        <span className="logo-text">
          Momento
        </span>

      </div>

      {/* MENU */}
      <ul className="nav-links">

        <li><Link to="/">Home</Link></li>

        <li><a href="/#packages">Packages</a></li>

        <li><Link to="/custom">Custom</Link></li>

        <li><Link to="/my-bookings">My Bookings</Link></li>

        <li><Link to="/contact">Contact us</Link></li>

        <li><Link to="/about">About us</Link></li>

      </ul>

      {/* PROFILE */}
      <div style={{ position: "relative" }}>

        <button
          onClick={() => setShowProfile(!showProfile)}
          style={{
            background: "#111",
            color: "#fff",
            border: "1px solid #444",
            padding: "10px 18px",
            borderRadius: "30px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          👤 Profile
        </button>

        {showProfile && (

          <div
            style={{
              position: "absolute",
              top: "55px",
              right: "0",
              background: "#fff",
              width: "180px",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              overflow: "hidden",
              zIndex: 999
            }}
          >

            {user ? (

              <>
                <div
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #eee",
                    fontWeight: "bold"
                  }}
                >
                  {user.fullName || "User"}
                </div>

                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "none",
                    background: "white",
                    cursor: "pointer",
                    textAlign: "left"
                  }}
                >
                  Logout
                </button>
              </>

            ) : (

              <>
                <Link
                  to="/login"
                  style={{
                    display: "block",
                    padding: "12px",
                    textDecoration: "none",
                    color: "#000"
                  }}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  style={{
                    display: "block",
                    padding: "12px",
                    textDecoration: "none",
                    color: "#000"
                  }}
                >
                  Register
                </Link>
              </>

            )}

          </div>
        )}

      </div>

    </nav>
  );
}