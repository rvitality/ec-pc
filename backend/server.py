from flask import Flask, request
import csv

from sarima_prediction import predict_rate

app = Flask(__name__)


@app.route("/get_sarima_rate")
def get_sarima_rate():
    forecast = predict_rate()
    sarima_rate = forecast.values[0]
    return {"sarima_rate": sarima_rate}


@app.route("/get_last_rate_data")
def get_last_rate_data():
    lastRowData = {}
    with open("official_rates.csv") as f:
        mycsv = csv.reader(f)
        mycsv = list(mycsv)
        lastRowData = mycsv[-1]
        print(lastRowData)

    return {"last_rate_data": lastRowData}


@app.route("/push_official_rate", methods=["GET", "POST"])
def push_official_rate():
    if request.method == "POST":
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

        return next_month_predicted_rate


if __name__ == "__main__":
    app.run(debug=True)


# with open("official_rates.csv", "r") as rates:
#     print(rates.readlines())
