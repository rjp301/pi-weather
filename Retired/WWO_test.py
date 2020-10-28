from wwo_hist import retrieve_hist_data

import os
os.chdir("E:\\Dropbox (SA Energy Group)\\34_Weather\\weather")



frequency = 24
start_date = '1-JAN-2009'
end_date = '26-OCT-2020'
api_key = "43d532badd0c4d85b15173723202710"
location_list = ['singapore','california']

hist_weather_data = retrieve_hist_data(api_key,
                                location_list,
                                start_date,
                                end_date,
                                frequency,
                                location_label = False,
                                export_csv = True,
                                store_df = False)