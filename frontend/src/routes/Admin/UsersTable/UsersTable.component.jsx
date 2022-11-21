import React from "react";

import "./UsersTable.styles.scss";

const UsersTable = ({ dataToDisplay }) => {
    return (
        <table className="table users-table data-logs">
            <thead>
                <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                {dataToDisplay.map((user, index) => {
                    const { id, name, email, role, photoURL } = user;

                    return (
                        <tr key={id}>
                            <td className="photo">
                                <img src={photoURL} alt={name} referrerPolicy="no-referrer" />
                            </td>
                            <td>
                                <strong>{name}</strong>{" "}
                            </td>
                            <td>{email}</td>
                            <td className="role">{role}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default UsersTable;
