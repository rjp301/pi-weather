import { Hono } from "hono";
import type { Session, User } from "lucia";

import stationRoutes from "./routes/stations";
import authRoutes from "./routes/auth";
import settingsRoutes from "./routes/settings";

import authMiddleware from "./middleware/auth";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");

app.use(authMiddleware);

const routes = app
  .route("/auth", authRoutes)
  .route("/settings", settingsRoutes)
  .route("/stations", stationRoutes)
  .get("/", (c) => c.json({ message: "Hello Hono!" }));

export default app;
export type AppType = typeof routes;

declare module "hono" {
  interface ContextVariableMap {
    session: Session | null;
    user: User | null;
  }
}
