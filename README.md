# Weather Reporting

NodeJS Function run as a CRON job which fetches weather observation data from a private constellation of weather stations along a remote construction site using the Weather Underground API, summarizes that data, and distributes the summary to key decision makers via email.

## Data

**_data/emailList.csv_**
CSV file containing every recipient of the weather summary email.

**_data/weatherStations.json_** 
JSON file containing the name and id of the weather stations that are included in the summary table.

## Modules

**_library/fetchWeatherData.ts_**
Fetch data from the Weather Underground server using the Axios library.

**_library/summarizeStation.ts_**
Summarize weather observation data from a station over the given time ranges for wind, temperature and rainfall.

**_library/summarizeStations.ts_**
Fetch and summarize weather observation data from every weather station in the weatherStations.json file. Defines time ranges over which to summarize rainfall and points in time in which to report temperature and wind.

**_library/renderHtml.ts_**
Generate a nicely formatting HTML table using the Handlebars templating engine from the summarized data for all weather stations.

**_library/sendEmail.ts_**
Interface with the SendGrid API to send emails to all recipients.

**_index.ts_**
Entry point into the function. Runs all modules in the function one after another. Uses the Commander framework to create a basic CLI.

## Notes

API keys and OAuth2 credentials are stored in local environment variables for security.

Code is hosted on a Ubuntu Linux server provided by [Linode](https://www.linode.com) and run every morning at 4:30 AM using a CronJob. This repo is kept in-sync with the server through another CronJob.
