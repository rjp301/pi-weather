const TzString = "Canada/Pacific"

function roundMinutes(date) {
    date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
    date.setMinutes(0, 0, 0); // Resets also seconds and milliseconds
    return date;
  }

export default function summarizeData(data,options) {
  const result = {}


  
  // hrs_of_interest = [7,13,19]
  // rng_of_interest = [(5,17),(17,29),(0,24)]
  // yesterday = dt.date.today() - dt.timedelta(days=1)
  
  data = data.map((obs) => ({
    ...obs,
    obsTimeRnd: roundMinutes(new Date(obs.obsTimeUtc)),
  }));

  return result
}