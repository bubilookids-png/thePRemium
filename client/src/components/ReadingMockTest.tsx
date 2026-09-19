import React, { useState } from 'react';
import { ReadingMock, Passage, Question } from '../data/readingMocks';
import { Card } from './Card';

interface ReadingMockTestProps {
  mock: ReadingMock;
}

export function ReadingMockTest({ mock }: ReadingMockTestProps) {
  const [activePassageIdx, setActivePassageIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activePassage = mock.passages[activePassageIdx];

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    let score = 0;
    mock.passages.forEach(p => {
      p.questions.forEach(q => {
        if (!answers[q.id]) return;

        const userAnswer = answers[q.id].trim().toLowerCase();
        const correctAnswer = q.answer.trim().toLowerCase();

        if (
          userAnswer === correctAnswer ||
          userAnswer.startsWith(correctAnswer + " ") ||
          userAnswer.startsWith(correctAnswer + ".")
        ) {
          score += 1;
        }
      });
    });
    return score;
  };

  const totalQuestions = mock.passages.reduce((acc, p) => acc + p.questions.length, 0);

  const checkAnswerIsCorrect = (qId: string, correctAnswer: string) => {
    if (!answers[qId]) return false;
    const userAnswer = answers[qId].trim().toLowerCase();
    const correct = correctAnswer.trim().toLowerCase();
    return userAnswer === correct ||
           userAnswer.startsWith(correct + " ") ||
           userAnswer.startsWith(correct + ".");
  };

  const renderQuestion = (q: Question) => {
    const isCorrect = isSubmitted && checkAnswerIsCorrect(q.id, q.answer);
    const isWrong = isSubmitted && !checkAnswerIsCorrect(q.id, q.answer);

    const resultClass = isSubmitted
      ? isCorrect ? "border-green-500/50" : "border-red-500/50"
      : "border-[#F8E7C9]/10";

    return (
      <div key={q.id} className={`p-4 mb-4 rounded-lg border ${resultClass} bg-[#0A1A14]`}>
        <p className="text-sm text-[#F8E7C9]/70 mb-2 italic">{q.instructions}</p>
        <p className="text-[#F8E7C9] mb-3">
          <strong>{q.number}.</strong> {q.text}
        </p>

        {q.options ? (
          <div className="flex flex-col gap-2">
            {q.options.map((opt, i) => (
              <label key={i} className="flex items-center gap-2 text-sm text-[#F8E7C9]/80 cursor-pointer">
                <input
                  type="radio"
                  name={q.id}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  disabled={isSubmitted}
                  className="accent-emerald-500"
                />
                {opt}
              </label>
            ))}
          </div>
        ) : (
          <input
            type="text"
            value={answers[q.id] || ''}
            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            disabled={isSubmitted}
            placeholder="Type your answer here..."
            className="w-full bg-[#030907] border border-[#F8E7C9]/10 rounded-lg p-2 text-[#F8E7C9] text-sm focus:outline-none focus:border-emerald-500/50"
          />
        )}

        {isSubmitted && (
          <div className="mt-3 text-sm">
            {isCorrect ? (
              <span className="text-green-400">✓ Correct</span>
            ) : (
              <span className="text-red-400">✗ Incorrect. Correct answer: {q.answer}</span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card title={mock.title}>
      {isSubmitted && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-900/30 border border-emerald-500/30 text-center">
          <h3 className="text-2xl text-emerald-400 mb-2">Test Completed</h3>
          <p className="text-lg text-[#F8E7C9]">
            Your Score: {calculateScore()} / {totalQuestions}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[#F8E7C9]/10 pb-2">
        {mock.passages.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setActivePassageIdx(idx)}
            className={`px-4 py-2 rounded-t-lg transition-colors ${
              activePassageIdx === idx
                ? 'bg-[#091511] text-[#F8E7C9] border-t border-l border-r border-[#F8E7C9]/10'
                : 'text-[#F8E7C9]/60 hover:text-[#F8E7C9]'
            }`}
          >
            Passage {idx + 1}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-full overflow-hidden">
        {/* Left Side: Passage */}
        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar" style={{ maxHeight: '60vh' }}>
          <h2 className="text-xl font-bold text-[#F8E7C9] mb-4">{activePassage.title}</h2>
          <div className="text-[#F8E7C9]/80 text-sm leading-relaxed whitespace-pre-wrap">
            {activePassage.text}
          </div>
        </div>

        {/* Right Side: Questions */}
        <div className="flex-1 overflow-y-auto pl-4 border-l border-[#F8E7C9]/10 custom-scrollbar" style={{ maxHeight: '60vh' }}>
          <h3 className="text-lg font-medium text-[#F8E7C9] mb-4">Questions</h3>

          <div className="flex flex-col">
            {activePassage.questions.map(renderQuestion)}
          </div>

          {!isSubmitted && (
            <button
              onClick={() => setIsSubmitted(true)}
              className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors font-medium"
            >
              Submit All Answers
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
