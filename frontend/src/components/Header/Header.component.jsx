import React, { useState, useRef } from "react";

import "./Header.styles.scss";

import { signInAuthWithEmailAndPassword } from "../../utils/firebase.utils";
import { useAuthContext } from "../../context/AuthContext";

const Header = () => {
    const { isAuthenticated, user, login, logout } = useAuthContext();

    const emailRef = useRef();
    const passwordRef = useRef();

    const [error, setError] = useState("");

    console.log(error, isAuthenticated);

    const loginFormHandler = e => {
        e.preventDefault();

        const enteredEmail = emailRef.current.value;
        const enteredPassword = passwordRef.current.value;

        const sendLoginRequest = async () => {
            try {
                setError("");

                const response = await signInAuthWithEmailAndPassword(
                    enteredEmail,
                    enteredPassword
                );

                const user = { email: enteredEmail, password: enteredPassword };
                console.log("------------------eqwewqew");

                if (enteredEmail.trim().toLowerCase().includes("admin")) {
                    console.log(1);
                    login({ ...user, role: "admin" });
                } else {
                    console.log(2);
                    login({ ...user, role: "user" });
                }
            } catch (err) {
                console.log(err.message);
                const errorMsg = err.message.split("auth")[1];
                console.log(errorMsg);
                setError(
                    errorMsg
                        .slice(1, errorMsg.length - 2)
                        .split("-")
                        .join(" ")
                );
            }
        };

        sendLoginRequest();
    };

    const logoutHandler = () => {
        logout();
    };

    return (
        <header>
            <div className="left">
                <h1>EC-PC</h1>
                <nav>
                    <ul>
                        <li>
                            <a href="#">Profile</a>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="right">
                {!isAuthenticated && (
                    <form onSubmit={loginFormHandler}>
                        <div className="groups">
                            <div className="control">
                                <input placeholder="Email" type="email" ref={emailRef} />
                                <input placeholder="Password" type="password" ref={passwordRef} />
                            </div>
                            {error && <div className="error">{error}</div>}
                        </div>
                        <button type="submit">Sign In</button>
                    </form>
                )}

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
    );
};

export default Header;
