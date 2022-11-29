import React from "react";
import useFetchCollections from "../../../hooks/useFetchCollections";

import Spinner from "../../../ui/Spinner/Spinner.ui";
import DataTable from "../../../components/DataTable/DataTable.component";
import PredictionsTable from "./PredictionsTable/PredictionsTable.component";

import "./Predictions.styles.scss";
const DUMMY_USERS = [
    {
        id: "EFBiQgz321313EICcN8dx258OvhH6fzJ82",
        email: "jyumul@cca.edu.ph",
        name: "Joshua Yumul",
        photoURL:
            "https://lh3.googleusercontent.com/a/ALm5wu0fDZ1olKA6QQWkWk9TblrBBOe1kDCpreJDUZmZ=s96-c",
        role: "admin",
        records: [
            {
                id: "29d43e07-4f15-4a5c-908d-31df10647a0d",
                actual: 0,
                year: 2022,
                accuracy: 0,
                month: "November",
                status: "good",
                forecasted: 26.4,
            },
        ],
    },
    {
        id: "dwKcA6GulSd0uZ95lPlGjQ4i3Br1",
        email: "daedalusquintus00@gmail.com",
        photoURL:
            "https://lh3.googleusercontent.com/a/ALm5wu0aCgS_2oY-BlBvhl4hta8O21Ktjmdbt8UI15Q6=s96-c",
        records: [
            {
                forecasted: 624.8894388,
                id: "aced2197-c603-449d-adaa-ed33641cd767",
                status: "good",
                actual: 534.3214512,
                accuracy: 85.51,
                month: "November",
                year: 2022,
            },
        ],
        name: "Daedalus",
        role: "admin",
    },
    {
        id: "dwKcA6GulSd0uZ95l21321PlGjQ4i3Br1",
        email: "daedalusquintus00@gmail.com",
        photoURL:
            "https://lh3.googleusercontent.com/a/ALm5wu0aCgS_2oY-BlBvhl4hta8O21Ktjmdbt8UI15Q6=s96-c",
        records: [
            {
                forecasted: 624.8894388,
                id: "aced2197-c603-449d-adaa-ed33641cd767",
                status: "good",
                actual: 534.3214512,
                accuracy: 85.51,
                month: "November",
                year: 2022,
            },
        ],
        name: "Daedalus",
        role: "admin",
    },
    {
        id: "dwKcA6GulSsadsad0uZ95lPlGjQ4i3Br1",
        email: "daedalusquintus00@gmail.com",
        photoURL:
            "https://lh3.googleusercontent.com/a/ALm5wu0aCgS_2oY-BlBvhl4hta8O21Ktjmdbt8UI15Q6=s96-c",
        records: [
            {
                forecasted: 624.8894388,
                id: "aced2197-c603-449d-adaa-ed33641cd767",
                status: "good",
                actual: 534.3214512,
                accuracy: 85.51,
                month: "November",
                year: 2022,
            },
        ],
        name: "Daedalus",
        role: "admin",
    },
    {
        id: "dwKcA6GulSd0uZzxczxc95lPlGjQ4i3Br1",
        email: "daedalusquintus00@gmail.com",
        photoURL:
            "https://lh3.googleusercontent.com/a/ALm5wu0aCgS_2oY-BlBvhl4hta8O21Ktjmdbt8UI15Q6=s96-c",
        records: [
            {
                forecasted: 624.8894388,
                id: "aced2197-c603-449d-adaa-ed33641cd767",
                status: "good",
                actual: 534.3214512,
                accuracy: 85.51,
                month: "November",
                year: 2022,
            },
        ],
        name: "Daedalus",
        role: "admin",
    },
    {
        id: "dwKcA6GulSd0uZ95212135lPlGjQ4i3Br1",
        email: "daedalusquintus00@gmail.com",
        photoURL:
            "https://lh3.googleusercontent.com/a/ALm5wu0aCgS_2oY-BlBvhl4hta8O21Ktjmdbt8UI15Q6=s96-c",
        records: [
            {
                forecasted: 624.8894388,
                id: "aced2197-c603-449d-adaa-ed33641cd767",
                status: "good",
                actual: 534.3214512,
                accuracy: 85.51,
                month: "November",
                year: 2022,
            },
        ],
        name: "Daedalus",
        role: "admin",
    },
    {
        id: "32131saasdad",
        email: "daedalusquintus00@gmail.com",
        photoURL:
            "https://lh3.googleusercontent.com/a/ALm5wu0aCgS_2oY-BlBvhl4hta8O21Ktjmdbt8UI15Q6=s96-c",
        records: [
            {
                forecasted: 624.8894388,
                id: "aced2197-c603-449d-adaa-ed33641cd767",
                status: "good",
                actual: 534.3214512,
                accuracy: 85.51,
                month: "November",
                year: 2022,
            },
        ],
        name: "Daedalus",
        role: "admin",
    },
    {
        id: "dwKcA6GulSd0uZ95lPl5125213213GjQ4i3Br1",
        email: "daedalusquintus00@gmail.com",
        photoURL:
            "https://lh3.googleusercontent.com/a/ALm5wu0aCgS_2oY-BlBvhl4hta8O21Ktjmdbt8UI15Q6=s96-c",
        records: [
            {
                forecasted: 624.8894388,
                id: "aced2197-c603-449d-adaa-ed33641cd767",
                status: "good",
                actual: 534.3214512,
                accuracy: 85.51,
                month: "November",
                year: 2022,
            },
        ],
        name: "Daedalus",
        role: "admin",
    },
    {
        id: "zxcxzcqwr12213",
        email: "daedalusquintus00@gmail.com",
        photoURL:
            "https://lh3.googleusercontent.com/a/ALm5wu0aCgS_2oY-BlBvhl4hta8O21Ktjmdbt8UI15Q6=s96-c",
        records: [
            {
                forecasted: 624.8894388,
                id: "aced2197-c603-449d-adaa-ed33641cd767",
                status: "good",
                actual: 534.3214512,
                accuracy: 85.51,
                month: "November",
                year: 2022,
            },
        ],
        name: "Daedalus",
        role: "admin",
    },
    {
        id: "dwKcA6zxcxzGulSd0uZ5132195lPlGjQ4i3Br1",
        email: "daedalusquintus00@gmail.com",
        photoURL:
            "https://lh3.googleusercontent.com/a/ALm5wu0aCgS_2oY-BlBvhl4hta8O21Ktjmdbt8UI15Q6=s96-c",
        records: [
            {
                forecasted: 624.8894388,
                id: "aced2197-c603-449d-adaa-ed33641cd767",
                status: "good",
                actual: 534.3214512,
                accuracy: 85.51,
                month: "November",
                year: 2022,
            },
        ],
        name: "Daedalus",
        role: "admin",
    },
    {
        id: "dwKcA6GulSd0zxcvzgu51421Z95lfPlGjQ4i3Br1",
        email: "daedalusquintus00@gmail.com",
        photoURL:
            "https://lh3.googleusercontent.com/a/ALm5wu0aCgS_2oY-BlBvhl4hta8O21Ktjmdbt8UI15Q6=s96-c",
        records: [
            {
                forecasted: 624.8894388,
                id: "aced2197-c603-449d-adaa-ed33641cd767",
                status: "good",
                actual: 534.3214512,
                accuracy: 85.51,
                month: "November",
                year: 2022,
            },
        ],
        name: "Daedalus",
        role: "admin",
    },
    {
        id: "dwKcA6GulS321421asdsagsdgsd0uZ95lPlGjQ4i3Br1",
        email: "daedalusquintus00@gmail.com",
        photoURL:
            "https://lh3.googleusercontent.com/a/ALm5wu0aCgS_2oY-BlBvhl4hta8O21Ktjmdbt8UI15Q6=s96-c",
        records: [
            {
                forecasted: 624.8894388,
                id: "aced2197-c603-449d-adaa-ed33641cd767",
                status: "good",
                actual: 534.3214512,
                accuracy: 85.51,
                month: "November",
                year: 2022,
            },
        ],
        name: "Daedalus",
        role: "admin",
    },
    {
        id: "dwKcA6GulS321321321acz421asdsagsdgsd0uZ95lPlGjQ4i3Br1",
        email: "daedalusquintus00@gmail.com",
        photoURL:
            "https://lh3.googleusercontent.com/a/ALm5wu0aCgS_2oY-BlBvhl4hta8O21Ktjmdbt8UI15Q6=s96-c",
        records: [
            {
                forecasted: 624.8894388,
                id: "aced2197-c603-449d-adaa-ed33641cd767",
                status: "good",
                actual: 534.3214512,
                accuracy: 85.51,
                month: "November",
                year: 2022,
            },
        ],
        name: "Daedalus",
        role: "admin",
    },
    {
        id: "dqwewqxeqwevwzxczcqewqf124214213",
        email: "daedalusquintus00@gmail.com",
        photoURL:
            "https://lh3.googleusercontent.com/a/ALm5wu0aCgS_2oY-BlBvhl4hta8O21Ktjmdbt8UI15Q6=s96-c",
        records: [
            {
                forecasted: 624.8894388,
                id: "aced2197-c603-449d-adaa-ed33641cd767",
                status: "good",
                actual: 534.3214512,
                accuracy: 85.51,
                month: "November",
                year: 2022,
            },
        ],
        name: "Daedalus",
        role: "admin",
    },
    {
        id: "dwKcA6GulS33213121321321acz421asdsagsdgsd0uZ95lPlGjQ4i3Br1",
        email: "daedalusquintus00@gmail.com",
        photoURL:
            "https://lh3.googleusercontent.com/a/ALm5wu0aCgS_2oY-BlBvhl4hta8O21Ktjmdbt8UI15Q6=s96-c",
        records: [
            {
                forecasted: 624.8894388,
                id: "aced2197-c603-449d-adaa-ed33641cd767",
                status: "good",
                actual: 534.3214512,
                accuracy: 85.51,
                month: "November",
                year: 2022,
            },
        ],
        name: "Daedalus",
        role: "admin",
    },
];

const Predictions = () => {
    const reqCollectionsResponse = useFetchCollections("users");
    const { error, isLoading, collections: users } = reqCollectionsResponse;

    return (
        <div className="predictions-container">
            {!error && isLoading ? (
                <div className="loading-container">
                    <div className="loading-container__text">Loading...</div>
                    <Spinner />
                </div>
            ) : (
                <DataTable data={users || []} Table={PredictionsTable} />
            )}
        </div>
    );
};

export default Predictions;
