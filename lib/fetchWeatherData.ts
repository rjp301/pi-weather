import axios from "axios";
import type WeatherFetch from "../types/fetch";
import type { DateTime } from "luxon";
import type Station from "../types/station";

async function fetchDailyWeatherData(
  station: Station,
  date: DateTime
): Promise<WeatherFetch> {
  const options = {
    url: "/history/hourly",
    baseURL: "https://api.weather.com/v2/pws/",
    method: "get",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    params: {
      apiKey: process.env.WU_API_KEY,
      format: "json",
      units: "m",
      stationId: station.id,
      date: date.toFormat("yyyyLLdd"),
    },
  };

  // console.log(`fetching ${station.name} for ${date.toISODate()}`);
  try {
    const { data } = await axios(options);
    const { observations } = data;
    return { success: true, observations, station };
  } catch (err) {
    return { success: false, error: err, station };
  }
}

export default async function fetchWeatherData(
  station: Station,
  date: DateTime
): Promise<WeatherFetch> {
  // return fetchDailyWeatherData(stationId, date);
  const dates = [date, date.plus({ days: 1 }), date.minus({ days: 1 })];
  const responses = await Promise.all(
    dates.map((d) => fetchDailyWeatherData(station, d))
  );
  const observations = responses
    .flatMap((r) => r.observations || [])
    .sort((a, b) => a.epoch - b.epoch);
  return { success: observations.length > 0, observations, station };
}
