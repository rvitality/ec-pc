import React from "react";

import "./BillsTable.styles.scss";

const BillsTable = ({ dataToDisplay }) => {
    return (
        <table className="data-bills">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Month</th>
                    <th>Year</th>
                    <th>Forecasted Bill</th>
                    <th>Actual Bill</th>
                    <th>Accuracy</th>
                </tr>
            </thead>
            <tbody>
                {dataToDisplay.map((log, index) => {
                    const { id, month, year, forecasted, actual, accuracy, status } = log;

                    return (
                        <tr key={id}>
                            <td>{index + 1}</td>
                            <td>{month}</td>
                            <td>{year}</td>
                            <td>₱ {forecasted.toLocaleString()}</td>
                            <td>₱ {actual.toLocaleString()}</td>
                            <td className={`status ${status}`}>{accuracy}%</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default BillsTable;
