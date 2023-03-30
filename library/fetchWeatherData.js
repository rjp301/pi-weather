import axios from "axios";
import fs from "fs/promises";

import { parse } from "csv-parse";

import dotenv from "dotenv";
dotenv.config();


const stations = await parse("./data/weatherStations.csv")
console.log(stations)

async function fetchWeatherData(stationId) {
  const options = {
    url: "/observations/current",
    baseURL: "https://api.weather.com/v2/pws/",
    method: "get",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    params: {
      apiKey: process.env.WU_API_KEY,
      format: "json",
      units: "m",
      stationId: "IREGIO61",
    },
  };

  try {
    const { data } = await axios(options);
    process.stdout.write(data);
  } catch (err) {
    process.stderr.write(err);
  }
}

// await fetchWeatherData(process.argv[2]);
