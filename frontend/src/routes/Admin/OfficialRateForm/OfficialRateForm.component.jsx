import React, { useRef, useState } from "react";
import { useEffect } from "react";

import { useApplianceContext } from "../../../context/ApplianceContext";
import useFetchLastRate from "../../../hooks/useFetchLastRate";

import Spinner from "../../../ui/Spinner/Spinner.ui";

import "./OfficialRateForm.styles.scss";

const OfficialRateForm = () => {
    const receivedLastRate = useFetchLastRate();
    const { value } = receivedLastRate || {};

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [currentOfficialRate, setCurrentOfficialRate] = useState(value);
    const date = (currentOfficialRate && currentOfficialRate[0]) || 0;
    const rate = (currentOfficialRate && +currentOfficialRate[1]) || 0;

    const { setSarimaRate } = useApplianceContext();
    const rateInputRef = useRef();

    const currentDate = new Date();
    const monthLong = currentDate.toLocaleDateString("en-US", { month: "long" });
    const day = currentDate.getDate();
    const yr = currentDate.getFullYear();

    useEffect(() => {
        setCurrentOfficialRate(receivedLastRate.value);
    }, [receivedLastRate.rate]);

    const submitHanlder = e => {
        e.preventDefault();

        const rateInput = rateInputRef.current?.value;
        setCurrentOfficialRate(prevState => {
            prevState[prevState.length - 1] = rateInput;
            return [...prevState];
        });

        const month = currentDate.getMonth() + 1;
        const dateToday = `${yr}/${month}/1`;

        const sendRequestOfficialRate = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch("api/add_official_rate", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({
                        date: dateToday,
                        rate: rateInput,
                    }),
                });

                if (!response.ok) throw Error("Something went wrong");

                const data = await response.json();
                console.log(data);
                const { last_rate_data, sarima_rate } = data;

                setSarimaRate(sarima_rate);
                setCurrentOfficialRate(last_rate_data);
            } catch (err) {
                console.log(err);
                setError(err.message);
            }

            setLoading(false);
        };

        sendRequestOfficialRate();
    };

    return (
        <form onSubmit={submitHanlder} className="official-rate-form">
            <div className="date">
                <span className="label">Date Today: </span> {monthLong} {day}, {yr}
            </div>
            <div className="official-rate-form__control rate">
                <div>
                    <label>
                        Latest Official Rate <small>({date}): </small>
                    </label>
                    <div className="sarima-rate">₱ {rate.toFixed(2)}</div>
                </div>
                <div className="loading">
                    {(loading || receivedLastRate.loading) && (
                        <>
                            <p>Loading ...</p>
                            <Spinner />
                        </>
                    )}
                </div>
            </div>
            <div className="official-rate-form__control">
                <label htmlFor="rate">Update Rate:</label>
                <input type="number" id="rate" step="any" ref={rateInputRef} required />
            </div>
            <button type="submit" className="btn btn__primary">
                Submit
            </button>
        </form>
    );
};

export default OfficialRateForm;
