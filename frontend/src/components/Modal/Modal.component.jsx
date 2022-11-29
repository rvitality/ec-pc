import React from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

import { useApplianceContext } from "../../context/ApplianceContext";
import Spinner from "../../ui/Spinner/Spinner.ui";

import "./Modal.styles.scss";

const Backdrop = ({ onCloseModal }) => {
    return <div className="backdrop" onClick={onCloseModal}></div>;
};

const ModalContent = props => {
    const { forecastedBill, sarimaRate, appliances, onCloseModal } = props;

    let highestBillAppliance = appliances[0];
    if (appliances.length > 1) {
        appliances.forEach(appliance => {
            if (appliance.applianceBill > highestBillAppliance.applianceBill) {
                highestBillAppliance = appliance;
            }
        });
    }

    return (
        <div className="modal">
            <div className="upper">
                <div>
                    <div className="heading">Forecasted electric bill: </div>
                    {forecastedBill > 0 && (
                        <p className="upper__value">
                            ₱ {forecastedBill.toLocaleString("en", { minimumFractionDigits: 2 })}
                        </p>
                    )}
                </div>
                <div className="divider"></div>
                <div>
                    <div className="heading">SARIMA Rate: </div>
                    <div>
                        {sarimaRate !== 1 ? (
                            <>
                                <div className="upper__value">
                                    ₱{" "}
                                    {sarimaRate.toLocaleString("en", { minimumFractionDigits: 2 })}
                                </div>
                            </>
                        ) : (
                            <>
                                <Spinner />
                                <div className="small">Please wait ...</div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="mid">
                <div className="breakdown">
                    <div className="heading">Appliances </div>
                    <ul className="lvl1">
                        {appliances.map(item => {
                            const {
                                applianceID,
                                applianceName,
                                wattage,
                                quantity,
                                duration,
                                applianceBill,
                                inputDurations,
                            } = item;

                            return (
                                <li key={applianceID}>
                                    <p className="appliance-name">
                                        <span>{applianceName}:</span>
                                    </p>
                                    <div className="info">
                                        <ul className="lvl2">
                                            <li>
                                                Wattage: <span className="value">{wattage}</span>
                                            </li>
                                            <li>
                                                Quantity: <span className="value">{quantity}</span>
                                            </li>
                                            <li>
                                                Duration(hr):{" "}
                                                <span className="value">
                                                    {inputDurations.length > 5
                                                        ? `${inputDurations
                                                              .slice(0, 5)
                                                              .join(", ")} ...`
                                                        : inputDurations.join(", ")}
                                                </span>
                                            </li>
                                        </ul>
                                        <div>
                                            Total:{" "}
                                            <span className="total">
                                                ₱{" "}
                                                {applianceBill?.toLocaleString("en", {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {highestBillAppliance && (
                    <div className="tips">
                        <div className="heading">Tips</div>
                        <p className="tips__content">
                            <span className="appliance-name">
                                {highestBillAppliance.applianceName}
                            </span>{" "}
                            is the highest contributor on your bill. Try to monitor your usage of it
                            and check these websites to know how to save electricity.
                        </p>

                        <ul className="list-links">
                            <li>
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://www.energy.gov/energysaver/energy-saver-guide-tips-saving-money-and-energy-home"
                                >
                                    energy.gov
                                </a>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://energysavingtrust.org.uk/hub/quick-tips-to-save-energy/"
                                >
                                    energysavingtrust.org
                                </a>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://www.directenergy.com/learning-center/25-energy-efficiency-tips"
                                >
                                    directenergy.com
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <div className="actions">
                <button className="actions__btn actions__save-btn" onClick={onCloseModal}>
                    Save
                </button>

                <button className="actions__btn actions__close-btn" onClick={onCloseModal}>
                    Close
                </button>
            </div>
        </div>
    );
};

const Modal = () => {
    const { forecastedBill, appliances, sarimaRate, modalIsOpen, setModalIsOpen } =
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
                            forecastedBill={forecastedBill}
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
