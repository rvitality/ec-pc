import React, { useState, useReducer } from "react";
import Appliance from "../Appliance/Appliance.component";

import { IoMdAdd } from "react-icons/io";

import "./Calculator.styles.scss";
import { useApplianceContext } from "../../context/ApplianceContext";

const initialState = {
    totalBill: 0,
    selectedAppliances: [],
};

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

const Calculator = () => {
    const { setAppliances, sarimaRate } = useApplianceContext();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [applianceHolders, setApplianceHolders] = useState(Array(3).fill());

    const addAppliance = item => {
        dispatch({ type: "ADD/UPDATE", payload: { item } });
    };

    const newApplianceHolderHandler = () => {
        setApplianceHolders(prevState => [
            ...prevState,
            <Appliance
                key={prevState.length - 1}
                num={prevState.length}
                appliances={state.selectedAppliances}
                onAddAppliance={addAppliance}
                sarimaRate={sarimaRate}
            />,
        ]);
    };

    const submitDataHandler = e => {
        e.preventDefault();
        setAppliances(state.selectedAppliances);
    };

    return (
        <aside className="calcu">
            <h2>Calculator</h2>

            <form onSubmit={submitDataHandler}>
                {applianceHolders.map((_, index) => (
                    <Appliance
                        key={index}
                        num={index + 1}
                        appliances={state.selectedAppliances}
                        onAddAppliance={addAppliance}
                        sarimaRate={sarimaRate}
                    />
                ))}

                <button
                    className="calcu__btn add-btn"
                    type="button"
                    onClick={newApplianceHolderHandler}
                >
                    <IoMdAdd />
                </button>

                <div className="calcu__bottom">
                    <p className="formula">
                        Estimated kWH of an appliance (((wattage * (hours * 30 days) * quantity) /
                        1000) * SARIMA_RATE)
                    </p>

                    <button className="calcu__btn submit-btn" type="submit">
                        Submit
                    </button>
                </div>
            </form>
        </aside>
    );
};

export default Calculator;
