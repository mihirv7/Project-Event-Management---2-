import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">

      {/* Hero Section */}
      <div className="contact-hero">
        <div className="hero-overlay">
          <h1>Contact Us</h1>
          <p>Let’s plan your next memorable event together.</p>
        </div>
      </div>

      {/* Main Contact Section */}
      <div className="contact-section">

        {/* Left Content */}
        <div className="contact-left slide-left">
          <h2>Get Your Event Quote Now</h2>
          <p>
            Planning a wedding, corporate event, birthday party, or DJ night?
            Our Event Management System makes booking and organizing events
            simple, fast, and stress-free.
          </p>

          <p>
            Contact us today to discuss your event requirements and get a
            customized quote tailored to your needs.
          </p>

          <div className="contact-phone">
            📞 +91 98765 43210
          </div>
        </div>

        {/* Right Form */}
        <div className="contact-form-card slide-right">
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="text" placeholder="Phone Number" required />
            <input type="email" placeholder="Email Address" required />
            <input type="text" placeholder="Event Type" required />
            <textarea
              placeholder="Tell us about your event requirements..."
              rows="4"
              required
            ></textarea>
            <button type="submit">Submit Request</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;