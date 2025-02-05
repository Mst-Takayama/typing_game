import React from "react";


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