import React from "react";

import { TiEdit } from "react-icons/ti";
import { MdDelete } from "react-icons/md";

import { useAuthContext } from "../../../context/AuthContext";
import { updateUserAppliances } from "../../../utils/firebase.utils";

import "./SelectedAppliancesTable.styles.scss";

const SelectedAppliancesTable = ({ dataToDisplay }) => {
    const { user, setUserAppliances, setUserRecords } = useAuthContext();

    // const updateApplianceHandler = appliance => {
    //     console.log(appliance);
    // };

    const deleteApplianceHandler = appliance => {
        const modifiedAppliances = user.selectedAppliances?.filter(
            currentAppliance => currentAppliance.applianceID !== appliance.applianceID
        );

        setUserAppliances(modifiedAppliances);

        updateUserAppliances({ id: user.id, selectedAppliances: modifiedAppliances });

        const forecastedBill = modifiedAppliances.reduce(
            (sum, item) => sum + item.applianceBill,
            0
        );

        if (!user.records || !modifiedAppliances.length) return;

        if (user.records.length > 0) {
            const newRecords = [...user.records];
            const lastRecord = newRecords[newRecords.length - 1];
            lastRecord.forecasted = forecastedBill;
            setUserRecords(newRecords);
        }
    };

    return (
        <table className="selected-appliances table">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Wattage</th>
                    <th>Quantity</th>
                    <th>Durations (hr)</th>
                    <th>Cost</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {dataToDisplay.map((log, index) => {
                    const {
                        applianceID,
                        applianceName,
                        applianceBill,
                        inputDurations,
                        quantity,
                        wattage,
                    } = log;

                    return (
                        <tr key={applianceID}>
                            <td>{index + 1}</td>
                            <td className="capitalize">{applianceName}</td>
                            <td>{wattage.toLocaleString("en", { maximumFractionDigits: 2 })}</td>
                            <td>{quantity}</td>
                            <td>
                                {inputDurations.length > 7
                                    ? `${inputDurations.slice(0, 7).join(", ")} ...`
                                    : inputDurations.join(", ")}
                            </td>
                            <td>
                                ₱ {applianceBill.toLocaleString("en", { maximumFractionDigits: 2 })}
                            </td>
                            <td>
                                <div className="actions">
                                    {/* <a
                                        href="#new-product"
                                        onClick={updateApplianceHandler.bind(null, log)}
                                        title="Edit"
                                        className="actions__edit"
                                    >
                                        <TiEdit />
                                    </a> */}
                                    <button
                                        title="Delete"
                                        onClick={() => deleteApplianceHandler(log)}
                                        className="actions__del"
                                    >
                                        <MdDelete />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default SelectedAppliancesTable;
