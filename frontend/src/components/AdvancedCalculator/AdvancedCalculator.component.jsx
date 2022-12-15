import React, { useState, useReducer, useEffect } from "react";

import Tooltip from "../Tooltip/Tooltip.component";
import Appliance from "../Appliance/Appliance.component";

import { useAuthContext } from "../../context/AuthContext";
import { useApplianceContext } from "../../context/ApplianceContext";

import { getAppliancesAndDocuments, updateUserAppliances } from "../../utils/firebase.utils";

import { IoMdAdd } from "react-icons/io";

import "./AdvancedCalculator.styles.scss";

const initialState = {
    forecastedBill: 0,
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

            const forecastedBill = newSelectedAppliances.reduce(
                (sum, item) => sum + item.applianceBill,
                0
            );
            return {
                ...state,
                forecastedBill,
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

        const forecastedBill = mappedItems.reduce((sum, item) => sum + item.applianceBill, 0);
        return { ...state, forecastedBill, selectedAppliances: mappedItems };
    }

    if (type === "REPLACE") {
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
        const { filteredAppliances } = payload;
        // const { appliance } = payload;

        // const filteredAppliances = state.selectedAppliances.filter(
        //     item => item.applianceID !== appliance.applianceID
        // );

        return { ...state, selectedAppliances: filteredAppliances };
    }

    return initialState;
};

const AdvancedCalculator = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const { setAppliances, sarimaRate, setModalIsOpen } = useApplianceContext();
    const { user, setUserRecords, setUserAppliances } = useAuthContext();

    const [error, setError] = useState("");
    const [applianceOptions, setApplianceOptions] = useState([]);
    const [applianceHolders, setApplianceHolder] = useState(Array(3).fill(0));
    const [manualApplianceHolders, setManualApplianceHolders] = useState([]);

    // FETCH APPLIANCE OPTIONS
    useEffect(() => {
        const getCategoriesMap = async () => {
            const categoriesMap = await getAppliancesAndDocuments();
            setApplianceOptions(categoriesMap);
        };

        getCategoriesMap();
    }, []);

    const addAppliance = (previousAppliance = {}, currentAppliance = {}) => {
        const { applianceID: prevApplianceID } = previousAppliance;
        const { applianceID: currentApplianceID } = currentAppliance;

        // replace what is in the appliances array with a new one
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

    const removeAppliance = (appliance, manualNum = undefined) => {
        if (manualNum !== undefined) {
            setManualApplianceHolders(prevState =>
                prevState.filter(itemNum => itemNum !== manualNum)
            );
        }

        const filteredAppliances = state.selectedAppliances.filter(
            item => item.applianceID !== appliance.applianceID
        );

        setAppliances(filteredAppliances);

        dispatch({ type: "REMOVE", payload: { filteredAppliances } });
    };

    const submitDataHandler = e => {
        e.preventDefault();

        setModalIsOpen(true);

        setAppliances(state.selectedAppliances);

        // if (sarimaRate === 1 || !sarimaRate) {
        //     setError("Please wait for the Predicted Rate (SARIMA).");
        //     return;
        // }

        // ! =======================================

        const { id, selectedAppliances } = user;

        const currentSelectedAppliances = selectedAppliances || [];

        const newSelectedAppliances = [...currentSelectedAppliances, ...state.selectedAppliances];

        const filteredAppliances = newSelectedAppliances.filter((appliance, currentIndex, self) => {
            const applianceIndex = self.findLastIndex(
                el => el.applianceID === appliance.applianceID
            );

            if (currentIndex === applianceIndex) {
                return appliance;
            }
            return null;
        });

        updateUserAppliances({
            id,
            selectedAppliances: filteredAppliances,
        });
        setUserAppliances(filteredAppliances);

        // ! ================================
        const forecastedBill = filteredAppliances.reduce(
            (sum, item) => sum + item.applianceBill,
            0
        );

        if (!user.records || !filteredAppliances.length) return;

        if (user.records.length > 0) {
            const newRecords = [...user.records];
            const lastRecord = newRecords[newRecords.length - 1];
            lastRecord.forecasted = forecastedBill;
            setUserRecords(newRecords);
        }
    };

    return (
        <aside className="calcu">
            <div className="hours-info">
                <Tooltip
                    message="Your hours input will greatly affect the predicted bill output so we
                        encourage to do it with certainty."
                />
            </div>

            <h1 className="heading-secondary">Advanced Calculator</h1>

            <form onSubmit={submitDataHandler} className="calcu__form">
                {applianceHolders?.map((_, index) => (
                    <Appliance
                        key={index}
                        indexNum={index + 1}
                        appliances={state.selectedAppliances}
                        onAddAppliance={addAppliance}
                        onRemoveAppliance={removeAppliance}
                        sarimaRate={sarimaRate}
                        fetchedApplianceOptions={applianceOptions}
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
                    <div className="manual-info">
                        <Tooltip
                            message="If you know your appliance's specific wattage, we encourage you to
                    put it manually for more accurate prediction."
                        />
                    </div>

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
                        Estimated kWH of an appliance ((wattage * (hours * 30 days)) / 1000) *
                        SARIMA_RATE
                    </p>

                    <div className="submit-btn-container">
                        <button className="calcu__btn submit-btn" type="submit">
                            Submit
                        </button>
                        {sarimaRate === 1 && error && <p className="error">{error}</p>}
                    </div>
                </div>
            </form>
        </aside>
    );
};

export default AdvancedCalculator;
