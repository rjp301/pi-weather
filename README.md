# Weather Reporting

Function run as a CRON job for fetching weather data from the Weather Underground API, summarizing that data using Pandas and distributing it using the Gmail API.

Each function of the script is written in the most appropriate language for the job. Python is used for data manipulation and NodeJS is used for interfacing with APIs and generating HTML from templates.

## Data

**_data/email_list.csv_**
CSV file containing every recipient of the weather summary email.

**_data/weatherStations.csv_** 
CSV file containing the name and id of the weather stations that are included in the summary table.

## Modules

**_library/fetchWeatherData.js_**
NodeJS function using the Axios library to fetch data from the Weather Underground server.

**_library/summarizeData.py_**
Python script using the Pandas library to summarize weather data over the specified time ranges and save to JSON file.

**_library/renderHtml.js_**
NodeJS function using the handlebars templating engine to generate HTML table with formatting from summarized data.

**_library/sendEmail.js_**
NodeJS function using the nodemailer library to interface with Gmail API to deliver formatted table using saeg.weather@gmail.com email address.

**_main.py_**
Entry point into the function written in Python. Defines time ranges over which to summarize rainfall and points in time in which to report temperature and wind. Runs all modules in the function one after another.

## Notes

API keys and OAuth2 credentials are stored in local environment variables for security.

Code is hosted on a Ubuntu Linux server provided by [Linode](https://www.linode.com) and run every morning at 4:30 AM using a CronJob. This repo is kept in-sync with the server through another CronJob.
