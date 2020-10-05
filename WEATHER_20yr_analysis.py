import pandas as pd
from pandas import Timestamp as ts
from pandas import Timedelta as td
import os

import matplotlib
import matplotlib.pyplot as plt

from datetime import date
from datetime import datetime
from datetime import timedelta

from wunderground_pws import WUndergroundAPI, units

wu = WUndergroundAPI(
    api_key="6c21a0c6b224472ba1a0c6b224372b63",
    units=units.METRIC_UNITS)

class PWS(object):
    # Personal Weather Station object containing all pertinent information
    def __init__(self,name,ID,key):
        self.name = name
        self.ID = ID
        self.key = key

stations = [
    PWS("SAEG_Vanderhoof","IVANDE4","8nYFNJMH"),
    PWS("SAEG_Parsnip","IREGIO56","vBCqMKqj")]
    # PWS("SAEG_Stuart","IBULKL8","xKoizTAr"),
    # PWS("SAEG_Anzac","IREGIO58","d6MfuO8f")]

fname = "weather\\20yr_record\\CGL - Weather Summary - Vanderhoof - 1098D90.xlsx"
data = pd.read_excel(fname,index_col=0)
print(data)




today = ts("2020-10-03")
dates = [today + td(days=i) for i in range(0-today.weekday(),7-today.weekday())]
labels = [date.day_name() for date in dates]

actual = [wu.history(date=date,granularity="daily",station_id=stations[0].ID)["observations"][0]["metric"]["precipTotal"] for date in dates]
plt.plot(dates,actual,label="Actual",color="red",marker="o")

# for label,column in data.iteritems():
#     if int(label) < 2010: continue
#     rain = [column[date] for date in dates]
#     plt.plot(dates,rain,label=label)

average = [data["Max"][date] for date in dates]
plt.plot(dates,average,label="10-year Maximum",color="gray",marker="o")

week_start = dates[0].strftime("%A, %b %m, %Y")

plt.grid(axis="y")
plt.legend(loc="upper left")
plt.ylabel("Total Rain (mm)")
plt.title(f"Weekly Rainfall Summary for week of {week_start}")
plt.xticks(ticks=dates,labels=labels)
plt.show()

