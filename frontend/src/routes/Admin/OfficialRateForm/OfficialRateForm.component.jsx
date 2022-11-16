import React, { useRef } from "react";
import { useApplianceContext } from "../../../context/ApplianceContext";

import "./OfficialRateForm.styles.scss";

const OfficialRateForm = () => {
    const { setSarimaRate } = useApplianceContext();

    const rateInputRef = useRef();

    const submitHanlder = e => {
        e.preventDefault();

        const rateInput = rateInputRef.current?.value;

        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const yr = currentDate.getFullYear();
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
            <div className="official-rate-form__control">
                <label>Enter Official Rate: </label>
                <input type="number" step="any" ref={rateInputRef} required />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default OfficialRateForm;
