import fetchWeatherData from "./fetchWeatherData.js";
import summarizeStation from "./summarizeStation.js";
import fs from "fs/promises";
import { DateTime } from "luxon";

function formatHr(hr) {
  return DateTime.fromObject({ hour: hr % 24 }).toFormat("ha");
}

export default async function summarizeStations() {
  const hrsInterest = [7, 13, 19];
  const rngInterest = [
    [5, 17],
    [17, 29],
    [0, 24],
  ];

  const weatherStations = JSON.parse(
    await fs.readFile("data/weatherStations.json")
  );

  const result = {};
  result.columns = ["Name"];
  result.columns = [
    ...result.columns,
    ...hrsInterest.map((hr) => formatHr(hr) + " Temp"),
  ];
  result.columns = [
    ...result.columns,
    ...hrsInterest.map((hr) => formatHr(hr) + " Wind"),
  ];
  result.columns = [
    ...result.columns,
    ...rngInterest.map((rng) => formatHr(rng[0]) + "-" + formatHr(rng[1])),
  ];

  result.data = await Promise.all(
    weatherStations.map(async (station) => {
      const { observations: data } = await fetchWeatherData(station.id);
      const summary = summarizeStation(data, hrsInterest, rngInterest);
      return [station.name, ...summary];
    })
  );

  return result;
}
