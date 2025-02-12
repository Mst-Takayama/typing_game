"use client";
import { useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { getQuestions } from '@/services/api';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import EndScreen from './components/EndScreen';

export default function Home() {
  const { state, dispatch } = useGame();

  useEffect(() => {
    getQuestions().then((questions) => {
      dispatch({ type: 'SET_QUESTIONS', payload: questions });
    });
  }, []);

  if (!state.isStart) {
    return <StartScreen />;
  }

  if (state.isCompleted) {
    return <EndScreen />;
  }

  return <GameScreen />;
}
