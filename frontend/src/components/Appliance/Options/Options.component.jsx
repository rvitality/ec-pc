import React from "react";

import { v4 as uuidv4 } from "uuid";

import { BsChevronRight } from "react-icons/bs";

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

const Options = ({ onSelectAppliance }) => {
    return (
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
                                                                onSelectAppliance({
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
                                            onSelectAppliance({
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
};

export default Options;
