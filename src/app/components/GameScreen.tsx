import QuestionDisplay from "./QuestionDisplay";
import type { Question } from "../page";

type GameScreenProps = {
  questions: Question[];
  currentQuestionIndex: number;
  currentPosition: number;
};

const GameScreen: React.FC<GameScreenProps> = ({ questions, currentQuestionIndex, currentPosition }) => {    
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
