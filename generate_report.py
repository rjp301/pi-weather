# This script prepares a weekly weather report, exported in .pdf format

import csv
import pandas as pd
import numpy as np
import datetime as dt
import yagmail
import time

from os import remove
from sys import platform
from pprint import pprint
from wunderground_pws import WUndergroundAPI, units

from reportlab.lib.enums import TA_JUSTIFY
from reportlab.graphics import shapes
from reportlab.graphics.charts.axes import XCategoryAxis, YValueAxis
from reportlab.pdfgen import canvas # ReportLab
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm

doc = SimpleDocTemplate("weather-report.pdf", pagesize = letter)
width, height = letter

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='Justify', alignment = "TA_JUSTIFY"))
styleH = styles['Heading1']

Story = []

logo = "saeg_logo.png"
im = Image(logo, 2*inch, 2*inch)
Story.append(im)

formatted_time = time.ctime()

Story.append(Paragraph("SA Energy Group Weekly Weather Report",styleH))

ptext = 'Please find disclosed here the weekly weather report for SA Energy Group project Coastal GasLink for the span of the week prior.'

Story.append(Paragraph(ptext, styles["Normal"]))

with open("weather_results.csv") as f:
    reader = csv.reader(f)
    array = np.loadtxt(f, delimeter=",")
    weather_list = list(reader)
    
print weather_list(f):

doc.build(Story)

yag = yagmail.SMTP("saeg.weather@gmail.com","SA_CGL_S34")
contents = [
    "This is a test email for the SAEG Weather Report", /home/pi/weather/Weather Reporthome/pi/weather/Weather Report/weather-report.pdf
    ]

yag.send('aouda@saenergygroup.com', 'test-report', contents)