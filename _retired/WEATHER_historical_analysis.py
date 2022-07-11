import pandas as pd
import datetime as dt
from pprint import pprint

fname = "DATA_historical\\hwd_order_496\\weather_data_24hr.csv"
data = pd.read_csv(fname)

years = list(range(2009,2021))
months = list(range(1,13))
metrics = ["maxtempC","mintempC","totalprecipMM"]

loc_id = 1
monthly = {met:{y:[] for y in years} for met in metrics}

pd.DataFrame(monthly[metrics[0]][])


pprint(monthly)

def normal_day(date):
    day = date.day
    month = date.month
    year = data.year




    pass

def normal_week(date):
    pass
