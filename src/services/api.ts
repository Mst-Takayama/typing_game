import type { Question, Rank } from '@/types';
import { client } from './rpcClient';

export const getQuestions = async (): Promise<Question[]> => {
  const response = await client.questions.random.$get();
  return response.json();
};

export const postResult = async (userName: string, score: number): Promise<void> => {
  await client.result.$post({
    json: { score, userName }
  });
};

export const getRank = async (): Promise<Rank[]> => {
  const response = await client.rank.$get();
  return response.json();
};

// スコア計算のRPC呼び出し
export const calculateScoreRPC = async (startTime: number, mistakeCount: number): Promise<{ score: number; totalTime: number }> => {
  const response = await client['calculate-score'].$post({
    json: { startTime, mistakeCount }
  });
  return response.json();
}; 