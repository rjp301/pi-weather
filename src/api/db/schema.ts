import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";

export const userTable = sqliteTable("user", {
  id: text("id").$defaultFn(uuid).primaryKey().unique(),
  githubId: integer("github_id").unique(),
  username: text("username").notNull(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export type User = typeof userTable.$inferSelect;

export const sessionTable = sqliteTable("user_session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export type Session = typeof sessionTable.$inferSelect;

export const stationsTable = sqliteTable("station", {
  id: text("id").$defaultFn(uuid).primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  name: text("name").notNull(),
  wuKey: text("wu_key").notNull(),
  lat: real("lat").notNull(),
  lon: real("lon").notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export type Station = typeof stationsTable.$inferSelect;
export type StationInsert = typeof stationsTable.$inferInsert;
export const stationSchema = createSelectSchema(stationsTable);
export const stationInsertSchema = createInsertSchema(stationsTable);

export const emailsTable = sqliteTable("email", {
  id: text("id").$defaultFn(uuid).primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  email: text("email").notNull(),
  tester: integer("tester", { mode: "boolean" }).notNull().default(false),
});

export type Email = typeof emailsTable.$inferSelect;
export type EmailInsert = typeof emailsTable.$inferInsert;
export const emailSchema = createSelectSchema(emailsTable);
export const emailInsertSchema = createInsertSchema(emailsTable);

export const settingsTable = sqliteTable("setting", {
  id: text("id").$defaultFn(uuid).primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
});

export type Setting = typeof settingsTable.$inferSelect;
export type SettingInsert = typeof settingsTable.$inferInsert;
export const settingSchema = createSelectSchema(settingsTable);
export const settingInsertSchema = createInsertSchema(settingsTable);

export const summariesTable = sqliteTable("summary", {
  id: text("id").$defaultFn(uuid).primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
});

export type Summary = typeof summariesTable.$inferSelect;
export type SummaryInsert = typeof summariesTable.$inferInsert;
export const summarySchema = createSelectSchema(summariesTable);
export const summaryInsertSchema = createInsertSchema(summariesTable);
