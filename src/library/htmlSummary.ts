import path from "path";

import SummarizedWeather from "src/types/summarized.js";
import renderHtml from "src/utils/renderHtml.js";

export default async function htmlSummary(data: SummarizedWeather) {
  const fname_template = path.join("html", "summary_template.html");
  const fname_save = path.join("html", "summary.html");
  return await renderHtml(data, fname_template, fname_save);
}
