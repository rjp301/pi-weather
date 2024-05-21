import { DateTime } from "luxon";
import fetchWeatherData from "../../api/helpers/fetch-weather-data.js";

const data = await fetchWeatherData("IREGIO82", DateTime.fromISO("2023-08-22"));
console.table(data.observations);
