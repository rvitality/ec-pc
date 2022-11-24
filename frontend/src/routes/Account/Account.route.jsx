import React, { useState, useRef, useEffect } from "react";

import { v4 as uuidv4 } from "uuid";

import { updateUserRecords } from "../../utils/firebase.utils";

import DataTable from "../../components/DataTable/DataTable.component";
import BillsTable from "./BillsTable/BillsTable.component";

import { FaChartLine } from "react-icons/fa";
import { RiLightbulbFlashFill } from "react-icons/ri";
import { GiMoneyStack } from "react-icons/gi";
import { TbTarget } from "react-icons/tb";

import { useAuthContext } from "../../context/AuthContext";
import useFetchLastRate from "../../hooks/useFetchLastRate";

import "./Account.styles.scss";

const monthNames = [
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

const Account = () => {
    const { user, setUserRecords } = useAuthContext();
    const receivedLastRate = useFetchLastRate();

    const [inputError, setInputError] = useState("");
    const billRef = useRef();

    const [accuracy, setAccuracy] = useState(0);
    const { email, name, photoURL, role, metadata } = user || {};
    const accountCreationTime = metadata?.createdAt ? new Date(+metadata.createdAt) : "";

    const options = {
        weekday: "short", //to display the full name of the day, you can use short to indicate an abbreviation of the day
        day: "numeric",
        month: "short", //to display the full name of the month
        year: "numeric",
    };

    // const dateObj = new Date();
    // const currentMonth = dateObj.toLocaleDateString("en-US", { month: "long" });
    // const currentMonth = "December";
    // const currentYear = dateObj.getFullYear();

    const lastUserRecord = user.records ? user.records[user.records.length - 1] : [];
    const { month } = lastUserRecord;
    const [currentRecord, setCurrentRecord] = useState(lastUserRecord);

    const forecastedBill = lastUserRecord?.forecasted || 0;

    const [records, setRecords] = useState(user.records || []);

    const lastMonthBill =
        user?.records && user?.records.length >= 2
            ? user.records[user.records.length - 2].actual
            : 0;

    const billChangeHandler = e => {
        const inputBill = +e.target.value;

        if (!forecastedBill) {
            setInputError("Please forecast a bill first using the calculator.");
            return;
        }

        if (!forecastedBill || inputBill < 0) {
            setInputError("Please input a valid value.");
            return;
        }

        setInputError("");

        // var regex = /[0-9]|\./;
        // if (!regex.test(inputBill)) return;

        const errorRate = (Math.abs(forecastedBill - inputBill) / forecastedBill) * 100;
        const accuracy = (100 - errorRate).toFixed(2);
        setAccuracy(accuracy);
    };

    const enterBillHandler = e => {
        const inputBill = +billRef.current?.value;

        if (!inputBill || inputBill < 0) {
            setInputError("Please input a valid value.");
            return;
        }

        if (!forecastedBill) {
            setInputError("Please forecast a bill first using the calculator.");
            return;
        }

        setInputError("");

        const newUserRecord = {
            ...currentRecord,
            accuracy: +accuracy,
            forecasted: forecastedBill,
            actual: inputBill,
            status: "good",
        };

        setRecords(prevState => {
            const existingRecordIndex = prevState.findIndex(
                record =>
                    record.month.toLowerCase() === newUserRecord.month.toLowerCase() &&
                    +record.year === +newUserRecord.year
            );

            if (existingRecordIndex >= 0) {
                prevState[existingRecordIndex] = newUserRecord;

                updateUserRecords({ ...user, records: prevState }); // firestore db

                // return prevState; // wont cause a rerender because it's the same reference
                return [...prevState];
            } else {
                // add new
                const updatedRecords = [...prevState, newUserRecord];
                updateUserRecords({ ...user, records: updatedRecords });

                return updatedRecords;
            }
        });
    };

    return (
        <section id="account" className="account">
            <div className="cover"></div>
            <div className="section-py section-px">
                <div className="section-px section-py">
                    <div className="photo-container">
                        <div className="left">
                            <img
                                src={photoURL}
                                alt={name}
                                className="photo"
                                referrerPolicy="no-referrer"
                            />

                            <div className="texts">
                                <div className="name">{name}</div>
                                <div className="role">{role}</div>
                            </div>
                        </div>

                        <div className="right">
                            <div className="email">
                                <span className="label">Email: </span>
                                {email}
                            </div>
                            <div className="last-login">
                                <span className="label">Account Created:</span>{" "}
                                {accountCreationTime
                                    ? accountCreationTime.toLocaleDateString("en-US", options)
                                    : ""}
                            </div>
                        </div>
                    </div>

                    <div className="prediction">
                        <div className="group">
                            <div className="control">
                                <div className="control__icon">
                                    <RiLightbulbFlashFill />
                                </div>
                                <div className="control__texts">
                                    <p className="label">
                                        Your <strong>Actual</strong> Bill Last Month
                                    </p>
                                    <div className="value">₱ {lastMonthBill.toLocaleString()}</div>
                                </div>
                            </div>

                            <div className="control">
                                <div className="control__icon">
                                    <FaChartLine />
                                </div>
                                <div className="control__texts">
                                    <p className="label">
                                        <strong>Forecasted</strong> bill this month{" "}
                                        <strong>({month})</strong>
                                    </p>
                                    <div className="value">₱ {forecastedBill.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="comparison group">
                        <div className="input-bill-container">
                            <div className="control input-bill">
                                <div className="control__icon">
                                    <GiMoneyStack />
                                </div>
                                <div className="control__texts">
                                    <div>
                                        <label className="label" htmlFor="bill">
                                            Your bill for <strong>{month}</strong>
                                        </label>
                                        <input
                                            onChange={billChangeHandler}
                                            ref={billRef}
                                            type="number"
                                            name="bill"
                                            id="bill"
                                        />
                                        {inputError && (
                                            <div className="error">
                                                {inputError}
                                                {/* Forecast a bill first using the{" "}
                                                <em>
                                                    <strong>calculator</strong>
                                                </em>{" "}
                                                app . */}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        className="btn btn__primary enter-btn"
                                        onClick={enterBillHandler}
                                    >
                                        Enter
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* <button className="btn secondary">Compare</button> */}

                        <div className="control">
                            <div className="control__icon">
                                <TbTarget />
                            </div>
                            <div className="control__texts">
                                <p className="label">Prediction Accuracy</p>
                                <div className="value">{accuracy}%</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ------------- DATA TABLE --------------- */}
                {Object.keys(user).length < 0 ? (
                    <h2>Loading...</h2>
                ) : (
                    <DataTable
                        data={records}
                        Table={BillsTable}
                        // onFilterBySearch={filterBySearchHandler}
                    />
                )}
            </div>
        </section>
    );
};

export default Account;
