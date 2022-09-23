import React from "react";
import { useState } from "react";

import { v4 as uuidv4 } from "uuid";

const ManualInput = ({ onSelectAppliance, applianceNameRef, wattageRef }) => {
    const [appliance, setAppliance] = useState({ applianceID: uuidv4() });

    let applianceName = applianceNameRef.current?.value || "";
    let wattage = wattageRef.current?.value || 1;

    const applianceNameOnBlurHandler = e => {
        applianceName = e.target.value;

        const newAppliance = {
            ...appliance,
            applianceName,
            wattage: 1,
        };

        setAppliance(prevState => ({ ...prevState, applianceName, wattage }));

        onSelectAppliance(newAppliance);
    };

    const wattageOnBlurHandler = e => {
        wattage = +e.target.value;

        const newAppliance = {
            ...appliance,
            wattage,
        };

        setAppliance(prevState => ({ ...prevState, wattage }));

        onSelectAppliance(newAppliance);
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
                        type="number"
                        min={1}
                        max={1000}
                        onBlur={wattageOnBlurHandler}
                        required
                    />
                </div>
            </div>
        </div>
    );
};

export default ManualInput;
