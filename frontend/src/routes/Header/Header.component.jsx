import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

import { BsCalculator } from "react-icons/bs";
import { FaUserShield, FaUserAlt } from "react-icons/fa";

import { signInWithGooglePopup, signOutUser } from "../../utils/firebase.utils";
import { useAuthContext } from "../../context/AuthContext";

import logoSrc from "../../assets/images/logo.png";

import "./Header.styles.scss";
import MobileNav from "../../components/MobileNav/MobileNav.component";

const Header = () => {
    const { isAuthenticated, user, login, logout } = useAuthContext();

    const [error, setError] = useState("");

    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const onScroll = () => setOffset(window.pageYOffset);
        // clean up code
        window.removeEventListener("scroll", onScroll);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

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
            <header className={`${offset >= 100 ? "add-shadow" : ""}`}>
                <div className="left">
                    <Link to="/" className="logo">
                        <img src={logoSrc} alt="Logo" />
                    </Link>
                </div>

                <div className="right">
                    {isAuthenticated && <MobileNav />}

                    {isAuthenticated && (
                        <nav className="nav">
                            <ul>
                                <li>
                                    <NavLink
                                        className={`nav__link ${({ isActive }) =>
                                            isActive ? "active" : ""}`}
                                        to="/calculator"
                                    >
                                        <BsCalculator />
                                        <span>Calculator</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        className={`nav__link ${({ isActive }) =>
                                            isActive ? "active" : ""}`}
                                        to="/account"
                                    >
                                        <FaUserAlt />
                                        <span>Account</span>
                                    </NavLink>
                                </li>
                                {user.role === "admin" && (
                                    <li>
                                        <NavLink
                                            className={`nav__link ${({ isActive }) =>
                                                isActive ? "active" : ""}`}
                                            to="/admin"
                                        >
                                            <FaUserShield />
                                            <span>Admin</span>
                                        </NavLink>
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
