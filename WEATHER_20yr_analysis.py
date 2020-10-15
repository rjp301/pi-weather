import pandas as pd
from pandas import Timestamp as ts
from pandas import Timedelta as td
import os

import matplotlib
import matplotlib.pyplot as plt

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




today = ts("2020-09-10")
dates = [today + td(days=i) for i in range(0-today.weekday(),7-today.weekday())]
labels = [date.strftime("%Y-%m-%d") for date in dates]

actual = [wu.history(date=date,granularity="daily",station_id=stations[0].ID)["observations"][0]["metric"]["precipTotal"] for date in dates]
average = [data["Max"][date] for date in dates]
week_start = dates[0].strftime("%Y-%m-%d")

plt.plot(dates,actual,label="Actual",color="red",marker="o")
plt.plot(dates,average,label="10-year Maximum",color="gray",marker="o")

plt.grid(axis="y")

leg = plt.legend(labels, bbox_to_anchor=(0.,1.15,1.,.102),prop ={'size':10},loc=10,ncol=2,title=f"Weekly Rainfall Summary for Week of {week_start}")                                         
leg.get_title().set_fontsize('12') 


# plt.legend(bbox_to_anchor=(0., 1.02, 1., .102), loc='lower left',ncol=2,mode="expand", borderaxespad=0.)
plt.ylabel("Total Rain (mm)")
# plt.xlabel(f"Weekly Rainfall Summary for Week of {week_start}",fontsize=12,labelpad=10)
plt.xticks(ticks=dates,labels=labels)
plt.tight_layout()

fig = plt.gcf()
fig.set_size_inches(8,4)
fig.savefig(f"weather\\Weekly_Rainfall_{week_start}.png",dpi=100)
plt.show()