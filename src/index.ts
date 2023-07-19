import dotenv from "dotenv";
import { DateTime } from "luxon";
import { program } from "commander";

dotenv.config();

import sendEmail from "./library/sendEmail.js";
import summarizeStations from "./library/summarizeStations.js";
import htmlSummary from "./library/htmlSummary.js";

program.option("-t, --test", "Send email only to developer").parse();

const options = program.opts();

const result = await summarizeStations();
console.table(result.data);

const html = await htmlSummary(result);
const yesterday = DateTime.now().minus({ day: 1 }).toFormat("yyyy-LL-dd");
const subject = `CGL S34 Weather Summary - ${yesterday}`;
console.log(subject);

await sendEmail(subject, html, options.test);
