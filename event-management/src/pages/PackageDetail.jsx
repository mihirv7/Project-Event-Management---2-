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
    axios
      .get(`http://localhost:5000/api/packages/${id}`)
      .then((res) => setPkg(res.data))
      .catch((err) => console.error(err));

    axios
      .get("http://localhost:5000/api/packages")
      .then((res) => setAllPackages(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!pkg) return <p className="loading">Loading package...</p>;

  const otherPackages = allPackages.filter((p) => p._id !== id);

  return (
    <div className="package-detail-page">

      {/* Hero Title */}

      <div className="package-header">

        <h1>{pkg.name}</h1>

        <p>
          Make your special occasion unforgettable with our premium event
          planning package.
        </p>

      </div>

      {/* Image Gallery */}

      <div className="gallery-section">

        {pkg.images?.slice(0, 2).map((img, index) => (

          <div className="gallery-card" key={index}>

            <img
              src={`http://localhost:5000/uploads/${img}`}
              alt={pkg.name}
            />

          </div>

        ))}

      </div>

      {/* Main Info */}

      <div className="detail-card">

        <div className="detail-left">

          <h2>Package Information</h2>

          <div className="info-row">

            <span className="label">Price</span>

            <span className="value price">
              ₹ {pkg.price}
            </span>

          </div>

          <div className="info-row">

            <span className="label">Venue</span>

            <span className="value">
              {pkg.venue}
            </span>

          </div>

          <div className="info-row">

            <span className="label">Coordinator</span>

            <span className="value">
              {pkg.coordinatorName}
            </span>

          </div>

          <div className="info-row">

            <span className="label">Contact</span>

            <span className="value">
              {pkg.coordinatorNumber}
            </span>

          </div>

          <div className="info-row">

            <span className="label">Guests</span>

            <span className="value">
              {pkg.guestCount}
            </span>

          </div>

        </div>

      </div>

      {/* Description */}

      <div className="description-card">

        <h2>Description</h2>

        <p>{pkg.description}</p>

      </div>

      {/* Catering */}

      {(pkg.catering?.length > 0 || pkg.thaliName) && (

        <div className="catering-card">

          <h2>Catering Details</h2>

          {pkg.catering &&
            pkg.catering.length > 0 &&
            pkg.catering.map((item, index) => (

              <div
                className="thali-box"
                key={index}
              >

                <h3>{item.thaliName}</h3>

                <p>{item.description}</p>

                <div className="thali-price">

                  ₹ {item.price} / Plate

                </div>

              </div>

            ))}

          {pkg.thaliName && (

            <div className="thali-box">

              <h3>{pkg.thaliName}</h3>

              <p>{pkg.thaliDescription}</p>

              <div className="thali-price">

                ₹ {pkg.thaliPrice} / Plate

              </div>

            </div>

          )}

        </div>

      )}

      <button
        className="book-btn-back"
        onClick={() => navigate(`/booking/${pkg._id}`)}
      >
        Book This Event
      </button>

      {/* Other Packages */}

      {otherPackages.length > 0 && (

        <div className="other-packages">

          <h2>Other Packages You May Like</h2>

          <div className="package-grid">

            {otherPackages.map((p) => (
                            <div key={p._id} className="other-package-card">

                <div className="other-image">

                  <img
                    src={`http://localhost:5000/uploads/${p.images?.[0]}`}
                    alt={p.name}
                  />

                </div>

                <div className="other-content">

                  <h3>{p.name}</h3>

                  <div className="other-price">

                    ₹ {p.price}

                  </div>

                  <button
                    className="details-btn"
                    onClick={() =>
                      (window.location.href = `/packages/${p._id}`)
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