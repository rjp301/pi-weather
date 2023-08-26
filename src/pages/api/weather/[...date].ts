import summarizeStations from "@/lib/summarizeStations";
import type { APIRoute } from "astro";
import { getCollection, getEntry } from "astro:content";
import { DateTime } from "luxon";

export const get: APIRoute = async ({ params, redirect }) => {
  const dateString = params.date;
  if (!dateString) return new Response(null, { status: 404 });

  const date = DateTime.fromISO(dateString);
  if (date.invalidReason) return new Response(null, { status: 404 });


  const stations = await getCollection("stations");
  const timesOfInterest = await getEntry("timesOfInterest", "timesOfInterest");
  const summary = await summarizeStations(
    stations.map((station) => station.data),
    date,
    timesOfInterest.data
  );

  return new Response(JSON.stringify(summary));
};
