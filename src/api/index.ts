import { Hono } from "hono";

import stationRoutes from "./routes/stations";
import authRoutes from "./routes/auth";
import settingsRoutes from "./routes/settings";
import emailsRoutes from "./routes/emails";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");

const routes = app
  .route("/auth", authRoutes)
  .route("/emails", emailsRoutes)
  .route("/settings", settingsRoutes)
  .route("/stations", stationRoutes)
  .get("/", (c) => c.json({ message: "Hello Hono!" }));

export default app;
export type AppType = typeof routes;
