import type PocketBase from "pocketbase";
import type SummarizedWeather from "./types/summarized";
import type Station from "./types/station";

import { DateTime } from "luxon";
import summarizeStations from "./summarizeStations";
import fetchWeatherData from "./fetchWeatherData";

const getWeatherSummary = async (
  pb: PocketBase,
  userId: string,
  dateString: string
): Promise<SummarizedWeather> => {
  const summaryId = dateString.padEnd(15, "0");

  try {
    const cachedSummary = await pb
      .collection("weather_summaries")
      .getOne(summaryId);
    console.log("using cached data");
    return cachedSummary.summary;
  } catch {
    console.log("fetching new data from weather underground");

    const date = DateTime.fromISO(dateString);
    if (date.invalidReason) throw new Error("Invalid date");

    const stationRecords = await pb
      .collection("weather_stations")
      .getFullList();
    const stations: Station[] = stationRecords.map((record) => ({
      id: record.wu_id,
      name: record.name,
      lat: record.lat,
      lon: record.lon,
    }));

    const user = await pb.collection("users").getOne(userId);
    const { times_of_interest, wu_api_key } = user;

    const responses = await Promise.all(
      stations.map((station) => fetchWeatherData(station, date, wu_api_key))
    );
    const summary = summarizeStations(responses, date, times_of_interest);

    await pb.collection("weather_summaries").create({
      id: summaryId,
      user: userId,
      response: responses,
      summary,
    });

    return summary;
  }
};

export default getWeatherSummary;
