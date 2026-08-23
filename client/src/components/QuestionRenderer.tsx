import React from 'react';
import type { QuizQuestion } from '../types/vocab';

export type UserAnswer =
  | { kind: 'option'; optionIndex: number }
  | { kind: 'text'; text: string }
  | { kind: 'empty' };

export function QuestionRenderer(props: {
  question: QuizQuestion;
  value: UserAnswer;
  onChange: (v: UserAnswer) => void;
  disabled?: boolean;
  showCorrectness?: boolean;
}) {
  const q = props.question;

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-slate-100 leading-6">{q.prompt}</div>

      {q.type === 'fill_blank' ? (
        <div>
          <label className="block text-xs font-medium text-slate-400" htmlFor={`fill-${q.id}`}>
            Your answer
          </label>
          <input
            id={`fill-${q.id}`}
            value={props.value.kind === 'text' ? props.value.text : ''}
            onChange={(e) => props.onChange({ kind: 'text', text: e.target.value })}
            className={[
              'mt-1 w-full rounded-xl bg-slate-950/40 px-4 py-3 text-sm',
              'ring-1 ring-white/10 placeholder:text-slate-500',
              'focus:ring-2 focus:ring-sky-400/60'
            ].join(' ')}
            placeholder="Type the missing word"
            disabled={props.disabled}
          />
          {props.showCorrectness && q.correctText ? (
            <div className="mt-2 text-xs text-slate-300">
              Correct answer: <span className="text-slate-100 font-semibold">{q.correctText}</span>
            </div>
          ) : null}
        </div>
      ) : (
        <fieldset className="space-y-2" disabled={props.disabled}>
          <legend className="sr-only">Choose an answer</legend>
          {(q.options || []).map((opt, idx) => {
            const checked = props.value.kind === 'option' && props.value.optionIndex === idx;
            return (
              <label
                key={opt + idx}
                className={[
                  'flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2',
                  'bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition-colors',
                  checked ? 'ring-2 ring-sky-400/60' : ''
                ].join(' ')}
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={checked}
                  onChange={() => props.onChange({ kind: 'option', optionIndex: idx })}
                  className="mt-1"
                />
                <span className="text-sm text-slate-100 leading-6">{opt}</span>
              </label>
            );
          })}

          {props.showCorrectness && typeof q.correctOptionIndex === 'number' && q.options ? (
            <div className="text-xs text-slate-300">
              Correct answer:{' '}
              <span className="text-slate-100 font-semibold">
                {q.options[q.correctOptionIndex]}
              </span>
            </div>
          ) : null}
        </fieldset>
      )}

      {props.showCorrectness ? (
        <div className="rounded-xl bg-slate-950/40 px-3 py-2 text-xs text-slate-300 ring-1 ring-white/10">
          {q.explanation}
        </div>
      ) : null}
    </div>
  );
}
