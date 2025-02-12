import { useState } from 'react';
import { useGame } from '@/context/GameContext';

const StartScreen = () => {
  const { dispatch } = useGame();
  const [localUserName, setLocalUserName] = useState('');

  const handleStart = () => {
    if (!localUserName) {
      alert('名前を入力してください');
      return;
    }
    dispatch({ type: 'SET_USERNAME', payload: localUserName });
    dispatch({ type: 'START_GAME', payload: Date.now() });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="text-center p-8">
        <input
          type="text"
          value={localUserName}
          onChange={(e) => setLocalUserName(e.target.value)}
          placeholder="Enter your name..."
          className="w-64 p-3 text-lg"
        />
      </div>
      <div>
        <button
          onClick={handleStart}
          className="px-8 py-3 text-xl bg-red-900"
        >
          Start Game
        </button>
      </div>
    </main>
  );
};

export default StartScreen;