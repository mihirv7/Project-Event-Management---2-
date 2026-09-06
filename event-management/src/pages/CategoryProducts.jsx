import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./CategoryProducts.css";

export default function CategoryProducts() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productSearch, setProductSearch] = useState("");

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

  // Search products/designs by name
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="loading">
        Loading Designs...
      </div>
    );
  }

  return (
    <div className="product-container">

      <h2 className="heading">Available Designs</h2>

      {/* ================= SEARCH ================= */}
      <div className="custom-product-search-container">
        <input
          type="text"
          placeholder="🔍 Search Designs..."
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          className="custom-product-search"
        />
      </div>

      {/* ================= PRODUCTS ================= */}
      {filteredProducts.length === 0 ? (
        <p className="no-data">
          No designs found
        </p>
      ) : (
        <div className="product-grid">

          {filteredProducts.map((p) => (
            <div
              key={p._id}
              className="product-card"
            >

              <img
                src={`http://localhost:5000/uploads/${p.image}`}
                alt={p.name}
                className="product-img"
              />

              <div className="product-details">

                <h3 className="product-title">
                  {p.name}
                </h3>

                <p className="price">
                  ₹ {p.price}
                </p>

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