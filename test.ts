import fetchWeatherData from "./library/fetchWeatherData.ts"

const result = await fetchWeatherData("IREGIO61")
console.log(result)