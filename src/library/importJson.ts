import fs from "fs/promises";

export default async function importJson(filePath: string) {
  try {
    const contents = await fs.readFile(filePath, { encoding: "utf8" });
    return JSON.parse(contents);
  } catch (err: any) {
    console.error(err.message);
  }
}
