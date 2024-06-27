import { DateTime } from "luxon";
import fetchWeatherData from "../api/helpers/fetch-weather-data.js";
import { expect, test } from "vitest";
import { db } from "@/api/db/index.js";
import { settingsTable, stationsTable, userTable } from "@/api/db/schema.js";
import { eq } from "drizzle-orm";

const USER = "rjp301";

test("fetch weather data", async () => {
  const userId = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, USER))
    .then((rows) => rows[0].id);

  const settings = await db
    .select()
    .from(settingsTable)
    .where(eq(settingsTable.userId, userId))
    .then((rows) => rows[0]);

  console.log("API Key:", settings.wuApiKey);

  const station = await db
    .select()
    .from(stationsTable)
    .where(eq(stationsTable.userId, userId))
    .then((rows) => rows[0]);

  const data = await fetchWeatherData(
    station,
    DateTime.fromISO("2022-07-10"),
    settings.wuApiKey,
  );
  console.log(data);
  expect(data.success).toBe(true);
});
