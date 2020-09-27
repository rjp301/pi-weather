import yagmail

from datetime import date
from datetime import datetime
from datetime import timedelta

from wunderground_pws import WUndergroundAPI, units

import yagmail
from pprint import pprint


wu = WUndergroundAPI(
    api_key="6c21a0c6b224472ba1a0c6b224372b63",
    units=units.METRIC_UNITS)

def hour_round(t):
    return (t.replace(second=0, microsecond=0, minute=0, hour=t.hour)+timedelta(hours=t.minute//30))

class PWS(object):
    # Personal Weather Station object containing all pertinent information
    def __init__(self,name,ID,key):
        self.name = name
        self.ID = ID
        self.key = key

def deg_to_compass(num):
    val = int(num/22.5 + 0.5)
    arr = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
    return arr[val % 16]

stations = [
    PWS("SAEG_Vanderhoof","IVANDE4","8nYFNJMH"),
    PWS("SAEG_Parsnip","IREGIO56","vBCqMKqj")]
    # PWS("SAEG_Stuart","IBULKL8","xKoizTAr"),
    # PWS("SAEG_Anzac","IREGIO58","d6MfuO8f")]

today = date.today()
yesterday = today - timedelta(days=1)
yesterday_text = datetime.strftime(yesterday,"%Y-%m-%d")

subject = "Weather Summary - " + yesterday_text
print(subject)

result_string = ""
for station in stations:
    history = wu.history(date=yesterday,granularity="hourly",station_id=station.ID)["observations"]
    # pprint(history)
    result_string += "<p><font size=\"+1\"><b>" + station.name.upper() + "</b></font><br>"
    for index,record in enumerate(history):
        time = datetime.strptime(record["obsTimeLocal"], "%Y-%m-%d %H:%M:%S")
        time_round = hour_round(time)
        if time_round.hour == 8:
            temp = record["metric"]["tempAvg"]
            wind_speed = record["metric"]["windspeedHigh"]
            wind_dir = deg_to_compass(float(record["winddirAvg"]))

            result_string += "<b>7:00 AM:</b><br>"
            result_string += "Temperature = {}°C<br>".format(temp)
            result_string += "Wind = {}km/h {}<br>".format(wind_speed,wind_dir)

        if time_round.hour == 20:
            temp = record["metric"]["tempAvg"]
            wind_speed = record["metric"]["windspeedHigh"]
            wind_dir = deg_to_compass(float(record["winddirAvg"]))

            result_string += "<b>7:00 PM:</b><br>"
            result_string += "Temperature = {}°C<br>".format(temp)
            result_string += "Wind = {}km/h {}<br>".format(wind_speed,wind_dir)

        if time_round.hour == 0:
            total_precip = record["metric"]["precipTotal"]
            
            result_string += "Total Precipitation = {}mm</p>".format(total_precip)

print(result_string)

# Acquire emails
fname_emails = "weather\\WEATHER_emails.txt"
emails = []
with open(fname_emails,newline="\r\n") as file:
    rows = file.read().splitlines()
    for row in rows:
        emails.append(row)
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