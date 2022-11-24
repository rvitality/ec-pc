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
                    <th>Forecasted Bill</th>
                    <th>Actual Bill</th>
                    <th>Accuracy</th>
                </tr>
            </thead>
            <tbody>
                {dataToDisplay.map((user, index) => {
                    const { id, name, email, records, role, photoURL } = user;
                    const { month, year, actual, forecasted, accuracy, status } =
                        records.length > 0 ? records[records.length - 1] : {};

                    return (
                        <tr key={id}>
                            <td className="photo">
                                <img src={photoURL} alt={name} referrerPolicy="no-referrer" />
                            </td>
                            <td>
                                <strong>{name}</strong>{" "}
                            </td>
                            <td>{month}</td>
                            <td>{year}</td>
                            <td>₱ {forecasted?.toLocaleString()}</td>
                            <td>₱ {actual?.toLocaleString()}</td>
                            <td className={`status ${status}`}>{accuracy}%</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default PredictionsTable;
