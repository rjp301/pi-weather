import { DateTime } from "luxon";
import fetchWeatherData from "../library/fetchWeatherData.js";
import summarizeStation from "../library/summarizeStation.js";

const date = DateTime.fromISO("2023-07-16");

const response = await fetchWeatherData("IREGIO82", date);
console.table(response.observations);
// const summary = summarizeStation(response);
// console.table(summary);

console.log(date);
