import pandas as pd
import datetime as dt

import matplotlib
import matplotlib.pyplot as plt
from pprint import pprint
from wunderground_pws import WUndergroundAPI, units

wu = WUndergroundAPI(
    api_key="24050802f4fe4bc7850802f4fe9bc7c4",
    units=units.METRIC_UNITS)

# Dates
week_ending = dt.date(year=2020,month=10,day=25)
week_dates = [week_ending + dt.timedelta(days=i) for i in range(0-week_ending.weekday(),7-week_ending.weekday())]
week_start = week_dates[0]
years = list(range(2009,2020))

fname = f"E:\\Dropbox (SA Energy Group)\\34_Weather\\DATA_historical\\1098D90 - Vanderhoof\\CGL - Weather - Vanderhoof - Summary.xlsx"
raw_data = pd.read_excel(fname,sheet_name="Summary - Rainfall")

print(raw_data["Date/Time"][7].strftime("%Y-%m-%d"))

week_data = {}
for day in week_dates:
    day_string = day.strftime("%Y-%m-%d")
    week_data[day_string] = []
    for year in years:
        value = raw_data.loc[(raw_data["Month"] == day.month) & (raw_data["Day"] == day.day),[year]][year].iloc[0]
        week_data[day_string].append(value)

pprint(week_data)

labels = []
hist_values = []
for x,y in week_data.items():
    labels.append(x)
    hist_values.append(max(y))

actual = [wu.history(date=date,granularity="daily",station_id="IVANDE4")["observations"][0]["metric"]["precipTotal"] for date in week_dates]
# actual = [2.79,0.71,0.79,3.99,16.61,0,0]
pprint(actual)

fname_fig = f"PLOT_Weekly_Rainfall - {week_start}.png"

plt.plot(week_dates,actual,label="Actual",color="red",marker="o")
plt.plot(week_dates,hist_values,label="10-year Daily Max",color="gray",marker="o")

plt.grid(axis="y")

leg_labels = ["Current (IVANDE4)","10yr Historical Max (1098D90)"]
leg = plt.legend(leg_labels, bbox_to_anchor=(0.,1.15,1.,.102),prop ={'size':10},loc=10,ncol=2,title=f"Weekly Rainfall Summary for Week of {week_start}")                                         
leg.get_title().set_fontsize('12')

plt.ylabel("Total Rain (mm)")
plt.xticks(ticks=week_dates,labels=labels)
plt.tight_layout()

fig = plt.gcf()
fig.set_size_inches(8,4)
fig.savefig(fname_fig,dpi=300)
plt.show()

fname_out = f"PLOT_Weekly_Rainfall - {week_start}.png"
print("DONE")