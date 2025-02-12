import { useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import QuestionDisplay from './QuestionDisplay';
import { useKeyboardInput } from '@/hooks/useKeyboardInput';
import { useSound } from '@/hooks/useSound';
import Trie from '@/services/trie';
import cartesianProduct from '@/services/cartesianProduct';

const GameScreen = () => {
  const { state } = useGame();
  const { playBgm, playShotSound } = useSound();
  
  const currentQuestion = state.questions[state.currentQuestionIndex];
  const trie = new Trie();
  trie.insert(cartesianProduct(currentQuestion.alphabet));

  const { currentPosition, handleKeyDown } = useKeyboardInput({
    trie,
    playShotSound,
  });

  useEffect(() => {
    playBgm();
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      className="text-center w-full h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${currentQuestion.image})`,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backgroundBlendMode: "overlay",
      }}
    >
      <QuestionDisplay
        statement={currentQuestion.statement}
        currentPosition={currentPosition}
      />
    </div>
  );
};

export default GameScreen;
