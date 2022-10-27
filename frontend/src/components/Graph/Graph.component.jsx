import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

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

const Graph = () => {
    const data = {
        labels: months.slice(0, 9),
        datasets: [
            {
                label: "Electic Bill",
                data: [5135, 4953, 5160, 5020, 5142, 5230, 5058, 4930, 5305],
                fill: true,
                borderColor: "#47AAEC",
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        lineTension: 0.5,
        plugins: {
            title: {
                display: true,
                text: "2022 Electric Bills",
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
                    text: "Month",
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
                    text: "Bills",
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
