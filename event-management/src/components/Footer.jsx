import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left Logo */}
        <div className="footer-logo">
          <h2>Momento</h2>
        </div>

        {/* Links */}
        <div className="footer-links">
          <div>
            <h4>Product</h4>
            <ul>
              <li>Home</li>
              <li>Support</li>
              <li>Pricing</li>
              <li>Affiliate</li>
            </ul>
          </div>

          <div>
            <h4>Resources</h4>
            <ul>
              <li>Company</li>
              <li>Blogs</li>
              <li>Community</li>
              <li>Careers</li>
              <li>About</li>
            </ul>
          </div>

          <div>
            <h4>Legal</h4>
            <ul>
              <li>Privacy</li>
              <li>Terms</li>
            </ul>
          </div>
        </div>

        {/* Right Content */}
        <div className="footer-right">
          <p>
            Making every customer feel valued— <br />
            no matter the size of your audience.
          </p>

          <div className="social-icons">
            <span>🌐</span>
            <span>💼</span>
            <span>🐦</span>
            <span>▶</span>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 Momento • MCA Event Management Project
      </div>
    </footer>
  );
}
