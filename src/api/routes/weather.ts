import { Hono } from "hono";
import { DateTime } from "luxon";
import { db } from "../db";
import { settingsTable, stationsTable, summariesTable } from "../db/schema";
import { eq } from "drizzle-orm";
import fetchWeatherData from "../helpers/fetch-weather-data";
import summarizeStations from "../helpers/summarize-stations";
import type { SummarizedWeather, WeatherFetch } from "@/api/lib/types";

const getFreshWeatherSummary = async (
  userId: string,
  date: DateTime,
): Promise<{ summary: SummarizedWeather; responses: WeatherFetch[] }> => {
  console.log("fetching new data from weather underground");

  const stations = await db
    .select()
    .from(stationsTable)
    .where(eq(stationsTable.userId, userId));

  const settings = await db
    .select()
    .from(settingsTable)
    .where(eq(settingsTable.userId, userId))
    .then((rows) => rows[0]);

  const responses = await Promise.all(
    stations.map((station) =>
      fetchWeatherData(station, date, settings.wuApiKey),
    ),
  );
  const summary = summarizeStations(responses, date, settings.timesOfInterest);

  await db.insert(summariesTable).values({
    userId,
    date: date.toISODate(),
    responses,
    summary,
  });

  return { responses, summary };
};

const app = new Hono().get("/:date", async (c) => {
  const userId = c.get("user")?.id ?? "";

  const dateString = c.req.param("date");
  const date = DateTime.fromISO(dateString);
  if (date.invalidReason) throw new Error("Invalid date");

  return c.json({ responses, summary });
});

export default app;

const getSummary = async (
  pb: PocketBase,
  userId: string,
  dateString: string,
): Promise<{ summary: SummarizedWeather; responses: WeatherFetch[] }> => {
  console.log("fetching new data from weather underground");

  const date = DateTime.fromISO(dateString);
  if (date.invalidReason) throw new Error("Invalid date");

  const stationRecords = await pb
    .collection("weather_stations")
    .getFullList({ filter: `user = "${userId}"` });
  const stations: Station[] = stationRecords.map((record) => ({
    id: record.wu_id,
    name: record.name,
    lat: record.lat,
    lon: record.lon,
  }));

  const user = await pb.collection("users").getOne(userId);
  const { times_of_interest, wu_api_key } = user;

  const responses = await Promise.all(
    stations.map((station) => fetchWeatherData(station, date, wu_api_key)),
  );
  const summary = summarizeStations(responses, date, times_of_interest);

  return { responses, summary };
};

export const getWeatherSummary = async (
  pb: PocketBase,
  userId: string,
  dateString: string,
): Promise<SummarizedWeather> => {
  const summaryId = dateString.padEnd(15, "0");

  try {
    const cachedSummary = await pb
      .collection("weather_summaries")
      .getOne(summaryId);
    console.log("using cached data");
    return cachedSummary.summary;
  } catch {
    const { summary, responses } = await getSummary(pb, userId, dateString);
    const summaryRecord = {
      id: summaryId,
      user: userId,
      response: responses,
      summary,
    };
    await pb.collection("weather_summaries").create(summaryRecord);
    return summary;
  }
};

export const updateWeatherSummary = async (
  pb: PocketBase,
  userId: string,
  dateString: string,
): Promise<void> => {
  const summaryId = dateString.padEnd(15, "0");

  console.log("updating data from weather underground");

  const { summary, responses } = await getSummary(pb, userId, dateString);
  const summaryRecord = {
    id: summaryId,
    user: userId,
    response: responses,
    summary,
  };

  await pb.collection("weather_summaries").update(summaryId, summaryRecord);
};
