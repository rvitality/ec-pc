import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { AuthContextProvider } from "./context/AuthContext";
import { ApplianceContextProvider } from "./context/ApplianceContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <AuthContextProvider>
            <ApplianceContextProvider>
                <App />
            </ApplianceContextProvider>
        </AuthContextProvider>
    </React.StrictMode>
);
