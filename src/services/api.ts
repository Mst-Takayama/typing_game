import type { Question, Rank } from '@/types';

export const getQuestions = async (): Promise<Question[]> => {
  const response = await fetch('/api/questions/random');
  return response.json();
};

export const postResult = async (userName: string, score: number): Promise<void> => {
  await fetch('/api/result', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score, userName }),
  });
};

export const getRank = async (): Promise<Rank[]> => {
  const response = await fetch('/api/rank');
  return response.json();
}; 