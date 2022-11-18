import React, { useRef, useEffect, useState } from "react";
import { useApplianceContext } from "../../../context/ApplianceContext";

import "./OfficialRateForm.styles.scss";

const OfficialRateForm = () => {
    const { setSarimaRate } = useApplianceContext();
    const rateInputRef = useRef();

    const [currentOfficialRate, setCurrentOfficialRate] = useState([]);
    const date = (currentOfficialRate && currentOfficialRate[0]) || 0;
    const rate = (currentOfficialRate && +currentOfficialRate[1]) || 0;

    // ! fetch last rate from csv file official rates
    useEffect(() => {
        const sendRequest = async () => {
            try {
                const response = await fetch("/get_last_rate_data");
                if (!response.ok) return "Something went wrong!";
                const data = await response.json();
                const { last_rate_data } = data;
                setCurrentOfficialRate(last_rate_data);

                // const rateInput = rateInputRef.current?.value;
                // setCurrentOfficialRate(prevState => {
                //     last_rate_data[-1] = rateInput;
                //     return [...last_rate_data];
                // });
            } catch (err) {
                console.log(err.message);
            }
        };
        sendRequest();
    }, []);

    const currentDate = new Date();
    const monthLong = currentDate.toLocaleDateString("en-US", { month: "long" });
    const day = currentDate.getDate();
    const yr = currentDate.getFullYear();

    const submitHanlder = e => {
        e.preventDefault();

        const rateInput = rateInputRef.current?.value;

        setCurrentOfficialRate(prevState => {
            prevState[prevState.length - 1] = rateInput;
            return [...prevState];
        });

        const month = currentDate.getMonth() + 1;
        const date = `${yr}/${month}/1`;

        const sendRequest = async () => {
            try {
                const response = await fetch("/push_official_rate", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({
                        date,
                        rate: rateInput,
                    }),
                });

                if (!response.ok) throw Error("Something went wrong");

                const data = await response.json();
                const { sarima_rate } = data;

                console.log("Official Rate Form: ", data);
                setSarimaRate(sarima_rate);
            } catch (err) {
                console.log(err);
            }
        };

        sendRequest();
    };

    return (
        <form onSubmit={submitHanlder} className="official-rate-form">
            <div className="date">
                <span className="label">Date Today: </span> {monthLong} {day}, {yr}
            </div>
            <div className="official-rate-form__control rate">
                <label>
                    Current Rate <small>({date}): </small>
                </label>
                <div className="sarima-rate">₱ {rate.toFixed(2)}</div>
            </div>
            <div className="official-rate-form__control">
                <label>
                    <strong>{123 !== 1 ? "Update" : "Enter"}</strong> Rate:{" "}
                </label>
                <input type="number" step="any" ref={rateInputRef} required />
            </div>
            <button type="submit" className="btn primary">
                Submit
            </button>
        </form>
    );
};

export default OfficialRateForm;
