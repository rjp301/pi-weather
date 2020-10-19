import pandas as pd

from wunderground_pws import WUndergroundAPI, units

import yagmail
from pprint import pprint
from sys import platform

import datetime as dt

import os

wu = WUndergroundAPI(
    api_key="24050802f4fe4bc7850802f4fe9bc7c4",
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
    PWS("SAEG_Parsnip","IREGIO56","vBCqMKqj","54.76181, -122.49811"),
    PWS("SAEG_Crooked","IREGIO61","xzvVa8U1","54.653556, -122.752946"),
    PWS("SAEG_Salmon","IREGIO64","HwajIWff","54.394, -123.171"),
    PWS("SAEG_Stuart","IBULKL8","xKoizTAr","54.174476, -123.683109")]

today = dt.date.today()
yesterday = today - dt.timedelta(days=1)
yesterday_text = dt.date.strftime(yesterday,"%Y-%m-%d")

subject = "Weather Summary - " + yesterday_text
print(subject)

hr_of_interest = [7,19]

result_table = {}
result_table["Weather Station"] = []
for hr_num in hr_of_interest:
    hr_txt = dt.time(hour=hr_num).strftime("%I%p").lstrip("0")
    result_table[hr_txt + " Temp"] = []
    result_table[hr_txt + " Wind"] = []
result_table["Precip"] = []

station_results = []

for station in stations:
    result_table["Weather Station"].append(station.name)
    try:
        history = wu.history(date=yesterday,granularity="hourly",station_id=station.ID)["observations"]
        station.hr_record = {}

        for index,record in enumerate(history):
            time = dt.datetime.strptime(record["obsTimeLocal"], "%Y-%m-%d %H:%M:%S")
            
            temp = record["metric"]["tempAvg"]
            temp_str = f"{temp}°C"

            wind_speed = record["metric"]["windspeedHigh"]
            wind_dir = deg_to_compass(float(record["winddirAvg"]))
            wind_str = f"{wind_speed}km/h {wind_dir}"

            station.hr_record[time.hour] = {"wind": wind_str, "temp": temp_str}

    except Exception as e:
        print(e)
        print(f"{station.name}'s hourly data could not be reached")

    try:
        total_precip = wu.history(date=yesterday,granularity="daily",station_id=station.ID)["observations"][0]["metric"]["precipTotal"]
        station.precip = f"{total_precip}mm"
    
    except Exception as e:
        print(e)
        print(f"{station.name}'s daily data could not be reached")


    # Add Values to Dictionary
    for hr_num in hr_of_interest:
        hr_txt = dt.time(hour=hr_num).strftime("%I%p").lstrip("0")
        if hr_num in station.hr_record:
            result_table[hr_txt + " Temp"].append(station.hr_record[hr_num]["temp"])
            result_table[hr_txt + " Wind"].append(station.hr_record[hr_num]["wind"])

        else:
            result_table[hr_txt + " Temp"].append("NO DATA")
            result_table[hr_txt + " Wind"].append("NO DATA")  

    if station.precip: result_table["Precip"].append(station.precip)
    else: result_table["Precip"].append("NO DATA")

df = pd.DataFrame(data=result_table)
print(df)

# Add HTML Styling
df_html = df.to_html(index=False)

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

if platform.startswith('linux'): fname_html = f"/home/pi/weather/Weather Summary - {yesterday_text}.html"
else: fname_html = f"Weather Summary - {yesterday_text}.html"

with open(fname_html,"w") as file:
    file.seek(0)
    file.write(html_string)

# Acquire emails
if platform.startswith('linux'): fname_emails = "/home/pi/weather/email_list.txt"
else: fname_emails = "email_list.txt"

emails = []
with open(fname_emails,newline="\r\n") as file:
    rows = file.read().splitlines()
    for row in rows:
        emails.append(row)
print(emails)

# Send Email
to = emails
contents = f"Hello,<br><br>Please see attached weather summary for {yesterday_text}. \
    You can open the attached file in a web browser.<br><br>Thanks,<br><br>\
    <span style=\"color:#c00000;font-weight:bold;\">Riley Paul</span>\
    , E.I.T.<br><span style=\"font-weight:bold;\">Junior Project Engineer<br>\
    Mobile:</span> 403.998.2856"

try:
    yag = yagmail.SMTP("rpaul.aecon@gmail.com","rzcxcrjefxusollv")
    yag.send(to=to,subject=subject,contents=contents,attachments=fname_html)
    print("Email SENT")
except:
    print("Email not sent")

os.remove(fname_html)