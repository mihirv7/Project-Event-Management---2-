import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-wrapper">
      <div className="about-hero">
        <h1 className="about-title">About Us</h1>
        <p className="about-subtitle">
          Making Event Planning Simple, Smart & Stylish
        </p>
      </div>

      <div className="about-content">
        
        {/* Card 1 - Image Left */}
        <div className="about-card horizontal slide-left">
          <img src="/assets/aboutus1.jpeg" alt="Mission" />
          <div className="about-text">
            <h1>01. Our Mission</h1>
            <p>
              Our mission is to simplify event planning by providing a seamless
              and reliable platform that helps users book, manage, and organize
              events efficiently.
            </p>
          </div>
        </div>

        {/* Card 2 - Image Right */}
        <div className="about-card horizontal reverse slide-right">
          <img src="/assets/aboutus2.jpeg" alt="Technology" />
          <div className="about-text">
            <h1>02. Technologies Used</h1>
            <p>
              The system is developed using React.js for frontend, Node.js and
              Express.js for backend services, and MongoDB for secure data
              storage.
            </p>
          </div>
        </div>

        {/* Card 3 - Image Left */}
        <div className="about-card horizontal fade-up">
          <img src="/assets/aboutus3.jpeg" alt="Features" />
          <div className="about-text">
            <h1>03. Key Features</h1>
            <p>
              Features include event booking, user authentication, scheduling,
              responsive design, and efficient data management.
            </p>
          </div>
        </div>

        {/* Card 4 - Image Right */}
        <div className="about-card horizontal reverse slide-left">
          <img src="/assets/aboutus4.jpeg" alt="Why Choose Us" />
          <div className="about-text">
            <h1>04. Why Choose This System?</h1>
            <p>
              It reduces manual work, improves accuracy, saves time, and offers
              a smooth user experience for both organizers and users.
            </p>
          </div>
        </div>

        {/* Card 5 - Image Left */}
        <div className="about-card horizontal slide-right">
          <img src="/assets/aboutus5.jpeg" alt="Academic" />
          <div className="about-text">
            <h1>05. Academic Relevance</h1>
            <p>
              This project is developed as part of the MCA curriculum to
              demonstrate real-world full-stack web development concepts.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;