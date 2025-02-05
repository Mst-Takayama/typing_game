
type QuestionDisplayProps = {
  statement: string;
  currentPosition: number;
};

const QuestionDisplay = ({ statement, currentPosition }: QuestionDisplayProps) => {
  return (
    <div>
      {statement
        .split("")
        .map((char: string, index: number) => (
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
  );
};

export default QuestionDisplay;
