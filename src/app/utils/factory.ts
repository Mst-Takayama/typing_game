import { Hono } from "hono";
import redis from "@/lib/redis";
import { pinoLogger } from "hono-pino";
import type { PinoLogger } from "hono-pino";

export type Env = {
  Variables: {
    redis: typeof redis;
    logger: PinoLogger;
  };
};

export const createAppWithRedis = () => {
  const app = new Hono<Env>();
  app.use(
    pinoLogger({
      pino: { level: "debug" },
    })
  );
  app.use(async (c, next) => {
    c.set("redis", redis);
    await next();
  });
  return app;
};
