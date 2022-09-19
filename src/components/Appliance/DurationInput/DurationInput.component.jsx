import React, { useState } from "react";

const DurationInput = ({ num, onChangeInputHander }) => {
    const [duration, setDuration] = useState(1);

    const changeHandler = e => {
        let inputValue = +e.target.value;

        if (inputValue > 24) {
            inputValue = 24;
        }

        if (inputValue < 1) {
            inputValue = 1;
        }

        setDuration(inputValue);
        onChangeInputHander(num, inputValue);
    };

    return (
        <div className="form-control">
            <label htmlFor={`duration_${num + 1}`} className="duration">
                <small className="duration__count-num">({num + 1})</small> Duration <em>(hr)</em>:
            </label>
            <input
                type="number"
                id={`duration_${num + 1}`}
                min={1}
                max={24}
                value={duration}
                onChange={changeHandler}
                required
            />
        </div>
    );
};

export default DurationInput;
