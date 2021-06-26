import pandas as pd
from wunderground_pws import WUndergroundAPI, units
from pprint import pprint

wu = WUndergroundAPI(
    api_key="6072a9791ae24987b2a9791ae2d987c7",
    default_station_id="IVANDE4",
    units=units.METRIC_UNITS,)

history = wu.hourly()["observations"]
print(pd.json_normalize(history))