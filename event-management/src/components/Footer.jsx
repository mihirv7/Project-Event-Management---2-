import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Left */}
        <div className="footer-brand">

          <h2 className="footer-logo">
            Momento
          </h2>

          <p className="footer-text">
            Create unforgettable memories with premium event planning,
            luxury venues, catering, decorations, and personalized
            celebrations—all in one place.
          </p>

        </div>

        {/* Quick Links */}
        <div className="footer-links">

          <div>
            <h4>Explore</h4>

            <ul>
              <li>Home</li>
              <li>Packages</li>
              <li>Custom Events</li>
              <li>Bookings</li>
            </ul>

          </div>

          <div>

            <h4>Company</h4>

            <ul>
              <li>About Us</li>
              <li>Contact</li>
              <li>Careers</li>
              <li>Support</li>
            </ul>

          </div>

          <div>

            <h4>Legal</h4>

            <ul>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Refund Policy</li>
            </ul>

          </div>

        </div>

        {/* Right */}

        <div className="footer-contact">

          <h4>Contact</h4>

          <p>📍 Surat, Gujarat</p>

          <p>📞 +91 96381 33033</p>

          <p>✉ support@momento.com</p>

          <div className="social-icons">

            <span>🌐</span>

            <span>📘</span>

            <span>📸</span>

            <span>▶</span>

          </div>

        </div>

      </div>

      <div className="footer-bottom">

        © 2026 <strong>Momento</strong> • MCA Event Management Project

      </div>

    </footer>
  );
}