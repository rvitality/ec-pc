import React, { useEffect, useRef, useState } from "react";

import { AiFillCaretDown } from "react-icons/ai";

import "./Appliance.styles.scss";
import DurationInput from "./DurationInput/DurationInput.component";
import { useReducer } from "react";
import Options from "./Options/Options.component";

const initialState = {
    sarimaRate: 8,
    selectedAppliance: {},
    applyAll: false,
    quantity: 1,
    duration: 1,
    totalDuration: 1,
    isExpanded: true,
    isAppliedToAllDuration: false,
    durationElements: Array(1).fill(),
    inputDurations: [],
    message: { status: "", msg: "" },
};

const reducer = (state, action) => {
    const { type, payload } = action;

    if (type === "SELECT_APPLIANCE") {
        const { appliance, appliances } = payload;

        const existingAppliance = appliances.find(
            item => item.applianceID === appliance.applianceID
        );

        if (existingAppliance) {
            return { ...state, message: { status: "error", msg: "Appliance already exists." } };
        }

        // return {...state, appliance}
        // setSelectedAppliance(appliance);

        return { ...state, selectedAppliance: appliance };
    }

    if (type === "RESET_MSG") {
        return { ...state, message: initialState.message };
    }

    if (type === "TOGGLE_EXPANDED") {
        return { ...state, isExpanded: !state.isExpanded };
    }

    if (type === "APPLY_TO_ALL_DURATION") {
        return { ...state, isAppliedToAllDuration: !state.isAppliedToAllDuration };
    }

    if (type === "SET_DURATION_ELEMENTS") {
        const { count } = payload;
        return { ...state, durationElements: Array(count).fill() };
    }

    if (type === "SET_INPUT_DURATIONS") {
        const { newInputDurations, computedTotalDuration } = payload;

        // ! this value is multiplied with `quantity`
        let newTotalDuration = computedTotalDuration;

        if (!computedTotalDuration && !state.isAppliedToAllDuration) {
            newTotalDuration = newInputDurations.reduce((total, num) => total + num, 0);
        }

        return { ...state, totalDuration: newTotalDuration, inputDurations: newInputDurations };
    }

    return state;
};

const getCurrentAppliance = ({ selectedAppliance, duration, quantity, sarimaRate }) => {
    const { wattage } = selectedAppliance;
    const applianceBill = ((wattage * (duration * 30) * quantity) / 1000) * sarimaRate;

    return {
        ...selectedAppliance,
        quantity,
        duration,
        applianceBill,
    };
};

