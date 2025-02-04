import type { Env } from "@/app/utils/factory";
import type { Hono } from "hono";

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
};

export default registerResultRoutes;
