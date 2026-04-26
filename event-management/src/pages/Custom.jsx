import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Custom.css";

export default function Custom() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories")
      .then(res => setCategories(res.data));
  }, []);

  return (
    <div className="custom-container">
      <h2>Choose Event Category</h2>

      <div className="category-grid">
        {categories.map(cat => (
          <div
            key={cat._id}
            className="category-card"
            onClick={() => navigate(`/custom/${cat._id}`)}
          >
            <img  src={`http://localhost:5000/uploads/${cat.image}`} alt={cat.name}  />
            <h3>{cat.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}