import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Custom.css";

export default function Custom() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="custom-container">

      <div className="custom-header">
        <h2>Customize Your Event</h2>

        <p>
          Select your event category and start creating your dream celebration.
        </p>
      </div>

      <div className="category-grid">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="category-card"
            onClick={() => navigate(`/custom/${cat._id}`)}
          >
            <div className="image-wrapper">
              <img
                src={`http://localhost:5000/uploads/${cat.image}`}
                alt={cat.name}
              />
            </div>

            <div className="category-content">
              <h3>{cat.name}</h3>

              <button className="choose-btn">
                Customize Now
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}