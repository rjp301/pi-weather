import { DateTime } from "luxon";
import fetchWeatherData from "../fetchWeatherData.js";
import summarizeStation from "../summarizeStation.js";
import type WeatherObservation from "../types/observation.js";
import roundMinutes from "../utils/roundMinutes.js";

export const getPrecip = (obs: WeatherObservation) => {
  const { obsTimeUtc } = obs;
  const time = roundMinutes(obsTimeUtc).toFormat("yyyy MM dd hh:mm a");
  const { precipTotal, precipRate } = obs.metric;
  return { time, precipRate, precipTotal };
};

const date = DateTime.fromISO("2023-07-16");

const response = await fetchWeatherData("IREGIO82", date);
const metrics = response.observations?.map(getPrecip);

console.table(metrics);
const summary = summarizeStation(response, date);
console.table(summary);
