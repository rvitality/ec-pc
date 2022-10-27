import React from "react";
import { createPortal } from "react-dom";

import { useApplianceContext } from "../../context/ApplianceContext";

import "./Modal.styles.scss";

const Backdrop = ({ onCloseModal }) => {
    return <div className="backdrop" onClick={onCloseModal}></div>;
};

const ModalContent = props => {
    const { totalBill, sarimaRate, appliances, onCloseModal } = props;

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
                    <h3>SARIMA Rate: </h3>
                    <p className="value">
                        ₱{sarimaRate.toLocaleString("en", { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            <div className="breakdown">
                <h3>Appliances: </h3>
                <ul className="lvl1">
                    {appliances.map(item => (
                        <li key={item.applianceID}>
                            <p className="appliance-name">
                                <span>{item.applianceName}</span>
                            </p>
                            <div className="info">
                                <ul className="lvl2">
                                    <li>
                                        Wattage: <span className="value">{item.wattage}</span>
                                    </li>
                                    <li>
                                        Quantity: <span className="value">{item.quantity}</span>
                                    </li>
                                    <li>
                                        Duration(hr): <span className="value">{item.duration}</span>
                                    </li>
                                </ul>
                                <div className="total">
                                    Total:{" "}
                                    <span className="value">
                                        ₱
                                        {item.applianceBill?.toLocaleString("en", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <button className="modal__close-btn" onClick={onCloseModal}>
                Close
            </button>
        </div>
    );
};

const Modal = () => {
    const { totalBill, appliances, sarimaRate, modalIsOpen, setModalIsOpen } =
        useApplianceContext();

    const closeModalHandler = () => {
        setModalIsOpen(false);
    };

    return (
        <>
            {modalIsOpen && (
                <>
                    {createPortal(
                        <Backdrop onCloseModal={closeModalHandler} />,
                        document.getElementById("backdrop-root")
                    )}
                    {createPortal(
                        <ModalContent
                            totalBill={totalBill}
                            appliances={appliances}
                            sarimaRate={sarimaRate}
                            onCloseModal={closeModalHandler}
                        />,
                        document.getElementById("modal-root")
                    )}
                </>
            )}
        </>
    );
};

export default Modal;
