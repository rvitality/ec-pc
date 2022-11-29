import { useState, useEffect } from "react";

const useFetchAllRates = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [rates, setRates] = useState([]);

    // ! fetch last rate from csv file official rates
    useEffect(() => {
        const getLastRateData = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await fetch("https://ec-pc-flaskapi.onrender.com/api/get_rates");
                if (!response.ok) return "Failed to fetch rates!";
                const { rates } = await response.json();

                if (!rates) return;

                // we need to slice(1) because python pandas df returns the labels too ["Months", "Rates"]
                const formattedRates =
                    rates.length > 1
                        ? rates.slice(1).map(el => {
                              const [date, rate] = el;

                              const dateArr = date?.split("/");

                              const yr = +dateArr[0];
                              const month = +dateArr[1];
                              return { yr, x: month, y: +rate };
                          })
                        : [];

                setRates(formattedRates);
            } catch (err) {
                console.log(err.message);
                setError(err.message);
            }

            setLoading(false);
        };

        getLastRateData();
    }, []);

    const reqAllRatesResponse = {
        rates,
        error,
        loading,
    };

    return reqAllRatesResponse;
};

export default useFetchAllRates;
