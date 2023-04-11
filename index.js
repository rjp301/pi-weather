import dotenv from "dotenv";
import { DateTime } from "luxon";
import { program } from "commander";

dotenv.config();

import renderHtml from "./library/renderHtml.js";
import sendEmail from "./library/sendEmail.js";
import summarizeStations from "./library/summarizeStations.js";

program.option("-t", "--test");
program.parse();

const options = program.opts();

const result = await summarizeStations();
console.table(result.data);

const html = await renderHtml(result);
const yesterday = DateTime.now().minus({ day: 1 }).toFormat("yyyy-LL-dd");
const subject = `CGL S34 Weather Summary - ${yesterday}`;

await sendEmail(subject, html, options.test);
