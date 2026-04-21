import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PackageDetail.css";


export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [allPackages, setAllPackages] = useState([]);

  useEffect(() => {
    // 1️⃣ Get single package
    axios
      .get(`http://localhost:5000/api/packages/${id}`)
      .then((res) => setPkg(res.data))
      .catch((err) => console.error(err));

    // 2️⃣ Get all packages
    axios
      .get("http://localhost:5000/api/packages")
      .then((res) => setAllPackages(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!pkg) return <p className="loading">Loading package...</p>;

  // remove current package from list
  const otherPackages = allPackages.filter(
    (p) => p._id !== id
  );

  return (
    <div className="package-detail-container">
      {/* ================= PACKAGE DETAIL ================= */}
      <h1 className="package-title">{pkg.name}</h1>

      {/* Images */}
      <div className="image-gallery">
        {pkg.images?.slice(0, 2).map((img, index) => (
          <img
            key={index}
            src={`http://localhost:5000/uploads/${img}`}
            alt={pkg.name}
          />
        ))}
      </div>

      {/* Info */}
      <div className="package-info">
        <p className="price"><strong>Price : ₹</strong> {pkg.price}</p>

        {/* <p className="date">
          📅 <strong>From:</strong>{" "}
          {new Date(pkg.startDate).toLocaleDateString()}{" "}
          →{" "}
          <strong>To:</strong>{" "}
          {new Date(pkg.endDate).toLocaleDateString()}
        </p> */}

        
      </div>
      <div className="package-info">
  <p className="description">
    <strong>Description :</strong> {pkg.description}
  </p>

  <p>
    <strong>Venue :</strong> {pkg.venue}
  </p>

  <p>
    <strong>Coordinator Name :</strong> {pkg.coordinatorName}
  </p>

  <p>
    <strong>Coordinator Contact :</strong> {pkg.coordinatorNumber}
  </p>
  <p>
    <strong>No of Guest :</strong> {pkg.guestCount}
  </p>
</div>

      {/* Catering */}
      {pkg.catering && pkg.catering.length > 0 && (
  /* Catering Section */
<div className="catering">

  <h2>Catering</h2>

  {/* OLD FORMAT (array based) */}
  {pkg.catering && pkg.catering.length > 0 &&
    pkg.catering.map((item, index) => (
      <div key={index}>
        <p><strong>{item.thaliName}</strong></p>
        <p>{item.description}</p>

        <p className="thali-price">₹ {item.price} per plate</p>
      </div>
    ))
  }

  {/* NEW FORMAT (single thali fields) */}
  {pkg.thaliName && (
    <div>
      <p><strong>{pkg.thaliName}</strong></p>
      <p>{pkg.thaliDescription}</p>
      <p className="thali-price">₹ {pkg.thaliPrice} per plate</p>
    </div>
  )}

</div>

)}

      <button
  className="book-btn"
  onClick={() => navigate(`/booking/${pkg._id}`)}
>
  Book Event
</button>

      {/* ================= OTHER PACKAGES ================= */}
      {otherPackages.length > 0 && (
        <div className="other-packages">
          <h2>Other Packages You May Like</h2>

          <div className="package-grid">
            {otherPackages.map((p) => (
              <div key={p._id} className="package-card">
                <img
                  src={`/assets/${p.images[0]}`}
                  alt={p.name}
                />

                <h3>{p.name}</h3>
                {/* <p>{p.description}</p> */}

                <div className="card-footer">
                  <span>₹ {p.price}</span>
                  
                </div>
                <div className="card-footer">
                  <button
                    onClick={() =>
                      window.location.href = `/packages/${p._id}`
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
