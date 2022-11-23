import React, { useState } from "react";

import Tooltip from "../../../components/Tooltip/Tooltip.component";

import { TbArrowWaveRightUp } from "react-icons/tb";

import "./ConversionTool.styles.scss";

const ConversionTool = () => {
    const [minutes, setMinutes] = useState("");
    const [hours, setHours] = useState("");

    const minutesChangeHandler = e => {
        let inputValue = +e.target.value;
        setMinutes(inputValue);

        if (inputValue > 60) {
            setMinutes(60);
            inputValue = 60;
        }

        if (inputValue <= 0) {
            setMinutes("");
            return;
            // inputValue = 1;
        }

        const computedHours = (inputValue / 60).toFixed(2);
        console.log(computedHours);

        setHours(computedHours);
    };

    return (
        <div className="conversion">
            <div className="conversion__heading">
                <span className="title">Conversion Tool</span>
                <Tooltip message="If your duration input is less than 60 minutes you may use this tool to convert it into hours in decimal form (input : 30minutes =  0.5 hours)" />
            </div>

            <div className="conversion__tool">
                <div className="box">
                    <label htmlFor="minutes">Minutes</label>
                    <input
                        value={minutes}
                        onChange={minutesChangeHandler}
                        type="number"
                        id="minutes"
                    />
                </div>

                <TbArrowWaveRightUp className="arrow" />

                <div className="box">
                    <label htmlFor="minutes">Hours</label>
                    <input value={hours} type="number" id="minutes" min="1" max="60" disabled />
                </div>
            </div>
        </div>
    );
};

export default ConversionTool;
