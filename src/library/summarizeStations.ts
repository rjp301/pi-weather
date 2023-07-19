import fetchWeatherData from "./fetchWeatherData.js";
import summarizeStation from "./summarizeStation.js";
import importJson from "../utils/importJson.js";
import { DateTime } from "luxon";

import type Station from "../types/station";
import type TimesOfInterest from "../types/interest";
import type SummarizedWeather from "../types/summarized";

const timesOfInterest = (await importJson(
  "data/timesOfInterest.json"
)) as TimesOfInterest;

const weatherStations = (await importJson(
  "data/weatherStations.json"
)) as Station[];

function formatHr(hr: number) {
  return DateTime.fromObject({ hour: hr % 24 }).toFormat("ha");
}

export default async function summarizeStations() {
  const result: SummarizedWeather = {
    columns: [
      "Name",
      ...timesOfInterest.hours.map((hr) => formatHr(hr)),
      "Max",
      "Min",
      ...timesOfInterest.hours.map((hr) => formatHr(hr)),
      ...timesOfInterest.ranges.map(
        (rng) => formatHr(rng.beg) + "-" + formatHr(rng.end)
      ),
    ],
    data: await Promise.all(
      weatherStations.map(async (station) => {
        const response = await fetchWeatherData(station.id);
        const summary = summarizeStation(response);
        return [station.name, ...summary];
      })
    ),
    headers: [
      { name: "Name", colspan: 1 },
      { name: "Temperature", colspan: timesOfInterest.hours.length + 2 },
      { name: "Wind", colspan: timesOfInterest.hours.length },
      { name: "Precipitation", colspan: timesOfInterest.ranges.length },
    ],
  };

  return result;
}
