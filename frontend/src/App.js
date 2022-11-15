import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./routes/Header/Header.component";
import Home from "./routes/Home/Home.route";
import CalculatorGraph from "./routes/CalculatorGraph/CalculatorGraph.route";
import Account from "./routes/Account/Account.route";
import Admin from "./routes/Admin/Admin.route";

import { useApplianceContext } from "./context/ApplianceContext";
import { useAuthContext } from "./context/AuthContext";

const App = () => {
    const { isAuthenticated, user } = useAuthContext();
    const { setSarimaRate } = useApplianceContext();

    // ! fetch sarima rate
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
        <Routes>
            <Route path="/" element={<Header />}>
                <Route index element={<Home />} />
                <Route
                    path="/calculator"
                    element={isAuthenticated ? <CalculatorGraph /> : <Navigate to="/" />}
                />
                <Route
                    path="/account"
                    element={isAuthenticated ? <Account /> : <Navigate to="/" />}
                />
                <Route
                    path="/admin"
                    element={
                        isAuthenticated && user.role === "admin" ? <Admin /> : <Navigate to="/" />
                    }
                />
            </Route>
            <Route
                path="*"
                element={
                    <>
                        <Header />
                        <p>There is nothing here!</p>
                    </>
                }
            />
        </Routes>
    );
};

export default App;
