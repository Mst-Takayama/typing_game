import { calculateScore } from "../src/utils/score";
import { expect, test, describe } from "bun:test";

// モック関数を作成
const mockDateNow = () => 1672531200000; // 2023-01-01 00:00:00

// 実際の関数をモック関数で置き換えたバージョンを作成
const calculateScoreWithMockedTime = (startTime: number, mistakeCount: number) => {
  const originalDateNow = Date.now;
  try {
    global.Date.now = mockDateNow;
    return calculateScore(startTime, mistakeCount);
  } finally {
    global.Date.now = originalDateNow;
  }
};

describe("スコア計算のテスト", () => {
  const mockNow = mockDateNow();

  test("通常のケース - 10秒でミス0回", () => {
    const startTime = mockNow - 10000; // 10秒前
    const { score, totalTime } = calculateScoreWithMockedTime(startTime, 0);
    
    expect(totalTime).toBe(10000);
    
    // 10秒の場合の期待値を計算
    const expectedBaseScore = Math.min(15000, 20000 * Math.exp(-0.05 * 10));
    const expectedScore = Math.floor(expectedBaseScore);
    
    expect(score).toBe(expectedScore);
  });

  test("ミスがある場合 - 10秒でミス4回", () => {
    const startTime = mockNow - 10000; // 10秒前
    const { score } = calculateScoreWithMockedTime(startTime, 4);
    
    // 10秒の場合の期待値を計算
    const expectedBaseScore = Math.min(15000, 20000 * Math.exp(-0.05 * 10));
    const expectedPenalty = Math.floor(50 * Math.sqrt(4)); // 100点
    const expectedScore = Math.floor(expectedBaseScore) - expectedPenalty;
    
    expect(score).toBe(expectedScore);
  });

  test("極端に短い時間 - 1秒未満", () => {
    const startTime = mockNow - 500; // 0.5秒前
    const { score } = calculateScoreWithMockedTime(startTime, 0);
    
    // 1秒の場合の期待値（最低1秒として扱われる）
    const expectedBaseScore = Math.min(15000, 20000 * Math.exp(-0.05 * 1));
    const expectedScore = Math.floor(expectedBaseScore);
    
    expect(score).toBe(expectedScore);
  });

  test("極端に長い時間 - 5分", () => {
    const startTime = mockNow - 300000; // 5分前
    const { score } = calculateScoreWithMockedTime(startTime, 0);
    
    // 300秒の場合の期待値（最低スコアは100点）
    const rawScore = Math.floor(Math.min(15000, 20000 * Math.exp(-0.05 * 300)));
    const expectedScore = Math.max(100, rawScore);
    
    expect(score).toBe(expectedScore);
  });

  test("負のミス数は0として扱われる", () => {
    const startTime = mockNow - 10000;
    const { score: normalScore } = calculateScoreWithMockedTime(startTime, 0);
    const { score: negativeScore } = calculateScoreWithMockedTime(startTime, -5);
    
    expect(negativeScore).toBe(normalScore);
  });

  test("最低スコアは100点", () => {
    const startTime = mockNow - 600000; // 10分前（非常に長い時間）
    const { score } = calculateScoreWithMockedTime(startTime, 100); // 多数のミス
    
    expect(score).toBeGreaterThanOrEqual(100);
  });
}); 