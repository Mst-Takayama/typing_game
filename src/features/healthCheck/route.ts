import type { Hono } from "hono";
import type { Env } from "@/app/utils/factory";

const registerHealthCheckRoutes = (app: Hono<Env>) => {
  app.get("/", (c) => {
    return c.json({ message: "ok" });
  });
};

export default registerHealthCheckRoutes;
