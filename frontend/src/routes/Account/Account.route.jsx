import React, { useState, useRef, useEffect } from "react";

import { updateUserRecords } from "../../utils/firebase.utils";

import DataTable from "../../components/DataTable/DataTable.component";
import BillsTable from "./BillsTable/BillsTable.component";

import { FaChartLine } from "react-icons/fa";
import { RiLightbulbFlashFill } from "react-icons/ri";
import { GiMoneyStack } from "react-icons/gi";
import { TbTarget } from "react-icons/tb";

import { useAuthContext } from "../../context/AuthContext";

import "./Account.styles.scss";
import { calculateAccuracy } from "../../helpers/calculateAccuracy.helper";
import SelectedAppliancesTable from "./SelectedAppliancesTable/SelectedAppliancesTable.component";
import BillsGraph from "../../components/BillsGraph/BillsGraph.component";

const Account = () => {
    const { user } = useAuthContext();

    const billRef = useRef();
    const [inputError, setInputError] = useState("");

    const { email, name, photoURL, role, metadata } = user || {};

    const accountCreationTime = metadata?.createdAt ? new Date(+metadata.createdAt) : "";

    const options = {
        weekday: "short", //to display the full name of the day, you can use short to indicate an abbreviation of the day
        day: "numeric",
        month: "short", //to display the full name of the month
        year: "numeric",
    };

    const lastUserRecord = user.records ? user.records[user.records.length - 1] : [];
    const { month, actual, accuracy: latestAccuracy } = lastUserRecord;

    const [currentRecord, setCurrentRecord] = useState(lastUserRecord);

    const forecastedBill = lastUserRecord?.forecasted || 0;

    const [records, setRecords] = useState(user?.records || []);
    const [selectedAppliances, setSelectedAppliances] = useState(user?.selectedAppliances || []);

    useEffect(() => {
        setRecords(user.records);
        setSelectedAppliances(user.selectedAppliances);
    }, [user.records, user.selectedAppliances]);

    const lastMonthBill =
        user?.records && user?.records.length >= 2
            ? user.records[user.records.length - 2].actual
            : 0;

    const [accuracy, setAccuracy] = useState(latestAccuracy || 0);

    const billChangeHandler = e => {
        const inputBill = +e.target.value;

        if (!forecastedBill) {
            setInputError("Please forecast a bill first using the calculator.");
            return;
        }

        if (!forecastedBill || inputBill < 0 || inputBill > 200_000) {
            setInputError("Please input a valid value.");
            return;
        }

        setInputError("");

        const accuracy = calculateAccuracy(forecastedBill, inputBill);
        setAccuracy(accuracy);
    };

    const enterBillHandler = e => {
        const inputBill = +billRef.current?.value;

        if (!inputBill || inputBill < 0 || inputBill > 200_000) {
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
            status: "neutral",
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

    const billsFilterBySearchHandler = (data, inputValue) => {
        if (!data) return;

        return data.filter(bill => {
            const { month, year, accuracy, actual, forecasted } = bill;
            return (
                month.toLowerCase().includes(inputValue) ||
                `${year}`.toLowerCase().includes(inputValue) ||
                `${accuracy}`.toLowerCase().includes(inputValue) ||
                `${actual}`.toLowerCase().includes(inputValue) ||
                `${forecasted}`.toLowerCase().includes(inputValue)
            );
        });
    };

    const appliancesFilterBySearchHandler = (data, inputValue) => {
        if (!data) return;

        return data.filter(appliance => {
            const { applianceName, wattage, quantity } = appliance;
            return (
                applianceName.toLowerCase().includes(inputValue) ||
                `${wattage}`.toLowerCase().includes(inputValue) ||
                `${quantity}`.toLowerCase().includes(inputValue)
            );
        });
    };

    const status = !accuracy ? "neutral" : accuracy >= 75 ? "good" : accuracy > 50 ? "bad" : "fail";

    return (
        <section id="account" className="account">
            <div className="cover"></div>
            <div className="section-py section-px">
                <div className="info-container">
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
                                    <div className="value">
                                        ???{" "}
                                        {lastMonthBill.toLocaleString("en", {
                                            maximumFractionDigits: 2,
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="control">
                                <div className="control__icon">
                                    <FaChartLine />
                                </div>
                                <div className="control__texts">
                                    <p className="label">
                                        <strong>Predicted</strong> bill for <strong>{month}</strong>
                                    </p>
                                    <div className="value">
                                        ???{" "}
                                        {forecastedBill.toLocaleString("en", {
                                            maximumFractionDigits: 2,
                                        })}
                                    </div>
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
                                            defaultValue={actual}
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
                                        {actual ? "Update" : "Enter"}
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
                                <div className={`value status ${status}`}>{accuracy}%</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tables">
                    <h2 className="tables__label heading-tertiary">Bill Records</h2>
                    {/* ------------- DATA TABLE for BILLS--------------- */}
                    {Object.keys(user).length < 0 ? (
                        <h2>Loading...</h2>
                    ) : (
                        <DataTable
                            data={records || []}
                            Table={BillsTable}
                            onFilterBySearch={billsFilterBySearchHandler}
                        />
                    )}

                    {/* ------------- BILLS GRAPH ------------- */}

                    {Object.keys(user).length < 0 ? (
                        <h2>Loading...</h2>
                    ) : (
                        <BillsGraph bills={records || []} />
                    )}

                    <h2 className="tables__label heading-tertiary">Selected Appliances</h2>
                    {/* ------------- DATA TABLE  for SELECTED APPLIANCES --------------- */}
                    {Object.keys(user).length < 0 ? (
                        <h2>Loading...</h2>
                    ) : (
                        <DataTable
                            data={selectedAppliances || []}
                            Table={SelectedAppliancesTable}
                            onFilterBySearch={appliancesFilterBySearchHandler}
                        />
                    )}
                </div>
            </div>
        </section>
    );
};

export default Account;
