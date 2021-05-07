from pprint import pprint
from sys import platform
from wunderground_pws import WUndergroundAPI, units

import datetime as dt
import pandas as pd
import yagmail
import os 

wu = WUndergroundAPI(
    api_key="ee026438a7544b0d826438a7544b0d01",
    units=units.METRIC_UNITS)

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
    PWS("SAEG_Parsnip","IREGIO82","021B6rFM","54.76181, -122.49811"),
    PWS("SAEG_Crooked","IREGIO61","xzvVa8U1","54.653556, -122.752946"),
    PWS("SAEG_Salmon","IREGIO64","HwajIWff","54.394, -123.171"),
    PWS("SAEG_Stuart","IBULKL8","xKoizTAr","54.174476, -123.683109")]

today = dt.date.today()
yesterday = today - dt.timedelta(days=1)
yesterday_text = dt.date.strftime(yesterday,"%Y-%m-%d")

subject = "CGL S34 Weather Summary - " + yesterday_text
print(subject)

hr_of_interest = [7,13,19]

result_table = pd.DataFrame()
station_results = []

for index,station in enumerate(stations):
    result_table.at[index,"Weather Station"] = station.name
    
    try:
        history = wu.history(date=yesterday,granularity="hourly",station_id=station.ID)["observations"]
    except Exception as e:
        print(e)
        print(f"{station.name}'s hourly data could not be reached")
        station.hr_record = {hr:{"wind": "OFFLINE", "temp": "OFFLINE"} for hr in range(0,25)}
    else:
        station.hr_record = {}
        for _,record in enumerate(history):
            time = dt.datetime.strptime(record["obsTimeLocal"], "%Y-%m-%d %H:%M:%S")
            temp = record["metric"]["tempAvg"]
            temp_str = f"{temp}°C"
            wind_speed = record["metric"]["windspeedHigh"]
            wind_dir = deg_to_compass(float(record["winddirAvg"]))
            wind_str = f"{wind_speed}km/h {wind_dir}"
            station.hr_record[time.hour] = {"wind": wind_str, "temp": temp_str}

    try:
        total_precip = wu.history(date=yesterday,granularity="daily",station_id=station.ID)["observations"][0]["metric"]["precipTotal"]
        station.precip = f"{total_precip}mm"
    except Exception as e:
        print(e)
        print(f"{station.name}'s daily data could not be reached")
        station.precip = "OFFLINE"

    for hr_num in hr_of_interest:
        hr_txt = dt.time(hour=hr_num).strftime("%I%p").lstrip("0")
        if hr_num in station.hr_record:
            result_table.at[index,hr_txt + " Temp"] = station.hr_record[hr_num]["temp"]
            result_table.at[index,hr_txt + " Wind"] = station.hr_record[hr_num]["wind"]
        else:
            result_table.at[index,hr_txt + " Temp"] = "NO DATA"
            result_table.at[index,hr_txt + " Wind"] = "NO DATA"

    if station.precip: result_table.at[index,"Precip"] = station.precip
    else: result_table.at[index,"Precip"] = "NO DATA"

# Add HTML Styling
print(result_table)
df_html = result_table.to_html(index=False)

df_html = df_html.replace(
    "<table border=\"1\" class=\"dataframe\">",
    "<table border=\"1\" class=\"dataframe\" \
        cell-spacing=0 cell_padding=0 \
        style=\"width: 100%; \
        font-size: 11pt; \
        font-family: Arial, Helvetica, sans-serif; \
        border-collapse: collapse; \
        border: 1px solid silver;\">"
)

df_html = df_html.replace(
    "<th>",
    "<th style=\"padding: 5px; text-align: left; \
        background-color: #c00000; \
        color: white;\">"
    )

df_html = df_html.replace(
    "<td>",
    "<td style=\"padding: 5px; text-align: left;\">"
)

html_string = f"""
<html>
  <head><title>HTML Pandas Dataframe with CSS</title></head>
  <body>
    <h2 style=\"font-size: 14pt; font-family: Arial, Helvetica, sans-serif;\">{subject}</h2>
    
    {df_html}
  </body>
</html>.
"""

if platform.startswith('linux'): 
    fname_html = f"/home/pi/weather/Weather Summary - {yesterday_text}.html"
    fname_emails = "/home/pi/weather/email_list.csv"
    fname_kmz = "/home/pi/weather/SAEG Weather Stations.kmz"
else: 
    fname_html = f"Weather Summary - {yesterday_text}.html"
    fname_emails = "01_Code\\email_list.csv"
    fname_kmz = "SAEG Weather Stations.kmz"

with open(fname_html,"w") as file:
    file.seek(0)
    file.write(html_string)

emails = pd.read_csv(fname_emails,header=None)[0].tolist()
print(emails)

# Send Email
to = emails
contents = f"For some reason the only data collected yesterday for several of the stations was from 3PM-6PM. I have included data from 4PM for this one time just to give you something from yesterday."

try:
    yag = yagmail.SMTP("saeg.weather@gmail.com","SA_CGL_S34")
    yag.send(to=to,subject=subject,attachments=[fname_html,fname_kmz])
    print("Email SENT")
except Exception as e:
    print(e)
    print("Email not sent")

os.remove(fname_html)
