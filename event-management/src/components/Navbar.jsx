import { Link } from "react-router-dom";
import "./Navbar.css";

// const handleLogout = () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");
//   window.location.href = "/login";
// };

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        {/* <span className="logo-icon">P</span> */}
        <span className="logo-text">Momento</span>
      </div>

      {/* Menu */}
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/packagecard">Packages</Link></li>
        <li><Link to="/logi">Custom</Link></li>
        <li><Link to="/contact">Contact us</Link></li>
        <li><Link to="/about">About us</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>

      {/* Button */}
      <button className="nav-btn">Start free trial</button>
    </nav>
  );
}
