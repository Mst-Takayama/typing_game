"use client";
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Question, Rank } from '@/types';

type GameState = {
  questions: Question[];
  currentQuestionIndex: number;
  userName: string;
  score: number;
  startTime: number;
  totalTime: number;
  rank: Rank[];
  isCompleted: boolean;
  isStart: boolean;
};

type GameAction = 
  | { type: 'SET_QUESTIONS'; payload: Question[] }
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'START_GAME'; payload: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE_GAME'; payload: { score: number; totalTime: number; rank: Rank[] } };

const initialState: GameState = {
  questions: [],
  currentQuestionIndex: 0,
  userName: '',
  score: 0,
  startTime: 0,
  totalTime: 0,
  rank: [],
  isCompleted: false,
  isStart: false,
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload };
    case 'SET_USERNAME':
      return { ...state, userName: action.payload };
    case 'START_GAME':
      return { ...state, isStart: true, startTime: action.payload };
    case 'NEXT_QUESTION':
      return { ...state, currentQuestionIndex: state.currentQuestionIndex + 1 };
    case 'COMPLETE_GAME':
      return { 
        ...state, 
        isCompleted: true,
        score: action.payload.score,
        totalTime: action.payload.totalTime,
        rank: action.payload.rank
      };
    default:
      return state;
  }
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 