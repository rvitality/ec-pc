import React from "react";
import { Link } from "react-router-dom";

import heroImgSrc from "../../assets/illustrations/hero.png";

import "./Home.styles.scss";

const Home = () => {
    return (
        <section id="home">
            <div className="home section-px section-py">
                <div className="home__texts">
                    <h1 className="heading-primary">
                        Let's <span className="highlight">predict</span> your next electric bill!
                    </h1>
                    <p className="section-paragraph">
                        EC-PC or <strong>"Electric Consumption - Price Calculator"</strong> is an
                        application that predicts a household's electric bill for the current month
                        using the previous bills using SARIMA.
                    </p>
                    <Link to="/" className="btn btn__primary">
                        Learn more
                    </Link>
                </div>
                <div className="home__img-container">
                    <img src={heroImgSrc} alt="People Calculating" />
                </div>
            </div>
        </section>
    );
};

export default Home;
