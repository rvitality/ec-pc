import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import {
    onAuthStateChangedListener,
    createUserDocumentFromAuth,
    getUserData,
    updateUserRecords,
} from "../utils/firebase.utils";

import { createContext, useContext, useState } from "react";

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

    const setUserRecords = records => {
        if (!records) return;
        updateUserRecords({ ...user, records });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener(user => {
            if (user) {
                loginHandler(user);
                createUserDocumentFromAuth(user);

                // get user data from firestore db
                // getUserData(user.uid).then(res => setUser(prevState => ({ ...prevState, ...res })));

                const getLastRateData = async () => {
                    const response = await fetch("/api/get_last_rate_data");
                    if (!response.ok) return "Failed to fetch last rate data.";
                    const data = await response.json();
                    console.log(response);
                    console.log(data);
                    const { last_rate_data } = data;

                    await getUserData(user.uid).then(res => {
                        const { records } = res;

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
                        const currentYear = dateObj.getFullYear();

                        if (records?.length > 0) {
                            console.log(last_rate_data);
                            const splitLastRate = last_rate_data[0]?.split("/");
                            const lastRateMonth = monthNames[+splitLastRate[1] - 1].toLowerCase();
                            // const lastRateMonth = "December";
                            const lastRateYear = +splitLastRate[0];

                            const lastRecordElement = records[records.length - 1];

                            // check if this month's data already exists, else create the basic values like month and year so that `Calculator` & `Account` will fetch the records
                            let nextMonthIndex = +splitLastRate[1];
                            let nextYr = lastRateYear;
                            // check if it exceeds december, 11 means december because it starts at 0 (January)
                            if (nextMonthIndex > 11) {
                                nextMonthIndex = 0;
                                nextYr += 1;
                            }

                            // console.log(lastRecordElement.month.toLowerCase(), lastRateMonth);
                            // console.log(+lastRecordElement.year, lastRateYear);

                            const nextMonth = monthNames[nextMonthIndex].toLowerCase();

                            if (
                                nextMonth === lastRecordElement.month.toLowerCase() &&
                                nextYr === +lastRecordElement.year
                            ) {
                                console.log(1);
                                setUser(prevState => {
                                    return { ...prevState, ...res };
                                });
                            } else if (
                                lastRecordElement.month.toLowerCase() === lastRateMonth &&
                                +lastRecordElement.year === lastRateYear
                            ) {
                                console.log(2);
                                addNewDefaultRecord(nextMonth, nextYr);
                            } else {
                                console.log(3);
                                addNewDefaultRecord(currentMonth, currentYear);
                            }
                        } else {
                            addNewDefaultRecord(currentMonth, currentYear);
                        }
                    });
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
    };

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
