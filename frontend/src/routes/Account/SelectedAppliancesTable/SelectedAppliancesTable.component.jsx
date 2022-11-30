import React from "react";

import "./SelectedAppliancesTable.styles.scss";

const SelectedAppliancesTable = ({ dataToDisplay }) => {
    return (
        <table className="data-table-bills table">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Wattage</th>
                    <th>Quantity</th>
                    <th>Durations (hr)</th>
                    <th>Cost</th>
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
                            <td>{wattage.toLocaleString()}</td>
                            <td>{quantity}</td>
                            <td>
                                {inputDurations.length > 7
                                    ? `${inputDurations.slice(0, 7).join(", ")} ...`
                                    : inputDurations.join(", ")}
                            </td>
                            <td>₱ {applianceBill.toLocaleString()}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default SelectedAppliancesTable;
