import dotenv from "dotenv";
dotenv.config();

import fetchWeatherData from "./library/fetchWeatherData.js";
import summarizeData from "./library/summarizeData.js";

let { observations: data } = await fetchWeatherData("IREGIO61");

console.table(data);
console.table(summarizeData(data));
