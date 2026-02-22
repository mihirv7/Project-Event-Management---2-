import "./EventCard.css";

export default function EventCard({ image, title, description }) {
  return (
    <div className="event-card">
      <img src={`/assets/${image}`} alt={title} />

      <div className="event-content">
        <h3>{title}</h3>
        <p>{description}</p>
        {/* <button>View Details</button> */}
      </div>
    </div>
  );
}

