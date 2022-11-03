import { createContext, useContext, useState } from "react";

const initialState = {
    sarimaRate: 6.9,
    totalBill: 0,
    selectedAppliances: [],
    modalIsOpen: false,
};

const ApplianceContext = createContext(initialState);

export const ApplianceContextProvider = props => {
    const [sarimaRate, setSarimaRate] = useState(1);
    const [appliances, setAppliances] = useState([]);
    const totalBill = appliances.reduce((sum, item) => sum + item.applianceBill, 0);

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const contextValue = {
        appliances,
        setAppliances,
        sarimaRate,
        setSarimaRate,
        totalBill,
        modalIsOpen,
        setModalIsOpen,
    };

    return (
        <ApplianceContext.Provider value={contextValue}>{props.children}</ApplianceContext.Provider>
    );
};

export const useApplianceContext = () => useContext(ApplianceContext);
