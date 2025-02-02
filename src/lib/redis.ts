// redis.ts
import { Redis } from "@upstash/redis";

// TypeScript のグローバル宣言を拡張
/* eslint-disable no-var */
declare global {
  var _redis: Redis | undefined;
}

const redisUrl = process.env.UPSTASH_REDIS_REST_URL as string;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN as string;

if (!redisUrl || !redisToken) {
  throw new Error("Missing Upstash Redis connection info");
}

const redis =
  process.env.NODE_ENV === "development"
    ? global._redis ??
      (global._redis = new Redis({ url: redisUrl, token: redisToken }))
    : new Redis({ url: redisUrl, token: redisToken });

export default redis;
