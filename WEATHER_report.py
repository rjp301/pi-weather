from datetime import date
from datetime import datetime
from datetime import timedelta

import pandas as pd
import dropbox
import os

from wunderground_pws import WUndergroundAPI, units

import yagmail
from pprint import pprint


wu = WUndergroundAPI(
    api_key="6c21a0c6b224472ba1a0c6b224372b63",
    units=units.METRIC_UNITS)

def upload_to_dbx(fname_in,fname_out):
    # Establish connection with Dropbox
    app_token = "4BUZUru28_kAAAAAAAAAAY5OBQo--Lc0_MxyXnj3TDdnPh5AW3Ydp48pDIfasiw-"
    dbx = dropbox.Dropbox(app_token)

    # Upload file to speicified location
    with open(fname_in,"rb") as file:
        dbx.files_upload(file.read(),fname_out,mode=dropbox.files.WriteMode.overwrite)
    
    # Remove file from computer
    os.remove(fname_in)

def hour_round(t):
    return (t.replace(second=0, microsecond=0, minute=0, hour=t.hour)+timedelta(hours=t.minute//30))

def hourly_to_df(station_id,date,units="metric",round_time=True):
    # Generate dictionary of hourly information for a day
    history = wu.history(date,granularity="hourly",station_id=station_id)["observations"]

    # Populate dataframe with hourly information
    for index,record in enumerate(history):
        if index == 0:
            keys = record[units].keys()
            data = {k:[] for k in keys}
            data["time"] = []
        time = datetime.strptime(record["obsTimeLocal"], "%Y-%m-%d %H:%M:%S")
        if round_time: time = hour_round(time)
        data["time"].append(time)
        for item in record[units]:
            data[item].append(record[units][item])

    return pd.DataFrame(data=data)

class PWS(object):
    # Personal Weather Station object containing all pertinent information
    def __init__(self,name,ID,key):
        self.name = name
        self.ID = ID
        self.key = key

stations = [
    PWS("SAEG_Vanderhoof","IVANDE4","8nYFNJMH"),
    PWS("SAEG_parsnip","IREGIO56","vBCqMKqj")] 

today = date.today()
yesterday = today - timedelta(days=1)

yesterday_text = datetime.strftime(yesterday,"%Y-%m-%d")
fname_in = "CGL - Daily Weather - " + yesterday_text + ".xlsx"
fname_out = "/daily_WU_reports/" + fname_in

# Create hourly record every day
writer = pd.ExcelWriter(
        fname_in,engine="xlsxwriter",
        datetime_format="yyyy mm dd hh:mm:ss",
        date_format="yyyy mm dd")
for station in stations:
    hourly_to_df(station.ID,yesterday).to_excel(writer,sheet_name=station.name,index=False)
writer.save()

upload_to_dbx(fname_in,fname_out)
print("Daily Weather Report Upload DONE")

# Email Patrick with Daily Weather

pprint(wu.history(date=yesterday,granularity="hourly",station_id=stations[0].ID))