import React from "react";

import "./CalculatorGraph.styles.scss";

import Calculator from "../../components/Calculator/Calculator.component";
import Modal from "../../components/Modal/Modal.component";
import Graph from "../../components/Graph/Graph.component";

const CalculatorGraph = () => {
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
