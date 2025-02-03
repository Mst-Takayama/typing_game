import { Hono } from "hono";
import redis from "@/lib/redis";

type Env = {
  Variables: {
    redis: typeof redis;
  }
}

export const createAppWithRedis = () => {
  const app = new Hono<Env>();
  app.use(async (c, next) => {
    c.set("redis", redis);
    await next();
  });
  return app;
};
