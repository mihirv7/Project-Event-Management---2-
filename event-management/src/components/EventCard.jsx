import "./EventCard.css";

export default function EventCard({ image, title, description }) {
  return (
    <div className="event-card">

      <div className="event-image">
        <img
          src={`http://localhost:5000/uploads/${image}`}
          alt={title}
        />

        <div className="image-overlay"></div>

      </div>

      <div className="event-content">

        <h3>{title}</h3>

        <p>{description}</p>

        <div className="event-footer">

          

        </div>

      </div>

    </div>
  );
}