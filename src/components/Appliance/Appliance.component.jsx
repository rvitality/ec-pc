import React, { useEffect, useRef, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import { BsChevronRight } from "react-icons/bs";
import { AiFillCaretDown } from "react-icons/ai";

import "./Appliance.styles.scss";

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

    const [selectedAppliance, setSelectedAppliance] = useState({});
    const selectedApplianceExists = Object.keys(selectedAppliance).length > 0;

    const [quantity, setQuantity] = useState(1);
    const [duration, setDuration] = useState(1);

    const [appliancesOptions, setAppliancesOptions] = useState();
    const [message, setMessage] = useState({});
    const showMessage = Object.keys(message).length > 0;

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
        const applianceBill = ((wattage * (duration * 30) * quantity) / 1000) * sarimaRate;

        const previousAppliance = prevSelectedAppliance.current;

        const currentAppliance = {
            ...appliance,
            quantity,
            duration,
            applianceBill,
        };

        prevSelectedAppliance.current = currentAppliance;
        onAddAppliance(previousAppliance, currentAppliance);
    };

    const inputBlurHandler = (event, type) => {
        const inputValue = event.target.value;

        const { wattage } = selectedAppliance;

        const applianceBill = ((wattage * (duration * 30) * quantity) / 1000) * sarimaRate;

        const previousAppliance = prevSelectedAppliance.current;

        const currentAppliance = {
            ...selectedAppliance,
            [type]: +inputValue,
            applianceBill,
        };

        prevSelectedAppliance.current = currentAppliance;
        onAddAppliance(previousAppliance, currentAppliance);
    };

    // const quantityBlurHandler = e => {
    //     const quantityInputValue = e.target.value;

    //     const { wattage } = selectedAppliance;
    //     const applianceBill =
    //         ((wattage * (duration * 30) * quantityInputValue) / 1000) * sarimaRate;

    //     const previousAppliance = prevSelectedAppliance.current;

    //     const currentAppliance = {
    //         ...selectedAppliance,
    //         quantity: quantityInputValue,
    //         duration,
    //         applianceBill,
    //     };
    //     prevSelectedAppliance.current = currentAppliance;

    //     onAddAppliance(previousAppliance, currentAppliance);
    // };

    // const durationBlurHandler = e => {
    //     const durationInputValue = e.target.value;

    //     const { wattage } = selectedAppliance;
    //     const applianceBill =
    //         ((wattage * (durationInputValue * 30) * quantity) / 1000) * sarimaRate;
    //     onAddAppliance({
    //         ...selectedAppliance,
    //         quantity,
    //         duration: durationInputValue,
    //         applianceBill,
    //     });
    // };

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
                    <div className="form-control">
                        <label htmlFor="quantity">Quantity: </label>
                        <input
                            type="number"
                            id="quantity"
                            min={0}
                            max={25}
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                            onBlur={e => inputBlurHandler(e, "quantity")}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label htmlFor="duration">Duration(hr): </label>
                        <input
                            type="number"
                            id="duration"
                            min={0}
                            max={25}
                            value={duration}
                            onChange={e => setDuration(e.target.value)}
                            onBlur={e => inputBlurHandler(e, "duration")}
                            required
                        />
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
