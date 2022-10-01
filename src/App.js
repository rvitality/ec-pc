import React from "react";
import Calculator from "./components/Calculator/Calculator.component";
import Header from "./components/Header/Header.component";
import Graph from "./components/Graph/Graph.component";

import "./App.styles.scss";
import Modal from "./components/Modal/Modal.component";

const App = () => {
    return (
        <main>
            <Header />
            <section className="main-content">
                <Calculator />
                <Graph />
            </section>
            <Modal />
        </main>
    );
};

export default App;
