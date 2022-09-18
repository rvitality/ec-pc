import React, { useEffect, useRef, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import { BsChevronUp } from "react-icons/bs";
import { BsChevronDown } from "react-icons/bs";
import { BsChevronRight } from "react-icons/bs";
import { AiFillCaretDown } from "react-icons/ai";

import "./Appliance.styles.scss";
import DurationInput from "./DurationInput/DurationInput.component";

const DUMMY_DATA = [
    {
        id: uuidv4(),
        category: "Cooling Equipment",
        data: [
            {
                id: uuidv4(),
                subCategory: "Airconditioning Unit",
                subData: [
                    {
                        applianceID: uuidv4(),
                        applianceName: "Airconditioning Unit (0.75 HP)",
                        wattage: 727,
                    },
                    {
                        applianceID: uuidv4(),
                        applianceName: "Airconditioning Unit (1.0 HP)",
                        wattage: 944,
                    },
                    {
                        applianceID: uuidv4(),
                        applianceName: "Airconditioning Unit (1.5 HP)",
                        wattage: 1252,
                    },
                    {
                        applianceID: uuidv4(),
                        applianceName: "Airconditioning Unit (2.0 HP)",
                        wattage: 1913,
                    },
                ],
            },
            {
                id: uuidv4(),
                subCategory: "Desk Fan",
                subData: [
                    {
                        applianceID: uuidv4(),
                        applianceName: 'Desk Fan 10"',
                        wattage: 50,
                    },
                    {
                        applianceID: uuidv4(),
                        applianceName: 'Desk Fan 12"',
                        wattage: 35,
                    },
                    {
                        applianceID: uuidv4(),
                        applianceName: 'Desk Fan 14"',
                        wattage: 55,
                    },
                    {
                        applianceID: uuidv4(),
                        applianceName: 'Desk Fan 16"',
                        wattage: 74,
                    },
                    {
                        applianceID: uuidv4(),
                        applianceName: 'Desk Fan 20"',
                        wattage: 175,
                    },
                ],
            },
            {
                applianceID: uuidv4(),
                applianceName: "Fan Box Type",
                wattage: 50,
            },
            {
                applianceID: uuidv4(),
                applianceName: "Air Cooler/Humidifier",
                wattage: 65,
            },
        ],
    },
    {
        id: uuidv4(),
        category: "Entertainment Systems",
        data: [
            {
                applianceID: uuidv4(),
                applianceName: "DVD/VCD Player",
                wattage: 300,
            },
            {
                applianceID: uuidv4(),
                applianceName: "Tape Recorder (Cassette)",
                wattage: 50,
            },
            {
                id: uuidv4(),
                subCategory: "T.V. Set",
                subData: [
                    {
                        applianceID: uuidv4(),
                        applianceName: 'T.V. Set Color 12"',
                        wattage: 65,
                    },
                    {
                        applianceID: uuidv4(),
                        applianceName: 'T.V. Set Color 18"',
                        wattage: 90,
                    },
                    {
                        applianceID: uuidv4(),
                        applianceName: 'T.V. Set Color 14"',
                        wattage: 85,
                    },
                    {
                        applianceID: uuidv4(),
                        applianceName: 'T.V. Set Color 16"',
                        wattage: 90,
                    },
                ],
            },
        ],
    },
];

const Appliance = ({ appliances = [], num, onAddAppliance, sarimaRate }) => {
    const prevSelectedAppliance = useRef();

    const [isExpanded, setIsExpanded] = useState(true);

    const [selectedAppliance, setSelectedAppliance] = useState({});
    const selectedApplianceExists = Object.keys(selectedAppliance).length > 0;

    const [quantity, setQuantity] = useState(1);
    const [durationElements, setDurationElements] = useState(Array(quantity).fill());
    console.log("durationElements: ", durationElements);

    const [inputDurations, setInputDurations] = useState([]);
    console.log("inputDurations:", inputDurations);
    const totalDuration = inputDurations.reduce((sum, num) => sum + num, 0);
    console.log("totalDuration: ", totalDuration);

    const [appliancesOptions, setAppliancesOptions] = useState();
    const [message, setMessage] = useState({});
    const showMessage = Object.keys(message).length > 0;

    const [applyToAllDuration, setApplyToAllDuration] = useState(false);

    const selectApplianceHandler = appliance => {
        const existingAppliance = appliances.find(
            item => item.applianceID === appliance.applianceID
        );

        if (existingAppliance) {
            setMessage({ status: "error", msg: "Appliance already exists." });
            return;
        }

        setSelectedAppliance(appliance);

        const { wattage } = appliance;
        const applianceBill = ((wattage * (totalDuration * 30) * quantity) / 1000) * sarimaRate;

        const previousAppliance = prevSelectedAppliance.current;

        const currentAppliance = {
            ...appliance,
            quantity,
            duration: totalDuration === 0 ? 1 : totalDuration,
            applianceBill,
        };

        prevSelectedAppliance.current = currentAppliance;
        onAddAppliance(previousAppliance, currentAppliance);
    };

    const quantityInputChangeHandler = e => {
        const inputValue = +e.target.value;

        setQuantity(inputValue);

        const { wattage } = selectedAppliance;

        const applianceBill = ((wattage * (totalDuration * 30) * inputValue) / 1000) * sarimaRate;

        const previousAppliance = prevSelectedAppliance.current;

        // ! if the durations hasn't been touched or left their values with 1
        if (!inputDurations.find(num => num > 1)) {
            setInputDurations(Array(inputValue).fill(1));
        } else {
            // ! if changes are made in the duration inputs
            // ! keep only the range based on the `quantity` input value
            setInputDurations(prevState => prevState.slice(0, inputValue));
        }

        setDurationElements(Array(inputValue).fill());

        const currentAppliance = {
            ...selectedAppliance,
            quantity: inputValue,
            duration: totalDuration === 0 ? inputValue : totalDuration,
            applianceBill,
        };

        prevSelectedAppliance.current = currentAppliance;
        onAddAppliance(previousAppliance, currentAppliance);
    };

    const durationChangeInputHandler = (num, durationValue) => {
        setInputDurations(prevState => {
            prevState[num] = durationValue;
            return prevState;
        });

        // ! these codes are necessary because we need the updated `totalDurations` based on the `durationValue`
        // ! if we rely on the `totalDurations` above, we will get the old value because `setInputDurations` is called inside this function
        // ! and will rerender this component with the updated `totalDurations`
        // ! but before that happens, the setting of the updated duration is already made
        // ! code -> duration: newTotalDurations,
        // ! and `onAddAppliance` is already called before we even receive the updated `totalDurations`

        // ! thus, we need to compute the new update `totalDurations` below ourselves
        const inputDurationsCopy = [...inputDurations];
        inputDurationsCopy[num] = durationValue;
        const newTotalDurations = inputDurationsCopy.reduce((sum, duration) => sum + duration, 0);

        const { wattage } = selectedAppliance;

        const applianceBill = ((wattage * (totalDuration * 30) * quantity) / 1000) * sarimaRate;

        const previousAppliance = prevSelectedAppliance.current;

        const currentAppliance = {
            ...selectedAppliance,
            duration: newTotalDurations,
            applianceBill,
        };

        prevSelectedAppliance.current = currentAppliance;
        onAddAppliance(previousAppliance, currentAppliance);
    };

    const applyToAllDurationHandler = e => {
        setApplyToAllDuration(e.target.checked);

        if (e.target.checked) {
            setInputDurations(prevState => prevState.slice(0, 1));
            setDurationElements(Array(1).fill());
        } else {
            setInputDurations(prevState => [prevState[0], ...Array(quantity - 1).fill(1)]);
            setDurationElements(Array(quantity).fill());
        }

        // console.log(applyToAllDuration);
    };

    const applianceChoices = (
        <ul className="lvl1">
            {DUMMY_DATA.map(({ id, category, data }) => {
                return (
                    <li key={id}>
                        <h3>
                            {category}
                            <BsChevronRight />
                        </h3>

                        <ul className="lvl2">
                            {data.map(itemData => {
                                const {
                                    id,
                                    applianceID,
                                    subCategory,
                                    subData,
                                    applianceName,
                                    wattage,
                                } = itemData;

                                if (subData) {
                                    return (
                                        <li key={id}>
                                            <h3>
                                                {subCategory}
                                                <BsChevronRight />
                                            </h3>

                                            <ul className="lvl3">
                                                {subData.map(
                                                    ({ applianceID, applianceName, wattage }) => (
                                                        <li
                                                            key={applianceID}
                                                            onClick={() =>
                                                                selectApplianceHandler({
                                                                    applianceID,
                                                                    applianceName,
                                                                    wattage,
                                                                })
                                                            }
                                                        >
                                                            <h3>{applianceName}</h3>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </li>
                                    );
                                }

                                return (
                                    <li
                                        key={applianceID}
                                        onClick={() =>
                                            selectApplianceHandler({
                                                applianceID,
                                                applianceName,
                                                wattage,
                                            })
                                        }
                                    >
                                        <h3>{applianceName}</h3>
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                );
            })}
        </ul>
    );

    useEffect(() => {
        if (Object.keys(message).length === 0) return;

        const timeout = setTimeout(() => {
            setMessage({});
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
                    onClick={e => setAppliancesOptions(applianceChoices)}
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
                                                    id="apply-to-all"
                                                />
                                                <label htmlFor="apply-to-all">Apply to all</label>
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
                        onClick={() => setIsExpanded(prevState => !prevState)}
                    >
                        {isExpanded ? (
                            <span>
                                Collapse <BsChevronUp />
                            </span>
                        ) : (
                            <span>
                                Expand <BsChevronDown />
                            </span>
                        )}
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
