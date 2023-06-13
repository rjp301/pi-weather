import { DateTime } from "luxon";
import importJson from "./importJson.js";

import type WeatherFetch from "../types/fetch";
import type WeatherObservation from "../types/observation";
import type TimesOfInterest from "../types/interest";

const timesOfInterest = (await importJson(
  "data/timesOfInterest.json"
)) as TimesOfInterest;

type ModWeatherObservation = WeatherObservation & { obsTimeRnd: DateTime };

const yesterdayBeg = DateTime.now()
  .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  .minus({ days: 1 });

function roundMinutes(dateText: string) {
  const date = DateTime.fromISO(dateText);
  return date.minute >= 30
    ? date.plus({ hour: 1 }).startOf("hour")
    : date.startOf("hour");
}

function roundDigits(num: number, digits = 1) {
  const factor = Math.pow(10, digits);
  return Math.round(num * factor) / factor;
}

function degToCompass(num: number) {
  var val = Math.floor(num / 22.5 + 0.5);
  var arr = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return arr[val % 16];
}

function getTemp(hr: number, data: ModWeatherObservation[]) {
  const time = yesterdayBeg.plus({ hour: hr });
  const obs = data.find((obs) => obs.obsTimeRnd.equals(time));
  return typeof obs?.metric.tempAvg === "number"
    ? `${obs?.metric.tempAvg}°C`
    : "NO DATA";
}

function getWind(hr: number, data: ModWeatherObservation[]) {
  const time = yesterdayBeg.plus({ hour: hr });
  const obs = data.find((obs) => obs.obsTimeRnd.equals(time));
  return typeof obs?.metric.windspeedAvg === "number" &&
    typeof obs?.winddirAvg === "number"
    ? `${obs.metric.windspeedAvg}km/h ${degToCompass(obs.winddirAvg)}`
    : "NO DATA";
}

function maxTemp(data: ModWeatherObservation[]) {
  const filtered = data.filter(
    (obs) => typeof obs.metric.tempHigh === "number"
  );
  const result = Math.max(
    ...(filtered.map((obs) => obs.metric.tempHigh) as number[])
  );
  return typeof result === "number" ? `${result}°C` : "NO DATA";
}

function minTemp(data: ModWeatherObservation[]) {
  const filtered = data.filter((obs) => typeof obs.metric.tempLow === "number");
  const result = Math.min(
    ...(filtered.map((obs) => obs.metric.tempLow) as number[])
  );
  return typeof result === "number" ? `${result}°C` : "NO DATA";
}

/**
 * Determine the total rainfal for a given 24 hours period.
 * Rainfall rate resets every 24 hours so must take the
 * accumulated precipitation at midnight
 */
function rainTotal(temp: ModWeatherObservation[]) {
  if (temp.length === 0) return 0;

  const precipRateMax = Math.max(
    ...(temp.map((obs) => obs.metric.precipRate) as number[])
  );
  const precipTotalMax = Math.max(
    ...(temp.map((obs) => obs.metric.precipTotal) as number[])
  );
  const precipTotalBeg = temp[0].metric.precipTotal as number;

  if (precipRateMax <= 0) return 0;
  return precipTotalMax - precipTotalBeg;
}

function getRain(
  rng: { beg: number; end: number },
  data: ModWeatherObservation[]
) {
  const timeBeg = yesterdayBeg.plus({ hour: rng.beg });
  const timeEnd = yesterdayBeg.plus({ hour: rng.end });
  const timeMid = yesterdayBeg.plus({ hour: 24 });

  // console.log("timeBeg",timeBeg.toString())
  // console.log("timeEnd",timeEnd.toString())
  // console.log("timeMid",timeMid.toString())

  const relevantObs = data.filter(
    (obs) =>
      obs.obsTimeRnd <= timeEnd &&
      obs.obsTimeRnd >= timeBeg &&
      obs.metric.precipRate !== null &&
      obs.metric.precipTotal !== null
  );

  if (relevantObs.length === 0) return "NO DATA";

  const preMidnight = relevantObs.filter((obs) => obs.obsTimeRnd < timeMid);
  const postMidnight = relevantObs.filter((obs) => obs.obsTimeRnd >= timeMid);
  const totalRain = rainTotal(preMidnight) + rainTotal(postMidnight);

  return `${totalRain.toFixed(1)}mm`;
}

export default function summarizeStation(response: WeatherFetch): string[] {
  const num_columns =
    timesOfInterest.hours.length * 2 + timesOfInterest.ranges.length;

  if (!response.observations) {
    return Array(num_columns).fill("OFFLINE");
  }

  // add rounded time and sort
  const data = response.observations
    .map((obs) => ({ ...obs, obsTimeRnd: roundMinutes(obs.obsTimeUtc) }))
    .sort((a, b) => b.epoch - a.epoch);

  let result: string[] = [
    ...timesOfInterest.hours.map((hr) => getTemp(hr, data)),
    maxTemp(data),
    minTemp(data),
    ...timesOfInterest.hours.map((hr) => getWind(hr, data)),
    ...timesOfInterest.ranges.map((rng) => getRain(rng, data)),
  ];

  return result;
}
