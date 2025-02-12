export const calculateScore = (startTime: number): { score: number; totalTime: number } => {
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  const timeInSeconds = Math.floor(totalTime / 1000);
  const baseScore = 10000 / timeInSeconds;
  return {
    score: Math.floor(baseScore),
    totalTime
  };
}; 