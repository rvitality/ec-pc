import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import {
    onAuthStateChangedListener,
    createUserDocumentFromAuth,
    getUserData,
    updateUserRecords,
} from "../utils/firebase.utils";

import { createContext, useContext, useState } from "react";
import { calculateAccuracy } from "../helpers/calculateAccuracy.helper";

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

const initialState = {
    isAuthenticated: false,
    user: { email: "", password: "", role: "" },
};

const AuthContext = createContext(initialState);

export const AuthContextProvider = props => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState({ email: "", password: "", role: "" });

    const formatUserData = user => {
        const { displayName, accessToken, uid, email, metadata, photoURL } = user;
        let userData = {
            name: displayName,
            token: accessToken,
            id: uid,
            email,
            metadata,
            photoURL,
        };

        if (email === "daedalusquintus00@gmail.com" || uid === "dwKcA6GulSd0uZ95lPlGjQ4i3Br1") {
            userData = { ...userData, role: "admin" };
        } else {
            userData = { ...userData, role: "user" };
        }
        return userData;
    };

    const loginHandler = user => {
        setIsAuthenticated(true);
        const formattedUserData = formatUserData(user);
        setUser(prevState => ({ ...prevState, ...formattedUserData }));
    };

    const logoutHandler = () => {
        setIsAuthenticated(false);
        setUser({});
    };

    const setUserAppliances = appliances => {
        setUser(prevState => ({ ...prevState, selectedAppliances: appliances }));
    };

    const setUserRecords = records => {
        if (!records) return;
        const lastUserRecord = user.records[user.records.length - 1];

        const { forecasted, actual } = lastUserRecord;

        const accuracy = calculateAccuracy(forecasted, actual);

        const newRecords = [...records];
        newRecords[newRecords.length - 1] = { ...lastUserRecord, accuracy };

        setUser(prevState => ({ ...prevState, records: newRecords }));
        updateUserRecords({ ...user, records: newRecords });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener(user => {
            if (user) {
                loginHandler(user);
                createUserDocumentFromAuth(user);

                // get user data from firestore db
                // getUserData(user.uid).then(res => setUser(prevState => ({ ...prevState, ...res })));

                const getLastRateData = async () => {
                    try {
                        const response = await fetch(
                            "https://ec-pc-flaskapi.onrender.com/api/get_last_rate_data"
                        );
                        if (!response.ok) throw new Error("Failed to fetch last rate data.");
                        const data = await response.json();
                        const { last_rate_data } = data;

                        await getUserData(user.uid).then(res => {
                            const records = res?.records || [];

                            const addNewDefaultRecord = (month, year) => {
                                const defaultRecordElement = {
                                    id: uuidv4(),
                                    accuracy: 0,
                                    actual: 0,
                                    forecasted: 0,
                                    month,
                                    year,
                                    status: "good",
                                };

                                const newRecords = [...records, defaultRecordElement];
                                updateUserRecords({ id: user.uid, ...res, records: newRecords });
                                setUser(prevState => ({
                                    ...prevState,
                                    ...res,
                                    records: newRecords,
                                }));
                            };

                            const dateObj = new Date();
                            const currentMonth = dateObj
                                .toLocaleDateString("en-US", {
                                    month: "long",
                                })
                                .toLowerCase();
                            // const currentMonth = "December";
                            const currentYear = +dateObj.getFullYear();

                            const splitLastRate = last_rate_data[0]?.split("/");
                            const lastRateMonth = monthNames[+splitLastRate[1] - 1].toLowerCase();
                            const lastRateYear = +splitLastRate[0];

                            // check if this month's data already exists, else create the basic values like month and year so that `Calculator` & `Account` will fetch the records
                            let nextMonthIndex = +splitLastRate[1];
                            let nextYr = lastRateYear;
                            // check if it exceeds december, 11 means december because it starts at 0 (January)
                            if (nextMonthIndex > 11) {
                                nextMonthIndex = 0;
                                nextYr += 1;
                            }

                            const nextMonth = monthNames[nextMonthIndex].toLowerCase();

                            // !! THIS BLOCK IS FOR THE USER SIGNS IN FOR THE FIRST TIME, USER DOESN'T HAVE ANY DATA IN THE FIRESTOREDB
                            if (!res || !Object.keys(res).length) {
                                // ! ADD THE NEW RECORD

                                if (
                                    currentMonth === lastRateMonth &&
                                    currentYear === lastRateYear
                                ) {
                                    addNewDefaultRecord(nextMonth, nextYr);
                                } else {
                                    addNewDefaultRecord(currentMonth, currentYear);
                                }

                                // ! WE'LL `RETURN` HERE BECAUSE IT WILL CAUSE AN ERROR BELOW AS THE `RECORDS` DOESN'T EXIST
                                return;
                            }

                            // ! ====================================

                            // ! THESE DATA WILL COME FROM THE USERS' FIRESTOREDB RECORDS
                            const lastRecordElement = records[records.length - 1];
                            const lastRecordMonth = lastRecordElement?.month.toLowerCase();
                            const lastRecordYear = +lastRecordElement?.year;

                            if (records?.length > 0) {
                                if (nextMonth === lastRecordMonth && nextYr === lastRecordYear) {
                                    setUser(prevState => {
                                        return { ...prevState, ...res };
                                    });
                                } else if (
                                    lastRecordMonth === lastRateMonth &&
                                    lastRecordYear === lastRateYear
                                ) {
                                    addNewDefaultRecord(nextMonth, nextYr);
                                } else {
                                    addNewDefaultRecord(currentMonth, currentYear);
                                }
                            } else {
                                // add next month because we're predicting the next month instead of the current month
                                // this month's official rate already exists in the backend
                                if (
                                    currentMonth === lastRateMonth &&
                                    currentYear === lastRateYear
                                ) {
                                    addNewDefaultRecord(nextMonth, nextYr);
                                } else {
                                    addNewDefaultRecord(currentMonth, currentYear);
                                }
                            }
                        });
                    } catch (err) {
                        console.log(err.message);
                    }
                };

                getLastRateData();
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const contextValue = {
        isAuthenticated,
        user,
        login: loginHandler,
        logout: logoutHandler,
        setUserRecords,
        setUserAppliances,
    };

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
