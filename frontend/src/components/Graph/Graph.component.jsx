import React from "react";
import { Line } from "react-chartjs-2";

import { Chart } from "chart.js/auto";

import "./Graph.styles.scss";

// const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
// ];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const rates = [
    9.3373, 9.309411, 9.1076, 9.5415, 10.6559, 10.830914, 11.487409, 10.7406, 10.689505, 10.65632,
    10.8854, 11.878485, 13.626412, 13.936211, 12.895415, 12.886791, 12.900309, 13.185409, 15.049805,
    15.137605, 15.012016, 16.515005, 14.123213,
];

const Graph = () => {
    const data = {
        labels: months,
        datasets: [
            {
                label: "2021",
                data: rates.slice(0, 12),
                borderColor: "purple",
            },
            {
                label: "2022",
                data: rates.slice(13),
                borderColor: "#00B526",
            },
            {
                label: "Predicted",
                data: [...rates.slice(13), 17.2323],
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
