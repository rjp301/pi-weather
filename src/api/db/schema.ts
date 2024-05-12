import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";

export const stations = sqliteTable("station", {
  id: text("id").$defaultFn(uuid).primaryKey(),
  userId: text("user_id").notNull(),
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

export const emails = sqliteTable("email", {
  id: text("id").$defaultFn(uuid).primaryKey(),
  userId: text("user_id").notNull(),
  email: text("email").notNull(),
  tester: integer("tester", { mode: "boolean" }).notNull().default(false),
});

export type Email = typeof emails.$inferSelect;
export type EmailInsert = typeof emails.$inferInsert;
export const emailSchema = createSelectSchema(emails);
export const emailInsertSchema = createInsertSchema(emails);

export const settings = sqliteTable("setting", {
  id: text("id").$defaultFn(uuid).primaryKey(),
  userId: text("user_id").notNull(),
});

export type Setting = typeof settings.$inferSelect;
export type SettingInsert = typeof settings.$inferInsert;
export const settingSchema = createSelectSchema(settings);
export const settingInsertSchema = createInsertSchema(settings);

export const summaries = sqliteTable("summary", {
  id: text("id").$defaultFn(uuid).primaryKey(),
  userId: text("user_id").notNull(),
});

export type Summary = typeof summaries.$inferSelect;
export type SummaryInsert = typeof summaries.$inferInsert;
export const summarySchema = createSelectSchema(summaries);
export const summaryInsertSchema = createInsertSchema(summaries);
