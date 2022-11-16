import React, { useEffect } from "react";

import { useApplianceContext } from "../../context/ApplianceContext";

import Calculator from "../../components/Calculator/Calculator.component";
import Modal from "../../components/Modal/Modal.component";
import Graph from "../../components/Graph/Graph.component";

import "./CalculatorGraph.styles.scss";

const CalculatorGraph = () => {
    const { setSarimaRate } = useApplianceContext();

    // ! fetch sarima rate
    useEffect(() => {
        const sendRequest = async () => {
            try {
                const response = await fetch("/get_sarima_rate");
                if (!response.ok) return "Something went wrong!";
                const data = await response.json();
                console.log(data);
                const { sarima_rate } = data;
                setSarimaRate(sarima_rate);
            } catch (err) {
                console.log(err.message);
            }
        };
        sendRequest();
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
