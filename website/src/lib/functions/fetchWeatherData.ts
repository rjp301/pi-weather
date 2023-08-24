import axios from "axios";
import dotenv from "dotenv";
import WeatherFetch from "../types/fetch";
import { DateTime } from "luxon";

dotenv.config();

async function fetchDailyWeatherData(
  stationId: string,
  date: DateTime,
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
      stationId,
      date: date.toFormat("yyyyLLdd"),
    },
  };

  try {
    const { data } = await axios(options);
    const { observations } = data;
    return { success: true, observations };
  } catch (err) {
    return { success: false, error: err };
  }
}

export default async function fetchWeatherData(
  stationId: string,
  date: DateTime,
): Promise<WeatherFetch> {
  // return fetchDailyWeatherData(stationId, date);
  const dates = [date, date.plus({ days: 1 }), date.minus({ days: 1 })];
  const responses = await Promise.all(
    dates.map((d) => fetchDailyWeatherData(stationId, d)),
  );
  const observations = responses
    .flatMap((r) => r.observations || [])
    .sort((a, b) => a.epoch - b.epoch);
  return { success: observations.length > 0, observations };
}
