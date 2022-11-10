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
                        Lorem ipsum sit <br /> <span className="highlight">dolor sit</span> amet
                        consectetur.
                    </h1>
                    <p className="section-paragraph">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. distinctio,
                        possimus ex obcaecati reprehenderit tempora perspiciatis fugit at.
                    </p>
                    <Link to="/" className="primary-btn">
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
