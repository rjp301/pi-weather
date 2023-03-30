import pandas as pd

data = pd.read_csv("weather_stations.csv")
data.to_json("weather_stations.json",orient="records")