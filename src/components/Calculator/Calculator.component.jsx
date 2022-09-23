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
                return { ...currentItem, ...payload.item };
            }

            return currentItem;
        });

        const totalBill = mappedItems.reduce((sum, item) => sum + item.applianceBill, 0);
        return { ...state, totalBill, selectedAppliances: mappedItems };
    }

    if (type === "REPLACE") {
        console.log("REPLACE");
        const { previousAppliance, newAppliance, sarimaRate } = payload;

        const { wattage, quantity, duration } = newAppliance;

        const applianceBill = ((wattage * (quantity * 30) * duration) / 1000) * sarimaRate;

        const newModifiedAppliance = {
            ...newAppliance,
            quantity,
            duration,
            applianceBill,
        };

        const newAppliances = state.selectedAppliances.map(item => {
            if (item.applianceID === previousAppliance.applianceID) {
                return newModifiedAppliance;
            }

            return item;
        });

        return { ...state, selectedAppliances: newAppliances };
    }

    if (type === "REMOVE") {
        const { appliance } = payload;
        console.log(appliance.applianceName);

        const filteredAppliances = state.selectedAppliances.filter(
            item => item.applianceID !== appliance.applianceID
        );

        return { ...state, selectedAppliances: filteredAppliances };
    }

    return initialState;
};

const Calculator = () => {
    const { setAppliances, sarimaRate } = useApplianceContext();
    const [state, dispatch] = useReducer(reducer, initialState);

    const [applianceHolders, setApplianceHolder] = useState(Array(3).fill(0));
    const [manualApplianceHolders, setManualApplianceHolders] = useState([]);

    // console.log(state.selectedAppliances);

    const addAppliance = (previousAppliance = {}, currentAppliance = {}) => {
        // console.log("previousAppliance: ", previousAppliance);
        // console.log("currentAppliance: ", currentAppliance);

        const { applianceID: prevApplianceID } = previousAppliance;
        const { applianceID: currentApplianceID } = currentAppliance;

        // replace what is in the appliances array if the user the appliance with a new one
        if (prevApplianceID && prevApplianceID !== currentApplianceID) {
            dispatch({
                type: "REPLACE",
                payload: { previousAppliance, newAppliance: currentAppliance, sarimaRate },
            });
        } else {
            // update here means same appliance but different quantity or duration
            dispatch({ type: "ADD/UPDATE", payload: { item: currentAppliance } });
        }
    };

    const newApplianceHolderHandler = () => {
        setApplianceHolder(prevState => [...prevState, 0]);
    };

    const newManualApplianceHolderHandler = () => {
        setManualApplianceHolders(prevState => {
            const lastValue = parseInt(prevState.slice(-1)) + 1;
            const toAddValue = isNaN(lastValue) ? 0 : lastValue;
            return [...prevState, toAddValue];
        });
    };

    const removeAppliance = (appliance, num = undefined) => {
        if (num !== undefined) {
            setManualApplianceHolders(prevState => {
                return prevState.filter(itemNum => {
                    console.log(itemNum, num);
                    return itemNum !== num;
                });
            });
        }

        dispatch({ type: "REMOVE", payload: { appliance } });
    };

    const submitDataHandler = e => {
        e.preventDefault();
        console.log("submit");
        setAppliances(state.selectedAppliances);
    };

    return (
        <aside className="calcu">
            <h2>Calculator</h2>

            <form onSubmit={submitDataHandler}>
                {applianceHolders?.map((_, index) => (
                    <Appliance
                        key={index}
                        num={index + 1}
                        appliances={state.selectedAppliances}
                        onAddAppliance={addAppliance}
                        onRemoveAppliance={removeAppliance}
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

                <div className="manual-input-container">
                    <h3>Manual Input:</h3>
                    <p className="note">
                        Add a <b>new</b> appliance if it's not included with the provided ones.
                    </p>

                    {manualApplianceHolders.map(num => (
                        <Appliance
                            key={num}
                            manualNum={num}
                            manual={true}
                            appliances={state.selectedAppliances}
                            onAddAppliance={addAppliance}
                            onRemoveAppliance={removeAppliance}
                            sarimaRate={sarimaRate}
                        />
                    ))}

                    <button
                        type="button"
                        className="new-btn"
                        onClick={newManualApplianceHolderHandler}
                    >
                        New
                    </button>
                </div>

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
