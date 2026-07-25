import { useEffect, useState } from "react";
import axios from "axios";
import "./Catering.css";
import CategoryCard from "./CategoryCard";

export default function Catering() {

  const [categories, setCategories] = useState([]);

  useEffect(() => {

    fetchCategories();

  }, []);

  const fetchCategories = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/catering/categories"
      );

      const activeCategories = res.data.filter(
        (category) => category.status === true
      );

      setCategories(activeCategories);

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <section className="catering-page">

      <div className="container">

        <div className="catering-heading">

          <h1>Discover delicious catering...</h1>

          {/* <p>
            Discover delicious catering options for weddings,
            birthdays, corporate events, and every special occasion.
          </p> */}

        </div>

        <div className="category-grid">

          {categories.map((category) => (

            <CategoryCard
              key={category._id}
              category={category}
            />

          ))}

        </div>

      </div>

    </section>

  );
}