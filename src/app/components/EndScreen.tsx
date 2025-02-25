import { useGame } from '@/context/GameContext';
import { useEffect } from 'react';
import { useSound } from '@/hooks/useSound';

const EndScreen = () => {
  const { state } = useGame();
  const { score, totalTime, userName, rank, mistakeCount } = state;
  const { stopBgm } = useSound();
  useEffect(() => {
    stopBgm();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-white">ゲーム終了</h1>
        <p className="text-xl text-white">スコア: {score}</p>
        <p className="text-xl text-white">所要時間: {Math.floor(totalTime / 1000)}秒</p>
        <p className="text-xl text-white">ミス回数: {mistakeCount}回</p>
        <p className="text-xl text-white">ユーザー名: {userName}</p>
      </div>
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-white">Ranking</h3>
        {rank.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-xl text-white">Loading rank...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rank.map((item, index) => (
              <div key={index} className="flex justify-around items-center p-3">
                <span className="text-white">{index + 1}.{item.name}</span>
                <span className="text-red-500">{item.score}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default EndScreen;
