import axios from "axios";
import fs from "fs/promises";

import dotenv from "dotenv";
dotenv.config();

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
  fs.writeFile("./data.json", JSON.stringify(data));
  console.log(data);
} catch (err) {
  fs.writeFile("./error.json", JSON.stringify(err));
  console.error(err);
}
