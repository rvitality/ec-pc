import { useEffect } from "react";
import { useState } from "react";
import { getUserData } from "../utils/firebase.utils";

const useFetchUserRecords = user => {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [records, setRecords] = useState([]);

    // ! FETCH USER BILLS FROM FIRESTORE DB
    useEffect(() => {
        setIsLoading(true);
        const fetchBills = async () => {
            try {
                if (user) {
                    const response = await getUserData(user.id);
                    if (response) {
                        setRecords(response.records);
                    }
                }
                // setRecords
            } catch (err) {
                setError(err.message);
                console.log(err.message);
            }

            setIsLoading(false);
        };
        fetchBills();
    }, []);

    return { error, isLoading, data: records };
};

export default useFetchUserRecords;
