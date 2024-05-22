import { Hono } from "hono";
import { db } from "../db";
import { stationInsertSchema, stationsTable } from "../db/schema";
import { eq } from "drizzle-orm";
import authMiddleware from "../middleware/auth";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("user").id;
    const stations = await db
      .select()
      .from(stationsTable)
      .where(eq(stationsTable.userId, userId));
    return c.json(stations);
  })
  .post(
    "/",
    zValidator(
      "form",
      stationInsertSchema.omit({ userId: true }).extend({
        lat: z.coerce.number(),
        lon: z.coerce.number(),
      }),
    ),
    zValidator("query", z.object({ redirect: z.string() })),
    async (c) => {
      const userId = c.get("user").id;
      const data = c.req.valid("form");
      const { redirect } = c.req.valid("query");
      await db.insert(stationsTable).values({ ...data, userId });
      return c.redirect(redirect);
    },
  );

export default app;
