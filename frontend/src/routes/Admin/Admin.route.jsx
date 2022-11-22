import React, { useState } from "react";

import Users from "./Users/Users.component";
import Graph from "../../components/Graph/Graph.component";
import OfficialRateForm from "./OfficialRateForm/OfficialRateForm.component";

import "./Admin.styles.scss";
import Predictions from "./Predictions/Predictions.component";

const Admin = () => {
    const [selectedCategory, setSelectedCategory] = useState("users");

    const clickCategoryHandler = category => {
        setSelectedCategory(category);
    };

    let contentToShow;

    if (selectedCategory === "rate-form") {
        contentToShow = (
            <div className="rate-container">
                <OfficialRateForm />
                <Graph />
            </div>
        );
    } else if (selectedCategory === "users") {
        contentToShow = <Users />;
    } else if (selectedCategory === "predictions") {
        contentToShow = <Predictions />;
    }

    return (
        <section className="admin-dashboard section-px section-py">
            <h1 className="heading-secondary">Admin Dashboard</h1>

            <nav>
                <ul>
                    <li
                        className={selectedCategory === "users" ? "active" : ""}
                        onClick={() => clickCategoryHandler("users")}
                    >
                        Users
                    </li>

                    <li
                        className={selectedCategory === "predictions" ? "active" : ""}
                        onClick={() => clickCategoryHandler("predictions")}
                    >
                        Predictions
                    </li>

                    <li
                        className={selectedCategory === "rate-form" ? "active" : ""}
                        onClick={() => clickCategoryHandler("rate-form")}
                    >
                        Offical Rate
                    </li>
                </ul>
            </nav>

            <div className="content">{contentToShow}</div>
        </section>
    );
};

export default Admin;
