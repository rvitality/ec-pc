import React, { useState } from "react";
import Appliance from "../Appliance/Appliance.component";

import { IoMdAdd } from "react-icons/io";

import "./Calculator.styles.scss";
import { useApplianceContext } from "../../context/ApplianceContext";

const Calculator = () => {
    const { addAppliance, selectedAppliances, sarimaRate } = useApplianceContext();

    const [applianceHolders, setApplianceHolders] = useState(Array(3).fill());

    const newApplianceHolderHandler = () => {
        setApplianceHolders(prevState => [
            ...prevState,
            <Appliance
                key={prevState.length - 1}
                num={prevState.length}
                appliances={selectedAppliances}
                onAddAppliance={addAppliance}
                sarimaRate={sarimaRate}
            />,
        ]);
    };

    const submitDataHandler = e => {
        e.preventDefault();
        console.log("SUBMITTED");
    };

    return (
        <aside className="calcu">
            <h2>Calculator</h2>

            <form onSubmit={submitDataHandler}>
                {applianceHolders.map((_, index) => (
                    <Appliance
                        key={index}
                        num={index + 1}
                        appliances={selectedAppliances}
                        onAddAppliance={addAppliance}
                        sarimaRate={sarimaRate}
                    />
                ))}

                <button
                    className="calcu__btn add-btn"
                    type="button"
                    onClick={newApplianceHolderHandler}
                >
                    <IoMdAdd />
                </button>

                <div className="calcu__bottom">
                    <p className="formula">
                        Estimated kWH of an appliance (((wattage * (hours * 30 days) * quantity) /
                        1000) * SARIMA_RATE)
                    </p>

                    <button className="calcu__btn submit-btn" type="submit">
                        Submit
                    </button>
                </div>
            </form>
        </aside>
    );
};

export default Calculator;
