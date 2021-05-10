import pandas as pd
import numpy as np
import datetime as dt
import yagmail

from os import remove
from sys import platform
from pprint import pprint
from wunderground_pws import WUndergroundAPI, units

wu = WUndergroundAPI(
    api_key="ee026438a7544b0d826438a7544b0d01",
    default_station_id="IVANDE4",
    units=units.METRIC_UNITS,)

def round_hr(then):
    return dt.datetime(year=then.year,month=then.month,day=then.day,hour=round(then.hour + then.minute/60)%24)

def hr_txt(time):
    return dt.time(hour=hr).strftime("%I%p").lstrip("0")

def date_from_str(string):
    return dt.datetime.strptime(string,"%Y-%m-%d %H:%M:%S")

def deg_to_compass(num):
    val = int(num/22.5 + 0.5)
    arr = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
    return arr[val % 16]

def gather_hourly(station_id,date):
    global wu

    datasets = []
    for i in range(2):
        date_of_interest = date - dt.timedelta(days=i)
        try:
            history = wu.history(date_of_interest,station_id=station_id)
            datasets.append(pd.json_normalize(history["observations"]))
        except:
            print(station_id,"is unreachable on",date_of_interest)

    if datasets:
        data = pd.concat(datasets)
        data["time_rnd"] = [round_hr(date_from_str(i)) for i in data["obsTimeLocal"].tolist()]
        data = data.set_index("time_rnd")
        data.index.name = None
        data = data.sort_index(ascending=False)
        return data
    else:
        print("Hourly data for",station_id,"on",date,"unreachable")
        return pd.DataFrame()

def gather_precip(station_id,date):
    global wu
    try:
        return wu.history(date,granularity="daily",station_id=station_id)["observations"][0]["metric"]["precipTotal"]
    except:
        print("Daily data for",station_id,"on",date,"unreachable")
        return None

def format_data(data,title):
    global fname_html

    df_html = data.to_html(index=False)
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
        <h2 style=\"font-size: 14pt; font-family: Arial, Helvetica, sans-serif;\">{title}</h2>
        
        {df_html}
    </body>
    </html>.
    """

    with open(fname_html,"w") as file:
        file.seek(0)
        file.write(html_string)

hrs_of_interest = [7,13,19]

today = dt.date.today()
today = dt.date(year=2021,month=5,day=7)
yesterday = today - dt.timedelta(days=1)
yesterday_txt = yesterday.strftime("%Y-%m-%d")

subject = "CGL S34 Weather Summary - " + yesterday_txt

# Define file names
if platform.startswith('linux'):
    fname_html = f"/home/pi/weather/Weather Summary - {yesterday_txt}.html"
    fname_emails = "/home/pi/weather/email_list.csv"
    fname_kmz = "/home/pi/weather/SAEG Weather Stations.kmz"
    fname_stations = "/home/pi/weather/weather_stations.csv"
else: 
    fname_html = f"Weather Summary - {yesterday_txt}.html"
    fname_emails = "email_list.csv"
    fname_kmz = "SAEG Weather Stations.kmz"
    fname_stations = "weather_stations.csv"

# Import weather station information
stations = pd.read_csv(fname_stations)

# Create result dataframe
result = pd.DataFrame()
result["Weather Station"] = stations["NAME"].tolist()

for index,station in stations.iterrows():
    hr_data = gather_hourly(station["ID"],today)
    # print(hr_data)
    
    if hr_data.empty:
        for hr in hrs_of_interest:
            result.at[index,f"{hr_txt(hr)} Temp"] = "NO DATA"
            result.at[index,f"{hr_txt(hr)} Wind"] = "NO DATA"

    else:
        for hr in hrs_of_interest:
            index_dt = dt.datetime.combine(yesterday,dt.time(hour=hr))
            if index_dt in hr_data.index:
                result.at[index,f"{hr_txt(hr)} Temp"] = f"{hr_data.at[index_dt,'metric.tempAvg']:.0f}°C"
                result.at[index,f"{hr_txt(hr)} Wind"] = f"{hr_data.at[index_dt,'metric.windspeedAvg']:.0f}km/h {deg_to_compass(hr_data.at[index_dt,'winddirAvg'])}"
            else:
                result.at[index,f"{hr_txt(hr)} Temp"] = "NO DATA"
                result.at[index,f"{hr_txt(hr)} Wind"] = "NO DATA"

    precip = gather_precip(station["ID"],yesterday)
    if precip is not None: result.at[index,"Precip (daily)"] = f"{precip}mm"
    else: result.at[index,"Precip (daily)"] = "NO DATA"

    # Caluclate rainfall of last 12 hours
    # find max rainfall yesterday --> x3
    yesterday_hrs = [dt.datetime.combine(yesterday,dt.time(hour=i)) for i in range(12,24)]
    yesterday_hrs = [i for i in yesterday_hrs if i in hr_data.index]
    if yesterday_hrs:
        yesterday_rain = hr_data.loc[yesterday_hrs,"metric.precipTotal"].tolist()
        yesterday_max = max(yesterday_rain)
    else:
        result.at[index,"Precip (overnight)"] = "NO DATA"
        continue

    # find max rainfall from midnight to 5AM --> x2
    today_hrs = [dt.datetime.combine(today,dt.time(hour=i)) for i in range(6)]
    today_hrs = [i for i in today_hrs if i in hr_data.index]
    if today_hrs:
        today_rain = hr_data.loc[today_hrs,"metric.precipTotal"].tolist()
        today_max = max(today_rain)
    else:
        result.at[index,"Precip (overnight)"] = "NO DATA"
        continue

    # find rainfall around 5PM yesterday --> x1
    evening_hours = [dt.datetime.combine(yesterday,dt.time(hour=i)) for i in range(16,19)]
    evening_hours = [i for i in evening_hours if i in hr_data.index]
    if evening_hours:
        evening_rain = hr_data.loc[evening_hours,"metric.precipTotal"].tolist()
        evening_min = min(evening_rain)
    else:
        result.at[index,"Precip (overnight)"] = "NO DATA"
        continue
    
    result.at[index,"Precip (overnight)"] = f"{yesterday_max - evening_min + today_max}mm"

print(result)

# Save out HTML file
format_data(result,subject)

# Send email
to = pd.read_csv(fname_emails,header=None)[0].tolist()
to = "rileypaul96@gmail.com"

try:
    yag = yagmail.SMTP("saeg.weather@gmail.com","SA_CGL_S34")
    yag.send(to,subject,attachments=[fname_html,fname_kmz])
    print("Email SENT")
except Exception as e:
    print(e)
    print("Email not sent")

remove(fname_html)


