import React from "react";

import { FaInfoCircle } from "react-icons/fa";

import "./Tooltip.styles.scss";

const Tooltip = ({ message }) => {
    return (
        <div className="tooltip">
            <div className="tooltip__message">{message}</div>
            <FaInfoCircle className="tooltip__icon" />
        </div>
    );
};

export default Tooltip;
