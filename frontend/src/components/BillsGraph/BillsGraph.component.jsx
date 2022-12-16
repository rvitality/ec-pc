import React from "react";
import { Line } from "react-chartjs-2";

import { Chart } from "chart.js/auto";

import "./BillsGraph.styles.scss";

const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const BillsGraph = ({ bills }) => {
    const yrs = bills.length > 0 ? [...new Set(bills.map(bill => bill.year))] : [];
    const mostRecentYr = yrs.length > 0 ? yrs.slice(-1)[0] : [];

    const mostRecentBills = bills.filter(bill => bill.year === mostRecentYr);

    const predictedBills = mostRecentBills.map(bill => ({
        x: `${bill.month[0].toUpperCase()}${bill.month.slice(1)}`,
        y: bill.forecasted,
    }));

    const actualBills = mostRecentBills.map(bill => ({
        x: `${bill.month[0].toUpperCase()}${bill.month.slice(1)}`,
        y: bill.actual,
    }));

    const data = {
        labels: MONTH_NAMES,
        datasets: [
            {
                label: "Predicted ",
                data: predictedBills,
                borderColor: "orange",
            },
            {
                label: "Official",
                data: actualBills,
                borderColor: "#018BC3",
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
                text: "Bills Progression",
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
                    text: "Bill",
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
        <section className="bills-graph">
            <Line data={data} options={options} />
        </section>
    );
};

export default BillsGraph;
