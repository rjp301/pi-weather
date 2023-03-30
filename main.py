import pandas as pd
import datetime as dt
import subprocess
import json
import os

from library.summarizeData import summarizeData

def run_node(fname:str,args:list = []) -> str:
  p = subprocess.Popen(["node", fname, *args], stdout=subprocess.PIPE)
  return p.stdout.read().decode("utf-8")

fname_stations = os.path.join("data","weatherStations.csv")
stations = pd.read_csv(fname_stations)
print(stations)

raw_data = []
summaries = []

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
  raw_data.append(history)

  # summary = summarizeData(history)
  # summaries.append(summaries)

fname = os.path.join("data","weatherData.json")
with open(fname,"w") as file: 
  file.write(json.dumps(raw_data))
  

fname_summaries = os.path.join("data","weatherSummary.json")
with open(fname_summaries,"w") as file: 
  file.write(json.dumps(summaries))
  
run_node("library/sendEmail.js",fname_summaries)
