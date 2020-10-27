from __future__ import print_function
from mailmerge import MailMerge

import datetime as dt

today = dt.date.today()
today_text = today.strftime("%Y-%m-%d")

template = "Daily Weather Report Template.docx"
document = MailMerge(template)
print(document.get_merge_fields())

merge_fields = {
    "date_today":today_text
}

document.merge(
    date_today = today_text,
    image_30days = "E:\\Dropbox (SA Energy Group)\\34_Weather\\weather\\PLOT_Weekly_Rainfall - 2020-10-12.jpg",
    ID_hist = "1098D90",
    ID_cont = "IVANDE4"
)

document.write(f"CGL - Daily Weather - {today_text}.docx")