import fs from "fs/promises";
import Handlebars from "handlebars";
import path from "path";

export default async function renderHtml(
  data: {},
  fname_template: string,
  fname_save?: string,
) {
  const source = await fs.readFile(fname_template, "utf-8");
  const template = Handlebars.compile(source);

  const result = template(data);
  if (fname_save) await fs.writeFile(fname_save, result);

  return result;
}
