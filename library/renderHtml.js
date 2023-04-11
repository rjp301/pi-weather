import fs from "fs/promises";
import Handlebars from "handlebars";
import path from "path";

export default async function renderHtml(data) {
  const fname_template = path.join("html", "summary_template.html");
  const source = await fs.readFile(fname_template, "utf-8");
  const template = Handlebars.compile(source);

  data["len_hrs"] = data.columns.filter((i) => i.includes("Temp")).length;
  data["len_rng"] = data.columns.filter((i) => i.includes("-")).length;

  const result = template(data);
  await fs.writeFile(path.join("html", "summary.html"), result);

  return result;
}