const Appliance = ({ appliances = [], num, onAddAppliance, sarimaRate }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {
        inputDurations,
        totalDuration,
        durationElements,
        selectedAppliance,
        message,
        isExpanded,
        isAppliedToAllDuration,
    } = state;

    const selectedApplianceExists = Object.keys(selectedAppliance).length > 0;
    const showMessage = Object.keys(message).length > 0;

    const prevSelectedAppliance = useRef();

    const [quantity, setQuantity] = useState(1);

    const [appliancesOptions, setAppliancesOptions] = useState();

    const selectApplianceHandler = appliance => {
        const previousAppliance = prevSelectedAppliance.current;

        const currentAppliance = getCurrentAppliance({
            selectedAppliance: appliance,
            duration: previousAppliance ? previousAppliance.duration : 1,
            quantity: previousAppliance ? previousAppliance.quantity : 1,
            sarimaRate,
        });

        prevSelectedAppliance.current = currentAppliance;
        onAddAppliance(previousAppliance, currentAppliance);

        dispatch({
            type: "SELECT_APPLIANCE",
            payload: { appliance, appliances },
        });
    };

    const quantityInputChangeHandler = e => {
        const inputValue = +e.target.value;
        setQuantity(inputValue);

        let newInputDurations = [...inputDurations];
        let newTotalDurations = 0;

        if (!isAppliedToAllDuration) {
            dispatch({ type: "SET_DURATION_ELEMENTS", payload: { count: inputValue } });

            // ! if the durations hasn't been touched
            if (!inputDurations.find(num => num > 1)) {
                newInputDurations = Array(inputValue).fill(1);
            } else {
                // ! keep only the range of `duration inputs` based on the `quantity`  value

                if (inputValue > newInputDurations.length) {
                    newInputDurations = [...newInputDurations, 1];
                } else {
                    newInputDurations = newInputDurations.slice(0, inputValue);
                }
            }

            newTotalDurations = newInputDurations.reduce((total, num) => total + num, 0);
            dispatch({
                type: "SET_INPUT_DURATIONS",
                payload: { newInputDurations },
            });
        } else {
            newTotalDurations = newInputDurations[0] * inputValue;

            dispatch({
                type: "SET_INPUT_DURATIONS",
                payload: { newInputDurations, computedTotalDuration: newTotalDurations },
            });
        }

        const previousAppliance = prevSelectedAppliance.current;

        const currentAppliance = getCurrentAppliance({
            selectedAppliance,
            duration: newTotalDurations,
            quantity: inputValue,
            sarimaRate,
        });

        prevSelectedAppliance.current = currentAppliance;

        onAddAppliance(previousAppliance, currentAppliance);
    };

    const durationChangeInputHandler = (num, durationValue) => {
        let newInputDurations = [...inputDurations];
        newInputDurations[num] = durationValue;

        let newTotalDurations = newInputDurations.reduce((sum, duration) => sum + duration, 0);

        if (!isAppliedToAllDuration) {
            dispatch({
                type: "SET_INPUT_DURATIONS",
                payload: { newInputDurations },
            });
        } else {
            newTotalDurations = newInputDurations[0] * quantity;

            dispatch({
                type: "SET_INPUT_DURATIONS",
                payload: { newInputDurations, computedTotalDuration: newTotalDurations },
            });
        }

        const previousAppliance = prevSelectedAppliance.current;

        const currentAppliance = getCurrentAppliance({
            selectedAppliance,
            duration: newTotalDurations,
            quantity,
            sarimaRate,
        });

        prevSelectedAppliance.current = currentAppliance;
        onAddAppliance(previousAppliance, currentAppliance);
    };

    const applyToAllDurationHandler = e => {
        dispatch({ type: "APPLY_TO_ALL_DURATION" });

        let newInputDurations = [...inputDurations];
        let newTotalDurations = 0;

        // ! IF `APPLY ALL` IS APPLIED
        if (e.target.checked) {
            dispatch({ type: "SET_DURATION_ELEMENTS", payload: { count: 1 } });

            // we need to assign it like this, because of the reduce function
            newInputDurations = [newInputDurations[0]];

            //  ! multiply it to `quantity`, that's the main logic of `apply all`
            newTotalDurations = newInputDurations[0] * quantity;

            dispatch({
                type: "SET_INPUT_DURATIONS",
                payload: { newInputDurations, computedTotalDuration: newTotalDurations },
            });
        } else {
            dispatch({ type: "SET_DURATION_ELEMENTS", payload: { count: quantity } });

            newInputDurations = [newInputDurations[0], ...Array(quantity - 1).fill(1)];
            newTotalDurations = newInputDurations.reduce((total, num) => total + num, 0);

            dispatch({
                type: "SET_INPUT_DURATIONS",
                payload: { newInputDurations },
            });
        }

        const previousAppliance = prevSelectedAppliance.current;

        const currentAppliance = getCurrentAppliance({
            selectedAppliance,
            duration: newTotalDurations,
            quantity,
            sarimaRate,
        });

        prevSelectedAppliance.current = currentAppliance;
        onAddAppliance(previousAppliance, currentAppliance);
    };

    const setAppliancesOptionHandler = () => {
        const { wattage } = selectedAppliance;

        const applianceBill = ((wattage * (totalDuration * 30) * quantity) / 1000) * sarimaRate;

        setAppliancesOptions(
            <Options
                quantity={quantity}
                duration={totalDuration}
                applianceBill={applianceBill}
                onSelectAppliance={selectApplianceHandler}
            />
        );
    };

    useEffect(() => {
        if (Object.keys(message).length === 0) return;

        const timeout = setTimeout(() => {
            dispatch({ type: "RESET_MSG" });
        }, 2000);

        return () => {
            clearTimeout(timeout);
        };
    }, [message]);

    return (
        <div className="appliance">
            <div className="appliance__selection">
                <button
                    type="button"
                    className="calcu__btn appliance__btn"
                    onClick={setAppliancesOptionHandler}
                >
                    {selectedApplianceExists
                        ? selectedAppliance.applianceName
                        : `Appliance #${num}`}
                    <AiFillCaretDown />
                </button>
                {appliancesOptions && <div className="appliance__options">{appliancesOptions}</div>}
            </div>

            {selectedApplianceExists && (
                <div className="extra-inputs">
                    <div className={`top  ${!isExpanded ? "hide" : ""}`}>
                        <div className="form-control quantity">
                            <label htmlFor="quantity">Quantity: </label>
                            <input
                                type="number"
                                id="quantity"
                                min={1}
                                max={25}
                                value={quantity}
                                onChange={quantityInputChangeHandler}
                                required
                            />
                        </div>

                        <div className="durations-container">
                            {durationElements.map((_, index) => {
                                if (index === 0) {
                                    return (
                                        <React.Fragment key={index}>
                                            <DurationInput
                                                key={index}
                                                num={index}
                                                onChangeInputHander={durationChangeInputHandler}
                                            />
                                            <div className="apply-to-all">
                                                <input
                                                    onChange={applyToAllDurationHandler}
                                                    type="checkbox"
                                                    name=""
                                                    id={selectedAppliance.applianceID}
                                                />
                                                <label htmlFor={selectedAppliance.applianceID}>
                                                    Apply to all
                                                </label>
                                            </div>
                                        </React.Fragment>
                                    );
                                }

                                return (
                                    <DurationInput
                                        key={index}
                                        num={index}
                                        onChangeInputHander={durationChangeInputHandler}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div
                        className="trigger-expand"
                        onClick={() => {
                            dispatch({ type: "TOGGLE_EXPANDED" });
                        }}
                    >
                        {isExpanded ? <span>Collapse</span> : <span>Expand</span>}
                    </div>
                </div>
            )}

            {showMessage && (
                <p
                    style={{
                        color: `${message.status === "success" ? "#00C24E" : "red"}`,
                        fontStyle: "italic",
                    }}
                >
                    {message.msg}
                </p>
            )}
        </div>
    );
};

export default Appliance;
