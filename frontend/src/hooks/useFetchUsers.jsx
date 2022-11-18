import { useEffect } from "react";
import { useState } from "react";
import { getUsers } from "../utils/firebase.utils";

const useFetchUsers = () => {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);

    // ! FETCH USERS FROM FIRESTORE DB
    useEffect(() => {
        setIsLoading(true);
        const fetchBills = async () => {
            try {
                const response = await getUsers();
                if (response) {
                    setUsers(response);
                }
                // setUsers
            } catch (err) {
                setError(err.message);
                console.log(err.message);
            }

            setIsLoading(false);
        };
        fetchBills();
    }, []);

    return { error, isLoading, data: users };
};

export default useFetchUsers;
