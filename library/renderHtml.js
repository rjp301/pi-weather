import fs from "fs/promises"
import Handlebars from "handlebars"
import path from "path"
import { fileURLToPath } from "url"

const PATH = path.dirname(fileURLToPath(import.meta.url))

const fname_template = path.join(PATH,"..","html","summary_template.html")
const source = await fs.readFile(fname_template,"utf-8")
const template = Handlebars.compile(source)

const fname_summary = path.join(PATH,"..","data","weatherSummary.json")
const data = JSON.parse(await fs.readFile(fname_summary))
data["len_hrs"] = data.columns.filter(i => i.includes("Temp")).length
data["len_rng"] = data.columns.filter(i => i.includes("-")).length

const result = template(data)

await fs.writeFile("./html/summary.html",result)
