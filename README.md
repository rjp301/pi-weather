# Weather Reporting

NodeJS Function run as a CRON job which fetches weather observation data from a private constellation of weather stations along a remote construction site using the Weather Underground API, summarizes that data, and distributes the summary to key decision makers via email.

![Screenshot 2023-06-20 at 7 07 53 AM](https://github.com/rjp301/pi-weather/assets/71047303/ba3c6dd9-ce10-4493-add1-45e37a3abd77)

## Data

**_data/emailList.csv_**
CSV file containing every recipient of the weather summary email.

**_data/weatherStations.json_** 
JSON file containing the name and id of the weather stations that are included in the summary table.

**_data/timesOfInterest.json_**
JSON file defining which hours and time ranges should be used when summarizing data. For each hour, temperature, wind speed and wind direction will be reported. For each time range the precipitation will be summed up.

## Modules

**_src/library/fetchWeatherData.ts_**
Fetch data from the Weather Underground API using the Axios library.

**_src/library/summarizeStation.ts_**
Summarize weather observation data from a station over the given time ranges for wind, temperature and rainfall.

**_src/library/summarizeStations.ts_**
Fetch and summarize weather observation data from every weather station in the weatherStations.json file.

**_src/library/renderHtml.ts_**
Generate a nicely formatting HTML table using the Handlebars templating engine from the summarized data for all weather stations.

**_src/library/sendEmail.ts_**
Interface with the SendGrid API to send emails to all recipients.

**_src/index.ts_**
Entry point into the function. Runs all modules in the function one after another. Uses the Commander framework to create a basic CLI.

## Running
Compile Typescript and run using Node.JS

`tsc && node dist`

## Notes

API keys and OAuth2 credentials are stored in local environment variables for security.

Code is hosted on a Ubuntu Linux server provided by [Linode](https://www.linode.com) and run every morning at 4:30 AM using a CronJob. The local repo is kept in-sync with the GitHub repo using webhooks interfacing with my [custom git-pulling node server](https://github.com/rjp301/git-hook-server).
