import summarizeStation from "./summarizeStation.js";
import { DateTime } from "luxon";

import type TimesOfInterest from "./types/interest.js";
import type SummarizedWeather from "./types/summarized.js";
import type WeatherFetch from "./types/fetch.js";

function formatHr(hr: number) {
  return DateTime.fromObject({ hour: hr % 24 }).toFormat("ha");
}

export default function summarizeStations(
  responses: WeatherFetch[],
  date: DateTime,
  timesOfInterest: TimesOfInterest
) {
  const result: SummarizedWeather = {
    columns: [
      "Name",
      ...timesOfInterest.hours.map((hr) => formatHr(hr)),
      "Max",
      "Min",
      ...timesOfInterest.hours.map((hr) => formatHr(hr)),
      ...timesOfInterest.ranges.map(
        (rng) => formatHr(rng.beg) + "-" + formatHr(rng.end)
      ),
    ],
    data: responses.map((response) => {
      const summary = summarizeStation(response, date, timesOfInterest);
      // if (summary.every((result) => result === "NO DATA")) return [];
      return [response.station.name, ...summary];
    }),

    headers: [
      { name: "Name", colspan: 1 },
      { name: "Temperature", colspan: timesOfInterest.hours.length + 2 },
      { name: "Wind", colspan: timesOfInterest.hours.length },
      { name: "Precipitation", colspan: timesOfInterest.ranges.length },
    ],
  };

  return result;
}
