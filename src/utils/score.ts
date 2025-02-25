export const calculateScore = (startTime: number, mistakeCount: number): { score: number; totalTime: number } => {
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  const timeInSeconds = Math.floor(totalTime / 1000);
  
  // 基本スコア計算
  const baseScore = 10000 / timeInSeconds;
  
  // ミスによるペナルティ（1ミスにつき100点減点）
  const mistakePenalty = mistakeCount * 100;
  
  // 最終スコア（最低点は0点）
  const finalScore = Math.max(0, Math.floor(baseScore) - mistakePenalty);
  
  return {
    score: finalScore,
    totalTime
  };
}; 