import redis from "@/lib/redis";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

app.get("/ping", (c) => {
  return c.text("pong");
});

app.post("/result", async (c) => {
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

export const GET = handle(app);
export const POST = handle(app);
