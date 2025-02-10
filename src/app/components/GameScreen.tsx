import { useEffect, useState, useRef } from "react";
import QuestionDisplay from "./QuestionDisplay";
import type { Question } from "../page";
import cartesianProduct from "@/services/cartesianProduct";
import Trie from "@/services/judge";

type GameScreenProps = {
  questions: Question[];
  currentQuestionIndex: number;
  currentPosition: number;
};

const GameScreen: React.FC<GameScreenProps> = ({ questions, currentQuestionIndex, currentPosition }) => {
  const [currentAlphabet, setCurrentAlphabet] = useState("");
  const shotSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    shotSoundRef.current = new Audio("/shot.mp3");
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentQuestion = questions[currentQuestionIndex];
      const correctAlphabets = cartesianProduct(currentQuestion.alphabet);
      const trie = new Trie();
      trie.insert(correctAlphabets);

      const nextAlphabet = trie.charAfter(currentAlphabet);

      if (nextAlphabet?.includes(e.key.toLowerCase())) {
        setCurrentPosition((prev) => prev + 1);
        setCurrentAlphabet(currentAlphabet + e.key.toLowerCase());
      }

      if (Array.isArray(nextAlphabet) && nextAlphabet.length === 0) {
        if (currentQuestionIndex === questions.length - 1) {
          if (shotSoundRef.current) {
            shotSoundRef.current.currentTime = 0;
            shotSoundRef.current.play();
          }
          // Handle game completion logic here
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

  return (
    <div
      className="text-center w-full h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${questions[currentQuestionIndex].image})`,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backgroundBlendMode: "overlay",
      }}
    >
      <QuestionDisplay
        statement={questions[currentQuestionIndex].statement}
        currentPosition={currentPosition}
      />
    </div>
  );
};

export default GameScreen;
