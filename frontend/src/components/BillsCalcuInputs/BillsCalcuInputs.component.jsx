import React, { useRef } from "react";
import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { updateUserAppliances } from "../../utils/firebase.utils";

import "./BillsCalcuInputs.styles.scss";

const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const BillsCalcuInputs = ({ rates, sarimaRate }) => {
    const [predictedBill, setPredictedBill] = useState(null);
    const { user, setUserRecords, setUserAppliances } = useAuthContext();

    const lastTwoRates = rates.slice(-2);

    const mostRecentMonth = lastTwoRates.length >= 2 ? MONTH_NAMES[lastTwoRates[1].x - 1] : "N/A";
    const secondRecentMonth = lastTwoRates.length >= 2 ? MONTH_NAMES[lastTwoRates[0].x - 1] : "N/A";

    const firstMonthRef = useRef();
    const secondMonthRef = useRef();

    const submitHandler = e => {
        e.preventDefault();

        if (lastTwoRates.length !== 2) return;
        const [firstOfficialRate, secondOfficialRate] = lastTwoRates;

        const firstMonthBill = +firstMonthRef.current?.value;
        const secondMonthBill = +secondMonthRef.current?.value;

        if (!firstMonthBill || !secondMonthBill) return;

        const firstKw = Math.round(firstMonthBill / firstOfficialRate?.y);
        const secondKw = Math.round(secondMonthBill / secondOfficialRate?.y);

        const predictedBill = ((firstKw + secondKw) * +sarimaRate) / 2;
        // console.log(
        //     "predictedBill: ",
        //     predictedBill.toLocaleString("en", { maximumFractionDigits: 2 })
        // );

        setPredictedBill(predictedBill);

        if (!user.records) return;

        if (user.records.length > 0) {
            const newRecords = [...user.records];
            const lastRecord = newRecords[newRecords.length - 1];
            lastRecord.forecasted = predictedBill;
            setUserRecords(newRecords);

            firstMonthRef.current.value = "";
            secondMonthRef.current.value = "";
        }

        // ! =======================================

        const { id } = user;

        updateUserAppliances({
            id,
            selectedAppliances: [],
        });
        setUserAppliances([]);
    };

    return (
        <aside className="bills-calcu-inputs">
            <h1>Basic Calculator</h1>

            <form onSubmit={submitHandler}>
                <div className="input-group">
                    <label className="input-group__label" htmlFor="first-month">
                        Bill for the month of{" "}
                        <span className="input-group__month"> {mostRecentMonth}</span>
                    </label>
                    <input
                        required
                        ref={firstMonthRef}
                        type="number"
                        step="any"
                        min="1"
                        id="first-month"
                    />
                </div>

                <div className="input-group">
                    <label className="input-group__label" htmlFor="second-month">
                        Bill for the month of{" "}
                        <span className="input-group__month">{secondRecentMonth}</span>
                    </label>
                    <input
                        required
                        ref={secondMonthRef}
                        type="number"
                        step="any"
                        min="1"
                        id="second-month"
                    />
                </div>

                {predictedBill && (
                    <div className="predicted-bill">
                        Predicted Bill: <span className="predicted-bill__value"></span>₱{" "}
                        {predictedBill?.toLocaleString("en", { maximumFractionDigits: 2 })}
                    </div>
                )}

                <button type="submit" className="submit-btn">
                    Submit
                </button>
            </form>
        </aside>
    );
};

export default BillsCalcuInputs;
