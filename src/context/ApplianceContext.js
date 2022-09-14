import { createContext, useContext, useReducer } from "react";

const initialState = {
    sarimaRate: 8,
    totalBill: 0,
    selectedAppliances: [],
};

const ApplianceContext = createContext(initialState);

const reducer = (state, action) => {
    const { type, payload } = action;

    if (type === "ADD/UPDATE") {
        const existingItem = state.selectedAppliances.find(
            currentItem => currentItem.applianceID === payload.item.applianceID
        );

        if (!existingItem) {
            //  ADD
            const newSelectedAppliances = [...state.selectedAppliances, payload.item];

            const totalBill = newSelectedAppliances.reduce(
                (sum, item) => sum + item.applianceBill,
                0
            );
            return {
                ...state,
                totalBill,
                selectedAppliances: newSelectedAppliances,
            };
        }

        // UPDATE
        const mappedItems = state.selectedAppliances.map(currentItem => {
            if (currentItem.applianceID === existingItem.applianceID) {
                return payload.item;
            }

            return currentItem;
        });

        const totalBill = mappedItems.reduce((sum, item) => sum + item.applianceBill, 0);
        return { ...state, totalBill, selectedAppliances: mappedItems };
    }
};

export const ApplianceContextProvider = props => {
    const [state, dispatch] = useReducer(reducer, initialState);
    console.log(state);

    const addAppliance = item => {
        dispatch({ type: "ADD/UPDATE", payload: { item } });
    };

    const contextValue = {
        sarimaRate: state.sarimaRate,
        addAppliance,
        totalBill: state.totalBill,
        selectedAppliances: state.selectedAppliances,
    };

    return (
        <ApplianceContext.Provider value={contextValue}>{props.children}</ApplianceContext.Provider>
    );
};

export const useApplianceContext = () => useContext(ApplianceContext);
