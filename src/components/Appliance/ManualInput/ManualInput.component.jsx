import React, { useRef } from "react";
import { useState } from "react";

import { v4 as uuidv4 } from "uuid";

const ManualInput = ({ onSelectAppliance }) => {
    const [appliance, setAppliance] = useState({ applianceID: uuidv4() });

    const applianceNameRef = useRef();
    const wattageRef = useRef();
    const sizeValueRef = useRef();
    const sizeMeasurementRef = useRef();

    let applianceName = applianceNameRef.current?.value || "";
    let wattage = wattageRef.current?.value || 1;

    let sizeValue = sizeValueRef.current?.value || "";
    let sizeMeasurement = sizeMeasurementRef.current?.value || "";
    let size = `${sizeValue} (${sizeMeasurement})`;

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

    const sizeValueOnBlurHandler = e => {
        sizeValue = +e.target.value;

        size = `${sizeValue} ${sizeMeasurement}`;

        const newAppliance = {
            ...appliance,
            wattage,
            size,
        };

        setAppliance(prevState => ({ ...prevState, size }));

        onSelectAppliance(newAppliance);
    };

    const sizeMeasurementChangeHandler = e => {
        sizeMeasurement = e.target.value;

        size = `${sizeValue} ${sizeMeasurement}`;

        const newAppliance = {
            ...appliance,
            wattage,
            size,
        };

        setAppliance(prevState => ({ ...prevState, size }));

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
                <div className="size">
                    <div className="form-control">
                        <label htmlFor="size">Size:</label>
                        <input
                            className="value"
                            id="size"
                            ref={sizeValueRef}
                            placeholder="Value"
                            type="number"
                            min={1}
                            max={1000}
                            onBlur={sizeValueOnBlurHandler}
                        />
                    </div>

                    <div className="form-control">
                        <select
                            ref={sizeMeasurementRef}
                            name="cars"
                            id="size-measurement"
                            onChange={sizeMeasurementChangeHandler}
                        >
                            <option value="in.">inches</option>
                            <option value="ft.">feet</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManualInput;
