import dotenv from "dotenv";
import { DateTime } from "luxon";
import { program } from "commander";

dotenv.config();

import sendEmail from "./library/sendEmail.js";
import summarizeStations from "./library/summarizeStations.js";
import htmlSummary from "./library/htmlSummary.js";

program.option("-t, --test", "Send email only to developer").parse();

const options = program.opts();

const yesterday = DateTime.now()
  .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  .minus({ day: 1 });

const result = await summarizeStations(yesterday);
console.table(result.data);

const html = await htmlSummary(result);
const subject = `CGL S34 Weather Summary - ${yesterday.toFormat("yyyy-LL-dd")}`;
console.log(subject);

await sendEmail(subject, html, options.test);
