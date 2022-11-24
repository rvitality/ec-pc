import { useState, useEffect } from "react";

const useFetchLastRate = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [currentOfficialRate, setCurrentOfficialRate] = useState([]);
    const date = (currentOfficialRate && currentOfficialRate[0]) || 0;
    const rate = (currentOfficialRate && +currentOfficialRate[1]) || 0;

    // ! fetch last rate from csv file official rates
    useEffect(() => {
        const getLastRateData = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await fetch("/api/get_last_rate_data");
                if (!response.ok) return "Failed to fetch last rate data.";
                const data = await response.json();
                // console.log(data);
                const { last_rate_data } = data;
                setCurrentOfficialRate(last_rate_data);
            } catch (err) {
                console.log(err.message);
                setError(err.message);
            }

            setLoading(false);
        };

        getLastRateData();
    }, []);

    const lastRate = {
        date,
        rate,
        loading,
        error,
        value: currentOfficialRate,
    };

    return lastRate;
};

export default useFetchLastRate;
