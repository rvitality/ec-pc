import React from "react";

import "./PredictionsTable.styles.scss";

const PredictionsTable = ({ dataToDisplay }) => {
    return (
        <table className="table predictions-table data-logs">
            <thead>
                <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Month</th>
                    <th>Year</th>
                    <th>Predicted Bill</th>
                    <th>Actual Bill</th>
                    <th>Accuracy</th>
                </tr>
            </thead>
            <tbody>
                {dataToDisplay.map((user, index) => {
                    const { id, name, email, records, role, photoURL } = user;
                    const { month, year, actual, forecasted, accuracy } =
                        records.length > 0 ? records[records.length - 1] : {};

                    const status = !accuracy
                        ? "neutral"
                        : accuracy >= 75
                        ? "good"
                        : accuracy > 50
                        ? "bad"
                        : "fail";

                    return (
                        <tr key={id}>
                            <td className="photo">
                                <img src={photoURL} alt={name} referrerPolicy="no-referrer" />
                            </td>
                            <td className="capitalize">
                                <strong>{name}</strong>{" "}
                            </td>
                            <td className="capitalize">{month}</td>
                            <td>{year}</td>
                            <td>
                                ₱ {forecasted?.toLocaleString("en", { maximumFractionDigits: 2 })}
                            </td>
                            <td>₱ {actual?.toLocaleString("en", { maximumFractionDigits: 2 })}</td>
                            <td className={`status ${status}`}>{accuracy}%</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default PredictionsTable;
