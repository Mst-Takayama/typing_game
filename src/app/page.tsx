"use client";
import { useEffect, useState, useRef} from "react";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import EndScreen from "./components/EndScreen";

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
  const [isCompleted, setIsCompleted] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [userName, setUserName] = useState("");
  const [score, setScore] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [rank, setRank] = useState<Rank[]>([]);
  const bgmRef = useRef<HTMLAudioElement| null>(null);

  useEffect(() => {
    bgmRef.current = new Audio("/bgm.mp3");
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

  const getQuestions = async () => {
    const response = await fetch("/api/questions/random");
    const questions = await response.json();
    return questions;
  };

  if (!isStart) {
    return (
      <StartScreen
        userName={userName}
        setUserName={setUserName}
        setIsStart={setIsStart}
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
        setIsCompleted={setIsCompleted}
        setScore={setScore}
        setTotalTime={setTotalTime}
        setRank={setRank}
      />
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <GameScreen
        questions={questions}
        currentQuestionIndex={currentQuestionIndex}
        currentPosition={currentPosition}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        setCurrentPosition={setCurrentPosition}
        setIsCompleted={setIsCompleted}
        setScore={setScore}
        setTotalTime={setTotalTime}
        setRank={setRank}
        userName={userName}
        startTime={startTime}
      />
    </main>
  );
}
