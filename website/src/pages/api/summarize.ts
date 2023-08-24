import type { APIRoute } from "astro";
import summarizeStations from "@/lib/summarizeStations";
import { DateTime } from "luxon";
import { getCollection, getEntry } from "astro:content";

export const get: APIRoute = async ({ url }) => {
  const dateString = url.searchParams.get("date");
  if (!dateString) return new Response(null, { status: 500 });

  const stations = await getCollection("stations");
  const timesOfInterest = await getEntry("timesOfInterest", "timesOfInterest");

  const date = DateTime.fromISO(dateString);
  const summary = await summarizeStations(
    stations.map((station) => station.data),
    date,
    timesOfInterest.data
  );

  return new Response(JSON.stringify(summary));
};
