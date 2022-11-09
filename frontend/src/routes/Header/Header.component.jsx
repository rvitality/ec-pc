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
                    <h1>EC-PC</h1>
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
                </div>

                <div className="right">
                    {!isAuthenticated && <button onClick={loginHandler}>Sign In</button>}

                    {!error && isAuthenticated && (
                        <div className="profile">
                            <div>
                                <div>
                                    <span className="label">Email:</span> {user.email}
                                </div>
                                <div>
                                    <span className="label">Role:</span> {user.role}
                                </div>
                            </div>
                            <button onClick={logoutHandler}>Sign Out</button>
                        </div>
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
