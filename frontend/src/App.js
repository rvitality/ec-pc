import React, { useEffect } from "react";
import Calculator from "./components/Calculator/Calculator.component";
import Header from "./components/Header/Header.component";
import Graph from "./components/Graph/Graph.component";

import "./App.styles.scss";
import Modal from "./components/Modal/Modal.component";
import OfficialRateForm from "./components/OfficialRateForm/OfficialRateForm.component";

import { useApplianceContext } from "./context/ApplianceContext";

const App = () => {
    const { setSarimaRate } = useApplianceContext();

    // fetch sarima rate
    useEffect(() => {
        const sendRequest = async () => {
            const response = await fetch("/get_sarima_rate");
            if (!response.ok) return "Something went wrong!";
            const data = await response.json();
            console.log(data);
            const { sarima_rate } = data;
            setSarimaRate(sarima_rate);
        };
        sendRequest();
    }, []);

    return (
        <main>
            <Header />
            <section className="main-content">
                <Calculator />
                <div className="right-side">
                    <Graph />
                    <OfficialRateForm />
                </div>
            </section>
            <Modal />
        </main>
    );
};

export default App;
