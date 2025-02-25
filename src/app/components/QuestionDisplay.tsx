import React from 'react';
import { useGame } from '@/context/GameContext';

type QuestionDisplayProps = {
  statement: string;
  currentPosition: number;
};

const QuestionDisplay = ({ statement, currentPosition }: QuestionDisplayProps) => {
  const { state } = useGame();
  const currentQuestion = state.questions[state.currentQuestionIndex];
  
  // 入力すべきアルファベットを取得
  // 現在の入力位置に対応するアルファベットの選択肢を取得
  const alphabetOptions = currentQuestion?.alphabet || [];
  
  // 現在の入力位置がalphabetOptionsの範囲内かチェック
  const currentAlphabetIndex = getCurrentAlphabetIndex(alphabetOptions, currentPosition);
  const currentAlphabetOptions = currentAlphabetIndex < alphabetOptions.length 
    ? alphabetOptions[currentAlphabetIndex] 
    : [];
  
  // 入力済みの文字と未入力の文字を分ける
  const typedText = statement.substring(0, currentPosition);
  const remainingText = statement.substring(currentPosition);

  return (
    <div className="p-6 bg-black bg-opacity-70 rounded-lg max-w-2xl">
      <h2 className="text-3xl font-bold text-white mb-6">{currentQuestion?.statement}</h2>
      
      <div className="text-2xl mb-8">
        <span className="text-green-500">{typedText}</span>
        <span className="text-white">{remainingText}</span>
      </div>
      
      {/* 入力すべきアルファベットの表示 */}
      <div className="mt-4">
        <p className="text-xl text-yellow-400 mb-2">次に入力するキー:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {currentAlphabetOptions.map((alphabet, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-gray-800 text-white rounded-md"
            >
              {alphabet}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// 現在の入力位置に対応するアルファベット配列のインデックスを計算する関数
function getCurrentAlphabetIndex(alphabetOptions: string[][], currentPosition: number): number {
  // 各アルファベット選択肢の最初の要素（代表的な入力）を使って位置を計算
  let position = 0;
  for (let i = 0; i < alphabetOptions.length; i++) {
    // 現在の位置が次のアルファベット選択肢の開始位置より前なら、現在のインデックスを返す
    if (position <= currentPosition && 
        (i === alphabetOptions.length - 1 || 
         position + alphabetOptions[i][0].length > currentPosition)) {
      return i;
    }
    position += alphabetOptions[i][0].length;
  }
  return alphabetOptions.length - 1; // デフォルトは最後の選択肢
}

export default QuestionDisplay;
