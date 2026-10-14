import React, { useState, useEffect, useRef } from 'react';
import type { VocabAnalysis, FieldSources, SourceType } from '../types/vocab';
import { Card } from './Card';
import { SourceBadge } from './SourceBadge';
import { apiFetch } from '../services/apiClient';
import { useMotionEntrance } from '../utils/motion';
import { useLanguage } from '../context/LanguageContext';

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
  currentUser?: { id: number; first_name?: string } | null;
}

export function AnalysisView({
  analysis: a,
  source,
  sources,
  onStartQuiz,
  currentUser
}: AnalysisViewProps) {
  const resultsRef = useRef<HTMLDivElement>(null);
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const { t, language } = useLanguage();
  useMotionEntrance(resultsRef, a.word, '.result-reveal');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  useMotionEntrance(saveButtonRef, `${isSaving}:${isSaved}`);

  // Reset saved state when analyzed word changes
  useEffect(() => {
    setIsSaved(false);
    setSaveFeedback(null);
  }, [a.word]);

  const handleSaveWord = async () => {
    if (isSaving || isSaved) return;

    if (!currentUser?.id) {
      alert(
        language === 'uz'
          ? "So'zni Turso bulut bazasiga saqlash uchun avval Telegram orqali kiring!"
          : "Please log in via Telegram first to save words to the cloud!"
      );
      return;
    }

    try {
      setIsSaving(true);
      await apiFetch('/api/saved-words', {
        method: 'POST',
        body: JSON.stringify({
          telegram_id: currentUser.id,
          english_word: a.word,
          translation: a.translation,
          source_feature: 'analyzer'
        })
      });
      setIsSaved(true);
      setSaveFeedback('Saved to Turso!');
      setTimeout(() => setSaveFeedback(null), 3000);
    } catch (err) {
      console.error('Failed to save word:', err);
      alert(
        language === 'uz'
          ? "So'zni saqlashda xatolik yuz berdi. Qayta urinib ko'ring."
          : 'Failed to save the word. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const isOverallDb = source === 'local_database' || source === 'db';
  const defaultSource: SourceType = isOverallDb ? 'db' : 'ai';

  const getSource = (field?: SourceType): SourceType => {
    if (field === 'db' || field === 'ai') return field;
    return defaultSource;
  };

  return (
    <div ref={resultsRef} className="analysis-results">
      {/* 01 — Word overview */}
      <div className="result-reveal result-1">
        <Card
          title={t.wordOverview}
          subtitle={t.essentialsAtGlance}
          rightSlot={
            <div className="flex items-center flex-wrap gap-2">
              <SourceBadge type={getSource(sources?.definition)} />
              
              <button
                type="button"
                ref={saveButtonRef}
                onClick={handleSaveWord}
                disabled={isSaving}
                className={`action-btn flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  isSaved
                    ? 'bg-lime-500/20 text-lime-300 border border-lime-400/40 shadow-[0_0_12px_rgba(163,230,53,0.3)]'
                    : 'hover:border-lime-400/40 hover:text-lime-300'
                }`}
                title={t.saveWord}
              >
                {isSaving ? (
                  <>
                    <span className="inline-block animate-spin text-xs">⟳</span>
                    <span>{t.savingWord}</span>
                  </>
                ) : isSaved ? (
                  <>
                    <span className="text-lime-400">✓</span>
                    <span>{t.savedWord}</span>
                  </>
                ) : (
                  <>
                    <span className="text-lime-400 font-bold">+</span>
                    <span>{t.saveWord}</span>
                  </>
                )}
              </button>

              <button
                onClick={onStartQuiz}
                className="action-btn"
              >
                {t.startMiniQuiz}
              </button>
            </div>
          }
        >
          <div className="meta-row">
            <Pill>CEFR: {a.cefrLevel}</Pill>
            <Pill>{language === 'uz' ? `So'z turkumi: ${a.partOfSpeech}` : `Part of speech: ${a.partOfSpeech}`}</Pill>

            {a.pronunciation?.ipa ? (
              <Pill accent>
                IPA: {a.pronunciation.ipa}
              </Pill>
            ) : null}
          </div>

          <div className="overview-grid">
            <div className="info-box">
              <div className="info-label">
                {t.definitionEnglish}
              </div>

              <div className="info-value">
                {a.definition}
              </div>
            </div>

            <div className="info-box translation-box">
              <div className="info-label flex items-center justify-between">
                <span>{t.translationLabel} · {a.targetLanguage.label}</span>
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
          title={t.synonyms}
          subtitle={t.synonymsSub}
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
              {t.noSynonyms}
            </div>
          )}
        </Card>

        <Card
          title={t.antonyms}
          subtitle={t.antonymsSub}
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
              {t.noAntonyms}
            </div>
          )}
        </Card>
      </div>

      {/* 03 — Collocations */}
      <div className="mt-4 result-reveal result-3">
        <Card
          title={t.collocations}
          subtitle={t.collocationsSub}
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
              {t.noCollocations}
            </div>
          )}
        </Card>
      </div>

      {/* 04 — Examples */}
      <div className="mt-4 result-reveal result-4">
        <Card
          title={t.examples}
          subtitle={t.examplesSub}
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
              {t.noExamples}
            </div>
          )}
        </Card>
      </div>

      {/* 05 — Usage */}
      <div className="cards-2 result-reveal result-5">
        <Card
          title={t.howUsed}
          subtitle={t.usageSub}
          rightSlot={<SourceBadge type={getSource(sources?.definition)} />}
        >
          <p className="text-sm leading-7 text-slate-200">
            {a.usage}
          </p>
        </Card>

        <Card
          title={t.usageNotes}
          subtitle={t.mistakesSub}
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
              {t.noMistakes}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
