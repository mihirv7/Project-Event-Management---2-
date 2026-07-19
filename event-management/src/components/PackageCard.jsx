import { Link } from "react-router-dom";
import "./PackageCard.css";

export default function PackageCard({ pkg }) {
  return (
    <Link to={`/packages/${pkg._id}`} className="package-link">
      <div className="package-card">

        <div className="package-image">

          <img
            src={`http://localhost:5000/uploads/${pkg.images[0]}`}
            alt={pkg.name}
            className="package-img"
          />

          <div className="package-overlay"></div>

          <span className="package-tag">
            ⭐ Best Seller
          </span>

        </div>

        <div className="package-content">

          <h2>{pkg.name}</h2>

          <div className="package-price">
            ₹ {pkg.price}
          </div>

          <button className="package-btn">
            View Package →
          </button>

        </div>

      </div>
    </Link>
  );
}