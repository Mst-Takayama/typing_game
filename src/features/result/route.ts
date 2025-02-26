import type { Env } from "@/app/utils/factory";
import type { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { calculateScore } from "@/utils/score";

// スコア計算のリクエストスキーマ
const calculateScoreSchema = z.object({
  startTime: z.number(),
  mistakeCount: z.number(),
});

const registerResultRoutes = (app: Hono<Env>) => {
  app.post("/result", async (c) => {
    const redis = c.get("redis");
    try {
      const { score, userName } = await c.req.json();

      if (!score || !userName) {
        throw new Error("Missing score or userName");
      }

      const result = {
        score: score,
        member: userName,
      };

      await redis.zadd("typing-score-rank", result);

      return c.json({
        message: "Score submitted successfully",
      });
    } catch (e) {
      return c.json({ error: `Error: ${e}` }, 500);
    }
  });

  app.get("/rank", async (c) => {
    const redis = c.get("redis");
    const result = await redis.zrange("typing-score-rank", 0, 9, {
      rev: true,
      withScores: true,
    });

    // [ { name: UserName, score: Score }, ... ] の形に変換
    const rank: { name: string; score: number }[] = [];
    for (let i = 0; i < result.length; i += 2) {
      rank.push({
        name: result[i] as string,
        score: result[i + 1] as number,
      });
    }

    return c.json(rank);
  });

  // スコア計算のRPCエンドポイント
  app.post("/calculate-score", zValidator("json", calculateScoreSchema), (c) => {
    const { startTime, mistakeCount } = c.req.valid("json");
    const result = calculateScore(startTime, mistakeCount);
    return c.json(result);
  });
};

export default registerResultRoutes;
