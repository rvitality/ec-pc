import React, { useState, useRef, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { updateUserAppliances } from "../../utils/firebase.utils";
import Tooltip from "../Tooltip/Tooltip.component";

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

const BillsCalcuInputs = ({ rates, sarimaRate, isFlipped }) => {
    const [predictedBill, setPredictedBill] = useState(null);
    const [billsDiff, setBillsDiff] = useState();

    const { user, setUserRecords, setUserAppliances } = useAuthContext();

    const { month, year } = user.records?.length > 0 ? user.records[user.records?.length - 1] : {};

    const lastTwoRates = rates.slice(-2);

    const mostRecentMonth = lastTwoRates.length >= 2 ? MONTH_NAMES[lastTwoRates[1].x - 1] : "N/A";
    const secondRecentMonth = lastTwoRates.length >= 2 ? MONTH_NAMES[lastTwoRates[0].x - 1] : "N/A";

    const firstMonthRef = useRef();
    const secondMonthRef = useRef();

    useEffect(() => {
        if (isFlipped) {
            setBillsDiff(null);
            setPredictedBill(null);
        }
    }, [isFlipped]);

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

        // most recent bill and predicted bill comparison
        const difference = ((predictedBill - firstMonthBill) / firstMonthBill) * 100;

        setBillsDiff(difference);

        // ! STATE UPDATES =======================================

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

            <div className="accuracy-info">
                <Tooltip message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe, dolorum!" />
            </div>

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
                        <div className="predicted-bill__label">
                            Predicted Bill{" "}
                            <span className="predicted-bill__date">
                                ({month}, {year}):
                            </span>
                        </div>
                        <span className="predicted-bill__value">
                            ₱ {predictedBill?.toLocaleString("en", { maximumFractionDigits: 2 })}
                        </span>
                    </div>
                )}

                {billsDiff && (
                    <div className="bills-diff-result">
                        {billsDiff > 0 ? (
                            <div>
                                <p>
                                    Your predicted next bill is ${billsDiff.toFixed(2)}% higher than
                                    your previous one. You might want to learn more about energy
                                    consumption.
                                </p>
                                <ul className="list-links">
                                    <li>
                                        <a
                                            target="_blank"
                                            rel="noreferrer"
                                            href="https://www.energy.gov/energysaver/energy-saver-guide-tips-saving-money-and-energy-home"
                                        >
                                            energy.gov
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            target="_blank"
                                            rel="noreferrer"
                                            href="https://energysavingtrust.org.uk/hub/quick-tips-to-save-energy/"
                                        >
                                            energysavingtrust.org
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            target="_blank"
                                            rel="noreferrer"
                                            href="https://www.directenergy.com/learning-center/25-energy-efficiency-tips"
                                        >
                                            directenergy.com
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            `Good job! Your predicted next bill is ${billsDiff.toFixed(
                                2
                            )}% lower than your previous one. Keep up the good work!`
                        )}
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
