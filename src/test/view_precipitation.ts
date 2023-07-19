import fetchWeatherData from "../library/fetchWeatherData.js";
import type WeatherObservation from "../types/observation.js";
import  roundMinutes from "../utils/roundMinutes.js";

const getPrecip = (obs: WeatherObservation) => {
  const { obsTimeUtc } = obs;
  const time = roundMinutes(obsTimeUtc).toFormat("yyyy MM dd hh:mm a");
  const { precipTotal, precipRate } = obs.metric;
  return { time, precipRate, precipTotal };
};

const data = await fetchWeatherData("IREGIO82");
// console.log(data);
const metrics = data.observations?.map(getPrecip);
console.table(metrics);