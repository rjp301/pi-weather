import { Hono } from "hono";
import { db } from "../db";
import { stationsTable } from "../db/schema";
import { eq } from "drizzle-orm";

const app = new Hono().get("/", async (c) => {
  const userId = c.get("user")?.id;
  if (!userId) {
    return c.json([]);
  }

  const stations = await db
    .select()
    .from(stationsTable)
    .where(eq(stationsTable.userId, userId));

  return c.json(stations);
});

export default app;
