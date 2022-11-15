import { useEffect } from "react";
import { onAuthStateChangedListener, createUserDocumentFromAuth } from "../utils/firebase.utils";

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

        if (email === "daedalusquintus00@gmail.com" || uid === "KgGL9ntc4IRouwtjBSGfusfd28r1") {
            userData = { ...userData, role: "admin" };
        } else {
            userData = { ...userData, role: "user" };
        }
        return userData;
    };

    const loginHandler = user => {
        setIsAuthenticated(true);
        const formattedUserData = formatUserData(user);
        setUser(formattedUserData);
    };

    const logoutHandler = () => {
        setIsAuthenticated(false);
        setUser({});
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener(user => {
            if (user) {
                loginHandler(user);
                createUserDocumentFromAuth(user);
            }

            // setUser(user);
        });

        return unsubscribe;
    }, []);

    const contextValue = {
        isAuthenticated,
        user,
        login: loginHandler,
        logout: logoutHandler,
    };

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
