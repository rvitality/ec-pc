import React from "react";
import { useApplianceContext } from "../../context/ApplianceContext";

import "./Modal.styles.scss";

const Modal = () => {
    const { totalBill, selectedAppliances } = useApplianceContext();

    return (
        <div className="modal">
            <div className="forecasted-bill">
                <h2>Your forecasted electric bill is: </h2>
                {totalBill > 0 && (
                    <p className="total-bill">₱{(+totalBill.toFixed(2)).toLocaleString()}</p>
                )}
            </div>

            {totalBill > 0 && (
                <div className="breakdown">
                    <h3>Appliances: </h3>
                    <ul className="lvl1">
                        {selectedAppliances.map(item => (
                            <li key={item.applianceID}>
                                <p>{item.applianceName}</p>
                                <ul className="lvl2">
                                    <li>Quantity: {item.quantity}</li>
                                    <li>Duration(hr): {item.hours}</li>
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* <button className="result__close-btn">Close</button> */}
        </div>
    );
};

export default Modal;
