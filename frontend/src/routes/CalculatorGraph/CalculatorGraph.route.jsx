import React, { useEffect } from "react";

import { useApplianceContext } from "../../context/ApplianceContext";

import Calculator from "../../components/Calculator/Calculator.component";
import Modal from "../../components/Modal/Modal.component";
import Graph from "../../components/Graph/Graph.component";

import "./CalculatorGraph.styles.scss";

const CalculatorGraph = () => {
    const { setSarimaRate, sarimaRate } = useApplianceContext();

    // ! fetch sarima rate
    useEffect(() => {
        const sendRequest = async () => {
            try {
                const response = await fetch(
                    "https://ec-pc-flaskapi.onrender.com/api/get_sarima_rate"
                );
                if (!response.ok) return "Something went wrong!";
                const data = await response.json();
                const { sarima_rate } = data;
                setSarimaRate(sarima_rate);
            } catch (err) {
                console.log(err.message);
            }
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
                <Calculator />
                <div className="right-side">
                    <Graph />
                </div>
            </section>
            <Modal />
        </>
    );
};

export default CalculatorGraph;
