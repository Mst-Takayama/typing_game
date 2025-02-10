"use client";
import { useEffect, useState, useRef} from "react";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import EndScreen from "./components/EndScreen";
import cartesianProduct from "@/services/cartesianProduct";
import Trie from "@/services/judge";

export type Question = {
  statement: string;
  alphabet: string[][];
  image: string;
};

export type Rank = {
  name: string;
  score: number;
};

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentAlphabet, setCurrentAlphabet] = useState("");
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
      const correctAlphabets = cartesianProduct(currentQuestion.alphabet);
      const trie = new Trie();
      trie.insert(correctAlphabets);

      const nextAlphabet = trie.charAfter(currentAlphabet);

      if (
        nextAlphabet?.includes(e.key.toLowerCase())
      ) {
        setCurrentPosition((prev) => prev + 1);
        setCurrentAlphabet(currentAlphabet + e.key.toLowerCase());
      }

      // 問題がすべて終わった場合
      // 次の文字が空の配列で帰ってきた場合,最後の文字まで入力したと判定する
      if (Array.isArray(nextAlphabet) && nextAlphabet.length === 0) {
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
  }, [currentPosition, currentQuestionIndex, questions, currentAlphabet]);

  if (!isStart) {
    return (
      <StartScreen
        userName={userName}
        setUserName={setUserName}
        handleStart={handleStart}
      />
    );
  }

  if (isCompleted) {
    return (
      <EndScreen
        score={score}
        totalTime={totalTime}
        userName={userName}
        rank={rank}
      />
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <GameScreen
        questions={questions}
        currentQuestionIndex={currentQuestionIndex}
        currentPosition={currentPosition}
      />
    </main>
  );
}
