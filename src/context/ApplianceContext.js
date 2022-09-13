import { createContext, useContext, useState } from "react";

const ApplianceContext = createContext({
    totalBill: 0,
    selectedAppliances: [],
});

export const ApplianceContextProvider = props => {
    const [totalBill, setTotalBill] = useState(0);
    const [selectedAppliances, setSelectedAppliances] = useState([]);

    const contextValue = {
        totalBill,
        setTotalBill,
        selectedAppliances,
        setSelectedAppliances,
    };

    return (
        <ApplianceContext.Provider value={contextValue}>{props.children}</ApplianceContext.Provider>
    );
};

export const useApplianceContext = () => useContext(ApplianceContext);
