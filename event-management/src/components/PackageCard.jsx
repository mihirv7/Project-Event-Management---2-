import { Link } from "react-router-dom";
import "./PackageCard.css";

export default function PackageCard({ pkg }) {
  return (
    <Link to={`/packages/${pkg._id}`} className="package-link">
      <div className="package-card">
        <img
        src={`/assets/${pkg.images[0]}`}
        alt={pkg.name}
        className="package-img"
      />

        <div className="package-content">
          <h2>{pkg.name}</h2>
          {/* <p>{pkg.description}</p> */}

          <div className="package-info">
            {/* <span>⏱ {pkg.duration}</span> */}
            <span>₹ {pkg.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
