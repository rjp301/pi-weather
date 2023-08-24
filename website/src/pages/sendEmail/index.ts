import type { APIRoute } from "astro";
import summarizeStations from "@/lib/summarizeStations";
import sendEmail from "@/lib/sendEmail";
import { DateTime } from "luxon";
import { getCollection, getEntry } from "astro:content";
import template from "@/templates/summary_template.html"
console.log(template)

export const post: APIRoute = async ({ url, params, redirect }) => {
  const test = Boolean(url.searchParams.get("test"));
  const dateString = url.searchParams.get("date");
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

  const subject = `CGL S34 Weather Summary - ${date.toFormat("yyyy-LL-dd")}`;

  try {
    await sendEmail(subject, "hello", true);
    return redirect(`/sendEmail/sent?test=${test}&date=${dateString}`);
  } catch {
    console.log("Could not send email");
    return redirect(`/sendEmail/fail?test=${test}&date=${dateString}`);
  }
};
