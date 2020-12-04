import pandas as pd
import datetime as dt

from wunderground_pws import WUndergroundAPI, units
from pprint import pprint

class PWS(object):
    # Personal Weather Station object containing all pertinent information
    def __init__(self,name,ID,key,loc):
        self.name = name
        self.ID = ID
        self.key = key
        self.loc = loc

stations = [
    PWS("SAEG_Vanderhoof","IVANDE4","8nYFNJMH","54.05608, -124.02993"),
    PWS("SAEG_Parsnip","IREGIO56","vBCqMKqj","54.76181, -122.49811"),
    PWS("SAEG_Crooked","IREGIO61","xzvVa8U1","54.653556, -122.752946"),
    PWS("SAEG_Salmon","IREGIO64","HwajIWff","54.394, -123.171"),
    PWS("SAEG_Stuart","IBULKL8","xKoizTAr","54.174476, -123.683109")]


wu = WUndergroundAPI(
    api_key="ea1b7935159d43c29b7935159dd3c2fe",
    units=units.METRIC_UNITS)

beg = dt.date(year=2020,month=7,day=1)
end = dt.date(year=2020,month=11,day=15)

for station in stations:
    data = {
        "date":[],
        "precipitation_mm":[],
        "temp_high_C":[],
        "temp_avg_C":[],
        "temp_low_C":[],
        "wind_high_kmh":[],
        "wind_avg_kmh":[],
        "wind_low_kmh":[],
    }
    current = beg
    while current != end:
        try:
            result = wu.history(date=current,granularity="daily",station_id=station.ID)["observations"][0]["metric"]
            pprint(result)
            data["date"].append(current)
            data["precipitation_mm"].append(result["precipTotal"])
            data["temp_high_C"].append(result["tempHigh"])
            data["temp_avg_C"].append(result["tempAvg"])
            data["temp_low_C"].append(result["tempLow"])
            data["wind_high_kmh"].append(result["windspeedHigh"])
            data["wind_avg_kmh"].append(result["windspeedAvg"])
            data["wind_low_kmh"].append(result["windspeedLow"])
        except Exception as e:
            print(e)
            data["date"].append(current)
            data["precipitation_mm"].append("NO DATA")
            data["temp_high_C"].append("NO DATA")
            data["temp_avg_C"].append("NO DATA")
            data["temp_low_C"].append("NO DATA")
            data["wind_high_kmh"].append("NO DATA")
            data["wind_avg_kmh"].append("NO DATA")
            data["wind_low_kmh"].append("NO DATA")
        current += dt.timedelta(days=1)    

    data = pd.DataFrame(data)
    data.to_csv(f"data_download_{station.name}_{station.ID}.csv",index=False)
    
    print(data)
    print(f"{station.name} is done")