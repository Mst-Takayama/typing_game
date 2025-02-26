import { describe, test, expect } from "bun:test";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { calculateScore } from "../src/utils/score";

// スコア計算のリクエストスキーマ
const calculateScoreSchema = z.object({
  startTime: z.number(),
  mistakeCount: z.number(),
});

// テスト用のHonoアプリを作成
const createTestApp = () => {
  const app = new Hono();
  
  // スコア計算のRPCエンドポイント
  app.post("/calculate-score", zValidator("json", calculateScoreSchema), (c) => {
    const { startTime, mistakeCount } = c.req.valid("json");
    const result = calculateScore(startTime, mistakeCount);
    return c.json(result);
  });
  
  return app;
};

describe("スコア計算RPCのテスト", () => {
  // Date.nowをモック
  const mockDateNow = () => 1672531200000; // 2023-01-01 00:00:00
  const originalDateNow = Date.now;
  
  test("RPCエンドポイントが正しくスコアを計算して返す", async () => {
    // Date.nowをモック
    global.Date.now = mockDateNow;
    
    try {
      const app = createTestApp();
      const startTime = mockDateNow() - 10000; // 10秒前
      const mistakeCount = 2;
      
      // Honoのテストフレームワークを使用してリクエストを送信
      const res = await app.request("/calculate-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startTime, mistakeCount }),
      });
      
      expect(res.status).toBe(200);
      
      const data = await res.json();
      expect(data).toHaveProperty("score");
      expect(data).toHaveProperty("totalTime");
      expect(data.totalTime).toBe(10000);
      
      // 期待値を計算
      const expectedBaseScore = Math.min(15000, 20000 * Math.exp(-0.05 * 10));
      const expectedPenalty = Math.floor(50 * Math.sqrt(2));
      const expectedScore = Math.floor(expectedBaseScore) - expectedPenalty;
      
      expect(data.score).toBe(expectedScore);
    } finally {
      // モックを元に戻す
      global.Date.now = originalDateNow;
    }
  });
  
  test("バリデーションエラーの場合は400エラーを返す", async () => {
    const app = createTestApp();
    
    // Honoのテストフレームワークを使用して不正なリクエストを送信
    const res = await app.request("/calculate-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ startTime: "invalid", mistakeCount: 2 }),
    });
    
    expect(res.status).toBe(400);
  });
}); 