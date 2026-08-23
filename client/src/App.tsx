import React, { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Card } from './components/Card';
import { WordForm } from './components/WordForm';
import { Alert } from './components/Alert';
import { SkeletonBlock } from './components/Skeleton';
import { AnalysisView } from './components/AnalysisView';
import { QuizView } from './components/QuizView';
import type { AnalyzeResponse, SupportedLanguageCode } from './types/vocab';
import { analyzeWord } from './services/vocabApi';
import { isLikelyValidTerm, normalizeTerm } from './utils/string';

type View = 'analysis' | 'quiz';

export default function App() {
  const [word, setWord] = useState('');
  const [langCode, setLangCode] = useState<SupportedLanguageCode>('es');
  const [langLabel, setLangLabel] = useState('Spanish');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [view, setView] = useState<View>('analysis');

  const normalized = useMemo(() => normalizeTerm(word), [word]);

  async function onAnalyze() {
    setError(null);
    setView('analysis');

    const term = normalizeTerm(word);
    if (!term) {
      setError('Please enter an English word.');
      return;
    }
    if (!isLikelyValidTerm(term)) {
      setError('Please enter a valid word/term (letters, spaces, apostrophes, hyphens; max 3 words).');
      return;
    }

    setLoading(true);
    try {
      const res = await analyzeWord({
        word: term,
        targetLanguageCode: langCode,
        targetLanguageLabel: langLabel
      });
      setData(res);
    } catch (e: any) {
      setError(e?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <Header />

      <main className="page">
        <section className="hero">
          <div>
            <div className="eyebrow">✦ AI vocabulary lab</div>
            <h1>Turn one word into <span>real knowledge.</span></h1>
            <p className="hero-copy">Get a clear definition, natural translation, CEFR level, collocations, examples and a quick quiz — all in one focused workspace.</p>
          </div>
          <div className="hero-panel">
            <div className="hero-panel-title">Everything in one analysis</div>
            <div className="feature-grid">
              <div className="feature"><strong>CEFR + grammar</strong>Know the level and word type.</div>
              <div className="feature"><strong>Natural context</strong>Learn how people actually use it.</div>
              <div className="feature"><strong>Translation</strong>Choose the language you need.</div>
              <div className="feature"><strong>Mini quiz</strong>Test memory immediately.</div>
            </div>
          </div>
        </section>

        <div className="grid gap-4">
          <Card title="Analyze a word" subtitle="Enter a word or short phrase and let AI build your study card" className="form-card">
            <WordForm
              word={word}
              onWordChange={setWord}
              languageCode={langCode}
              onLanguageChange={(code, label) => {
                setLangCode(code);
                setLangLabel(label);
              }}
              onSubmit={onAnalyze}
              disabled={loading}
            />
            <div className="entered-line">You entered: <strong>{normalized || '—'}</strong></div>

            {error ? (
              <div className="mt-4">
                <Alert variant="error" title="Couldn’t analyze the word">
                  {error}
                </Alert>
              </div>
            ) : null}
          </Card>

          {loading ? (
            <Card title="Loading">
              <div aria-live="polite" className="text-sm text-slate-300 mb-3">
                Analyzing vocabulary and generating a quiz…
              </div>
              <SkeletonBlock />
            </Card>
          ) : null}

          {!loading && !data ? (
            <Card title="Your study workflow" subtitle="A simple loop that keeps you learning">
              <div className="quick-start">
                <div className="quick-item"><div className="quick-icon">01</div><strong>Enter</strong><span>Type one word or phrase.</span></div>
                <div className="quick-item"><div className="quick-icon">02</div><strong>Understand</strong><span>Read meaning and translation.</span></div>
                <div className="quick-item"><div className="quick-icon">03</div><strong>See it</strong><span>Use examples and collocations.</span></div>
                <div className="quick-item"><div className="quick-icon">04</div><strong>Recall</strong><span>Finish the mini quiz.</span></div>
              </div>
            </Card>
          ) : null}

          {!loading && data ? (
            view === 'analysis' ? (
              <AnalysisView
                analysis={data.analysis}
                onStartQuiz={() => setView('quiz')}
              />
            ) : (
              <QuizView
                quiz={data.quiz}
                onBackToAnalysis={() => setView('analysis')}
              />
            )
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
