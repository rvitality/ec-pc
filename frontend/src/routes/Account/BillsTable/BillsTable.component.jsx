import React from "react";

import "./BillsTable.styles.scss";

const BillsTable = ({ dataToDisplay }) => {
    return (
        <table className="data-table-bills table">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Month</th>
                    <th>Year</th>
                    <th>Predicted Bill</th>
                    <th>Actual Bill</th>
                    <th>Accuracy</th>
                </tr>
            </thead>
            <tbody>
                {dataToDisplay.map((log, index) => {
                    const { id, month, year, forecasted, actual, accuracy } = log;

                    const status = !accuracy
                        ? "neutral"
                        : accuracy >= 75
                        ? "good"
                        : accuracy > 50
                        ? "bad"
                        : "fail";

                    return (
                        <tr key={id}>
                            <td>{index + 1}</td>
                            <td className="capitalize">{month}</td>
                            <td>{year}</td>
                            <td>
                                ₱ {forecasted.toLocaleString("en", { maximumFractionDigits: 2 })}
                            </td>
                            <td>₱ {actual.toLocaleString("en", { maximumFractionDigits: 2 })}</td>
                            <td className={`status ${status}`}>{accuracy}%</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default BillsTable;
