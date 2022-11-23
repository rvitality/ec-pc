import React, { useEffect } from "react";

import { useApplianceContext } from "../../context/ApplianceContext";

import Spinner from "../../ui/Spinner/Spinner.ui";
import Calculator from "../../components/Calculator/Calculator.component";
import Modal from "../../components/Modal/Modal.component";
import Graph from "../../components/Graph/Graph.component";

import { useAuthContext } from "../../context/AuthContext";
import { useState } from "react";

import "./CalculatorGraph.styles.scss";
import ConversionTool from "./ConversionTool/ConversionTool.component";

const CalculatorGraph = () => {
    const { user } = useAuthContext();
    const { forecasted, actual, month, year } = user.records?.length > 0 ? user.records[0] : {};

    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const { setSarimaRate, sarimaRate } = useApplianceContext();

    // const [accuracy, setAccuracy] = useState()
    const errorRate = (Math.abs(actual - forecasted) / forecasted) * 100;
    const accuracy = (100 - errorRate).toFixed(2);
    // setAccuracy(accuracy);

    // ! fetch sarima rate
    useEffect(() => {
        const sendRequest = async () => {
            setIsLoading(true);
            setError("");
            try {
                const response = await fetch("/api/get_sarima_rate");
                if (!response.ok) return "Failed to get sarima rate!";
                const data = await response.json();
                console.log(data);
                const { sarima_rate } = data;
                setSarimaRate(sarima_rate);
            } catch (err) {
                console.log(err.message);
                setError(err.message);
            }
            setIsLoading(false);
        };

        // run python predict rate if sarimaRate hasn't been changed in the admin route
        // 1 being the default value
        if (sarimaRate === 1) {
            sendRequest();
        }
    }, []);

    return (
        <>
            <section className="main-content">
                <div className="left-side">
                    {loading ? (
                        <div className="loading">
                            <p>Getting SARIMA rate...</p>
                            <Spinner />
                        </div>
                    ) : (
                        <Calculator />
                    )}
                </div>

                <div className="right-side">
                    <Graph />

                    <ConversionTool />

                    <div className="current-data">
                        <div className="control">
                            <div className="control__label">
                                Predicted Rate{" "}
                                <div className="date">
                                    ({month}, {year})
                                </div>
                            </div>
                            <div className="control__value">
                                {loading ? (
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
                            <div className="control__label">Current Forecasted Bill</div>
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
