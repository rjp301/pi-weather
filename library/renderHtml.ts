import fs from "fs/promises";
import Handlebars from "handlebars";
import path from "path";

import SummarizedWeather from "../types/summarized";
import timesOfInterest from "../data/timesOfInterest.json" assert { type: "json" };

type TemplateData = SummarizedWeather & {
  len_hrs: number;
  len_rng: number;
};

export default async function renderHtml(data: SummarizedWeather) {
  const fname_template = path.join("html", "summary_template.html");
  const source = await fs.readFile(fname_template, "utf-8");
  const template = Handlebars.compile(source);

  const templateData: TemplateData = {
    ...data,
    len_hrs: timesOfInterest.hours.length,
    len_rng: timesOfInterest.ranges.length,
  };

  const result = template(templateData);
  await fs.writeFile(path.join("html", "summary.html"), result);

  return result;
}
