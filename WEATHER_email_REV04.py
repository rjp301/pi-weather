from pprint import pprint
from sys import platform
from wunderground_pws import WUndergroundAPI, units

import datetime as dt
import pandas as pd
import numpy as np
import yagmail
import os

now = dt.datetime.now()
today = dt.date.today()
yesterday = today - dt.timedelta(days=0)
yesterday_text = dt.date.strftime(yesterday,"%Y-%m-%d")

def deg_to_compass(num):
    val = int(num/22.5 + 0.5)
    arr = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
    return arr[val % 16]

def import_data(stations,start_date):
    wu = WUndergroundAPI(
        api_key="ee026438a7544b0d826438a7544b0d01",
        units=units.METRIC_UNITS)
       
    
    datasets = []
    for _,station in stations.iterrows():
        data = pd.DataFrame()
        history = []
        dates = [start_date - dt.timedelta(days=i) for i in range(3)]
        print(dates)
        for date in dates:
            history += wu.history(date=date,granularity="hourly",station_id=station["ID"])["observations"]
        
        for index,record in enumerate(history):
            time = dt.datetime.strptime(record["obsTimeLocal"], "%Y-%m-%d %H:%M:%S")
            data.at[index,"NAME"] = station["NAME"]
            data.at[index,"DATETIME"] = time
            data.at[index,"DAY"] = time.day
            data.at[index,"HOUR"] = round(time.hour + time.minute/60,0)
            data.at[index,"TEMP"] = record["metric"]["tempAvg"]
            data.at[index,"WIND_VEL"] = record["metric"]["windspeedHigh"]
            data.at[index,"WIND_DIR"] = deg_to_compass(float(record["winddirAvg"]))
            data.at[index,"PRECIP"] = record["metric"]["precipTotal"]
            index += 1

        datasets.append(data)
    data = pd.concat(datasets)
    data = data.reset_index()

    print(data)
    data.to_csv("test.csv",index=False)
    return datasets

def filter_data(data,hrs_of_interest):
    print(data)
    result = pd.DataFrame()

    stations = data["NAME"].drop_duplicates().tolist()
    for index,station in enumerate(stations):
        result.at[index,"WEATHER STATION"] = station
        for hr in hrs_of_interest:
            temp = data[data["DAY"] == yesterday.day]
            print(temp)

    


    # for index,station in stations.iterrows():


    
    
    # data["WEATHER STATION"] = labels

    # for hr in hrs_of_interest:
    #     hr_txt = dt.time(hour=hr).strftime("%I%p").lstrip("0")
    #     data[f"{hr_txt} TEMP"] = np.nan
    #     data[f"{hr_txt} WIND"] = np.nan
    # print(data)

    pass

def make_pretty(data,fname):
# Convert dataset to HTML and save
# Add formatting use find and replace
    pass

def send_email(fname,attachments):
# import emails
# attach files
# Send using yagmail
    pass


def main():
    if platform.startswith('linux'):
        fname_html = f"/home/pi/weather/Weather Summary - {yesterday_text}.html"
        fname_emails = "/home/pi/weather/email_list.csv"
        fname_kmz = "/home/pi/weather/SAEG Weather Stations.kmz"
        fname_stations = "/home/pi/weather/weather_stations.csv"
    else: 
        fname_html = f"Weather Summary - {yesterday_text}.html"
        fname_emails = "email_list.csv"
        fname_kmz = "SAEG Weather Stations.kmz"
        fname_stations = "weather_stations.csv"

    stations = pd.read_csv(fname_stations)
    datasets = import_data(stations,now)
    # data = filter_data(datasets,stations,[7,13,19])
    # html = make_pretty(data,fname_html)
    # send_email(fname_emails,[fname_html,fname_kmz])

if __name__ == "__main__":
    main()

filter_data(pd.read_csv("test.csv"),[7,13,19])



# def deg_to_compass(num):
#     val = int(num/22.5 + 0.5)
#     arr = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
#     return arr[val % 16]

# today = dt.date.today()
# yesterday = today - dt.timedelta(days=0)
# yesterday_text = dt.date.strftime(yesterday,"%Y-%m-%d")



# hr_txt = [dt.time(hour=i).strftime("%I%p").lstrip("0") for i in range(24)]

