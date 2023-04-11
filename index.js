import fs from "fs/promises";
import dotenv from "dotenv";
import { DateTime } from "luxon";
import sgMail from "@sendgrid/mail";

dotenv.config();
sgMail.setApiKey(process.env.SG_API_KEY);

import fetchWeatherData from "./library/fetchWeatherData.js";
import summarizeData from "./library/summarizeData.js";
import renderHtml from "./library/renderHtml.js";
import sendEmail from "./library/sendEmail.js";

function formatHr(hr) {
  return DateTime.fromObject({ hour: hr % 24 }).toFormat("ha");
}

const hrsInterest = [7, 13, 19];
const rngInterest = [
  [5, 17],
  [17, 29],
  [0, 24],
];

const weatherStations = JSON.parse(
  await fs.readFile("data/weatherStations.json")
);

const result = {};
result.columns = ["Name"];
result.columns = [
  ...result.columns,
  ...hrsInterest.map((hr) => formatHr(hr) + " Temp"),
];
result.columns = [
  ...result.columns,
  ...hrsInterest.map((hr) => formatHr(hr) + " Wind"),
];
result.columns = [
  ...result.columns,
  ...rngInterest.map((rng) => formatHr(rng[0]) + "-" + formatHr(rng[1])),
];

result.data = await Promise.all(
  weatherStations.map(async (station) => {
    const { observations: data } = await fetchWeatherData(station.id);
    const summary = summarizeData(data, hrsInterest, rngInterest);
    return [station.name, ...summary];
  })
);

console.table(result.data);

const html = await renderHtml(result);
const yesterday = DateTime.now().minus({ day: 1 }).toFormat("yyyy-LL-dd");

const msg = {
  to: "rileypaul96@gmail.com",
  from: "saeg.weather@gmail.com",
  subject: `CGL S34 Weather Summary - ${yesterday}`,
  html,
};

sgMail
  .send(msg)
  .then((response) => {
    console.log(response[0].statusCode, "Mail sent with SendGrid");
  })
  .catch((error) => {
    console.error(error);
  });
