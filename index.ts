import { DateTime } from "luxon";
import { program } from "commander";
import summarizeStations from "./lib/summarizeStations";
import htmlSummary from "./lib/htmlSummary";
import sendEmail from "./lib/sendEmail";

import {
  emails,
  timesOfInterest,
  weatherStations,
  fromEmail,
  testEmails,
} from "./data";
import fetchWeatherData from "./lib/fetchWeatherData";

program
  .option("-t, --test", "Send email only to developer")
  .option("-n, --nomail", "Do not send email")
  .parse();
const options = program.opts();

const yesterday = DateTime.now()
  .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  .minus({ day: 1 });

const responses = await Promise.all(
  weatherStations.map((station) => fetchWeatherData(station, yesterday))
);
const summary = summarizeStations(responses, yesterday, timesOfInterest);

for (let line of summary.data) {
  console.log(line.join("\t"));
}

const html = await htmlSummary(summary);
const subject = `CGL S34 Weather Summary - ${yesterday.toFormat("yyyy-LL-dd")}`;
console.log(subject);

if (!options.nomail)
  await sendEmail(options.test ? testEmails : emails, subject, html, fromEmail);
console.log("DONE");
