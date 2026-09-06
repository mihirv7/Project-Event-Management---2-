import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Custom.css";

export default function Custom() {
  const [categories, setCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Search custom event categories by name
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div className="custom-container">

      <div className="custom-header">
        <h2>Customize Your Event</h2>

        <p>
          Select your event category and start creating your dream celebration.
        </p>
      </div>

      {/* Custom Event Search */}
      <div className="custom-search-container">
        <input
          type="text"
          placeholder="🔍 Search Custom Events..."
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
          className="custom-search"
        />
      </div>

      <div className="category-grid">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat) => (
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
          ))
        ) : (
          <p className="no-custom-result">
            No custom events found.
          </p>
        )}
      </div>

    </div>
  );
}