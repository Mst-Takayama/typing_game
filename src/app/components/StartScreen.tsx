import React, { useState } from "react";

type StartScreenProps = {
  userName: string;
  setUserName: (userName: string) => void;
  handleStart: () => void;
};

const StartScreen: React.FC<StartScreenProps> = ({
  userName,
  setUserName,
  handleStart,
}) => {
  const [startTime, setStartTime] = useState(0);

  const handleStartClick = () => {
    if (!userName) {
      alert("名前を入力してください");
      return;
    }
    setStartTime(Date.now());
    handleStart();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="text-center p-8">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name..."
          className="w-64 p-3 text-lg"
        />
      </div>
      <div>
        <button
          onClick={handleStartClick}
          className="px-8 py-3 text-xl bg-red-900"
        >
          Start Game
        </button>
      </div>
    </main>
  );
};

export default StartScreen;
