import pandas as pd
from pandas import Timestamp as ts
from pandas import Timedelta as td
import os

import matplotlib
import matplotlib.pyplot as plt

from wunderground_pws import WUndergroundAPI, units
from sys import platform
import dropbox

def upload_to_dbx(fname_in,fname_out):
    app_token = "pHLSHepyv2wAAAAAAAAAAepvG4Kkl_HQv3e9yn1l0Lwn1RKN1L-4_ISQHHHrRgNo"
    dbx = dropbox.Dropbox(app_token)

    with open(fname_in,"rb") as file:
        dbx.files_upload(file.read(),fname_out,mode=dropbox.files.WriteMode.overwrite)

wu = WUndergroundAPI(
    api_key="1e81c4e2de6e476e81c4e2de6e476e21",
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

if platform.startswith('linux'): fname_data = "/home/pi/weather/DATA_historical/CGL - Weather Summary - Vanderhoof - 1098D90.xlsx"
else: fname_data = "DATA_historical\\CGL - Weather Summary - Vanderhoof - 1098D90.xlsx"

data = pd.read_excel(fname_data,index_col=0)
print(data)

today = ts("2020-10-07")
dates = [today + td(days=i) for i in range(0-today.weekday(),7-today.weekday())]
labels = [date.strftime("%Y-%m-%d") for date in dates]

actual = [wu.history(date=date,granularity="daily",station_id=stations[0].ID)["observations"][0]["metric"]["precipTotal"] for date in dates]
average = [data["Max"][date] for date in dates]
week_start = dates[0].strftime("%Y-%m-%d")

if platform.startswith('linux'): fname_fig = f"/home/pi/weather/PLOT_Weekly_Rainfall - {week_start}.png"
else: fname_fig = f"PLOT_Weekly_Rainfall - {week_start}.png"

plt.plot(dates,actual,label="Actual",color="red",marker="o")
plt.plot(dates,average,label="10-year Maximum",color="gray",marker="o")

plt.grid(axis="y")

leg_labels = ["Current (IVANDE4)","10yr Historical Max (1098D90)"]
leg = plt.legend(leg_labels, bbox_to_anchor=(0.,1.15,1.,.102),prop ={'size':10},loc=10,ncol=2,title=f"Weekly Rainfall Summary for Week of {week_start}")                                         
leg.get_title().set_fontsize('12') 

plt.ylabel("Total Rain (mm)")
plt.xticks(ticks=dates,labels=labels)
plt.tight_layout()

fig = plt.gcf()
fig.set_size_inches(8,4)
fig.savefig(fname_fig,dpi=300)
plt.show()

fname_out = f"/5_ENG-CGLS34/42_Weather/PLOT_Weekly_Rainfall - {week_start}.png"
upload_to_dbx(fname_fig,fname_out)
print("File has been uploaded")
os.remove(fname_fig)
print("File has been deleted")