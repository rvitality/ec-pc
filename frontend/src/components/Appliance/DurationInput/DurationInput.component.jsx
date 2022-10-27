import React, { useRef } from "react";

const DurationInput = ({ num, onChangeInputHander }) => {
    const durationRef = useRef();
    // const duration = durationRef.current?.value || 1;

    const inputBlurHandler = e => {
        let inputValue = +e.target.value;

        if (inputValue > 24) {
            inputValue = 24;
            durationRef.current.value = 24;
        }

        if (inputValue < 1) {
            inputValue = 1;
            durationRef.current.value = 1;
        }

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
                defaultValue={1}
                ref={durationRef}
                onBlur={inputBlurHandler}
                required
            />
        </div>
    );
};

export default DurationInput;
