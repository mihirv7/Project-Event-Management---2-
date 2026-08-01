import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./CateringMenu.css";

const BASE_URL = "http://localhost:5000";

export default function CateringMenu() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [menus, setMenus] = useState([]);
  const [foodType, setFoodType] = useState("Regular");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategory();
    fetchMenus();
  }, [id]);

  const fetchCategory = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/catering/categories/${id}`
      );
      setCategory(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMenus = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/catering/menu/category/${id}`
      );
      setMenus(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMenus = menus.filter(
    (menu) => menu.foodType === foodType
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="container py-5">

      {/* ===== Header ===== */}

      <div className="catering-header">
        <h1>{category?.name}</h1>

        {/* <p>{category?.description}</p> */}

        {category?.bannerImage && (
          <img
            src={`${BASE_URL}/uploads/${category.bannerImage}`}
            alt={category.name}
            className="hero-image"
          />
        )}
      </div>

      {/* ===== Food Type ===== */}

      <div className="food-filter">
        <button
          className={foodType === "Regular" ? "active" : ""}
          onClick={() => setFoodType("Regular")}
        >
          Regular
        </button>

        <button
          className={foodType === "Jain" ? "active" : ""}
          onClick={() => setFoodType("Jain")}
        >
          Jain
        </button>
      </div>

      {/* ===== Menu Cards ===== */}

      <div className="menu-grid">
  {filteredMenus.length > 0 ? (
    filteredMenus.map((menu) => (
      <div className="catering-detail-card" key={menu._id}>

        <h3>{menu.thaliName}</h3>

        <p className="menu-description">
          {menu.description}
        </p>

        <div className="menu-price">
          ₹{menu.price} / Plate
        </div>

        <button
          className="book-btnn"
          onClick={() => navigate(`/catering-booking/${menu._id}`)}
        >
          Book Catering
        </button>

      </div>
    ))
  ) : (
    <div className="text-center">
      <h4>No {foodType} menu available.</h4>
    </div>
  )}
</div>
  
    </div>
  );
}