import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showCustomize, setShowCustomize] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/product/${id}`)
      .then((res) => {
        setProduct(res.data);

        return axios.get(
          `http://localhost:5000/api/products/${res.data.categoryId}`
        );
      })
      .then((res) => {
        const filtered = res.data.filter((p) => p._id !== id);
        setRelated(filtered);
      })
      .catch((err) => console.log(err));
  }, [id]);

  if (!product) return <h2>Loading...</h2>;

  return (
    <div className="detail-wrapper">

      {/* ================= MAIN PRODUCT ================= */}

      <div className="detail-card">

        <h2 className="title">{product.name}</h2>

        {/* IMAGE */}
        <div className="image-box premium-image">
          <img
            src={`http://localhost:5000/uploads/${product.image}`}
            alt={product.name}
          />
        </div>

        {/* PRICE */}
        <p className="price">
          <b style={{ color: "black" }}>Price</b> : ₹ {product.price}
        </p>

        {/* DESCRIPTION */}
        <p className="description">
          <b style={{ color: "black" }}>Description</b> :{" "}
          {product.description || "No description available"}
        </p>

        {/* ================= CUSTOMIZE BUTTON ================= */}

        {product.customizations?.length > 0 && (
          <button
            className="custom-btn premium-btn"
            onClick={() => setShowCustomize(!showCustomize)}
          >
            {showCustomize ? "Hide Customization" : "Customize"}
          </button>
        )}

        {/* ================= CUSTOMIZATION ================= */}

        {showCustomize && (
          <div className="custom-section">

            {product.customizations.map((c, index) => (
              <div key={index} className="custom-box">

                <h4>{c.name}</h4>

                <div className="option-container">

                  {c.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`option-box ${
                        selectedOptions[c.name] === opt ? "active" : ""
                      }`}
                      onClick={() => {
                        setSelectedOptions((prev) => {

                          // If same option is clicked again,
                          // unselect/cancel it
                          if (prev[c.name] === opt) {
                            const updated = { ...prev };
                            delete updated[c.name];

                            return updated;
                          }

                          // Select the new option
                          return {
                            ...prev,
                            [c.name]: opt,
                          };
                        });
                      }}
                    >
                      {opt}
                    </div>
                  ))}

                </div>

              </div>
            ))}

          </div>
        )}

        {/* ================= BOOK BUTTON ================= */}

        <button
          className="book-btnn premium-btn"
          onClick={() =>
            navigate("/product-booking", {
              state: {
                productId: product._id,
                productName: product.name,
                price: product.price,
                selectedOptions,
              },
            })
          }
        >
          Book Now
        </button>

      </div>

      {/* ================= RELATED PRODUCTS ================= */}

      <div className="related-section">

        <div className="related-header">
          <h3>More Designs</h3>
          <p>
            Explore more beautiful designs from this category.
          </p>
        </div>

        <div className="related-grid">

          {related.map((item) => (

            <div
              key={item._id}
              className="related-card"
              onClick={() =>
                navigate(`/product/${item._id}`)
              }
            >

              <div className="related-image">

                <img
                  src={`http://localhost:5000/uploads/${item.image}`}
                  alt={item.name}
                />

              </div>

              <div className="related-content">

                <h4>{item.name}</h4>

                <span className="related-price">
                  ₹ {item.price}
                </span>

                <button className="related-btn">
                  View Details
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}