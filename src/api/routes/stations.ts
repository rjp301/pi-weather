import { Hono } from "hono";
import { db } from "../db";
import { stationsTable } from "../db/schema";
import { eq } from "drizzle-orm";
import authMiddleware from "../middleware/auth";

const app = new Hono().use(authMiddleware).get("/", async (c) => {
  const userId = c.get("user").id;
  const stations = await db
    .select()
    .from(stationsTable)
    .where(eq(stationsTable.userId, userId));
  return c.json(stations);
});

export default app;
