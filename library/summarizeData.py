import pandas as pd
import datetime as dt
import json
import os

hrs_of_interest = [7,13,19]
rng_of_interest = [(5,17),(17,29),(0,24)]

def round_hr(then):
  return dt.datetime(
    year=then.year,
    month=then.month,
    day=then.day,
    hour=round(then.hour + then.minute/60)%24
  )

def hr_txt(hr):
  return dt.time(hour=hr%24).strftime("%I%p").lstrip("0")

def date_from_str(string):
  return dt.datetime.strptime(string,"%Y-%m-%d %H:%M:%S")

def deg_to_compass(num:float) -> str:
  val = int(num/22.5 + 0.5)
  arr = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
  return arr[val % 16]

def rain_total(dataframe:pd.DataFrame) -> float:
  dataframe.reset_index(inplace=True)

  precip_rate_max = dataframe["metric.precipRate"].max()
  precip_total_max = dataframe["metric.precipTotal"].max()

  if precip_rate_max <= 0: return 0
  return precip_total_max - dataframe.at[0,"metric.precipTotal"]

def summarizeData(history:dict) -> dict:
  station = history["station"]
  
  columns = ["Name"]
  columns += [f"{hr_txt(hr)} Temp" for hr in hrs_of_interest]
  columns += [f"{hr_txt(hr)} Wind" for hr in hrs_of_interest]
  columns += [f"{hr_txt(i[0])}-{hr_txt(i[1])}" for i in rng_of_interest]

  result = pd.Series(index=columns,dtype=str)
  result["Name"] = station["name"]

  if "observations" not in history["response"]:
    print(f"No data from {station['name']}")
    return result.fillna("NO DATA")
  
  data = pd.json_normalize(history["response"]["observations"])
  data["time_rnd"] = data["obsTimeLocal"].apply(lambda i: round_hr(date_from_str(i)))
  data = (data
    .drop_duplicates(subset=["time_rnd"],keep="first")
    .set_index("time_rnd")
    .sort_index(ascending=False)
  )
  # print(data)

  yesterday = dt.date.today() - dt.timedelta(days=1)

  # if len(data) < 18:
  #   print(f"Station has not reported for last 18 hours")
  #   return result.fillna("OFFLINE")
  
  # Get temperature and wind for times of interest
  for hr in hrs_of_interest:
    index_dt = dt.datetime.combine(yesterday,dt.time(hour=hr))
    if index_dt not in data.index: continue

    data_hr = data.loc[index_dt]
    result[f"{hr_txt(hr)} Temp"] = f"{data_hr['metric.tempAvg']:.0f}°C"
    result[f"{hr_txt(hr)} Wind"] = f"{data_hr['metric.windspeedAvg']:.0f}km/h {deg_to_compass(data_hr['winddirAvg'])}"

  data = data.reset_index()
  for rng in rng_of_interest:
    yesterday_beg = dt.datetime.combine(yesterday,dt.time(hour=0))
    
    hr_beg = yesterday_beg + dt.timedelta(hours=rng[0])
    hr_end = yesterday_beg + dt.timedelta(hours=rng[1])
    hr_mid = yesterday_beg + dt.timedelta(hours=24)
    
    # filter for data bewteen points of interest
    temp = data.loc[data["time_rnd"].between(hr_beg,hr_end)].copy()

    if len(temp) <= 4:
      rain_tot = None

    elif rng[0] < 24 and rng[1] > 24:
      pre_mid = temp[temp["time_rnd"] < hr_mid].reset_index(drop=True)
      post_mid = temp[temp["time_rnd"] >= hr_mid].reset_index(drop=True)
      rain_tot = rain_total(pre_mid) + rain_total(post_mid)

    else:
      rain_tot = rain_total(temp)

    result[f"{hr_txt(rng[0])}-{hr_txt(rng[1])}"] = f"{rain_tot:.1f}mm" if rain_tot != None else "NO DATA"
  
  return result

if __name__ == "__main__":
  with open("data/weatherData.json") as file:
    datasets = json.loads(file.read())

  summaries = []
  for dataset in datasets:
    summary = summarizeData(dataset)
    summaries.append(summary)

  data = pd.concat(summaries,axis=1).T
  print(data)