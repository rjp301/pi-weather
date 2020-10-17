import yagmail

from datetime import date
from datetime import datetime
from datetime import timedelta

from wunderground_pws import WUndergroundAPI, units

import yagmail
from pprint import pprint
from sys import platform


wu = WUndergroundAPI(
    api_key="1e81c4e2de6e476e81c4e2de6e476e21",
    units=units.METRIC_UNITS)

def hour_round(t):
    return (t.replace(second=0, microsecond=0, minute=0, hour=t.hour)+timedelta(hours=t.minute//30))

def deg_to_compass(num):
    val = int(num/22.5 + 0.5)
    arr = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
    return arr[val % 16]

class PWS(object):
    # Personal Weather Station object containing all pertinent information
    def __init__(self,name,ID,key):
        self.name = name
        self.ID = ID
        self.key = key

stations = [
    PWS("SAEG_Vanderhoof","IVANDE4","8nYFNJMH"),
    PWS("SAEG_Parsnip","IREGIO56","vBCqMKqj"),
    PWS("SAEG_Crooked","IREGIO61","xzvVa8U1"),
    PWS("SAEG_Salmon","IREGIO64","HwajIWff"),
    PWS("SAEG_Stuart","IBULKL8","xKoizTAr")]

today = date.today()
yesterday = today - timedelta(days=1)
yesterday_text = datetime.strftime(yesterday,"%Y-%m-%d")

subject = f"Weather Summary - {yesterday_text}"
print(subject)

result_string = ""
result_print = ""

for station in stations:
    result_string += f"<p><font size=\"+1\"><b>{station.name.upper()}</b></font><br>"
    result_print += f"{station.name.upper()}\n"

    try:
        history = wu.history(date=yesterday,granularity="hourly",station_id=station.ID)["observations"]
        total_precip = wu.history(date=yesterday,granularity="daily",station_id=station.ID)["observations"][0]["metric"]["precipTotal"]
    except:
        result_print += " No data available\n"
        result_string += "&nbsp;No data available<br>"
        continue

    AM = True
    for index,record in enumerate(history):
        time = datetime.strptime(record["obsTimeLocal"], "%Y-%m-%d %H:%M:%S")
        time_round = hour_round(time)
        if time_round.hour == 8 or time_round.hour == 20:
            temp = record["metric"]["tempAvg"]
            wind_speed = record["metric"]["windspeedHigh"]
            wind_dir = deg_to_compass(float(record["winddirAvg"]))

            if AM: result_string += "<b>&nbsp;7:00 AM:</b><br>"
            else: result_string += "<b>&nbsp;7:00 PM:</b><br>"
            result_string += f"&nbsp;&nbsp;Temperature = {temp}°C<br>"
            result_string += f"&nbsp;&nbsp;Wind = {wind_speed}km/h {wind_dir}<br>"

            if AM: result_print += " 7:00 AM:\n"
            else: result_print += " 7:00 PM:\n"
            result_print += f"   Temperature = {temp}°C\n"
            result_print += f"   Wind = {wind_speed}km/h {wind_dir}\n"

            AM = False

    result_string += f"&nbsp;Total Precipitation = {total_precip}mm</p>"
    result_print += f" Total Precipitation = {total_precip}mm\n\n"

print(result_print)
print(result_string)

# Acquire emails
if platform.startswith('linux'): fname_emails = "/home/pi/weather/WEATHER_emails.txt"
else: fname_emails = "weather\\WEATHER_emails.txt"

with open(fname_emails,newline="\r\n") as file:
    emails = file.read().splitlines()
print(emails)

# Send Email
to = emails
text = result_string

try:
    yag = yagmail.SMTP("rpaul.aecon@gmail.com","rzcxcrjefxusollv")
    yag.send(to=to,subject=subject,contents=text)
    print("Email SENT")
except:
    print("Email not sent")
