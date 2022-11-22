import React from "react";

import useFetchUsers from "../../../hooks/useFetchUsers";

import Spinner from "../../../ui/Spinner/Spinner.ui";
import DataTable from "../../../components/DataTable/DataTable.component";
import UsersTable from "./UsersTable/UsersTable.component";
import "./Users.styles.scss";

const Users = () => {
    const { error, isLoading, data: users } = useFetchUsers();

    return (
        <div className="users-container">
            {!error && isLoading ? (
                <div className="loading-container">
                    <div className="loading-container__text">Loading...</div>
                    <Spinner />
                </div>
            ) : (
                <DataTable data={users} Table={UsersTable} />
            )}
        </div>
    );
};

export default Users;
