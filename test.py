import pandas as pd

data = pd.read_csv("data/weatherStations.csv")
data.to_json("weather_stations.json",orient="records")