import { Hono } from "hono";
import { db } from "@/api/db";
import { settingInsertSchema, settingsTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import type { TimesOfInterest } from "@/lib/types/interest";

const app = new Hono()
  .get("/", async (c) => {
    const userId = c.get("user")?.id;
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

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
    zValidator("form", settingInsertSchema.omit({ userId: true })),
    async (c) => {
      const userId = c.get("user")?.id;
      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const body = c.req.valid("form");

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
