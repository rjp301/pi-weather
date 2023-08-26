import fetchWeatherData from "@/lib/fetchWeatherData";
import summarizeStations from "@/lib/summarizeStations";
import type Station from "@/lib/types/station";
import type { APIRoute } from "astro";
import { DateTime } from "luxon";

export const get: APIRoute = async ({ params, redirect, locals }) => {
  const dateString = params.date || "";
  const summaryId = dateString.padEnd(15, "0");

  try {
    const cachedSummary = await locals.pb
      .collection("weather_summaries")
      .getOne(summaryId);
    console.log("using cached data");
    return new Response(JSON.stringify({ data: cachedSummary.summary }));
  } catch {
    console.log("fetching new data from weather underground");

    const date = DateTime.fromISO(dateString);
    if (date.invalidReason)
      return new Response(JSON.stringify({ error: "invalid date" }), {
        status: 404,
      });

    const stationRecords = await locals.pb
      .collection("weather_stations")
      .getFullList();
    const stations: Station[] = stationRecords.map((record) => ({
      id: record.wu_id,
      name: record.name,
      lat: record.lat,
      lon: record.lon,
    }));

    if (!locals.user)
      return new Response(JSON.stringify({ error: "no user info" }), {
        status: 500,
      });
    const { times_of_interest, wu_api_key } = locals.user;

    const responses = await Promise.all(
      stations.map((station) => fetchWeatherData(station, date, wu_api_key))
    );
    const summary = summarizeStations(responses, date, times_of_interest);

    await locals.pb.collection("weather_summaries").create({
      id: summaryId,
      user: locals.user.id,
      response: responses,
      summary,
    });

    return new Response(JSON.stringify({ data: summary }));
  }
};
