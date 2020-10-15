import pandas as pd
from pandas import Timestamp as ts
from pandas import Timedelta as td

from openpyxl import load_workbook

from wunderground_pws import WUndergroundAPI, units
from pprint import pprint
from sys import platform
import dropbox

wu = WUndergroundAPI(
    api_key="1e81c4e2de6e476e81c4e2de6e476e21",
    units=units.METRIC_UNITS)

def hour_round(t):
    return (t.replace(second=0, microsecond=0, minute=0, hour=t.hour)+td(hours=t.minute//30))

def deg_to_compass(num):
    val = int(num/22.5 + 0.5)
    arr = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
    return arr[val % 16]

def upload_to_dbx(fname_in,fname_out):
    app_token = "C3UXpmLsHncAAAAAAAAAAXrgdTMQG1hC3tiAmQJSRxzDm432bzXP8MSpfwoectAX"
    dbx = dropbox.Dropbox(app_token)

    with open(fname_in,"rb") as file:
        dbx.files_upload(file.read(),fname_out,mode=dropbox.files.WriteMode.overwrite)

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
yesterday = today - td(days=1)

fname = "weather\\WEATHER_record.xlsx"
wb = load_workbook(fname)

for station in stations:
    ws = wb[station.name]

    try: 
        result = wu.history(yesterday,granularity="hourly",station_id=station.ID)["observations"]
        if not result: break
    except Exception as e:
        print("\nQuery failed\n")
        print(e)
        break

    for entry in result:
        time = pd.to_datetime(entry["obsTimeLocal"], format="%Y-%m-%d %H:%M:%S")
        time_round = hour_round(time)
    
        data = {
            "A": time,
            "B": time_round,
            "C": entry["metric"]["dewptAvg"],
            "D": entry["metric"]["dewptHigh"],
            "E": entry["metric"]["dewptLow"],
            "F": entry["metric"]["heatindexAvg"],
            "G": entry["metric"]["heatindexHigh"],
            "H": entry["metric"]["heatindexLow"],
            "I": entry["metric"]["precipRate"],
            "J": entry["metric"]["precipTotal"],
            "K": entry["metric"]["pressureMax"],
            "L": entry["metric"]["pressureMin"],
            "M": entry["metric"]["pressureTrend"],
            "N": entry["metric"]["tempAvg"],
            "O": entry["metric"]["tempHigh"],
            "P": entry["metric"]["tempLow"],
            "Q": entry["metric"]["windchillAvg"],
            "R": entry["metric"]["windchillHigh"],
            "S": entry["metric"]["windchillLow"],
            "T": entry["metric"]["windgustAvg"],
            "U": entry["metric"]["windgustHigh"],
            "V": entry["metric"]["windgustLow"],
            "W": entry["metric"]["windspeedAvg"],
            "X": entry["metric"]["windspeedHigh"],
            "Y": entry["metric"]["windspeedLow"],
            "Z": entry["winddirAvg"],
            "AA": deg_to_compass(entry["winddirAvg"]),
            "AB": entry["uvHigh"],
            "AC": entry["solarRadiationHigh"] 
        }

        ws.append(data)

    print(f"{station.name} data written to Excel")

wb.save(fname)

if platform.startswith('linux'): fname_in = "/home/pi/weather/WEATHER_record.xlsx"
else: fname_in = "weather\\WEATHER_record.xlsx"

fname_out = "/5_ENG-CGLS34/42_Weather/WEATHER_record.xlsx"

upload_to_dbx(fname_in,fname_out)
print("File has been uploaded")