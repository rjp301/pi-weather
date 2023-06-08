import fs from "fs/promises";
import Handlebars from "handlebars";
import path from "path";

import SummarizedWeather from "../types/summarized";

export default async function renderHtml(data: SummarizedWeather) {
  const fname_template = path.join("html", "summary_template.html");
  const source = await fs.readFile(fname_template, "utf-8");
  const template = Handlebars.compile(source);

  const result = template(data);
  await fs.writeFile(path.join("html", "summary.html"), result);

  return result;
}
