import path from "path";
import fs from "fs/promises";

export default async function importList(filePath: string) {
  try {
    const contents = await fs.readFile(filePath, { encoding: "utf8" });
    return contents
      .replace(/\r\n/g, "\n")
      .split("\n")
      .filter((str) => str.length > 0);
  } catch (err: any) {
    console.error(err.message);
  }
}
