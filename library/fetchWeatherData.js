import axios from "axios";

export default async function fetchWeatherData(stationId) {
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
    return data;
  } catch (err) {
    console.error(err);
    return {};
  }
}
