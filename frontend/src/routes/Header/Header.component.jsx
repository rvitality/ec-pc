import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

import { signInWithGooglePopup, signOutUser } from "../../utils/firebase.utils";
import { useAuthContext } from "../../context/AuthContext";

import "./Header.styles.scss";

const Header = () => {
    const { isAuthenticated, user, login, logout } = useAuthContext();

    const [error, setError] = useState("");

    const loginHandler = async () => {
        try {
            const response = await signInWithGooglePopup();

            const { accessToken, uid, email, metadata, photoURL } = response.user;
            const userData = { token: accessToken, id: uid, email, metadata, photoURL };

            if (email === "daedalusquintus00@gmail.com") {
                login({ ...userData, role: "admin" });
            } else {
                login({ ...userData, role: "user" });
            }
        } catch (err) {
            console.log(err.message);
            setError(err.message);
        }
    };

    const logoutHandler = async () => {
        await signOutUser();
        logout();
    };

    return (
        <>
            <header>
                <div className="left">
                    <Link to="/" className="logo">
                        LOGO
                    </Link>
                </div>

                <div className="right">
                    <nav>
                        <ul>
                            <li>
                                <Link to="/account">Account</Link>
                            </li>
                            <li>
                                <Link to="/admin">Admin</Link>
                            </li>
                        </ul>
                    </nav>

                    {!isAuthenticated && (
                        <button className="primary-btn" onClick={loginHandler}>
                            Sign In
                        </button>
                    )}

                    {!error && isAuthenticated && (
                        <button className="primary-btn" onClick={logoutHandler}>
                            Sign Out
                        </button>
                    )}
                </div>
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
};

export default Header;
