import { useEffect, useState } from 'react';
import { useGame } from '@/context/GameContext';
import QuestionDisplay from './QuestionDisplay';
import { useKeyboardInput } from '@/hooks/useKeyboardInput';
import { useSound } from '@/hooks/useSound';
import Trie from '@/services/trie';
import cartesianProduct from '@/services/cartesianProduct';

const GameScreen = () => {
  const { state } = useGame();
  const { playBgm, playShotSound } = useSound();
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const currentQuestion = state.questions[state.currentQuestionIndex];
  const trie = new Trie();
  trie.insert(cartesianProduct(currentQuestion.alphabet));

  const { currentPosition, handleKeyDown } = useKeyboardInput({
    trie,
    playShotSound,
  });

  // タイマーの更新
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - state.startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [state.startTime]);

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
      {/* ゲーム情報表示エリア */}
      <div className="absolute top-4 left-0 right-0 flex justify-between px-8">
        <div className="bg-black bg-opacity-70 p-2 rounded-lg">
          <p className="text-white">問題: {state.currentQuestionIndex + 1}/{state.questions.length}</p>
        </div>
        <div className="bg-black bg-opacity-70 p-2 rounded-lg">
          <p className="text-white">時間: {elapsedTime}秒</p>
        </div>
        <div className="bg-black bg-opacity-70 p-2 rounded-lg">
          <p className="text-white">ミス: {state.mistakeCount}回</p>
        </div>
      </div>
      
      <QuestionDisplay
        statement={currentQuestion.statement}
        currentPosition={currentPosition}
      />
    </div>
  );
};

export default GameScreen;
