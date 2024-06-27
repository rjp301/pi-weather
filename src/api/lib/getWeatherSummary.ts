// import type PocketBase from "pocketbase";
// import type { SummarizedWeather } from "./types";
// import type { Station } from "@/api/db/schema";

// import { DateTime } from "luxon";
// import summarizeStations from "../helpers/summarize-stations";
// import fetchWeatherData from "../helpers/fetch-weather-data";
// import type { WeatherFetch } from "./types";

// const getSummary = async (
//   pb: PocketBase,
//   userId: string,
//   dateString: string,
// ): Promise<{ summary: SummarizedWeather; responses: WeatherFetch[] }> => {
//   console.log("fetching new data from weather underground");

//   const date = DateTime.fromISO(dateString);
//   if (date.invalidReason) throw new Error("Invalid date");

//   const stationRecords = await pb
//     .collection("weather_stations")
//     .getFullList({ filter: `user = "${userId}"` });
//   const stations: Station[] = stationRecords.map((record) => ({
//     id: record.wu_id,
//     name: record.name,
//     lat: record.lat,
//     lon: record.lon,
//   }));

//   const user = await pb.collection("users").getOne(userId);
//   const { times_of_interest, wu_api_key } = user;

//   const responses = await Promise.all(
//     stations.map((station) => fetchWeatherData(station, date, wu_api_key)),
//   );
//   const summary = summarizeStations(responses, date, times_of_interest);

//   return { responses, summary };
// };

// export const getWeatherSummary = async (
//   pb: PocketBase,
//   userId: string,
//   dateString: string,
// ): Promise<SummarizedWeather> => {
//   const summaryId = dateString.padEnd(15, "0");

//   try {
//     const cachedSummary = await pb
//       .collection("weather_summaries")
//       .getOne(summaryId);
//     console.log("using cached data");
//     return cachedSummary.summary;
//   } catch {
//     const { summary, responses } = await getSummary(pb, userId, dateString);
//     const summaryRecord = {
//       id: summaryId,
//       user: userId,
//       response: responses,
//       summary,
//     };
//     await pb.collection("weather_summaries").create(summaryRecord);
//     return summary;
//   }
// };

// export const updateWeatherSummary = async (
//   pb: PocketBase,
//   userId: string,
//   dateString: string,
// ): Promise<void> => {
//   const summaryId = dateString.padEnd(15, "0");

//   console.log("updating data from weather underground");

//   const { summary, responses } = await getSummary(pb, userId, dateString);
//   const summaryRecord = {
//     id: summaryId,
//     user: userId,
//     response: responses,
//     summary,
//   };

//   await pb.collection("weather_summaries").update(summaryId, summaryRecord);
// };
