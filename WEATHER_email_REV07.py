import pandas as pd
import numpy as np
import datetime as dt
import yagmail
import time

from os import remove
from sys import platform
from pprint import pprint
from wunderground_pws import WUndergroundAPI, units

def fname_to_pi(fname): return f"/home/pi/weather/{fname}" if platform.startswith('linux') else fname

hrs_of_interest = [7,13,19]
rng_of_interest = [(5,17),(17,29),(0,24)]

def round_hr(then):
    return dt.datetime(year=then.year,month=then.month,day=then.day,hour=round(then.hour + then.minute/60)%24)

def hr_txt(hr):
    return dt.time(hour=hr%24).strftime("%I%p").lstrip("0")

def date_from_str(string):
    return dt.datetime.strptime(string,"%Y-%m-%d %H:%M:%S")

def deg_to_compass(num):
    val = int(num/22.5 + 0.5)
    arr = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
    return arr[val % 16]

def gather_hourly(station_id,date):
    wu = WUndergroundAPI(
        api_key="6072a9791ae24987b2a9791ae2d987c7",
        default_station_id="IVANDE4",
        units=units.METRIC_UNITS,)

    datasets = []
    for i in range(2):
        date_of_interest = date + dt.timedelta(days=i)
        try:
            history = wu.history(date_of_interest,station_id=station_id)
            datasets.append(pd.json_normalize(history["observations"]))
        except Exception as e:
            print(e)
            print(station_id,"is unreachable on",date_of_interest)

    if datasets:
        data = pd.concat(datasets)
        data["time_rnd"] = [round_hr(date_from_str(i)) for i in data["obsTimeLocal"].tolist()]
        data = data.set_index("time_rnd")
        data.index.name = None
        data = data.sort_index(ascending=False)
        data = data[~data.index.duplicated(keep="first")]
        return data
    else:
        print("Hourly data for",station_id,"on",date,"unreachable")
        return pd.DataFrame()

def format_data(data,title):
    global hrs_of_interest,rng_of_interest

    df_html = data.to_html(index=False,na_rep="NO DATA")
    df_html = df_html.replace(
        "<table border=\"1\" class=\"dataframe\">",
        "<table border=\"1\" class=\"dataframe\" \
            cell-spacing=0 cell_padding=0 \
            style=\"width: 100%; \
            font-size: 11pt; \
            font-family: Arial, Helvetica, sans-serif; \
            border-collapse: collapse; \
            border: 1px solid silver;\">"
    )
    
    df_html = df_html.replace(
        "<thead>",
        f"""<thead>
            <tr style="text-align: right;">
                <th style=\"padding: 5px; text-align: left; background-color: #c00000; color: white;\">Weather Station</th>
                <th colspan="{len(hrs_of_interest)}" style=\"padding: 5px; text-align: left; background-color: #c00000; color: white;\">Temperature</th>
                <th colspan="{len(hrs_of_interest)}" style=\"padding: 5px; text-align: left; background-color: #c00000; color: white;\">Wind</th>
                <th colspan="{len(rng_of_interest)}" style=\"padding: 5px; text-align: left; background-color: #c00000; color: white;\">Precipitation</th>
            </tr>"""
    )

    df_html = df_html.replace(
        "<th>",
        "<th style=\"padding: 5px; text-align: left;\">"
        )

    df_html = df_html.replace(
        "<td>",
        "<td style=\"padding: 5px; text-align: left;\">"
    )

    html_string = f"""
    <html>
    <head><title>HTML Pandas Dataframe with CSS</title></head>
    <body>
        <h2 style=\"font-size: 14pt; font-family: Arial, Helvetica, sans-serif;\">{title}</h2>
        
        {df_html}
    </body>
    </html>.
    """

    return html_string

def rain_total(dataframe):
    precip_rate_max = dataframe["metric.precipRate"].max()
    precip_total_max = dataframe["metric.precipTotal"].max()
    return precip_total_max - dataframe.at[0,"metric.precipTotal"] if precip_rate_max > 0 else 0

