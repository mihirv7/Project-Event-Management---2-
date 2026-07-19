import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import PackageCard from "../components/PackageCard";
import "../components/EventCard.css";
import "./Home.css";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/packages")
      .then(res => res.json())
      .then(data => setPackages(data));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  const scrollToEvents = () => {
    document.getElementById("events").scrollIntoView({
      behavior: "smooth",
    });
  };

  const scrollToPackages = () => {
    document.getElementById("packages").scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <>
      <section className="hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <span className="hero-tag">
            ✨ Premium Event Planning Experience
          </span>

          <h1>
            Create <span>Unforgettable</span><br />
            Events With Ease
          </h1>

          <p>
            From weddings and birthdays to corporate conferences,
            discover premium venues, decorators, catering and everything
            you need to make your event memorable.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={scrollToEvents}>
              Explore Events
            </button>

            <button className="secondary-btn" onClick={scrollToPackages}>
              View Packages
            </button>
          </div>

          <div className="hero-stats">
            <div>
              <h2>500+</h2>
              <span>Events</span>
            </div>

            <div>
              <h2>100+</h2>
              <span>Vendors</span>
            </div>

            <div>
              <h2>5★</h2>
              <span>Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Events */}
      <section id="events" className="events-section">
        <h2 className="section-title">Recent Events</h2>

        <div className="events-grid">
          {events.map(event => (
            <EventCard
              key={event._id}
              image={event.image}
              title={event.title}
              description={event.description}
            />
          ))}
        </div>
      </section>

      {/* Packages */}
      <section id="packages" style={{ padding: "60px 100px" }}>
        <h2 className="section-title">Our Packages</h2>

        <div className="package-grid">
          {packages.map(pkg => (
            <PackageCard key={pkg._id} pkg={pkg} />
          ))}
        </div>
      </section>
    </>
  );
}