import type SummarizedWeather from "../types/summarized";
import type WeatherFetch from "../types/fetch";

import { DateTime } from "luxon";
import summarizeStations from "./summarizeStations";
import fetchWeatherData from "./fetchWeatherData";

import { weatherStations, timesOfInterest } from "../data";

export const getWeatherSummary = async (
  date: DateTime
): Promise<{ summary: SummarizedWeather; responses: WeatherFetch[] }> => {
  console.log("fetching new data from weather underground");

  const wuApiKey = process.env.WU_API_KEY;
  if (!wuApiKey) throw new Error("Weather Underground API Key not found");

  const responses = await Promise.all(
    weatherStations.map((station) => fetchWeatherData(station, date))
  );
  const summary = summarizeStations(responses, date, timesOfInterest);

  return { responses, summary };
};
