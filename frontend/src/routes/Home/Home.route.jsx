import React from "react";

import jyumulImgSrc from "../../assets/images/jyumul.jpg";

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
                            an application that predicts a household's electric bill for the current
                            month using the previous bills using SARIMA.
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
            <section id="about" className="about section-px section-py">
                <div className="heading">
                    <div className="heading-secondary">About</div>
                    <div className="section-paragraph">
                        This is an application developed by student researchers to predict a{" "}
                        <strong>household's electric bill for the month</strong>. However, this
                        application is only limited to the households within{" "}
                        <strong>Angeles City, Pampanga, Philippines</strong>. If you are from
                        another city, place, or country, then the accuracy of this application may
                        differentiate as the rate used to create this calculator is based on the
                        public information posted by <strong>Angeles Electric Corporation</strong>.
                    </div>
                </div>

                <h2 className="heading-tertiary our-team-heading">Our Team</h2>

                <div className="people">
                    <div className="people__item">
                        <div>
                            <img src={jyumulImgSrc} alt="Joshua Yumul" />
                        </div>
                        <h3 className="people__name">Joshua B. Yumul</h3>
                    </div>

                    <div className="people__item">
                        <div>
                            <img src="https://picsum.photos/200" alt="Carlos Gabriel U. Soriano" />
                        </div>
                        <h3 className="people__name">Carlos Gabriel U. Soriano</h3>
                    </div>

                    <div className="people__item">
                        <div>
                            <img
                                src="https://picsum.photos/200"
                                alt="Danielle G. Velasco
"
                            />
                        </div>
                        <h3 className="people__name">Danielle G. Velasco</h3>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
