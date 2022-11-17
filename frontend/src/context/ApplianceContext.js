import { createContext, useContext, useState } from "react";

const initialState = {
    sarimaRate: 6.9,
    forecastedBill: 0,
    selectedAppliances: [],
    modalIsOpen: false,
};

const ApplianceContext = createContext(initialState);

export const ApplianceContextProvider = props => {
    const [sarimaRate, setSarimaRate] = useState(1);

    const [appliances, setAppliances] = useState([]);
    const forecastedBill = appliances.reduce((sum, item) => sum + item.applianceBill, 0);

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const contextValue = {
        appliances,
        setAppliances,
        sarimaRate,
        setSarimaRate,
        forecastedBill,
        modalIsOpen,
        setModalIsOpen,
    };

    return (
        <ApplianceContext.Provider value={contextValue}>{props.children}</ApplianceContext.Provider>
    );
};

export const useApplianceContext = () => useContext(ApplianceContext);
