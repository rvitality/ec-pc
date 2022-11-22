import React from "react";

import "./Spinner.styles.scss";

const Spinner = () => {
    return (
        <div className="loading-spinner">
            <div id="square1"></div>
            <div id="square2"></div>
            <div id="square3"></div>
            <div id="square4"></div>
            <div id="square5"></div>
        </div>
    );
};

export default Spinner;
