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
    const [selectedAppliance, setSelectedAppliance] = useState({});
    const selectedApplianceExists = Object.keys(selectedAppliance).length > 0;

    const [actionType, setActionType] = useState("add");

    const [appliancesOptions, setAppliancesOptions] = useState();
    const [message, setMessage] = useState({});

    const quantityRef = useRef();
    const durationRef = useRef();

    const existingAppliance = appliances.find(
        item => item.applianceID === selectedAppliance.applianceID
    );

    const selectApplianceHandler = appliance => {
        setSelectedAppliance(appliance);

        // if user selects new appliance
        setActionType("add");

        if (quantityRef.current && durationRef.current) {
            quantityRef.current.value = "";
            durationRef.current.value = "";
        }
    };

    const submitHandler = e => {
        e.preventDefault();

        const quantity = +quantityRef.current.value || 1;
        const hours = +durationRef.current.value || 1;

        if (existingAppliance && actionType === "add") {
            setMessage({ status: "error", msg: "Appliance already added." });
            return;
        }

        if (quantity && hours) {
            const { wattage } = selectedAppliance;

            const applianceBill = ((wattage * (hours * 30) * quantity) / 1000) * sarimaRate;

            if (actionType === "add") {
                setMessage({ status: "success", msg: "Appliance added successfully." });
                setActionType("update");
            } else {
                setMessage({ status: "success", msg: "Appliance updated successfully." });
            }

            onAddAppliance({ ...selectedAppliance, quantity, hours, applianceBill });
        }
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
        if (Object.keys(message).length === 0 || message.status === "error") return;

        const timeout = setTimeout(() => {
            setMessage({});
        }, 1500);

        return () => {
            clearTimeout(timeout);
        };
    }, [message]);

    return (
        <div className="appliance">
            <div className="appliance__selection">
                <button
                    className="calcu__btn appliance__btn"
                    onClick={() => setAppliancesOptions(applianceChoices)}
                >
                    {selectedApplianceExists
                        ? selectedAppliance.applianceName
                        : `Appliance #${num}`}
                    <AiFillCaretDown />
                </button>
                {appliancesOptions && <div className="appliance__options">{appliancesOptions}</div>}
            </div>

            {selectedApplianceExists && (
                <form onSubmit={submitHandler}>
                    <div className="inputs">
                        <div className="form-control">
                            <label htmlFor="quantity">Quantity: </label>
                            <input
                                ref={quantityRef}
                                type="number"
                                id="quantity"
                                min={0}
                                max={25}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label htmlFor="duration">Duration(hr): </label>
                            <input
                                ref={durationRef}
                                type="number"
                                id="duration"
                                min={0}
                                max={25}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit">{actionType}</button>
                </form>
            )}

            {Object.keys(message).length > 0 && (
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
