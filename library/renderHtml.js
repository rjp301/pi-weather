import fs from "fs/promises"
import Handlebars from "handlebars"

const source = await fs.readFile("./html/summary_template.html","utf-8")
const template = Handlebars.compile(source)

const data = JSON.parse(await fs.readFile("./data/weatherSummary.json"))
const result = template(data)

await fs.writeFile("./html/summary.html",result)
