import { DateTime } from "luxon";

function roundMinutes(dateText) {
  const date = DateTime.fromISO(dateText);
  return date.minute >= 30
    ? date.plus({ hour: 1 }).startOf("hour")
    : date.startOf("hour");
}

function roundDigits(num, digits = 1) {
  const factor = Math.pow(10, digits);
  return Math.round(num * factor) / factor;
}

function degToCompass(num) {
  var val = Math.floor(num / 22.5 + 0.5);
  var arr = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return arr[val % 16];
}

function getTemp(hr, data) {
  const obs = data.find((obs) => obs.obsTimeRnd.hour === hr);
  return obs ? `${obs.metric.tempAvg}°C` : "NO DATA";
}

function getWind(hr, data) {
  const obs = data.find((obs) => obs.obsTimeRnd.hour === hr);
  return obs
    ? `${obs.metric.windspeedAvg}km/h ${degToCompass(obs.winddirAvg)}`
    : "NO DATA";
}

/**
 * Determine the total rainfal for a given 24 hours period.
 * Rainfall rate resets every 24 hours so must take the
 * accumulated precipitation at midnight
 */
function rainTotal(temp) {
  if (temp.length === 0) return 0;

  const precipRateMax = Math.max(...temp.map((obs) => obs.metric.precipRate));
  const precipTotalMax = Math.max(...temp.map((obs) => obs.metric.precipTotal));
  const precipTotalBeg = temp[0].metric.precipTotal;

  if (precipRateMax <= 0) return 0;
  return precipTotalMax - precipTotalBeg;
}

function getRain(rng, data) {
  const yesterdayBeg = DateTime.now()
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .minus({ days: 1 });

  const timeBeg = yesterdayBeg.plus({ hour: rng[0] });
  const timeEnd = yesterdayBeg.plus({ hour: rng[1] });
  const timeMid = yesterdayBeg.plus({ hour: 24 });

  // console.log("timeBeg",timeBeg.toString())
  // console.log("timeEnd",timeEnd.toString())
  // console.log("timeMid",timeMid.toString())

  const relevantObs = data.filter(
    (obs) => obs.obsTimeRnd <= timeEnd && obs.obsTimeRnd >= timeBeg
  );

  if (relevantObs.length === 0) return "NO DATA";

  const preMidnight = relevantObs.filter((obs) => obs.obsTimeRnd < timeMid);
  const postMidnight = relevantObs.filter((obs) => obs.obsTimeRnd >= timeMid);
  const totalRain = rainTotal(preMidnight) + rainTotal(postMidnight);

  return `${roundDigits(totalRain, 2)}mm`;
}

export default function summarizeStation(
  data = [],
  hrsInterest = [],
  rngInterest = []
) {
  data = data
    .map((obs) => ({
      ...obs,
      obsTimeRnd: roundMinutes(obs.obsTimeUtc),
    }))
    .sort((a, b) => b.epoch - a.epoch);

  // console.table(data);

  let result = [];
  result = [...result, ...hrsInterest.map((hr) => getTemp(hr, data))];
  result = [...result, ...hrsInterest.map((hr) => getWind(hr, data))];
  result = [...result, ...rngInterest.map((rng) => getRain(rng, data))];

  return result;
}
