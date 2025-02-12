import { useState, useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import { calculateScore } from '@/utils/score';
import { postResult, getRank } from '@/services/api';
import Trie from '@/services/trie';
type UseKeyboardInputProps = {
  trie: Trie;
  playShotSound: () => void;
};

export const useKeyboardInput = ({ trie, playShotSound }: UseKeyboardInputProps) => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentAlphabet, setCurrentAlphabet] = useState('');
  const { state, dispatch } = useGame();

  const handleKeyDown = useCallback(async (e: KeyboardEvent) => {
    const nextAlphabet = trie.charAfter(currentAlphabet);

    if (nextAlphabet?.includes(e.key.toLowerCase())) {
      const currentString = currentAlphabet + e.key.toLowerCase();
      setCurrentPosition(prev => prev + 1);
      setCurrentAlphabet(currentString);

      if (trie.charAfter(currentString)?.length === 0) {
        playShotSound();

        if (state.currentQuestionIndex === state.questions.length - 1) {
          const { score, totalTime } = calculateScore(state.startTime);
          await postResult(state.userName, score);
          const rank = await getRank();
          dispatch({ 
            type: 'COMPLETE_GAME', 
            payload: { score, totalTime, rank } 
          });
          return;
        }

        dispatch({ type: 'NEXT_QUESTION' });
        setCurrentPosition(0);
        setCurrentAlphabet('');
      }
    }
  }, [currentAlphabet, state.currentQuestionIndex, trie]);

  return {
    currentPosition,
    currentAlphabet,
    handleKeyDown
  };
}; 