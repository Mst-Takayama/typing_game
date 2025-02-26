/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render } from '@testing-library/react';
import { describe, test, expect, mock } from 'bun:test';
import GameScreen from '../src/app/components/GameScreen';
import QuestionDisplay from '../src/app/components/QuestionDisplay';

// モック
mock.module('@/hooks/useSound', () => ({
  useSound: () => ({
    playBgm: () => {},
    stopBgm: () => {},
    playShotSound: () => {},
  }),
}));

// GameContextのモック状態
const mockGameState = {
  questions: [
    {
      statement: 'テスト問題',
      alphabet: [['t'], ['e'], ['s'], ['t'], ['o']],
      image: '/test.jpg',
    },
  ],
  currentQuestionIndex: 0,
  userName: 'テストユーザー',
  score: 0,
  startTime: Date.now() - 10000, // 10秒前
  totalTime: 0,
  rank: [],
  isCompleted: false,
  isStart: true,
  mistakeCount: 3,
};

// GameProviderをモック
mock.module('@/context/GameContext', () => ({
  useGame: () => ({
    state: mockGameState,
    dispatch: () => {},
  }),
}));

describe('QuestionDisplay', () => {
  test('進捗バーが正しく表示される', () => {
    const { getByText, container } = render(<QuestionDisplay statement="テスト問題" currentPosition={2} />);
    
    // 進捗率のテキストが表示されていることを確認（テキストノードが分割されているため関数で検索）
    const progressText = getByText((content, element) => {
      return element?.textContent === '2/5 文字 (40%)';
    });
    expect(progressText).toBeInTheDocument();
    
    // 進捗バーが存在することを確認
    const progressBar = container.querySelector('.bg-green-500') as HTMLElement;
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveStyle('width: 40%');
  });
});

describe('GameScreen', () => {
  test('ゲーム情報が正しく表示される', () => {
    const { getAllByText } = render(<GameScreen />);
    
    // 問題番号が表示されていることを確認
    const questionNumberElements = getAllByText((content, element) => {
      return element?.textContent === '問題: 1/1';
    });
    expect(questionNumberElements.length).toBeGreaterThan(0);
    expect(questionNumberElements[0]).toBeInTheDocument();
    
    // ミス回数が表示されていることを確認
    const mistakeCountElements = getAllByText((content, element) => {
      return element?.textContent === 'ミス: 3回';
    });
    expect(mistakeCountElements.length).toBeGreaterThan(0);
    expect(mistakeCountElements[0]).toBeInTheDocument();
    
    // タイマーが表示されていることを確認（値は変動するため、正確な秒数ではなくパターンでテスト）
    const timerElements = getAllByText(/時間: \d+秒/);
    expect(timerElements.length).toBeGreaterThan(0);
    expect(timerElements[0]).toBeInTheDocument();
  });
}); 