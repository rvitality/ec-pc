import React, { useRef } from "react";
import { useState } from "react";

import { v4 as uuidv4 } from "uuid";

const ManualInput = ({ onBlurApplianceNameHandler, onBlurWattageHandler, applianceNameRef }) => {
    const [appliance, setAppliance] = useState({ applianceID: uuidv4() });

    const wattageRef = useRef();
    let applianceName = applianceNameRef.current?.value || "";

    const applianceNameOnBlurHandler = e => {
        applianceName = e.target.value;

        const newAppliance = {
            ...appliance,
            applianceName,
            wattage: 1,
        };

        const wattageValue = parseInt(wattageRef.current?.value) || 1;

        setAppliance(prevState => ({ ...prevState, applianceName, wattage: wattageValue }));

        onBlurApplianceNameHandler(newAppliance);
    };

    const wattageOnBlurHandler = e => {
        const wattageValue = +e.target.value;
        if (wattageValue > 5000 || wattageValue < 1) return;

        setAppliance(prevState => ({ ...prevState, wattage: wattageValue }));

        onBlurWattageHandler(wattageValue);
    };

    return (
        <div className="manual">
            <input
                placeholder="Appliance name"
                type="text"
                className="calcu__btn appliance__btn manual__input"
                ref={applianceNameRef}
                onBlur={applianceNameOnBlurHandler}
                required
            />
            <div className="manual__form-control-container">
                <div className="form-control wattage">
                    <label htmlFor="wattage">Wattage: </label>
                    <input
                        id="wattage"
                        ref={wattageRef}
                        defaultValue={1}
                        step="any"
                        type="number"
                        min={1}
                        max={5000}
                        onBlur={wattageOnBlurHandler}
                        required
                    />
                </div>
            </div>
        </div>
    );
};

export default ManualInput;
