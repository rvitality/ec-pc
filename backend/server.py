from flask import Flask

from sarima_prediction import *

app = Flask(__name__)


@app.route("/")
def index():
    return "Hello, World!"


@app.route("/sarima_rate")
def prediction():
    sarima_rate = forecast.tolist()[0]
    accuracy = rmse
    return {"sarima_rate": sarima_rate, "accuracy": accuracy}


if __name__ == "__main__":
    app.run(debug=True)
