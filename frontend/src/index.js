import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.scss";
import App from "./App";

import { AuthContextProvider } from "./context/AuthContext";
import { ApplianceContextProvider } from "./context/ApplianceContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthContextProvider>
                <ApplianceContextProvider>
                    <App />
                </ApplianceContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    </React.StrictMode>
);
