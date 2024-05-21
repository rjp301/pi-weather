import { Hono } from "hono";

const app = new Hono().get("/:date", async (c) => {
  return c.json({ date: c.req.param("date") });
});

export default app;
