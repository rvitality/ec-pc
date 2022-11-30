import React from "react";

import useFetchCollections from "../../../hooks/useFetchCollections";

import Spinner from "../../../ui/Spinner/Spinner.ui";
import DataTable from "../../../components/DataTable/DataTable.component";
import UsersTable from "./UsersTable/UsersTable.component";
import "./Users.styles.scss";

const Users = () => {
    const filterBySearchHandler = (data, inputValue) => {
        if (!data) return;

        return data.filter(user => {
            const { email, name, role } = user;
            return (
                email.toLowerCase().includes(inputValue) ||
                name.toLowerCase().includes(inputValue) ||
                role.toLowerCase().includes(inputValue)
            );
        });
    };

    const reqCollectionsResponse = useFetchCollections("users");
    const { error, isLoading, collections: users } = reqCollectionsResponse;

    return (
        <div className="users-container">
            {!error && isLoading ? (
                <div className="loading-container">
                    <div className="loading-container__text">Loading...</div>
                    <Spinner />
                </div>
            ) : (
                <DataTable
                    data={users || []}
                    Table={UsersTable}
                    onFilterBySearch={filterBySearchHandler}
                />
            )}
        </div>
    );
};

export default Users;
