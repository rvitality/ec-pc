from flask import Flask, request
import csv

from sarima_prediction import predict_rate

app = Flask(__name__)


@app.route("/get_sarima_rate")
def get_sarima_rate():
    forecast = predict_rate()
    predicted_rate = forecast.values[0]
    return {
        "sarima_rate": predicted_rate,
    }


@app.route("/push_official_rate", methods=["GET", "POST"])
def push_official_rate():
    if request.method == "POST":
        jsonData = request.get_json()
        entered_data = list(jsonData.values())

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
