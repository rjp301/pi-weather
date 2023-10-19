import path from "path";
import importList from "../src/utils/importList";
import TimesOfInterest from "../types/interest";
import Station from "../types/station";

export const emails = (await importList(
  path.join("data", "emailList.csv")
)) as string[];

export const testEmails = ["rileypaul96@gmail.com"];
export const fromEmail = "saeg.weather@gmail.com"

export const timesOfInterest = JSON.parse(
  await Bun.file("data/timesOfInterest.json").text()
) as TimesOfInterest;

export const weatherStations = JSON.parse(
  await Bun.file("data/weatherStations.json").text()
) as Station[];
