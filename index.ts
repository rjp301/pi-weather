import dotenv from "dotenv";
import { DateTime } from "luxon";
import { program } from "commander";

dotenv.config();

import renderHtml from "./library/renderHtml.ts";
import sendEmail from "./library/sendEmail.ts";
import summarizeStations from "./library/summarizeStations.ts";

program.option("-t, --test", "Send email only to developer").parse();

const options = program.opts();

const result = await summarizeStations();
console.table(result.data);

const html = await renderHtml(result);
const yesterday = DateTime.now().minus({ day: 1 }).toFormat("yyyy-LL-dd");
const subject = `CGL S34 Weather Summary - ${yesterday}`;
console.log(subject)

await sendEmail(subject, html, options.test);
