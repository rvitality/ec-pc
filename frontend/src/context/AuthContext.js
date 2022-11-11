import { createContext, useContext, useState } from "react";

const initialState = {
    isAuthenticated: false,
    user: { email: "", password: "", role: "" },
};

const AuthContext = createContext(initialState);

export const AuthContextProvider = props => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState({ email: "", password: "", role: "" });

    const loginHandler = user => {
        setIsAuthenticated(true);

        const { displayName, accessToken, uid, email, metadata, photoURL } = user;
        const userData = {
            name: displayName,
            token: accessToken,
            id: uid,
            email,
            metadata,
            photoURL,
        };

        if (email === "daedalusquintus00@gmail.com" || uid === "KgGL9ntc4IRouwtjBSGfusfd28r1") {
            setUser({ ...userData, role: "admin" });
        } else {
            setUser({ ...userData, role: "user" });
        }
    };

    const logoutHandler = () => {
        setIsAuthenticated(false);
        setUser({});
    };

    const contextValue = {
        isAuthenticated,
        user,
        login: loginHandler,
        logout: logoutHandler,
    };

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
