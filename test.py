import pandas as pd
import datetime as dt
from wunderground_pws import WUndergroundAPI, units

wu = WUndergroundAPI(
    api_key="6dad6ffc9f2844e1ad6ffc9f2884e1c7",
    default_station_id="IVANDE4",
    units=units.METRIC_UNITS,)

def round_hr(then):
    return dt.datetime(year=then.year,month=then.month,day=then.day,hour=round(then.hour + then.minute/60)%24)

def date_from_str(string):
    return dt.datetime.strptime(string,"%Y-%m-%d %H:%M:%S")

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


date = dt.date.today()
data = gather_hourly("IVANDE4",date)
print(data)