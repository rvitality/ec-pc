from flask import Flask, request
from flask_cors import CORS

import csv

from sarima_prediction import predict_rate

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})


@app.get("/api/get_sarima_rate")
def get_sarima_rate():
    forecast = predict_rate()
    sarima_rate = forecast.values[0]
    return {"sarima_rate": sarima_rate}


@app.get("/api/get_last_rate_data")
def get_last_rate_data():

    lastRowData = {}
    with open("official_rates.csv") as f:
        mycsv = csv.reader(f)
        mycsv = list(mycsv)
        lastRowData = mycsv[-1]

    return {
        "last_rate_data": lastRowData,
    }


@app.get("/api/get_rates")
def get_rates():
    with open("official_rates.csv") as f:
        mycsv = csv.reader(f)
        rates = list(mycsv)

    return {"rates": rates}


@app.post("/api/add_official_rate")
def add_official_rate():
    jsonData = request.get_json()
    entered_data = list(jsonData.values())
    receivedMonth = entered_data[0]

    with open("official_rates.csv") as f:
        mycsv = csv.reader(f)
        mycsv = list(mycsv)
        lastRowData = mycsv[-1]
        lastRowMonth = lastRowData[0]

        if receivedMonth == lastRowMonth:
            lines = mycsv[:-1]

            with open("official_rates.csv", "w", newline="") as f:
                writer = csv.writer(f)
                for line in lines:
                    writer.writerow(line)

            with open("official_rates.csv", "a", newline="") as f:
                writer = csv.writer(f)
                writer.writerow(entered_data)

        else:
            with open("official_rates.csv", "a", newline="") as f:
                writer = csv.writer(f)
                writer.writerow(entered_data)

    # run prediction
    next_month_predicted_rate = get_sarima_rate()
    last_rate_data = get_last_rate_data()

    return {**next_month_predicted_rate, **last_rate_data}


if __name__ == "__main__":
    app.run(debug=True)


# with open("official_rates.csv", "r") as rates:
#     print(rates.readlines())
