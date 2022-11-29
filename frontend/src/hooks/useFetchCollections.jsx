import { useEffect } from "react";
import { useState } from "react";
import { getCollections } from "../utils/firebase.utils";

const useFetchCollections = collectionName => {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        const fetchCollections = async () => {
            try {
                const response = await getCollections(collectionName);
                if (!response) return;

                if (collectionName === "predictedRates") {
                    const receivedPredictedRates = response[0]?.predictedRates || [];
                    setCollections(receivedPredictedRates);
                } else {
                    setCollections(response);
                }
            } catch (err) {
                setError(err.message);
                console.log(err.message);
            }

            setIsLoading(false);
        };
        fetchCollections();
    }, []);

    const reqCollectionsResponse = {
        error,
        isLoading,
        collections,
    };

    return reqCollectionsResponse;
};

export default useFetchCollections;
