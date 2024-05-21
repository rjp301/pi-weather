import { Hono } from "hono";
import { db } from "@/api/db";
import { settingInsertSchema, settingsTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import type { TimesOfInterest } from "@/api/lib/types";
import authMiddleware from "../middleware/auth";

const app = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("user").id;
    const settings = await db
      .select()
      .from(settingsTable)
      .where(eq(settingsTable.userId, userId))
      .then((rows) => rows[0]);
    if (!settings) {
      return c.json({ error: "Settings not found" }, 404);
    }
    return c.json(settings);
  })
  .post(
    "/",
    zValidator("json", settingInsertSchema.omit({ userId: true })),
    async (c) => {
      const userId = c.get("user").id;
      const body = c.req.valid("json");
      const newSettings = await db
        .update(settingsTable)
        .set({
          ...body,
          userId,
          timesOfInterest: body.timesOfInterest as TimesOfInterest,
        })
        .where(eq(settingsTable.userId, userId))
        .returning()
        .then((rows) => rows[0]);
      return c.json(newSettings);
    },
  );

export default app;
