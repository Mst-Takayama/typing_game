export const calculateScore = (startTime: number, mistakeCount: number): { score: number; totalTime: number } => {
  const endTime = Date.now();
  const totalTime = Math.max(1, endTime - startTime); // 最低1ミリ秒を保証
  const timeInSeconds = Math.max(1, Math.floor(totalTime / 1000)); // 最低1秒を保証
  
  // 基本スコア計算 - タイムの影響を大きくする
  // 速いほど高得点になるよう、指数関数的な減衰を使用
  // 上限を設定して極端に高いスコアを防止
  const baseScore = Math.min(15000, 20000 * Math.exp(-0.05 * timeInSeconds));
  
  // ミスによるペナルティ - 影響を小さくする
  // ミス数の平方根に比例させることで、ミス数が増えても減点の増加率は低下
  const mistakePenalty = 50 * Math.sqrt(Math.max(0, mistakeCount));
  
  // 最終スコア（最低点は100点）
  const finalScore = Math.max(100, Math.floor(baseScore) - Math.floor(mistakePenalty));
  
  return {
    score: finalScore,
    totalTime
  };
}; 