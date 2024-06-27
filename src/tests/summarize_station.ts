// import { DateTime } from "luxon";
// import fetchWeatherData from "../api/helpers/fetch-weather-data.js";
// import summarizeStation from "../api/helpers/summarize-station.js";
// import type WeatherObservation from "../types/observation.js";
// import roundMinutes from "../api/helpers/round-minutes.js";

// export const getPrecip = (obs: WeatherObservation) => {
//   const { obsTimeUtc } = obs;
//   const time = roundMinutes(obsTimeUtc).toFormat("yyyy MM dd hh:mm a");
//   const { precipTotal, precipRate } = obs.metric;
//   return { time, precipRate, precipTotal };
// };

// const date = DateTime.fromISO("2023-07-16");

// const response = await fetchWeatherData("IREGIO82", date);
// const metrics = response.observations?.map(getPrecip);

// console.table(metrics);
// const summary = summarizeStation(response, date);
// console.table(summary);
