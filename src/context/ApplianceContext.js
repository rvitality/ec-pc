import { createContext, useContext, useState } from "react";

const initialState = {
    sarimaRate: 8,
    totalBill: 0,
    selectedAppliances: [],
};

const ApplianceContext = createContext(initialState);

export const ApplianceContextProvider = props => {
    const sarimaRate = 8;
    const [appliances, setAppliances] = useState([]);
    const totalBill = appliances.reduce((sum, item) => sum + item.applianceBill, 0);

    const contextValue = {
        appliances,
        setAppliances,
        sarimaRate,
        totalBill,
    };

    return (
        <ApplianceContext.Provider value={contextValue}>{props.children}</ApplianceContext.Provider>
    );
};

export const useApplianceContext = () => useContext(ApplianceContext);
