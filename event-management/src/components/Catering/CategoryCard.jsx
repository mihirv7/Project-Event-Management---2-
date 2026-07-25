import { Link } from "react-router-dom";
import "./CategoryCard.css";

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/catering/${category._id}`}
      className="package-link"
    >
      <div className="package-card">

        <div className="package-image">

          <img
            src={`http://localhost:5000/uploads/${category.cardImage}`}
            alt={category.name}
            className="package-img"
          />

          <div className="package-overlay"></div>

          <span className="package-tag">
            🍽 Premium Catering
          </span>

        </div>

        <div className="package-content">

          <h2>{category.name}</h2>

          <p className="package-desc">
            {category.description}
          </p>

          <button className="package-btn">
            View Menu →
          </button>

        </div>

      </div>
    </Link>
  );
}