import React, { useState } from "react";
import Appliance from "../Appliance/Appliance.component";

import { IoMdAdd } from "react-icons/io";

import "./Calculator.styles.scss";
import { useApplianceContext } from "../../context/ApplianceContext";

const Calculator = () => {
    const { setTotalBill, selectedAppliances, setSelectedAppliances } = useApplianceContext();

    const [applianceHolders, setApplianceHolders] = useState(Array(3).fill());

    const addApplianceHandler = appliance => {
        console.log(appliance);

        const exisitingAppliance = selectedAppliances.find(
            item => item.applianceID === appliance.applianceID
        );

        // add
        if (!exisitingAppliance) {
            setSelectedAppliances(prevState => [...prevState, appliance]);
        } else {
            // update
            const updatedAppliances = selectedAppliances.map(item => {
                if (item.applianceID === exisitingAppliance.applianceID) {
                    return appliance;
                }

                return item;
            });
            setSelectedAppliances(updatedAppliances);
        }
    };

    const newApplianceHolderHandler = () => {
        setApplianceHolders(prevState => [...prevState, <Appliance num={prevState.length} />]);
    };

    const submitDataHandler = () => {
        const total = selectedAppliances.reduce(
            (sum, appliance) => sum + appliance.applianceBill,
            0
        );

        setTotalBill(total);
        console.log(total);
        console.log(selectedAppliances);
    };

    return (
        <aside className="calcu">
            <h2>Calculator</h2>

            {applianceHolders.map((_, index) => (
                <Appliance
                    key={index}
                    num={index + 1}
                    appliances={selectedAppliances}
                    onAddAppliance={addApplianceHandler}
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
                <p className="formula">Total Estimated kWH of all Appliances (kWH * 30 days)</p>

                <button className="calcu__btn submit-btn" onClick={submitDataHandler} type="button">
                    Submit
                </button>
            </div>
        </aside>
    );
};

export default Calculator;
