import React, { useRef, useState, useEffect } from "react";

import { useAuthContext } from "../../../context/AuthContext";
import { useApplianceContext } from "../../../context/ApplianceContext";
import { updatePredictedRates, updateUserAppliances } from "../../../utils/firebase.utils";

import Spinner from "../../../ui/Spinner/Spinner.ui";

import useFetchLastRate from "../../../hooks/useFetchLastRate";

import "./OfficialRateForm.styles.scss";

const OfficialRateForm = ({ predictedRates, onChangeLatestOfficialRate }) => {
    const { user, setUserAppliances } = useAuthContext();
    const receivedLastRate = useFetchLastRate();
    const { value } = receivedLastRate || {};

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [currentOfficialRate, setCurrentOfficialRate] = useState(value);
    const date = (currentOfficialRate && currentOfficialRate[0]) || 0;
    const rate = (currentOfficialRate && +currentOfficialRate[1]) || 0;

    const { setSarimaRate } = useApplianceContext();
    const rateInputRef = useRef();

    const currentDate = new Date();
    const monthLong = currentDate.toLocaleDateString("en-US", { month: "long" });
    const day = currentDate.getDate();
    const yr = currentDate.getFullYear();

    useEffect(() => {
        setCurrentOfficialRate(receivedLastRate.value);
    }, [receivedLastRate.value]);

    const submitHanlder = e => {
        e.preventDefault();

        const rateInput = rateInputRef.current?.value;
        setCurrentOfficialRate(prevState => {
            prevState[prevState.length - 1] = rateInput;
            return [...prevState];
        });

        const month = currentDate.getMonth() + 1;
        const dateToday = `${yr}/${month}/1`;

        const sendRequestOfficialRate = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "https://ec-pc-flaskapi.onrender.com/api/add_official_rate",
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        method: "POST",
                        body: JSON.stringify({
                            date: dateToday,
                            rate: rateInput,
                        }),
                    }
                );

                if (!response.ok) throw Error("Something went wrong");

                const data = await response.json();
                const { last_rate_data, sarima_rate } = data;

                setSarimaRate(sarima_rate);
                setCurrentOfficialRate(last_rate_data);

                // update firestore db
                // ! -------------------------------------
                if (!last_rate_data) return;
                const [date, rate] = last_rate_data;

                // ex. 2022/11/1
                const dateSplit = date?.split("/");

                let newMonth = +dateSplit[1];
                let newYr = +dateSplit[0];

                // + 1 because 11 is december and 0 is january
                if (newMonth + 1 > 12) {
                    newMonth = 1;
                    newYr += 1;
                } else {
                    newMonth += 1;
                }

                const lastOfficialRateDate = `${newYr}/${newMonth}/1`;
                let predictedRatesCopy = [...predictedRates];

                const existingPredictedRateIndex = predictedRatesCopy.findIndex(
                    rate => rate.date === lastOfficialRateDate
                );

                console.log(existingPredictedRateIndex);

                // ! UPDATE -------
                if (existingPredictedRateIndex >= 0) {
                    predictedRatesCopy[existingPredictedRateIndex].value = sarima_rate;
                    await updatePredictedRates({
                        id: "pHyzqSueZeBWo2iA5IGg",
                        predictedRates: predictedRatesCopy,
                    });

                    onChangeLatestOfficialRate({
                        predictedRates: predictedRatesCopy,
                        last_rate_data,
                    });
                } else {
                    // ! ADD NEW -------
                    console.log("add new");
                    const newPredictedRate = { date: lastOfficialRateDate, value: sarima_rate };

                    await updatePredictedRates({
                        id: "pHyzqSueZeBWo2iA5IGg",
                        predictedRates: [...predictedRates, newPredictedRate],
                    });

                    updateUserAppliances({
                        id: user.id,
                        selectedAppliances: [],
                    });

                    setUserAppliances([]);
                }

                // if (newPredictedRates.length > 1) {
                //     newPredictedRates[newPredictedRates.length - 1].value = sarima_rate;
                //     await updatePredictedRates({
                //         id: "pHyzqSueZeBWo2iA5IGg",
                //         predictedRates: newPredictedRates,
                //     });
                // } else {
                //     // add new predicted rate

                //     const newPredictedRates = { date: lastOfficialRateDate, value: rate };

                //     await updatePredictedRates({
                //         id: "pHyzqSueZeBWo2iA5IGg",
                //         predictedRates: [newPredictedRates],
                //     });
                // }
            } catch (err) {
                console.log(err);
                setError(err.message);
            }

            setLoading(false);
        };

        sendRequestOfficialRate();

        // const sendRequestUpdatePredictedRates = async () => {
        //     // const reponse = await updatePredictedRates({ id: "pHyzqSueZeBWo2iA5IGg" });
        // };

        // sendRequestUpdatePredictedRates();
    };

    return (
        <form onSubmit={submitHanlder} className="official-rate-form">
            <div className="date">
                <span className="label">Date Today: </span> {monthLong} {day}, {yr}
            </div>
            <div className="official-rate-form__control rate">
                <div>
                    <label>
                        Latest Official Rate <small>({date}): </small>
                    </label>
                    <div className="sarima-rate">₱ {rate.toFixed(2)} kWh</div>
                </div>
                <div className="loading">
                    {(loading || receivedLastRate.loading) && (
                        <>
                            <p>Updating ...</p>
                            <Spinner />
                        </>
                    )}
                </div>
            </div>
            <div className="official-rate-form__control">
                <label htmlFor="rate">Update Rate:</label>
                <input type="number" id="rate" step="any" ref={rateInputRef} required />
            </div>
            <button type="submit" className="btn btn__primary">
                Submit
            </button>
        </form>
    );
};

export default OfficialRateForm;
