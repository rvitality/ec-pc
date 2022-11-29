import React from "react";
import { Line } from "react-chartjs-2";

import { Chart } from "chart.js/auto";

import "./Graph.styles.scss";

const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

const RATES = [
    9.3373, 9.309411, 9.1076, 9.5415, 10.6559, 10.830914, 11.487409, 10.7406, 10.689505, 10.65632,
    10.8854, 11.878485, 13.626412, 13.936211, 12.895415, 12.886791, 12.900309, 13.185409, 15.049805,
    15.137605, 15.012016, 16.515005, 14.123213,
];

const Graph = ({ rates = [], predictedRates = [] }) => {
    // console.log(rates);

    // ! THERE WILL ALWAYS BE AT LEAST 24 RATES BECAUSE PYTHON (SARIMA) REQUIRES IT TO PREDICT A VALUE
    const yrs = rates ? [...new Set(rates.map(rate => rate.yr))] : [];
    const lastTwoYrs = yrs.length >= 2 ? yrs.slice(-2) : [];

    const [firstYr, secondYr] = lastTwoYrs;

    const firstYearData = rates
        .map(rate => (rate.yr === firstYr ? { x: rate.x - 1, y: rate.y, yr: rate.yr } : null))
        .filter(Boolean);
    const secondYearData = rates
        .map(rate => (rate.yr === secondYr ? { x: rate.x - 1, y: rate.y, yr: rate.yr } : null))
        .filter(Boolean);

    // predictedRates = [
    //     { x: "Nov", y: 17.2113213, yr: 2021 },
    //     { x: "Nov", y: 17.2113213, yr: 2021 },
    //     { x: "Nov", y: 17.2113213, yr: 2021 },
    //     { x: "Dec", y: 19.2113213, yr: 2022 },
    //     { x: "Jan", y: 22.2113213, yr: 2023 },
    //     { x: "Jan", y: 22.2113213, yr: 2024 },
    // ];

    const formattedPredictedRates = predictedRates?.map(rate => {
        const { date, value } = rate;
        const dateSplit = date.split("/");

        const yr = +dateSplit[0];
        const monthIndex = dateSplit[1] - 1;
        const monthName = MONTH_NAMES[monthIndex];

        return { yr, x: monthName, y: value };
    });

    const predictedRatesYrs = formattedPredictedRates
        ? [...new Set(formattedPredictedRates.map(rate => rate.yr))]
        : [];

    const lastPredictedYr = predictedRatesYrs?.slice(-1)[0];
    const lastPredictedYearData = formattedPredictedRates.filter(rate =>
        rate.yr === lastPredictedYr ? { x: rate.x, y: rate.y } : null
    );

    const data = {
        labels: MONTH_NAMES,
        datasets: [
            {
                label: firstYr,
                data: firstYearData,
                borderColor: "purple",
            },
            {
                label: secondYr,
                data: secondYearData,
                borderColor: "#00B526",
            },
            {
                label: "Predicted",
                data: lastPredictedYearData,
                borderColor: "red",
            },
        ],
    };

    const options = {
        responsive: true,
        lineTension: 0.5,
        interaction: {
            mode: "index",
            intersect: false,
        },
        plugins: {
            title: {
                display: true,
                text: "Official Rates",
                padding: {
                    top: 10,
                    bottom: 20,
                },
                font: {
                    size: 16,
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Months",
                    crossAlign: "far",
                    font: {
                        weight: "bold",
                    },
                    padding: {
                        top: 10,
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Rate",
                    font: {
                        weight: "bold",
                    },
                    padding: {
                        bottom: 10,
                    },
                },
            },
        },
    };

    return (
        <aside className="graph-container">
            <Line data={data} options={options} />
        </aside>
    );
};

export default Graph;
