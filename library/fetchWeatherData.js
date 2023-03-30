import axios from "axios";
import fs from "fs/promises";

import dotenv from "dotenv";
dotenv.config();

async function fetchWeatherData(stationId) {
  const options = {
    url: "/observations/hourly/7day",
    baseURL: "https://api.weather.com/v2/pws/",
    method: "get",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    params: {
      apiKey: process.env.WU_API_KEY,
      format: "json",
      units: "m",
      stationId,
    },
  };

  try {
    const { data } = await axios(options);
    const text = JSON.stringify(data);
    process.stdout.write(text);
  } catch (err) {
    process.stderr.write(JSON.stringify(err));
  }
}

await fetchWeatherData(process.argv[2]);
