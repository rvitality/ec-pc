import React, { useRef } from "react";
import { useApplianceContext } from "../../../context/ApplianceContext";

import "./OfficialRateForm.styles.scss";

const OfficialRateForm = () => {
    const { setSarimaRate } = useApplianceContext();

    const rateInputRef = useRef();

    const currentDate = new Date();
    const monthLong = currentDate.toLocaleDateString("en-US", { month: "long" });
    const day = currentDate.getDate();
    const yr = currentDate.getFullYear();

    const submitHanlder = e => {
        e.preventDefault();

        const rateInput = rateInputRef.current?.value;

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

                console.log(response);

                if (!response.ok) throw Error("Something went wrong");

                const data = await response.json();
                console.log(data);
                const { sarima_rate } = data;
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
            <div className="official-rate-form__control">
                <label>Official Rate: </label>
                <input type="number" step="any" ref={rateInputRef} required />
            </div>
            <button type="submit" className="btn primary">
                Submit
            </button>
        </form>
    );
};

export default OfficialRateForm;
