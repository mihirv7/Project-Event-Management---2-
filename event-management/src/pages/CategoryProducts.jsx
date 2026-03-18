import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./CategoryProducts.css";

export default function CategoryProducts() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  // Loading state
  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="product-container">
      <h2 className="heading">Available Designs</h2>

      {/* Empty state */}
      {products.length === 0 ? (
        <p className="no-data">No products found</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <div
              key={p._id}
              className="product-card"
            >
              <img
                src={`/assets/${p.image}`}
                alt={p.name}
                className="product-img"
              />

              <div className="product-details">
                <h3 className="product-title">{p.name}</h3>
                <p className="price">₹ {p.price}</p>

                <button
                  className="view-btn"
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}