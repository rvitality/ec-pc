import pandas as pd
import numpy as np
import statsmodels.api as sm
from pylab import rcParams
import itertools

# import tensorflow as tf
from sklearn.metrics import mean_squared_error
from math import sqrt


def predict_rate():
    # Read in the dataset
    df = pd.read_csv("official_rates.csv")
    rates = df["Rates"].tolist()
    print(rates)
    df.head()

    # Descriptive Statistics
    df.describe().T

    # Row ID column is redundant, we can drop it
    # df.drop('Months', axis=1, inplace=True)
    new_df = pd.DataFrame(df)
    df.info()

    df["Months"] = pd.to_datetime(df["Months"], format="%Y/%m/%d")
    df.sort_values(by=["Months"], inplace=True, ascending=True)
    # Reset index as Order Date
    df = df.set_index("Months")

    # Select dataframe
    temp_df = df
    resample = "MS"

    new_df = pd.DataFrame(temp_df["Rates"])
    # Resample the average of daily sales
    new_df = pd.DataFrame(new_df["Rates"].resample(resample).mean())
    new_df = new_df.interpolate(method="linear")
    new_df.head()

    # Train / Test / Validate Split
    train_df, test_df, val_df = np.split(
        new_df["Rates"].sample(frac=1),
        [int(0.6 * len(new_df["Rates"])), int(0.8 * len(new_df["Rates"]))],
    )

    # Normalize
    # Do not include test or val in mean calculation to avoid information leakage
    train_mean = train_df.mean()
    train_std = train_df.std()

    train_df = (train_df - train_mean) / train_std
    val_df = (val_df - train_mean) / train_std
    test_df = (test_df - train_mean) / train_std

    def analyze_time_series(time_series_df):
        rcParams["figure.figsize"] = 18, 8
        decomposition = sm.tsa.seasonal_decompose(time_series_df, model="additive")

    analyze_time_series(new_df)

    # Time Series Analysis
    p = d = q = range(0, 2)
    pdq = list(itertools.product(p, d, q))
    seasonal_pdq = [(x[0], x[1], x[2], 12) for x in list(itertools.product(p, d, q))]
    # print("Examples of parameter combinations for Seasonal ARIMAX...")
    # print("SARIMAX: {} x {}".format(pdq[1], seasonal_pdq[1]))
    # print("SARIMAX: {} x {}".format(pdq[1], seasonal_pdq[2]))
    # print("SARIMAX: {} x {}".format(pdq[2], seasonal_pdq[3]))
    # print("SARIMAX: {} x {}".format(pdq[2], seasonal_pdq[4]))

    for (
        parameters
    ) in (
        pdq
    ):  # for loop for determining the best combination of seasonal parameters for SARIMA
        for seasonal_param in seasonal_pdq:
            try:
                mod = sm.tsa.statespace.SARIMAX(
                    new_df,
                    order=parameters,
                    seasonal_param_order=seasonal_param,
                    enforce_stationarity=False,
                    enforce_invertibility=False,
                )  # determines the AIC value of the model**
                results = mod.fit()
                # print(
                #     "SARIMAX{}x{}12 - AIC:{}".format(
                #         parameters, seasonal_param, results.aic
                #     )
                # )
            except:
                continue

    mod = sm.tsa.statespace.SARIMAX(
        new_df,
        order=(0, 1, 0),
        seasonal_order=(0, 1, 0, 12),
        enforce_stationarity=False,
        enforce_invertibility=False,
    )
    results = mod.fit()
    # print(results.summary().tables[1])

    # prediction analysis
    pred = results.get_prediction(start=pd.to_datetime("2022-01-01"), dynamic=False)
    pred_ci = pred.conf_int()
    y_forecasted = pred.predicted_mean
    y_truth = new_df["2022-01-01":]

    mse = mean_squared_error(y_forecasted, y_truth)
    rmse = sqrt(mse)
    print("The Root Mean Squared Error of the forecasts is {}".format(round(rmse, 2)))

    forecast = results.forecast(
        steps=3
    )  # making a forecast of 1 days later of the last date in the 'Order Date' column
    # print(forecast.astype("int"))  # displays the sales forecast as type integer
    pred_uc = results.get_forecast(steps=1)
    pred_ci = pred_uc.conf_int()
    # print(pred_ci)

    return forecast
