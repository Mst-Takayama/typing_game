export const calculateScore = (startTime: number, mistakeCount: number): { score: number; totalTime: number } => {
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  const timeInSeconds = Math.floor(totalTime / 1000);
  
  // 基本スコア計算 - タイムの影響を大きくする
  // 速いほど高得点になるよう、指数関数的な減衰を使用
  const baseScore = 20000 * Math.exp(-0.05 * timeInSeconds);
  
  // ミスによるペナルティ - 影響を小さくする
  // ミス数の平方根に比例させることで、ミス数が増えても減点の増加率は低下
  const mistakePenalty = 50 * Math.sqrt(mistakeCount);
  
  // 最終スコア（最低点は100点）
  const finalScore = Math.max(100, Math.floor(baseScore) - Math.floor(mistakePenalty));
  
  return {
    score: finalScore,
    totalTime
  };
}; 