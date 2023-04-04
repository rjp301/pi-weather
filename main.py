import pandas as pd
import datetime as dt
import argparse
import json
import os

from library.summarizeData import summarizeData
from library.run_node import run_node
from library.dataframe_to_dict import dataframe_to_dict

parser = argparse.ArgumentParser(
  prog="Weather Summary Email",
  description="Fetch data from constellation of personal weather stations and send to email recipients",
  formatter_class=argparse.ArgumentDefaultsHelpFormatter
)
parser.add_argument("-t","--test",action="store_true")
args = parser.parse_args()

# Define parameters
hrs_of_interest = [7,13,19]
rng_of_interest = [(5,17),(17,29),(0,24)]
yesterday = dt.date.today() - dt.timedelta(days=1)

# Get list of all weather stations
stations = pd.read_csv(os.path.join("data","weatherStations.csv"))

# Initialize results
data = []
summaries = []

# Fetch and summarize history for all stations
for _,station in stations.iterrows():
  try: 
    response = run_node("library/fetchWeatherData.js",[station["id"]])
  except Exception as e:
    print(e)
    print(f"Could not fetch hourly data for {station['name']}")
    continue
  
  history = {}
  history["station"] = station.to_dict()
  history["response"] = json.loads(response)
  data.append(history)

  summary = summarizeData(history,yesterday,hrs_of_interest,rng_of_interest)
  summaries.append(summary)

result = pd.concat(summaries,axis=1).T
print(result)

# Save raw data
fname = os.path.join("data","weatherData.json")
with open(fname,"w") as file: 
  file.write(json.dumps(data))

# Save summary
fname_summaries = os.path.join("data","weatherSummary.json")
with open(fname_summaries,"w") as file: 
  result_dict = dataframe_to_dict(result)
  result_json = json.dumps(result_dict).replace("NaN","null")
  file.write(result_json)

subject = f"CGL S34 Weather Summary - {yesterday:%Y-%m-%d}"


run_node("library/renderHtml.js")

email_test = "--email-test" if args.test else "--email-all"
email_result = run_node("library/sendEmail.js",[subject,email_test])
print(email_result)