import React, { useMemo, useState } from 'react';
import type { VocabQuiz, QuizQuestion } from '../types/vocab';
import { Card } from './Card';
import { Alert } from './Alert';
import { QuestionRenderer, type UserAnswer } from './QuestionRenderer';

type Result = {
  score: number;
  total: number;
  perQuestion: { id: string; correct: boolean }[];
};

function gradeQuestion(q: QuizQuestion, ans: UserAnswer): boolean {
  if (q.type === 'fill_blank') {
    const correct = (q.correctText || '').trim().toLowerCase();
    const got =
      ans.kind === 'text'
        ? ans.text.trim().toLowerCase()
        : '';

    if (!correct) return false;

    return got === correct;
  }

  if (ans.kind !== 'option') return false;
  if (typeof q.correctOptionIndex !== 'number') return false;

  return ans.optionIndex === q.correctOptionIndex;
}

function feedbackMessage(
  score: number,
  total: number
): {
  variant: 'success' | 'info';
  title: string;
  body: string;
} {
  const pct = total ? (score / total) * 100 : 0;

  if (pct >= 80) {
    return {
      variant: 'success',
      title: `Excellent — ${score}/${total}`,
      body: 'Strong understanding. Try a new word to keep momentum.'
    };
  }

  if (pct >= 50) {
    return {
      variant: 'info',
      title: `Good progress — ${score}/${total}`,
      body: 'Review the explanations and retry to reinforce memory.'
    };
  }

  return {
    variant: 'info',
    title: `Keep going — ${score}/${total}`,
    body: 'Re-read the examples and usage notes, then try again.'
  };
}

function QuizIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 3h8" />
      <path d="M9 3v4" />
      <path d="M15 3v4" />
      <rect x="4" y="5" width="16" height="16" rx="3" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
      <path d="M4 5v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
      <path d="M20 19v-4h-4" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

export function QuizView(props: {
  quiz: VocabQuiz;
  onBackToAnalysis: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const total = props.quiz.questions.length;

  const completedCount = useMemo(() => {
    return props.quiz.questions.reduce((acc, q) => {
      const a = answers[q.id];

      if (!a) return acc;

      if (a.kind === 'text') {
        return acc + (a.text.trim() ? 1 : 0);
      }

      if (a.kind === 'option') {
        return acc + 1;
      }

      return acc;
    }, 0);
  }, [answers, props.quiz.questions]);

  const progress = total
    ? Math.round((completedCount / total) * 100)
    : 0;

  const scorePercentage =
    result && result.total
      ? Math.round((result.score / result.total) * 100)
      : 0;

  function onSubmit() {
    const per = props.quiz.questions.map((q) => {
      const a =
        answers[q.id] || {
          kind: 'empty' as const
        };

      const correct = gradeQuestion(q, a);

      return {
        id: q.id,
        correct
      };
    });

    const score = per.filter((p) => p.correct).length;

    setResult({
      score,
      total,
      perQuestion: per
    });

    setSubmitted(true);
  }

  function reset() {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
  }

  const msg = result
    ? feedbackMessage(result.score, result.total)
    : null;

  return (
    <div className="quiz-workspace fade-in">
      {/* QUIZ HEADER */}
      <Card
        className="quiz-header-card"
        title={props.quiz.title || 'Mini Quiz'}
        subtitle="Check how well you remember this word"
        rightSlot={
          <div className="quiz-header-actions">
            <button
              onClick={props.onBackToAnalysis}
              className="quiz-secondary-btn"
              type="button"
            >
              <BackIcon />
              <span>Back</span>
            </button>

            <button
              onClick={reset}
              className="quiz-secondary-btn"
              type="button"
            >
              <RefreshIcon />
              <span>Restart</span>
            </button>
          </div>
        }
      >
        {/* PROGRESS */}
        <div className="quiz-progress-area">
          <div className="quiz-progress-top">
            <div className="quiz-progress-label">
              <span className="quiz-progress-icon">
                <QuizIcon />
              </span>

              <div>
                <strong>Quiz progress</strong>
                <span>
                  {completedCount} of {total} answered
                </span>
              </div>
            </div>

            <div className="quiz-progress-percent">
              {progress}%
            </div>
          </div>

          <div
            className="quiz-progress-track"
            aria-label={`Quiz progress: ${progress}%`}
          >
            <div
              className="quiz-progress-fill"
              style={{
                width: `${progress}%`
              }}
            />
          </div>
        </div>

        {/* RESULT */}
        {submitted && result && msg ? (
          <div className="quiz-result-area">
            <div className="quiz-score-ring">
              <div className="quiz-score-inner">
                <strong>{scorePercentage}%</strong>
                <span>score</span>
              </div>
            </div>

            <div className="quiz-result-copy">
              <Alert
                variant={msg.variant}
                title={msg.title}
              >
                {msg.body}
              </Alert>
            </div>
          </div>
        ) : null}

        {/* SUBMIT */}
        {!submitted ? (
          <div className="quiz-submit-row">
            <div className="quiz-submit-info">
              {completedCount === total && total > 0 ? (
                <>
                  <span className="quiz-ready-icon">
                    <CheckIcon />
                  </span>
                  All questions answered
                </>
              ) : (
                <>
                  Answer as many questions as you can, then submit.
                </>
              )}
            </div>

            <button
              onClick={onSubmit}
              type="button"
              className="quiz-submit-btn"
              disabled={completedCount === 0}
            >
              <span>Submit quiz</span>
              <ArrowIcon />
            </button>
          </div>
        ) : null}
      </Card>

      {/* QUESTIONS */}
      <div className="quiz-question-list">
        {props.quiz.questions.map((q, idx) => {
          const per = result?.perQuestion.find(
            (p) => p.id === q.id
          );

          const correct = per?.correct;

          return (
            <Card
              key={q.id}
              className={[
                'quiz-question-card',
                submitted
                  ? correct
                    ? 'quiz-question-correct'
                    : 'quiz-question-incorrect'
                  : ''
              ].join(' ')}
              title={`Question ${String(idx + 1).padStart(2, '0')}`}
              subtitle={
                q.type === 'fill_blank'
                  ? 'Fill in the blank'
                  : 'Choose the best answer'
              }
              rightSlot={
                submitted ? (
                  <span
                    className={[
                      'quiz-status-badge',
                      correct
                        ? 'quiz-status-correct'
                        : 'quiz-status-incorrect'
                    ].join(' ')}
                  >
                    {correct ? (
                      <>
                        <CheckIcon />
                        Correct
                      </>
                    ) : (
                      'Incorrect'
                    )}
                  </span>
                ) : (
                  <span className="quiz-question-number">
                    {idx + 1}/{total}
                  </span>
                )
              }
            >
              <QuestionRenderer
                question={q}
                value={
                  answers[q.id] || {
                    kind: 'empty'
                  }
                }
                onChange={(v) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [q.id]: v
                  }))
                }
                disabled={submitted}
                showCorrectness={submitted}
              />
            </Card>
          );
        })}
      </div>

      {/* BOTTOM ACTION */}
      {submitted ? (
        <div className="quiz-complete-card">
          <div className="quiz-complete-icon">
            <CheckIcon />
          </div>

          <div className="quiz-complete-copy">
            <strong>Quiz completed</strong>
            <span>
              You scored {result?.score || 0} out of {total}.
              Review the explanations above to reinforce the word.
            </span>
          </div>

          <button
            type="button"
            onClick={reset}
            className="quiz-retry-btn"
          >
            <RefreshIcon />
            Try again
          </button>
        </div>
      ) : null}
    </div>
  );
}