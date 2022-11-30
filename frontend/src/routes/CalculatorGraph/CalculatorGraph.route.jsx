import React, { useEffect, useState } from "react";

import { useApplianceContext } from "../../context/ApplianceContext";

import { useAuthContext } from "../../context/AuthContext";

import { calculateAccuracy } from "../../helpers/calculateAccuracy.helper";

import Spinner from "../../ui/Spinner/Spinner.ui";
import Calculator from "../../components/Calculator/Calculator.component";
import Modal from "../../components/Modal/Modal.component";
import Graph from "../../components/Graph/Graph.component";
import ConversionTool from "./ConversionTool/ConversionTool.component";

import useFetchAllRates from "../../hooks/useFetchAllRates";
import useFetchCollections from "../../hooks/useFetchCollections";

import "./CalculatorGraph.styles.scss";
import { updatePredictedRates } from "../../utils/firebase.utils";

const CalculatorGraph = () => {
    const reqAllRatesResponse = useFetchAllRates();

    const reqCollectionsResponse = useFetchCollections("predictedRates");
    const predictedRates = reqCollectionsResponse?.collections;

    const { user } = useAuthContext();
    const {
        forecasted,
        actual,
        month,
        year,
        accuracy: lastCalcAccuracy,
    } = user.records?.length > 0 ? user.records[user.records?.length - 1] : {};

    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const { setSarimaRate, sarimaRate } = useApplianceContext();

    let accuracy = lastCalcAccuracy;
    if (actual && forecasted) {
        accuracy = calculateAccuracy(forecasted, actual);
    }

    // ! fetch sarima rate
    useEffect(() => {
        // get the last entered data on the offical_rates.csv
        const response = reqAllRatesResponse.rates ? reqAllRatesResponse.rates?.slice(-1)[0] : null;

        if (response) {
            const { yr, x: month } = response;
            let newMonth = month;
            let newYr = yr;

            if (month + 1 > 12) {
                newMonth = 1;
                newYr += 1;
            } else {
                newMonth += 1;
            }

            const lastOfficialRateDate = `${newYr}/${newMonth}/1`;

            //  check if it exist in the firesstoredb
            const currentPredictedRate = predictedRates.find(
                rate => rate.date === lastOfficialRateDate
            );

            if (currentPredictedRate) {
                setSarimaRate(currentPredictedRate.value);
            } else {
                // if it doesnt exist in the firestoredb yet

                const getSarimaRate = async () => {
                    setIsLoading(true);
                    setError("");
                    try {
                        const response = await fetch(
                            "https://ec-pc-flaskapi.onrender.com/api/get_sarima_rate"
                        );
                        if (!response.ok) return "Failed to get sarima rate!";
                        const data = await response.json();
                        const { sarima_rate } = data;

                        setSarimaRate(sarima_rate);

                        // ! ADD NEW IN FIRESTORE-------
                        const newPredictedRate = { date: lastOfficialRateDate, value: sarima_rate };

                        await updatePredictedRates({
                            id: "pHyzqSueZeBWo2iA5IGg",
                            predictedRates: [...predictedRates, newPredictedRate],
                        });
                    } catch (err) {
                        console.log(err.message);
                        setError(err.message);
                    }
                    setIsLoading(false);
                };

                // run python predict rate if sarimaRate hasn't been changed in the admin route and it doesnt exist in the firestoredb
                // 1 being the default value
                if (sarimaRate === 1 && !currentPredictedRate && !reqAllRatesResponse) {
                    getSarimaRate();
                }
            }
        }
    }, [predictedRates, reqAllRatesResponse, sarimaRate, setSarimaRate]);

    useEffect(() => {
        const handleClickOutside = e => {
            const target = e.target;

            const firstLevel = document.querySelectorAll(".appliance__options");
            const secondLevel = document.querySelectorAll(".lvl2");
            const thirdLevel = document.querySelectorAll(".lvl3");

            const hideOptions = arr => arr.forEach(option => option.classList.remove("show"));

            if (!target.classList.contains("option") || target.classList.contains("edge")) {
                hideOptions(firstLevel);
                hideOptions(secondLevel);
                hideOptions(thirdLevel);

                return;
            }

            if (target.classList.contains("appliance__btn")) {
                const options = target.nextElementSibling;

                hideOptions(firstLevel);
                hideOptions(secondLevel);
                hideOptions(thirdLevel);

                options.classList.add("show");
            }

            if (target.classList.contains("first-category")) {
                const lvl2 = target.querySelector(".lvl2");

                hideOptions(secondLevel);

                lvl2.classList.add("show");
            }

            if (target.classList.contains("sub-category")) {
                const lvl3 = target.querySelector(".lvl3");

                hideOptions(thirdLevel);

                lvl3.classList.add("show");
            }
        };

        // Bind the event listener
        document.addEventListener("click", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <>
            <section className="main-content">
                {/* ----------------- Calculator ----------------- */}
                <div className="left-side">
                    {reqAllRatesResponse.loading || loading ? (
                        <div className="loading">
                            <p>Getting SARIMA rate...</p>
                            <Spinner />
                        </div>
                    ) : (
                        <Calculator />
                    )}
                </div>

                <div className="right-side">
                    {(reqAllRatesResponse.error || error) && (
                        <small style={{ color: "red" }}>
                            {reqAllRatesResponse.error} <br /> {error}
                        </small>
                    )}
                    {reqAllRatesResponse.loading && (
                        <div className="loading">
                            <p>Getting Official Rates...</p>
                            <Spinner />
                        </div>
                    )}

                    {/* ----------------- Graph ----------------- */}
                    {!reqAllRatesResponse.loading && !reqAllRatesResponse.error && (
                        <Graph
                            rates={reqAllRatesResponse.rates || []}
                            predictedRates={predictedRates || []}
                        />
                    )}

                    <ConversionTool />

                    <div className="current-data">
                        <div className="control">
                            <div className="control__label">
                                Forecasted Rate{" "}
                                <div className="date small">
                                    ({month}, {year})
                                </div>
                            </div>
                            <div className="control__value">
                                {reqAllRatesResponse.loading || loading ? (
                                    <div className="loading">
                                        <p>Getting SARIMA rate...</p>
                                        <Spinner />
                                    </div>
                                ) : (
                                    `₱ ${sarimaRate?.toLocaleString()}`
                                )}
                            </div>
                        </div>

                        <div className="control">
                            <div className="control__label">
                                Current Predicted Bill{" "}
                                <div className="small">(with your previous appliances)</div>
                            </div>
                            <div className="control__value">₱ {forecasted?.toLocaleString()}</div>
                        </div>

                        <div className="control">
                            <div className="control__label">Current Actual Bill</div>
                            <div className="control__value">₱ {actual?.toLocaleString()}</div>
                        </div>
                        <div className="control">
                            <div className="control__label">Accuracy</div>
                            <div className="control__value">{accuracy}%</div>
                        </div>
                    </div>
                </div>
            </section>
            <Modal />
        </>
    );
};

export default CalculatorGraph;
