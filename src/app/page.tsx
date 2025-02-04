"use client";
import { useEffect, useState, useRef} from "react";

type Question = {
  statement: string;
  alphabet: string;
  image: string;
};

type Rank = {
  name: string;
  score: number;
};

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [userName, setUserName] = useState("");
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [rank, setRank] = useState<Rank[]>([]);
  const bgmRef = useRef<HTMLAudioElement| null>(null);
  const shotSoundRef = useRef<HTMLAudioElement| null>(null);

  useEffect(() => {
    bgmRef.current = new Audio("/bgm.mp3");
    shotSoundRef.current = new Audio("/shot.mp3");
    getQuestions().then((questions) => setQuestions(questions));
  }, []);

  useEffect(() => {
    if (isStart && bgmRef.current) {
      bgmRef.current?.play();
    }

    if (isCompleted && bgmRef.current) {
      bgmRef.current?.pause();
    }
  }, [isStart, isCompleted]);


  // スコア計算
  const addResult = async (userName: string, startTime: number) => {
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const timeInSeconds = Math.floor(totalTime / 1000);
    const baseScore = 10000 / timeInSeconds;
    // 整数にする
    const score = Math.floor(baseScore);

    await fetch("/api/result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score, userName }),
    });

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

  const getRank = async () => {
    const response = await fetch("/api/rank");
    const rank = await response.json();
    return rank;
  };

  const getQuestions = async () => {
    const response = await fetch("/api/questions/random");
    const questions = await response.json();
    return questions;
  };

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const currentQuestion = questions[currentQuestionIndex];
      if (
        e.key.toLowerCase() === currentQuestion.alphabet[currentPosition].toLowerCase()
      ) {
        setCurrentPosition((prev) => prev + 1);
      }

      if (currentPosition === currentQuestion.alphabet.length - 1) {
        // 問題がすべて終わった場合
        if (currentQuestionIndex === questions.length - 1) {
          if (shotSoundRef.current) {
            shotSoundRef.current.currentTime = 0;
            shotSoundRef.current.play();
          }
          const { score, totalTime } = await addResult(userName, startTime);
          setScore(score);
          setTotalTime(totalTime);
          const rank = await getRank();
          setRank(rank);
          setIsCompleted(true);
        } else {
          if (shotSoundRef.current) {
            shotSoundRef.current.currentTime = 0;
            shotSoundRef.current.play();
          }
          setCurrentQuestionIndex((prev) => prev + 1);
          setCurrentPosition(0);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPosition, currentQuestionIndex, questions]);

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
        <div className="mt-8">
            <h3 className="text-2xl font-bold text-white">Ranking</h3>
            {rank.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-xl text-white">Loading rank...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rank.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-around items-center p-3"
                  >
                    <span className="text-white">{index + 1}.{item.name}</span>
                    <span className="text-red-500">{item.score}</span>
                  </div>
                ))}
              </div>
            )}
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
          {questions[currentQuestionIndex].statement
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
