from __future__ import print_function

import pandas as pd
import datetime as dt

from mailmerge import MailMerge

from pprint import pprint
from wunderground_pws import WUndergroundAPI, units

def avg(lst):
    lst = [i for i in lst if str(i) != "nan"]
    return sum(lst) / len(lst)

class PWS(object):
    # Personal Weather Station object containing all pertinent information
    def __init__(self,name,ID,key,loc):
        self.name = name
        self.ID = ID
        self.key = key
        self.loc = loc

locations = [
    {"loc_text": "Vanderhoof, BC",
    "ID_hist": "1098D90",
    "ID_cont": "IVANDE4",
    "path":"E:\\Dropbox (SA Energy Group)\\34_Weather\DATA_historical\\1098D90 - Vanderhoof",
    "ID_cont_str": "IVANDE4 located in the Vanderhoof Yard",
    },
    {"loc_text":"Prince George, BC",
    "ID_hist":"1096468",
    "ID_cont":"IREGIO64",
    "ID_cont_str":"IREGIO64 located near the crossing of the Salmon River",
    "path":"E:\\Dropbox (SA Energy Group)\\34_Weather\DATA_historical\\1096468 - Prince George STP",}
]

# Dates
today = dt.date.today()
yesterday = today - dt.timedelta(days=1)
yesterday_text = yesterday.strftime("%Y-%m-%d")
day_num = yesterday.strftime("%d").lstrip("0")
mon_str = yesterday.strftime("%B")
year_num = yesterday.strftime("%Y")
yesterday_str = f"{mon_str} {day_num}, {year_num}"

pages = []

for location in locations:
    pprint(location)
    pprint(location)
    # Analyze historical data
    years = list(range(2009,2020))
    hist_data = {}
    for year in years:
        day_of_interest = dt.date(year=year,month=yesterday.month,day=yesterday.day)
        days = [day_of_interest + dt.timedelta(days=i) for i in range(-3,4)]
        days = [d.strftime("%Y-%m-%d") for d in days]

        fname_path = location["path"]
        fname_id = location["ID_hist"]
        fname = f"{fname_path}\\en_climate_daily_BC_{fname_id}_{year}_P1D.csv"
        raw_data = pd.read_csv(fname)
        hist_data[year] = raw_data[raw_data["Date/Time"].isin(days)]

    hist_temp_min_ext = min([hist_data[year]["Min Temp (°C)"].min() for year in years])
    hist_temp_min_avg = avg([hist_data[year]["Min Temp (°C)"].mean() for year in years])
    hist_temp_max_ext = max([hist_data[year]["Max Temp (°C)"].max() for year in years])
    hist_temp_max_avg = avg([hist_data[year]["Max Temp (°C)"].mean() for year in years])

    hist_precip_rain_max = max([hist_data[year]["Total Rain (mm)"].max() for year in years])
    hist_precip_rain_avg = avg([hist_data[year]["Total Rain (mm)"].mean() for year in years])
    hist_precip_snow_max = max([hist_data[year]["Total Snow (cm)"].max() for year in years])
    hist_precip_snow_avg = avg([hist_data[year]["Total Snow (cm)"].mean() for year in years])


    # Analyze current weather info
    wu = WUndergroundAPI(
        api_key="24050802f4fe4bc7850802f4fe9bc7c4",
        units=units.METRIC_UNITS)

    PWS_data = wu.history(date=yesterday,granularity="daily",station_id=location["ID_cont"])["observations"][0]["metric"]

    act_temp_max = PWS_data["tempHigh"]
    act_temp_min = PWS_data["tempLow"]
    act_precip_rain = PWS_data["precipTotal"]

    pprint(PWS_data)

    # Print Results to terminal
    str_location = location["loc_text"]
    print(f"\nWeather Summary for {yesterday_text} in {str_location}:")
    print(f"\n10 Year Historical Daily Temperature:")
    print(f" Minimum Temperature Average: {hist_temp_min_avg:>6.1f}°C")
    print(f" Maximum Temperature Average: {hist_temp_max_avg:>6.1f}°C")
    print(f" Minimum Temperature Extreme: {hist_temp_min_ext:>6.1f}°C")
    print(f" Maximum Temperature Extreme: {hist_temp_max_ext:>6.1f}°C")

    print(f"\n10 Year Historical Daily Precipitation:")
    print(f" Average Rainfall: {hist_precip_rain_avg:>6.1f}mm")
    print(f" Average Snowfall: {hist_precip_snow_avg:>6.1f}cm")
    print(f" Maximum Rainfall: {hist_precip_rain_max:>6.1f}mm")
    print(f" Maximum Snowfall: {hist_precip_snow_max:>6.1f}cm")

    print(f"\nActual Weather:")
    print(f" Minimum Temperature: {act_temp_min:>6.1f}°C")
    print(f" Maximum Temperature: {act_temp_max:>6.1f}°C")
    print(f" Total Rainfall: {act_precip_rain}mm")

    merge_fields = {
        "loc_text":location["loc_text"],
        "date_text":yesterday_str,
        "ID_cont_str":location["ID_cont_str"],
        "ID_hist":location["ID_hist"],
        "hist_temp_min_ext":hist_temp_min_ext,
        "hist_temp_min_avg":hist_temp_min_avg,
        "hist_temp_max_ext":hist_temp_max_ext,
        "hist_temp_max_avg":hist_temp_max_avg,
        "hist_precip_rain_max":hist_precip_rain_max,
        "hist_precip_rain_avg":hist_precip_rain_avg,
        "hist_precip_snow_max":hist_precip_snow_max,
        "hist_precip_snow_avg":hist_precip_snow_avg,
        "act_temp_max":act_temp_max,
        "act_temp_min":act_temp_min,
        "act_precip_rain":act_precip_rain
    }

    pages.append(merge_fields)

    # Create Word Document
    template = "CGL - Daily Weather - Template.docx"
    document = MailMerge(template)
    print(document.get_merge_fields())

    document.merge(
        loc_text = location["loc_text"],
        date_text = yesterday_str,
        ID_cont_str = location["ID_cont_str"],
        ID_hist = location["ID_hist"],
        hist_temp_min_ext = f"{hist_temp_min_ext:.1f}",
        hist_temp_min_avg = f"{hist_temp_min_avg:.1f}",
        hist_temp_max_ext = f"{hist_temp_max_ext:.1f}",
        hist_temp_max_avg = f"{hist_temp_max_avg:.1f}",
        hist_precip_rain_max = f"{hist_precip_rain_max:.2f}",
        hist_precip_rain_avg = f"{hist_precip_rain_avg:.2f}",
        hist_precip_snow_max = f"{hist_precip_snow_max:.2f}",
        hist_precip_snow_avg = f"{hist_precip_snow_avg:.2f}",
        act_temp_max = f"{act_temp_max:.1f}",
        act_temp_min = f"{act_temp_min:.1f}",
        act_precip_rain = f"{act_precip_rain:.2f}",
    )
    document.write(f"E:\\Dropbox (SA Energy Group)\\34_Weather\Daily Reports\\CGL - Daily Weather - {yesterday_text} - {str_location}.docx")
    print("DONE")