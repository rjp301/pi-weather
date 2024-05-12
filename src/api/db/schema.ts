import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";

export const stations = sqliteTable("station", {
  id: text("id").$defaultFn(uuid).primaryKey(),
  name: text("name").notNull(),
  wuKey: text("wu_key").notNull(),
  lat: real("lat").notNull(),
  lon: real("lon").notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export type Station = typeof stations.$inferSelect;
export type StationInsert = typeof stations.$inferInsert;
export const stationSchema = createSelectSchema(stations);
export const stationInsertSchema = createInsertSchema(stations);
