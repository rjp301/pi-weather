import axios from "axios";
import dotenv from "dotenv";
import WeatherFetch from "../types/fetch";

dotenv.config();

export default async function fetchWeatherData(
  stationId: string
): Promise<WeatherFetch> {
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
    const { observations } = data;
    return { success: true, observations };
  } catch (err) {
    return { success: false, error: err };
  }
}
