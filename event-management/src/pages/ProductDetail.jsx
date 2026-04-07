import { useParams, useNavigate } from "react-router-dom"; // ✅ added useNavigate
import { useEffect, useState } from "react";
import axios from "axios";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ important

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
      .then((res) => setRelated(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!product) return <h2>Loading...</h2>;

  return (
    <div className="detail-wrapper">

      <div className="detail-card">

        <h2 className="title">{product.name}</h2>

        {/* IMAGE */}
        <div className="image-box">
          <img src={`/assets/${product.image}`} alt={product.name} />
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

        {/* CUSTOMIZE BUTTON */}
        {product.customizations?.length > 0 && (
          <button
            className="custom-btn"
            onClick={() => setShowCustomize(!showCustomize)}
          >
            Customize
          </button>
        )}

        {/* CUSTOMIZATION */}
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
                      onClick={() =>
                        setSelectedOptions({
                          ...selectedOptions,
                          [c.name]: opt
                        })
                      }
                    >
                      {opt}
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

        {/* BOOK BUTTON */}
        <button
          className="book-btn full-btn"
          onClick={() =>
            navigate("/product-booking", {
              state: {
                product,
                selectedOptions
              }
            })
          }
        >
          Book Now
        </button>

      </div>

      {/* RELATED */}
      <div className="related-section">
        <h3>More Designs</h3>

        <div className="product-grid">
          {related.map((item) => (
            <div className="product-card" key={item._id}>
              <img src={`/assets/${item.image}`} alt={item.name} />
              <h4>{item.name}</h4>
              <p>₹ {item.price}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}