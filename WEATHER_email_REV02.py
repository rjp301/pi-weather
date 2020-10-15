import pandas as pd
from pandas import Timestamp as ts
from pandas import Timedelta as td

from wunderground_pws import WUndergroundAPI, units

import yagmail
from pprint import pprint
from sys import platform

wu = WUndergroundAPI(
    api_key="6c21a0c6b224472ba1a0c6b224372b63",
    units=units.METRIC_UNITS)

def hour_round(t):
    return (t.replace(second=0, microsecond=0, minute=0, hour=t.hour)+td(hours=t.minute//30))

class PWS(object):
    # Personal Weather Station object containing all pertinent information
    def __init__(self,name,ID,key,loc):
        self.name = name
        self.ID = ID
        self.key = key
        self.loc = loc

def deg_to_compass(num):
    val = int(num/22.5 + 0.5)
    arr = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
    return arr[val % 16]

stations = [
    PWS("SAEG_Vanderhoof","IVANDE4","8nYFNJMH","54.05608, -124.02993"),
    PWS("SAEG_Parsnip","IREGIO56","vBCqMKqj","54.76181, -122.49811"),
    PWS("SAEG_Crooked","IREGIO61","xzvVa8U1","54.653556, -122.752946")]

today = ts.today()
yesterday = today - td(days=1)
yesterday_text = ts.strftime(yesterday,"%Y-%m-%d")

subject = "Weather Summary - " + yesterday_text
print(subject)

result_table = {
    "Weather Station":[],
    "7AM Temp":[],
    "7AM Wind":[],
    "7PM Temp":[],
    "7PM Wind":[],
    "Precip":[]
}
result_print = ""

for station in stations:
    result_table["Weather Station"].append(station.name)
    result_print += station.name.upper() + "\n"
    try:
        history = wu.history(date=yesterday,granularity="hourly",station_id=station.ID)["observations"]

        AM = True
        for index,record in enumerate(history):
            time = ts.strptime(record["obsTimeLocal"], "%Y-%m-%d %H:%M:%S")
            time_round = hour_round(time)
            if time_round.hour == 8 or time_round.hour == 20:
                temp = record["metric"]["tempAvg"]
                wind_speed = record["metric"]["windspeedHigh"]
                wind_dir = deg_to_compass(float(record["winddirAvg"]))

                temp_str = f"{temp}°C"
                wind_str = f"{wind_speed}km/h {wind_dir}"

                if AM: 
                    result_table["7AM Temp"].append(temp_str)
                    result_table["7AM Wind"].append(wind_str)
                else: 
                    result_table["7PM Temp"].append(temp_str)
                    result_table["7PM Wind"].append(wind_str)

                if AM: result_print += " 7:00 AM:\n"
                else: result_print += " 7:00 PM:\n"
                result_print += f"   Temperature = {temp}°C\n"
                result_print += f"   Wind = {wind_speed}km/h {wind_dir}\n"

                AM = False
    
    except:
        result_table["7AM Temp"].append("NO DATA")
        result_table["7AM Wind"].append("NO DATA")
        result_table["7PM Temp"].append("NO DATA")
        result_table["7PM Wind"].append("NO DATA")

        result_print += " No temperature data\n"
        result_print += " No wind data\n"

    try:
        total_precip = wu.history(date=yesterday,granularity="daily",station_id=station.ID)["observations"][0]["metric"]["precipTotal"]
        result_table["Precip"].append(f"{total_precip}mm")
        result_print += f" Total Precipitation = {total_precip}mm\n\n"
    
    except:
        result_table["Precip"].append("NO DATA")
        result_print += " No precipitation data\n\n"


df = pd.DataFrame(data=result_table)

print(result_print)
print(df)

# Acquire emails
if platform.startswith('linux'):
    fname_emails = "/home/pi/weather/WEATHER_emails.txt"
else:
    fname_emails = "weather\\WEATHER_emails.txt"

emails = []
with open(fname_emails,newline="\r\n") as file:
    rows = file.read().splitlines()
    for row in rows:
        emails.append(row)
print(emails)

# Send Email
to = "rpaul@saenergygroup.com" #emails
text = df.to_string(index=False)

try:
    yag = yagmail.SMTP("rpaul.aecon@gmail.com","rzcxcrjefxusollv")
    yag.send(to=to,subject=subject,contents=text)
    print("Email SENT")
except:
    print("Email not sent")
