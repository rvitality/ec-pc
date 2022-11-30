import React, { useState, useEffect } from "react";

import Users from "./Users/Users.component";
import Graph from "../../components/Graph/Graph.component";
import OfficialRateForm from "./OfficialRateForm/OfficialRateForm.component";
import Predictions from "./Predictions/Predictions.component";
import Spinner from "../../ui/Spinner/Spinner.ui";

import useFetchCollections from "../../hooks/useFetchCollections";
import useFetchAllRates from "../../hooks/useFetchAllRates";

import "./Admin.styles.scss";

const Admin = () => {
    const reqAllRatesResponse = useFetchAllRates();
    // get the last entered data on the offical_rates.csv
    const lastOfficialRate = reqAllRatesResponse.rates
        ? reqAllRatesResponse.rates?.slice(-1)[0]
        : null;

    const [officialRates, setOfficialRates] = useState(reqAllRatesResponse.rates || []);

    const reqCollectionsResponse = useFetchCollections("predictedRates");

    const [predictedRates, setPredictedRates] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState("users");

    const clickCategoryHandler = category => {
        setSelectedCategory(category);
    };

    let contentToShow;

    const changeLatestOfficialRateHandler = data => {
        if (!data) return;
        const { predictedRates, last_rate_data } = data;

        setPredictedRates(predictedRates);

        if (!last_rate_data) return;
        const [date, rate] = last_rate_data;
        setOfficialRates(prevState => {
            if (prevState.length > 0) {
                prevState[prevState.length - 1].y = rate;
                return prevState;
            }
            return prevState;
        });
    };

    useEffect(() => {
        const receivedRates = reqCollectionsResponse?.collections;
        setPredictedRates(receivedRates);
    }, [reqCollectionsResponse.collections]);

    useEffect(() => {
        setOfficialRates(reqAllRatesResponse.rates);
    }, [reqAllRatesResponse.rates]);

    if (selectedCategory === "rate-form") {
        contentToShow = (
            <div className="rate-container">
                <div className="form">
                    <OfficialRateForm
                        lastOfficialRate={lastOfficialRate}
                        onChangeLatestOfficialRate={changeLatestOfficialRateHandler}
                        predictedRates={predictedRates}
                    />
                </div>

                <div className="rates">
                    {(reqAllRatesResponse.error || reqCollectionsResponse.error) && (
                        <small style={{ color: "red" }}>Failed to fetch data.</small>
                    )}
                    {(reqAllRatesResponse.loading || reqCollectionsResponse.isLoading) && (
                        <div className="loading">
                            <p>Getting Rates...</p>
                            <Spinner />
                        </div>
                    )}
                    {(!reqAllRatesResponse.loading || !reqCollectionsResponse.isLoading) && (
                        <Graph rates={officialRates || []} predictedRates={predictedRates || []} />
                    )}
                </div>
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
