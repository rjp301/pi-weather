import dotenv from "dotenv";
dotenv.config();

import fetchWeatherData from "./library/fetchWeatherData.js";
import summarizeData from "./library/summarizeData.js";

const { observations: data } = await fetchWeatherData("IREGIO61");
// const data = []

const hrs_of_interest = [7, 13, 19];
const rng_of_interest = [
  [5, 17],
  [17, 29],
  [0, 24],
];

const result = {}


console.table(data);
console.log(summarizeData(data, hrs_of_interest, rng_of_interest));
