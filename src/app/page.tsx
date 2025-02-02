"use client";
import { useEffect, useState } from "react";

type Question = {
  question: string;
  image: string;
};

export default function Home() {
  const questions: Question[] = [
    { question: "React", image: "/monster1.jpg" },
    { question: "TypeScript", image: "/monster2.jpg" },
    { question: "JISOU", image: "/monster3.jpg" },
    { question: "GitHub", image: "/monster4.jpg" },
    { question: "Next.js", image: "/monster5.jpg" },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [userName, setUserName] = useState("");
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // スコア計算
  const addResult = (userName: string, startTime: number) => {
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const timeInSeconds = Math.floor(totalTime / 1000);
    const baseScore = 10000 / timeInSeconds;
    // 整数にする
    const score = Math.floor(baseScore);
    return { score, totalTime };
  };

  const handleStart = () => {
    if (!userName) {
      alert("名前を入力してください");
      return;
    }
    setIsStart(true);
    const startTime = Date.now();
    setStartTime(startTime);
  };

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const currentQuestion = questions[currentQuestionIndex];
      if (
        e.key.toLowerCase() === currentQuestion.question[currentPosition].toLowerCase()
      ) {
        setCurrentPosition((prev) => prev + 1);
      }

      if (currentPosition === currentQuestion.question.length - 1) {
        // 問題がすべて終わった場合
        if (currentQuestionIndex === questions.length - 1) {
          const { score, totalTime } = addResult(userName, startTime);
          setScore(score);
          setTotalTime(totalTime);
          setIsCompleted(true);
        } else {
          setCurrentQuestionIndex((prev) => prev + 1);
          setCurrentPosition(0);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPosition, currentQuestionIndex]);

  if (!isStart) {
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
  }

  if (isCompleted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-white">ゲーム終了</h1>
          <p className="text-xl text-white">スコア: {score}</p>
          <p className="text-xl text-white">所要時間: {totalTime}秒</p>
          <p className="text-xl text-white">ユーザー名: {userName}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div
        className="text-center w-full h-screen bg-cover bg-center flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${questions[currentQuestionIndex].image})`,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backgroundBlendMode: "overlay",
        }}
      >
        <div>
          {questions[currentQuestionIndex].question
            .split("")
            .map((char, index) => (
              <span
                key={index}
                style={{
                  color: index < currentPosition ? "#ff0000" : "white",
                }}
              >
                {char}
              </span>
            ))}
        </div>
      </div>
    </main>
  );
}
