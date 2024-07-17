import { z } from "zod";


// WeatherObservation schema
export const zWeatherObservation = z.object({
  stationID: z.string(),
  tz: z.string(),
  obsTimeUtc: z.string(),
  obsTimeLocal: z.string(),
  epoch: z.number(),
  lat: z.number(),
  lon: z.number(),
  solarRadiationHigh: z.number().nullable(),
  uvHigh: z.number().nullable(),
  winddirAvg: z.number().nullable(),
  humidityHigh: z.number().nullable(),
  humidityLow: z.number().nullable(),
  humidityAvg: z.number().nullable(),
  qcStatus: z.number().nullable(),
  metric: z.object({
    tempHigh: z.number().nullable(),
    tempLow: z.number().nullable(),
    tempAvg: z.number().nullable(),
    windspeedHigh: z.number().nullable(),
    windspeedLow: z.number().nullable(),
    windspeedAvg: z.number().nullable(),
    windgustHigh: z.number().nullable(),
    windgustLow: z.number().nullable(),
    windgustAvg: z.number().nullable(),
    dewptHigh: z.number().nullable(),
    dewptLow: z.number().nullable(),
    dewptAvg: z.number().nullable(),
    windchillHigh: z.number().nullable(),
    windchillLow: z.number().nullable(),
    windchillAvg: z.number().nullable(),
    heatindexHigh: z.number().nullable(),
    heatindexLow: z.number().nullable(),
    heatindexAvg: z.number().nullable(),
    pressureMax: z.number().nullable(),
    pressureMin: z.number().nullable(),
    pressureTrend: z.number().nullable(),
    precipRate: z.number().nullable(),
    precipTotal: z.number().nullable(),
  })
});

// TimesOfInterest schema
export const zTimesOfInterest = z.object({
  hours: z.array(z.number()),
  ranges: z.array(z.object({
    beg: z.number(),
    end: z.number()
  }))
});

// WeatherFetch schema
export const zWeatherFetch = z.object({
  success: z.boolean(),
  observations: z.array(zWeatherObservation).optional(),
  error: z.any().optional(),
  stationId: z.string()
});

// SummarizedWeather schema
export const zSummarizedWeather = z.object({
  headers: z.array(z.object({
    name: z.string(),
    colspan: z.number()
  })),
  columns: z.array(z.string()),
  data: z.array(z.array(z.string()))
});
