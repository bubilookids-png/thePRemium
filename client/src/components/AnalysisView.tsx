import React from 'react';
import type { VocabAnalysis, FieldSources, SourceType } from '../types/vocab';
import { Card } from './Card';
import { SourceBadge } from './SourceBadge';

function Pill({
  children,
  accent = false
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <span className="pill">
      <span
        className="pill-dot"
        style={accent ? { background: '#a78bfa' } : undefined}
      />
      {children}
    </span>
  );
}

interface AnalysisViewProps {
  analysis: VocabAnalysis;
  source?: 'local_database' | 'ai_engine' | string;
  sources?: FieldSources;
  onStartQuiz: () => void;
}

export function AnalysisView({
  analysis: a,
  source,
  sources,
  onStartQuiz
}: AnalysisViewProps) {
  const isOverallDb = source === 'local_database' || source === 'db';
  const defaultSource: SourceType = isOverallDb ? 'db' : 'ai';

  const getSource = (field?: SourceType): SourceType => {
    if (field === 'db' || field === 'ai') return field;
    return defaultSource;
  };

  return (
    <div className="analysis-results">
      {/* 01 — Word overview */}
      <div className="result-reveal result-1">
        <Card
          title="Word overview"
          subtitle="The essentials at a glance"
          rightSlot={
            <div className="flex items-center gap-2">
              <SourceBadge type={getSource(sources?.definition)} />
              <button
                onClick={onStartQuiz}
                className="action-btn"
              >
                ✦ Start mini quiz
              </button>
            </div>
          }
        >
          <div className="meta-row">
            <Pill>CEFR: {a.cefrLevel}</Pill>
            <Pill>Part of speech: {a.partOfSpeech}</Pill>

            {a.pronunciation?.ipa ? (
              <Pill accent>
                IPA: {a.pronunciation.ipa}
              </Pill>
            ) : null}
          </div>

          <div className="overview-grid">
            <div className="info-box">
              <div className="info-label">
                Definition · English
              </div>

              <div className="info-value">
                {a.definition}
              </div>
            </div>

            <div className="info-box translation-box">
              <div className="info-label flex items-center justify-between">
                <span>Translation · {a.targetLanguage.label}</span>
                <SourceBadge type={getSource(sources?.translation)} />
              </div>

              <div className="info-value">
                {a.translation}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 02 — Synonyms / Antonyms */}
      <div className="cards-2 result-reveal result-2">
        <Card
          title="Synonyms"
          subtitle="Similar meaning"
          rightSlot={<SourceBadge type={getSource(sources?.synonyms)} />}
        >
          {a.synonyms?.length ? (
            <div className="tag-list">
              {a.synonyms.map((s) => (
                <span className="tag" key={s}>
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-400">
              No common synonyms provided.
            </div>
          )}
        </Card>

        <Card
          title="Antonyms"
          subtitle="Opposite meaning"
          rightSlot={<SourceBadge type={getSource(sources?.antonyms)} />}
        >
          {a.antonyms?.length ? (
            <div className="tag-list">
              {a.antonyms.map((s) => (
                <span className="tag" key={s}>
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-400">
              No common antonyms provided.
            </div>
          )}
        </Card>
      </div>

      {/* 03 — Collocations */}
      <div className="mt-4 result-reveal result-3">
        <Card
          title="Common collocations"
          subtitle="Natural word combinations"
          rightSlot={<SourceBadge type={getSource(sources?.collocations)} />}
        >
          {a.collocations?.length ? (
            <div className="item-list">
              {a.collocations.map((c) => (
                <div
                  className="list-item"
                  key={c}
                >
                  {c}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-400">
              No collocations provided.
            </div>
          )}
        </Card>
      </div>

      {/* 04 — Examples */}
      <div className="mt-4 result-reveal result-4">
        <Card
          title="Natural examples"
          subtitle="See the word in real context"
          rightSlot={<SourceBadge type={getSource(sources?.examples)} />}
        >
          {a.examples?.length ? (
            <ol className="example-list">
              {a.examples.map((ex, idx) => (
                <li
                  className="example-item"
                  key={idx}
                >
                  <span className="example-num">
                    {idx + 1}
                  </span>

                  <span className="example-text">
                    {ex}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="text-sm text-slate-400">
              No examples provided.
            </div>
          )}
        </Card>
      </div>

      {/* 05 — Usage */}
      <div className="cards-2 result-reveal result-5">
        <Card
          title="How it’s used"
          subtitle="Usage guidance"
          rightSlot={<SourceBadge type={getSource(sources?.definition)} />}
        >
          <p className="text-sm leading-7 text-slate-200">
            {a.usage}
          </p>
        </Card>

        <Card
          title="Usage notes"
          subtitle="Common mistakes to avoid"
          rightSlot={<SourceBadge type={getSource(sources?.definition)} />}
        >
          {a.commonMistakes?.length ? (
            <div className="item-list">
              {a.commonMistakes.map((m, idx) => (
                <div
                  className="list-item"
                  key={idx}
                >
                  {m}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-400">
              No common mistakes listed.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}