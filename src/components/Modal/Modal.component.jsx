import React from "react";
import { useApplianceContext } from "../../context/ApplianceContext";

import "./Modal.styles.scss";

const Modal = () => {
    const { totalBill, selectedAppliances, sarimaRate } = useApplianceContext();

    return (
        <div className="modal">
            <div className="forecasted-bill">
                <div>
                    <h3>Forecasted electric bill: </h3>
                    {totalBill > 0 && (
                        <p className="value">
                            ₱{totalBill.toLocaleString("en", { minimumFractionDigits: 2 })}
                        </p>
                    )}
                </div>
                <div className="divider"></div>
                <div>
                    <h3>Sarima Rate: </h3>
                    <p className="value">
                        ₱{sarimaRate.toLocaleString("en", { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            {totalBill > 0 && (
                <div className="breakdown">
                    <h3>Appliances: </h3>
                    <ul className="lvl1">
                        {selectedAppliances.map(item => (
                            <li key={item.applianceID}>
                                <p>{item.applianceName}</p>
                                <div className="info">
                                    <ul className="lvl2">
                                        <li>
                                            Quantity: <span className="value">{item.quantity}</span>
                                        </li>
                                        <li>
                                            Duration(hr):{" "}
                                            <span className="value">{item.hours}</span>
                                        </li>
                                    </ul>
                                    <div className="total">
                                        Total:{" "}
                                        <span className="value">
                                            ₱
                                            {item.applianceBill.toLocaleString("en", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                </div>
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
