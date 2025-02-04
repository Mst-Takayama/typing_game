import type { Env } from "@/app/utils/factory";
import type { Hono } from "hono";
import { shuffle, take, sample } from "remeda";

type Question = {
  question: string;
  alphabet: string;
};

const registerQuestionsRoutes = (app: Hono<Env>) => {
  // すべての問題を出力する
  app.get("/questions", async (c) => {
    const redis = c.get("redis");
    try {
      const questions: Question[] | null = await redis.get("statement");
      if (!questions) {
        throw new Error("No questions found");
      }

      return c.json(questions);
    } catch (e) {
      return c.json({ error: `Error: ${e}` }, 500);
    }
  });

  // ランダムに5個の問題を出力する
  app.get("/questions/random", async (c) => {
    const redis = c.get("redis");
    try {
      const questions: Question[] | null = await redis.get("statement");
      if (!questions) {
        throw new Error("No questions found");
      }

      const randomQuestions = take(shuffle(questions), 5);
      const randomQuestionsWithImage = randomQuestions.map((question) => ({
        ...question,
        image: `/monster${sample([1, 2, 3, 4, 5], 1)}.jpg`,
      }));

      return c.json(randomQuestionsWithImage);
    } catch (e) {
      return c.json({ error: `Error: ${e}` }, 500);
    }
  });
};

export default registerQuestionsRoutes;
