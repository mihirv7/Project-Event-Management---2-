import React from "react";
import "./CateringMenu.css";
import { useParams } from "react-router-dom";

import banner from "../../assets/catering/wedding.jpg";

function CateringMenu() {

    const { slug } = useParams();
    return (

        <div className="menu-container">

            <div className="banner">

                <img src={banner} alt="Wedding Catering" />

            </div>

            <div className="menu-header">

                <h1>Wedding Catering</h1>

                <p>
                    Experience premium catering services crafted
                    for weddings with delicious cuisines,
                    elegant presentation, and exceptional quality.
                </p>

            </div>

        </div>

    );

}

export default CateringMenu;