import React from "react";

import heroImgSrc from "../../assets/illustrations/hero.png";

import "./Home.styles.scss";

const Home = () => {
    return (
        <>
            <section id="home">
                <div className=" landing section-px section-py">
                    <div className="landing__texts">
                        <h1 className="heading-primary">
                            Let's <span className="highlight">predict</span> your next electric
                            bill!
                        </h1>
                        <p className="section-paragraph">
                            EC-PC or <strong>"Electric Consumption - Price Calculator"</strong> is
                            an application that predicts a household's electric bill for a specific
                            month using the previous rates.
                        </p>
                        <a href="#about" className="btn btn__primary">
                            Learn more
                        </a>
                    </div>
                    <div className="landing__img-container">
                        <img src={heroImgSrc} alt="People Calculating" />
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
