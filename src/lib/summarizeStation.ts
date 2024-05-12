import type { DateTime } from "luxon";

import type { WeatherFetch } from "./types/fetch.js";
import type { WeatherObservation } from "./types/observation.js";
import type { TimesOfInterest } from "./types/interest.js";
import roundMinutes from "./utils/roundMinutes.js";
import degToCompass from "./utils/degToCompass.js";

type ModWeatherObservation = WeatherObservation & { obsTimeRnd: DateTime };

function roundDigits(num: number, digits = 1) {
  const factor = Math.pow(10, digits);
  return Math.round(num * factor) / factor;
}

function getTemp(day: DateTime, hr: number, data: ModWeatherObservation[]) {
  const time = day.plus({ hour: hr });
  const obs = data.find((obs) => obs.obsTimeRnd.equals(time));
  return typeof obs?.metric.tempAvg === "number"
    ? `${obs.metric.tempAvg}°C`
    : "NO DATA";
}

function getWind(day: DateTime, hr: number, data: ModWeatherObservation[]) {
  const time = day.plus({ hour: hr });
  const obs = data.find((obs) => obs.obsTimeRnd.equals(time));
  return typeof obs?.metric.windspeedAvg === "number" &&
    typeof obs?.winddirAvg === "number"
    ? `${obs.metric.windspeedAvg}km/h ${degToCompass(obs.winddirAvg)}`
    : "NO DATA";
}

function maxTemp(day: DateTime, data: ModWeatherObservation[]) {
  const filtered = data
    .filter((obs) => obs.obsTimeRnd.day === day.day)
    .filter((obs) => typeof obs.metric.tempHigh === "number");
  if (filtered.length === 0) return "NO DATA";
  const result = Math.max(
    ...(filtered.map((obs) => obs.metric.tempHigh) as number[])
  );
  return typeof result === "number" ? `${result}°C` : "NO DATA";
}

function minTemp(day: DateTime, data: ModWeatherObservation[]) {
  const filtered = data
    .filter((obs) => obs.obsTimeRnd.day === day.day)
    .filter((obs) => typeof obs.metric.tempHigh === "number");
  if (filtered.length === 0) return "NO DATA";
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

  if (precipRateMax === 0) return 0;
  return Math.max(precipTotalMax - precipTotalBeg, 0);
}

function getRain(
  day: DateTime,
  rng: { beg: number; end: number },
  data: ModWeatherObservation[]
) {
  const timeBeg = day.plus({ hour: rng.beg });
  const timeEnd = day.plus({ hour: rng.end });
  const timeMid = day.plus({ hour: 24 });

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
  const POSTMidnight = relevantObs.filter((obs) => obs.obsTimeRnd >= timeMid);
  const totalRain = rainTotal(preMidnight) + rainTotal(POSTMidnight);

  return `${totalRain.toFixed(1)}mm`;
}

export default function summarizeStation(
  response: WeatherFetch,
  date: DateTime,
  timesOfInterest: TimesOfInterest
): string[] {
  const num_columns =
    timesOfInterest.hours.length * 2 + 2 + timesOfInterest.ranges.length;
  if (!response.observations) return Array(num_columns).fill("OFFLINE");

  // add rounded time, sort and filter for past 24 hours
  const data = response.observations.map((obs) => ({
    ...obs,
    obsTimeRnd: roundMinutes(obs.obsTimeUtc),
  }));

  let result: string[] = [
    ...timesOfInterest.hours.map((hr) => getTemp(date, hr, data)),
    maxTemp(date, data),
    minTemp(date, data),
    ...timesOfInterest.hours.map((hr) => getWind(date, hr, data)),
    ...timesOfInterest.ranges.map((rng) => getRain(date, rng, data)),
  ];

  return result;
}
