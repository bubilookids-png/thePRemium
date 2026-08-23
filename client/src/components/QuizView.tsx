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
    const got = ans.kind === 'text' ? ans.text.trim().toLowerCase() : '';
    if (!correct) return false;
    // Accept exact match only (simple + predictable).
    return got === correct;
  }

  if (ans.kind !== 'option') return false;
  if (typeof q.correctOptionIndex !== 'number') return false;
  return ans.optionIndex === q.correctOptionIndex;
}

function feedbackMessage(score: number, total: number): { variant: 'success' | 'info'; title: string; body: string } {
  const pct = total ? (score / total) * 100 : 0;
  if (pct >= 80) {
    return { variant: 'success', title: `Excellent — ${score}/${total}`, body: 'Strong understanding. Try a new word to keep momentum.' };
  }
  if (pct >= 50) {
    return { variant: 'info', title: `Good progress — ${score}/${total}`, body: 'Review the explanations and retry to reinforce memory.' };
  }
  return { variant: 'info', title: `Keep going — ${score}/${total}`, body: 'Re-read the examples and usage notes, then try again.' };
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
      if (a.kind === 'text') return acc + (a.text.trim() ? 1 : 0);
      if (a.kind === 'option') return acc + 1;
      return acc;
    }, 0);
  }, [answers, props.quiz.questions]);

  function onSubmit() {
    const per = props.quiz.questions.map((q) => {
      const a = answers[q.id] || { kind: 'empty' as const };
      const correct = gradeQuestion(q, a);
      return { id: q.id, correct };
    });

    const score = per.filter(p => p.correct).length;
    setResult({ score, total, perQuestion: per });
    setSubmitted(true);
  }

  function reset() {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
  }

  const msg = result ? feedbackMessage(result.score, result.total) : null;

  return (
    <div className="grid gap-4 fade-in">
      <Card
        title={props.quiz.title || 'Mini Quiz'}
        rightSlot={
          <div className="flex items-center gap-2">
            <button
              onClick={props.onBackToAnalysis}
              className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-100 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
            >
              Back
            </button>
            <button
              onClick={reset}
              className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-100 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
            >
              Try Again
            </button>
          </div>
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-slate-400">
            Answered <span className="text-slate-200 font-semibold">{completedCount}</span> / {total}
          </div>
          {!submitted ? (
            <button
              onClick={onSubmit}
              className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition-colors disabled:opacity-60"
              disabled={completedCount === 0}
            >
              Submit Quiz
            </button>
          ) : null}
        </div>

        {submitted && result && msg ? (
          <div className="mt-4">
            <Alert variant={msg.variant} title={msg.title}>
              {msg.body}
            </Alert>
          </div>
        ) : null}
      </Card>

      <div className="grid gap-4">
        {props.quiz.questions.map((q, idx) => {
          const per = result?.perQuestion.find(p => p.id === q.id);
          const correct = per?.correct;

          return (
            <Card
              key={q.id}
              title={`Question ${idx + 1}`}
              rightSlot={
                submitted ? (
                  <span
                    className={[
                      'rounded-full px-2.5 py-1 text-xs font-semibold ring-1',
                      correct ? 'bg-emerald-500/10 text-emerald-100 ring-emerald-500/30' : 'bg-rose-500/10 text-rose-100 ring-rose-500/30'
                    ].join(' ')}
                  >
                    {correct ? 'Correct' : 'Incorrect'}
                  </span>
                ) : null
              }
            >
              <QuestionRenderer
                question={q}
                value={answers[q.id] || { kind: 'empty' }}
                onChange={(v) => setAnswers(prev => ({ ...prev, [q.id]: v }))}
                disabled={submitted}
                showCorrectness={submitted}
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
