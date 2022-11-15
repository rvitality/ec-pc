import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getUserData } from "../../utils/firebase.utils";

import useFetchUserRecords from "../../hooks/useFetchUserRecords";

import DataTable from "../../components/DataTable/DataTable.component";
import BillsTable from "./BillsTable/BillsTable.component";

import { FaChartLine } from "react-icons/fa";
import { RiLightbulbFlashFill } from "react-icons/ri";
import { GiMoneyStack } from "react-icons/gi";
import { TbTarget } from "react-icons/tb";

import { useAuthContext } from "../../context/AuthContext";

import "./Account.styles.scss";

const DUMMY_LOGS = [
    {
        id: uuidv4(),
        month: "January",
        year: 2022,
        forecasted: 153425.4322,
        actual: 142425.3214,
        accuracy: 93.53,
        status: "good",
    },
    {
        id: uuidv4(),
        month: "February",
        year: 2022,
        forecasted: 153425.4322,
        actual: 142425.3214,
        accuracy: 93.53,
        status: "bad",
    },
    {
        id: uuidv4(),
        month: "March",
        year: 2022,
        forecasted: 153425.4322,
        actual: 142425.3214,
        accuracy: 93.53,
        status: "late",
    },
    // {
    //     id: uuidv4(),
    //     month: "April",
    //     year: 2022,
    //     forecasted: 153425.4322,
    //     actual: 142425.3214,
    //     accuracy: 93.53,
    //     status: "good",
    // },
    // {
    //     id: uuidv4(),
    //     month: "May",
    //     year: 2022,
    //     forecasted: 153425.4322,
    //     actual: 142425.3214,
    //     accuracy: 93.53,
    //     status: "late",
    // },
    // {
    //     id: uuidv4(),
    //     month: "June",
    //     year: 2022,
    //     forecasted: 153425.4322,
    //     actual: 142425.3214,
    //     accuracy: 93.53,
    //     status: "good",
    // },
    // {
    //     id: uuidv4(),
    //     month: "July",
    //     year: 2022,
    //     forecasted: 153425.4322,
    //     actual: 142425.3214,
    //     accuracy: 93.53,
    //     status: "late",
    // },
    // {
    //     id: uuidv4(),
    //     month: "August",
    //     year: 2022,
    //     forecasted: 153425.4322,
    //     actual: 142425.3214,
    //     accuracy: 93.53,
    //     status: "good",
    // },
];

const Account = () => {
    const { user } = useAuthContext();
    const officialBillsRequest = useFetchUserRecords(user || {});

    const dateObj = new Date();
    const currentMonth = dateObj.toLocaleDateString("en-US", { month: "long" });
    const currentYear = dateObj.getFullYear();
    const [currentRecord, setCurrentRecord] = useState({
        id: uuidv4(),
        month: currentMonth,
        year: currentYear,
    });

    const [records, setRecords] = useState([]);

    useEffect(() => {
        setRecords(officialBillsRequest.data || []);
    }, [officialBillsRequest.data]);

    const [accuracy, setAccuracy] = useState(0);
    const { email, name, photoURL, role, metadata } = user || {};
    const accountCreationTime = metadata?.createdAt ? new Date(+metadata.createdAt) : "";

    const forecastedBill = 15734.63;

    const options = {
        weekday: "short", //to display the full name of the day, you can use short to indicate an abbreviation of the day
        day: "numeric",
        month: "short", //to display the full name of the month
        year: "numeric",
    };

    const billChangeHandler = e => {
        const officialBill = +e.target.value;
        // console.log(officialBill);
        // var regex = /[0-9]|\./;
        // if (!regex.test(officialBill)) return;

        const errorRate = (Math.abs(officialBill - forecastedBill) / forecastedBill) * 100;
        const accuracy = (100 - errorRate).toFixed(2);
        setAccuracy(accuracy);
    };

    const billOnBlurHandler = e => {
        console.log("blur");

        const officialBill = +e.target.value;

        const errorRate = (Math.abs(officialBill - forecastedBill) / forecastedBill) * 100;
        const accuracy = (100 - errorRate).toFixed(2);
        const newUserRecord = {
            accuracy: +accuracy,
            forecasted: forecastedBill,
            actual: officialBill,
            status: "good",
            ...currentRecord,
        };

        setRecords(prevState => {
            const existingRecordIndex = prevState.findIndex(
                record => record.id === newUserRecord.id
            );
            if (existingRecordIndex > 0) {
                prevState[existingRecordIndex] = newUserRecord;
                // return prevState; // wont cause a rerender because it's the same reference
                return [...prevState];
            } else {
                // add new
                return [...prevState, newUserRecord];
            }
        });

        // console.log(records);
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
                                <div className="control">
                                    <div className="control__icon">
                                        <RiLightbulbFlashFill />
                                    </div>
                                    <div className="control__texts">
                                        <p className="label">Your Bill Last Month</p>
                                        <div className="value">₱ 123, 456.00</div>
                                    </div>
                                </div>
                            </div>

                            <div className="control">
                                <div className="control">
                                    <div className="control__icon">
                                        <FaChartLine />
                                    </div>
                                    <div className="control__texts">
                                        <p className="label">Forecasted bill for this month</p>
                                        <div className="value">
                                            ₱ {forecastedBill.toLocaleString()}
                                        </div>
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
                                    <label className="label" htmlFor="bill">
                                        Enter your bill this month
                                    </label>
                                    <input
                                        onChange={billChangeHandler}
                                        onBlur={billOnBlurHandler}
                                        type="number"
                                        name="bill"
                                        id="bill"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* <button className="btn secondary">Compare</button> */}

                        <div className="control">
                            <div className="control">
                                <div className="control__icon">
                                    <TbTarget />
                                </div>
                                <div className="control__texts">
                                    <p className="label">Prediction Accuracy:</p>
                                    <div className="value">{accuracy}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ------------- DATA TABLE --------------- */}
                {officialBillsRequest.isLoading ? (
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
