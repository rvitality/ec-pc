import React from "react";

import DataTable from "../../../components/DataTable/DataTable.component";
import UsersTable from "../UsersTable/UsersTable.component";
import "./Users.styles.scss";

const Users = props => {
    const { error, isLoading, data: users } = props.response;

    return (
        <div className="users-container">
            {!error && isLoading ? (
                <h1>Loading...</h1>
            ) : (
                <DataTable data={users} Table={UsersTable} />
            )}
        </div>
    );
};

export default Users;
