import React, { useEffect, useRef, useState } from "react";

import { Link, Navigate, NavLink } from "react-router-dom";

import { useAuthContext } from "../../context/AuthContext";
import { signOutUser } from "../../utils/firebase.utils";

import { BsCalculator } from "react-icons/bs";

import { BiChevronDown } from "react-icons/bi";

import "./MobileNav.styles.scss";

const MobileNav = () => {
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const [showDropdown, setShowDropdown] = useState(false);

    const { logout, user } = useAuthContext();

    const { photoURL, name } = user;
    // const userName = authContext.user?.firstName;
    // const userEmail = authContext.user?.email.split("@")[0]?.toLowerCase();

    const toggleDropdownHandler = () => setShowDropdown(prevState => !prevState);

    const logoutHandler = () => {
        signOutUser();
        logout();
        Navigate("/boys-art-paint-center-delivery/auth");
    };

    useEffect(() => {
        const checkIfClickedOutside = e => {
            // If the menu is open and the clicked target is not within the menu, then close the menu

            if (showDropdown && dropdownRef.current && e.target !== buttonRef.current) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("click", checkIfClickedOutside);

        return () => {
            // Cleanup the event listener
            document.removeEventListener("click", checkIfClickedOutside);
        };
    }, [showDropdown]);

    return (
        <div className="user-container">
            <NavLink
                className={`nav__link ${({ isActive }) => (isActive ? "active" : "")}`}
                to="/calculator"
            >
                <BsCalculator />
                <span>Calculator</span>
            </NavLink>

            <div className="user">
                <div className="user__photo">
                    <img src={photoURL} alt={name} />
                </div>
                <div className="user__name">{name}</div>
                <button
                    className="user__drowndown-btn"
                    ref={buttonRef}
                    onClick={toggleDropdownHandler}
                >
                    <BiChevronDown className="user__dropdown-icon" />
                </button>

                <div ref={dropdownRef} className={`dropdown ${showDropdown ? "show" : ""}`}>
                    <Link to="/account">Account</Link>
                    <Link to="/admin">Admin</Link>
                    <Link className="logout" to="" onClick={logoutHandler}>
                        Log out
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MobileNav;
