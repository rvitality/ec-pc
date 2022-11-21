import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import {
    onAuthStateChangedListener,
    createUserDocumentFromAuth,
    getUserData,
    updateUserRecords,
} from "../utils/firebase.utils";

import { createContext, useContext, useState } from "react";

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

                const dateObj = new Date();
                const currentMonth = dateObj.toLocaleDateString("en-US", { month: "long" });
                // const currentMonth = "December";
                const currentYear = dateObj.getFullYear();

                getUserData(user.uid).then(res => {
                    const { records } = res;

                    const addNewDefaultRecord = () => {
                        const defaultRecordElement = {
                            id: uuidv4(),
                            accuracy: 0,
                            actual: 0,
                            forecasted: 0,
                            month: currentMonth,
                            year: currentYear,
                            status: "good",
                        };

                        const newRecords = [...records, defaultRecordElement];
                        updateUserRecords({ id: user.uid, ...res, records: newRecords });
                        setUser(prevState => ({ ...prevState, ...res, records: newRecords }));
                    };

                    if (records?.length > 0) {
                        const lastRecordElement = records[records.length - 1];

                        // check if this month's data already exists, else create the basic values like month and year so that `Calculator` & `Account` will fetch the records
                        if (
                            lastRecordElement.month.toLowerCase() === currentMonth.toLowerCase() &&
                            +lastRecordElement.year === currentYear
                        ) {
                            setUser(prevState => ({ ...prevState, ...res }));
                        } else {
                            addNewDefaultRecord();
                        }
                    } else {
                        addNewDefaultRecord();
                    }
                });
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
