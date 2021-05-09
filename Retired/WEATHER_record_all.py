import pandas as pd
from pandas import Timestamp as ts
from pandas import Timedelta as td

from wunderground_pws import WUndergroundAPI, units
from pprint import pprint

wu = WUndergroundAPI(
    api_key="1e81c4e2de6e476e81c4e2de6e476e21",
    units=units.METRIC_UNITS)

def hour_round(t):
    return (t.replace(second=0, microsecond=0, minute=0, hour=t.hour)+td(hours=t.minute//30))

def deg_to_compass(num):
    val = int(num/22.5 + 0.5)
    arr = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
    return arr[val % 16]

class PWS(object):
    # Personal Weather Station object containing all pertinent information
    def __init__(self,name,ID,key,loc):
        self.name = name
        self.ID = ID
        self.key = key
        self.loc = loc

stations = [
    PWS("SAEG_Vanderhoof","IVANDE4","8nYFNJMH","54.05608, -124.02993"),
    PWS("SAEG_Parsnip","IREGIO56","vBCqMKqj","54.76181, -122.49811"),
    PWS("SAEG_Crooked","IREGIO61","xzvVa8U1","54.653556, -122.752946")]

today = ts.today()
fname = f"weather\\WEATHER_record.xlsx"
writer = pd.ExcelWriter(fname, engine="xlsxwriter")

for station in stations:
    
    data = {
        "dateAct": [],
        "dateRnd": [],
        "dewptAvg": [],
        "dewptHigh": [],
        "dewptLow": [],
        "heatindexAvg": [],
        "heatindexHigh": [],
        "heatindexLow": [],
        "precipRate": [],
        "precipTotal": [],
        "pressureMax": [],
        "pressureMin": [],
        "pressureTrend": [],
        "tempAvg": [],
        "tempHigh": [],
        "tempLow": [],
        "windchillAvg": [],
        "windchillHigh": [],
        "windchillLow": [],
        "windgustAvg": [],
        "windgustHigh": [],
        "windgustLow": [],
        "windspeedAvg": [],
        "windspeedHigh": [],
        "windspeedLow": [],
        "winddirAvg": [],
        "winddirTxt": [],
        "uvHigh": [],
        "solarRadiationHigh": []
    }

    delta = 0
    while True:
        date = today - td(days=delta)
        date = date.date()
        delta += 1
        print(date)

        try: 
            result = wu.history(date,station_id=station.ID)
            if not result["observations"]: break
            pprint(result)
        except Exception as e:
            print("\nQuery failed\n")
            print(e)
            break

        for entry in result["observations"]:
            time = pd.to_datetime(entry["obsTimeLocal"], format="%Y-%m-%d %H:%M:%S")
            time_round = hour_round(time)

            data["dateAct"].append(time)
            data["dateRnd"].append(time_round)
            data["dewptAvg"].append(entry["metric"]["dewptAvg"])
            data["dewptHigh"].append(entry["metric"]["dewptHigh"])
            data["dewptLow"].append(entry["metric"]["dewptLow"])
            data["heatindexAvg"].append(entry["metric"]["heatindexAvg"])
            data["heatindexHigh"].append(entry["metric"]["heatindexHigh"])
            data["heatindexLow"].append(entry["metric"]["heatindexLow"])
            data["precipRate"].append(entry["metric"]["precipRate"])
            data["precipTotal"].append(entry["metric"]["precipTotal"])
            data["pressureMax"].append(entry["metric"]["pressureMax"])
            data["pressureMin"].append(entry["metric"]["pressureMin"])
            data["pressureTrend"].append(entry["metric"]["pressureTrend"])
            data["tempAvg"].append(entry["metric"]["tempAvg"])
            data["tempHigh"].append(entry["metric"]["tempHigh"])
            data["tempLow"].append(entry["metric"]["tempLow"])
            data["windchillAvg"].append(entry["metric"]["windchillAvg"])
            data["windchillHigh"].append(entry["metric"]["windchillHigh"])
            data["windchillLow"].append(entry["metric"]["windchillLow"])
            data["windgustAvg"].append(entry["metric"]["windgustAvg"])
            data["windgustHigh"].append(entry["metric"]["windgustHigh"])
            data["windgustLow"].append(entry["metric"]["windgustLow"])
            data["windspeedAvg"].append(entry["metric"]["windspeedAvg"])
            data["windspeedHigh"].append(entry["metric"]["windspeedHigh"])
            data["windspeedLow"].append(entry["metric"]["windspeedLow"])
            data["winddirAvg"].append(entry["winddirAvg"])
            data["winddirTxt"].append(deg_to_compass(entry["winddirAvg"]))
            data["uvHigh"].append(entry["uvHigh"])
            data["solarRadiationHigh"].append(entry["solarRadiationHigh"])

    df = pd.DataFrame(data=data)
    df.to_excel(writer,sheet_name=station.name,index=False)
    
    print(df)
    print(f"{station.name} data written to Excel")

writer.save()