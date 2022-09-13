import React from "react";
import Calculator from "./components/Calculator/Calculator.component";
import Header from "./components/Header/Header.component";
import Modal from "./components/Modal/Modal.component";

import "./App.styles.scss";

const App = () => {
    return (
        <main>
            <Header />
            <section className="main-content">
                <Calculator />
                <Modal />
            </section>
        </main>
    );
};

export default App;
