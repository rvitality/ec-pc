import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

import { signInWithGooglePopup, signOutUser } from "../../utils/firebase.utils";
import { useAuthContext } from "../../context/AuthContext";

import logoSrc from "../../assets/images/logo.png";

import "./Header.styles.scss";

const Header = () => {
    const { isAuthenticated, user, login, logout } = useAuthContext();

    const [error, setError] = useState("");

    const loginHandler = async () => {
        try {
            const response = await signInWithGooglePopup();
            login(response?.user);
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
                        <img src={logoSrc} alt="Logo" />
                    </Link>
                </div>

                <div className="right">
                    {isAuthenticated && (
                        <nav>
                            <ul>
                                <li>
                                    <Link to="/calculator">Calculator</Link>
                                </li>
                                <li>
                                    <Link to="/account">Account</Link>
                                </li>
                                {user.role === "admin" && (
                                    <li>
                                        <Link to="/admin">Admin</Link>
                                    </li>
                                )}
                            </ul>
                        </nav>
                    )}

                    {!isAuthenticated && (
                        <button className="btn btn__secondary" onClick={loginHandler}>
                            Sign In
                        </button>
                    )}

                    {!error && isAuthenticated && (
                        <button className="btn btn__secondary" onClick={logoutHandler}>
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