def summary(date,stations):
    global hrs_of_interest,rng_of_interest

    yesterday = date

    columns = ["Name"]
    columns += [f"{hr_txt(hr)} Temp" for hr in hrs_of_interest]
    columns += [f"{hr_txt(hr)} Wind" for hr in hrs_of_interest]
    columns += [f"{hr_txt(i[0])}-{hr_txt(i[1])}" for i in rng_of_interest]

    result = pd.DataFrame(columns=columns)
    result["Name"] = stations["NAME"].tolist()

    hr_datas = []

    for index,station in stations.iterrows():
        
        hr_data = gather_hourly(station["ID"],yesterday)
        # if len(hr_data) < 30:
        #     print("Trying again in three minutes")
        #     time.sleep(3*60)
        #     hr_data = gather_hourly(station["ID"],yesterday)

        hr_data["station_name"] = station["NAME"]
        hr_datas.append(hr_data)

        # print(station["NAME"])
        # print(hr_data)
        
        if len(hr_data) < 18:
            for index_c,entry in enumerate(result.columns):
                if index_c == 0: continue
                result.at[index,entry] = "OFFLINE"
            continue

        for hr in hrs_of_interest:
            index_dt = dt.datetime.combine(yesterday,dt.time(hour=hr))
            if index_dt in hr_data.index:
                result.at[index,f"{hr_txt(hr)} Temp"] = f"{hr_data.at[index_dt,'metric.tempAvg']:.0f}°C"
                result.at[index,f"{hr_txt(hr)} Wind"] = f"{hr_data.at[index_dt,'metric.windspeedAvg']:.0f}km/h {deg_to_compass(hr_data.at[index_dt,'winddirAvg'])}"

        for rng in rng_of_interest:
            yesterday_beg = dt.datetime.combine(yesterday,dt.time(hour=0))
            hr_beg = yesterday_beg + dt.timedelta(hours=rng[0])
            hr_end = yesterday_beg + dt.timedelta(hours=rng[1])
            hr_mid = yesterday_beg + dt.timedelta(hours=24)
            
            data = hr_data.copy().reset_index()
            data = data[data["index"].between(hr_beg,hr_end)].reset_index(drop=True)
            data.sort_values("index",inplace=True)
            data.reset_index(drop=True,inplace=True)

            if len(data) <= 4:
                rain_tot = None

            elif rng[0] < 24 and rng[1] > 24:
                pre_mid = data[data["index"] < hr_mid].reset_index(drop=True)
                post_mid = data[data["index"] >= hr_mid].reset_index(drop=True)
                rain_tot = rain_total(pre_mid) + rain_total(post_mid)

            else:
                rain_tot = rain_total(data)

            result.at[index,f"{hr_txt(rng[0])}-{hr_txt(rng[1])}"] = f"{rain_tot:.1f}mm" if rain_tot != None else "NO DATA"

    hr_data = pd.concat(hr_datas)
    hr_data = hr_data.reset_index()

    return result,hr_data


def send_email(emails,subject,attachments):
    try:
        yag = yagmail.SMTP("saeg.weather@gmail.com","SA_CGL_S34")
        yag.send(emails,subject,attachments)
        print(f"Email SENT to {len(emails)} recipients")
    except Exception as e:
        print(e)
        print("Email not sent")


def main():
    today = dt.date.today()
    yesterday = today - dt.timedelta(days=1)
    yesterday_txt = yesterday.strftime("%Y-%m-%d")
    subject = "CGL S34 Weather Summary - " + yesterday_txt

    fname_html = fname_to_pi(f"Weather Summary - {yesterday_txt}.html")
    fname_stations = fname_to_pi("weather_stations.csv")
    fname_csv = fname_to_pi("weather_results.csv")
    fname_emails = fname_to_pi("email_list.csv")
    fname_kmz = fname_to_pi("SAEG Weather Stations.kmz")  

    stations = pd.read_csv(fname_stations)
    result,hr_data = summary(yesterday,stations)
    hr_data.to_csv(fname_csv,index=False)

    with open(fname_html,"w") as file:
        file.seek(0)
        file.write(format_data(result,subject))

    emails = pd.read_csv(fname_emails,header=None)[0].tolist()
    # emails = ["rileypaul96@gmail.com"]
    
    attachments = [fname_html,fname_kmz]
    send_email(emails,subject,attachments)
    remove(fname_html)

if __name__ == "__main__":
    main()