// import { DateTime } from "luxon";
// import fetchWeatherData from "../api/helpers/fetch-weather-data.js";
// import roundMinutes from "../api/helpers/round-minutes.js";
// import type { WeatherObservation } from "@/api/lib/types.js";

// const getPrecip = (obs: WeatherObservation) => {
//   const { obsTimeUtc } = obs;
//   const time = roundMinutes(obsTimeUtc).toFormat("yyyy MM dd hh:mm a");
//   const { precipTotal, precipRate } = obs.metric;
//   return { time, precipRate, precipTotal };
// };

// const data = await fetchWeatherData("IREGIO82", DateTime.fromISO("2023-07-16"));
// // console.log(data);
// const metrics = data.observations?.map(getPrecip);
// console.table(metrics);