# data = pd.read_csv(fname_stations)
# for hr in hr_txt:
#     data[f"{hr} TEMP"] = np.nan
#     data[f"{hr} WIND"] = np.nan
# print(data)

# hr_of_interest = [7,13,19]
# subject = "CGL S34 Weather Summary - " + yesterday_text
# print(subject)

# for index,station in data.iterrows():
#     if index != 0: continue

#     try: 
#         history = wu.history(date=yesterday,granularity="hourly",station_id=station["ID"])["observations"]
#         # pprint(history)
#     except Exception as e:
#         print(e)
#         print(f"{station['NAME']}'s hourly data could not be reached")
#         data.at[index,"HOURLY"] = {hr:{"wind": "OFFLINE", "temp": "OFFLINE"} for hr in range(0,25)}
#     else:
#         station.hr_record = {}
#         for _,record in enumerate(history):
#             time = dt.datetime.strptime(record["obsTimeLocal"], "%Y-%m-%d %H:%M:%S")
#             temp = record["metric"]["tempAvg"]
#             temp_str = f"{temp}°C"
#             wind_speed = record["metric"]["windspeedHigh"]
#             wind_dir = deg_to_compass(float(record["winddirAvg"]))
#             wind_str = f"{wind_speed}km/h {wind_dir}"
#             station.hr_record[time.hour] = {"wind": wind_str, "temp": temp_str}

    # try:
    #     total_precip = wu.history(date=yesterday,granularity="daily",station_id=station.ID)["observations"][0]["metric"]["precipTotal"]
    #     station.precip = f"{total_precip}mm"
    # except Exception as e:
    #     print(e)
    #     print(f"{station.name}'s daily data could not be reached")
    #     station.precip = "OFFLINE"

    # for hr_num in hr_of_interest:
    #     hr_txt = dt.time(hour=hr_num).strftime("%I%p").lstrip("0")
    #     if hr_num in station.hr_record:
    #         result_table.at[index,hr_txt + " Temp"] = station.hr_record[hr_num]["temp"]
    #         result_table.at[index,hr_txt + " Wind"] = station.hr_record[hr_num]["wind"]
    #     else:
    #         result_table.at[index,hr_txt + " Temp"] = "NO DATA"
    #         result_table.at[index,hr_txt + " Wind"] = "NO DATA"

    # if station.precip: result_table.at[index,"Precip"] = station.precip
    # else: result_table.at[index,"Precip"] = "NO DATA"

# # Add HTML Styling
# print(result_table)
# df_html = result_table.to_html(index=False)

# df_html = df_html.replace(
#     "<table border=\"1\" class=\"dataframe\">",
#     "<table border=\"1\" class=\"dataframe\" \
#         cell-spacing=0 cell_padding=0 \
#         style=\"width: 100%; \
#         font-size: 11pt; \
#         font-family: Arial, Helvetica, sans-serif; \
#         border-collapse: collapse; \
#         border: 1px solid silver;\">"
# )

# df_html = df_html.replace(
#     "<th>",
#     "<th style=\"padding: 5px; text-align: left; \
#         background-color: #c00000; \
#         color: white;\">"
#     )

# df_html = df_html.replace(
#     "<td>",
#     "<td style=\"padding: 5px; text-align: left;\">"
# )

# html_string = f"""
# <html>
#   <head><title>HTML Pandas Dataframe with CSS</title></head>
#   <body>
#     <h2 style=\"font-size: 14pt; font-family: Arial, Helvetica, sans-serif;\">{subject}</h2>
    
#     {df_html}
#   </body>
# </html>.
# """



# with open(fname_html,"w") as file:
#     file.seek(0)
#     file.write(html_string)

# emails = pd.read_csv(fname_emails,header=None)[0].tolist()
# print(emails)

# # Send Email
# to = emails
# contents = f"For some reason the only data collected yesterday for several of the stations was from 3PM-6PM. I have included data from 4PM for this one time just to give you something from yesterday."

# try:
#     yag = yagmail.SMTP("saeg.weather@gmail.com","SA_CGL_S34")
#     yag.send(to=to,subject=subject,attachments=[fname_html,fname_kmz])
#     print("Email SENT")
# except Exception as e:
#     print(e)
#     print("Email not sent")

# os.remove(fname_html)
