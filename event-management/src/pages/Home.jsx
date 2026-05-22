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

  return (
    <>
      {/* HERO SECTION (DO NOT DELETE THIS) */}
      <section className="hero">
        <h1>Plan Your Events Effortlessly</h1>
        <p>
          Manage weddings, conferences, concerts and more with ease.
        </p>
        <button className="primary-btn">Get Started</button>
      </section>

      {/* RECENT EVENTS SECTION */}
      <section className="events-section">
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
