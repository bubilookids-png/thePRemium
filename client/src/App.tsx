import GradientWaves from './components/GradientWaves';
import WarpText from './components/WarpText';
import React, { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Card } from './components/Card';
import { WordForm } from './components/WordForm';
import { Alert } from './components/Alert';
import { AnalysisView } from './components/AnalysisView';
import { QuizView } from './components/QuizView';
import { ReadingCreator } from './components/ReadingCreator';

import type {
  AnalyzeResponse,
  SupportedLanguageCode
} from './types/vocab';

import { analyzeWord } from './services/vocabApi';

import {
  isLikelyValidTerm,
  normalizeTerm
} from './utils/string';

type View = 'analysis' | 'quiz';
type AppMode = 'vocabulary' | 'reading';

export default function App() {
  const [mode, setMode] =
    useState<AppMode>('vocabulary');

  const [word, setWord] = useState('');
  const [langCode, setLangCode] =
    useState<SupportedLanguageCode>('es');
  const [langLabel, setLangLabel] =
    useState('Spanish');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [data, setData] =
    useState<AnalyzeResponse | null>(null);

  const [view, setView] =
    useState<View>('analysis');

  const normalized = useMemo(
    () => normalizeTerm(word),
    [word]
  );

  async function onAnalyze() {
    setError(null);
    setView('analysis');

    const term = normalizeTerm(word);

    if (!term) {
      setError(
        'Please enter an English word.'
      );
      return;
    }

    if (!isLikelyValidTerm(term)) {
      setError(
        'Please enter a valid word/term (letters, spaces, apostrophes, hyphens; max 3 words).'
      );
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
      setError(
        e?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  function handleTryFirstWord() {
    const section = document.getElementById(
      'analyze-word-section'
    );

    if (!section) return;

    section.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    window.setTimeout(() => {
      const input = section.querySelector(
        'input'
      ) as HTMLInputElement | null;

      if (input) {
        input.focus();
      }
    }, 500);
  }

  function openReading() {
    setMode('reading');
    setError(null);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function openVocabulary() {
    setMode('vocabulary');
    setError(null);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  return (
    <div className="app-shell">
      <div className="app-background">
        <GradientWaves
          horizonColor="#09051F"
          waveColor="#5227FF"
          crestColor="#C4B5FD"
          speed={0.22}
          amplitude={2.2}
          waveScale={0.55}
          waveRatio={0.9}
          swell={28}
          turbulence={16}
          tilt={1.11}
          zoom={1.0}
          height={5.5}
          fogDepth={18}
          detail="medium"
          brightness={0.75}
          opacity={0.85}
          mouseInteraction={true}
          parallaxStrength={0.35}
          grain={true}
          grainIntensity={0.025}
        />
      </div>

      <div className="app-content">
        <Header
          onReadingClick={openReading}
          readingActive={
            mode === 'reading'
          }
        />

        {mode === 'reading' ? (
          <main className="page">
            <ReadingCreator
              onBack={openVocabulary}
            />
          </main>
        ) : (
          <>
            <main className="page">
              <section className="hero">
                <div>
                  <div className="eyebrow">
                    ✦ AI vocabulary lab
                  </div>

                  <button
                    type="button"
                    className="try-first-word"
                    onClick={
                      handleTryFirstWord
                    }
                  >
                    <span className="try-first-word-icon">
                      ✦
                    </span>

                    <span>
                      Try your first word
                    </span>

                    <span className="try-first-arrow">
                      →
                    </span>
                  </button>

                  <h1>
                    <WarpText
                      text={
                        'Turn one word into\nreal knowledge.'
                      }
                      color="#f8f5ff"
                      warpStrength={0.08}
                      warpScale={1.7}
                      speed={0.55}
                      pointerInfluence={0.42}
                      pointerStrength={0.38}
                      refraction={0.018}
                      ripple
                      fontSize="clamp(3rem, 7vw, 6rem)"
                      fontWeight={800}
                      style={{
                        height: '220px'
                      }}
                    />
                  </h1>

                  <p className="hero-copy">
                    Get a clear definition,
                    natural translation, CEFR
                    level, collocations, examples
                    and a quick quiz — all in one
                    focused workspace.
                  </p>
                </div>

                <div className="hero-panel">
                  <div className="hero-panel-title">
                    Everything in one analysis
                  </div>

                  <div className="feature-grid">
                    <div className="feature">
                      <strong>
                        CEFR + grammar
                      </strong>
                      Know the level and word
                      type.
                    </div>

                    <div className="feature">
                      <strong>
                        Natural context
                      </strong>
                      Learn how people actually
                      use it.
                    </div>

                    <div className="feature">
                      <strong>
                        Translation
                      </strong>
                      Choose the language you
                      need.
                    </div>

                    <div className="feature">
                      <strong>
                        Mini quiz
                      </strong>
                      Test memory immediately.
                    </div>
                  </div>
                </div>
              </section>

              <div className="grid gap-4">
                <div id="analyze-word-section">
                  <Card
                    title="Analyze a word"
                    subtitle="Enter a word or short phrase and let AI build your study card"
                    className="form-card"
                  >
                    <WordForm
                      word={word}
                      onWordChange={setWord}
                      languageCode={
                        langCode
                      }
                      onLanguageChange={(
                        code,
                        label
                      ) => {
                        setLangCode(code);
                        setLangLabel(label);
                      }}
                      onSubmit={onAnalyze}
                      disabled={loading}
                    />

                    <div className="entered-line">
                      You entered:{' '}
                      <strong>
                        {normalized || '—'}
                      </strong>
                    </div>

                    {error ? (
                      <div className="mt-4">
                        <Alert
                          variant="error"
                          title="Couldn’t analyze the word"
                        >
                          {error}
                        </Alert>
                      </div>
                    ) : null}
                  </Card>
                </div>

                {loading ? (
                  <Card title="AI is thinking">
                    <div className="ai-loading">
                      <div className="ai-loading-orb">
                        <div className="ai-loading-ring ai-loading-ring-1" />
                        <div className="ai-loading-ring ai-loading-ring-2" />

                        <div className="ai-loading-core">
                          ✦
                        </div>
                      </div>

                      <div className="ai-loading-content">
                        <div className="ai-loading-title">
                          Analyzing your word

                          <span className="ai-dots">
                            <span>.</span>
                            <span>.</span>
                            <span>.</span>
                          </span>
                        </div>

                        <div className="ai-loading-steps">
                          <div className="ai-step active">
                            <span>✦</span>
                            Understanding
                            meaning
                          </div>

                          <div className="ai-step active">
                            <span>✦</span>
                            Building natural
                            examples
                          </div>

                          <div className="ai-step active">
                            <span>✦</span>
                            Preparing your
                            quiz
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : null}

                {!loading && !data ? (
                  <Card
                    title="Your study workflow"
                    subtitle="A simple loop that keeps you learning"
                  >
                    <div className="quick-start">
                      <div className="quick-item">
                        <div className="quick-icon">
                          01
                        </div>

                        <strong>
                          Enter
                        </strong>

                        <span>
                          Type one word or
                          phrase.
                        </span>
                      </div>

                      <div className="quick-item">
                        <div className="quick-icon">
                          02
                        </div>

                        <strong>
                          Understand
                        </strong>

                        <span>
                          Read meaning and
                          translation.
                        </span>
                      </div>

                      <div className="quick-item">
                        <div className="quick-icon">
                          03
                        </div>

                        <strong>
                          See it
                        </strong>

                        <span>
                          Use examples and
                          collocations.
                        </span>
                      </div>

                      <div className="quick-item">
                        <div className="quick-icon">
                          04
                        </div>

                        <strong>
                          Recall
                        </strong>

                        <span>
                          Finish the mini
                          quiz.
                        </span>
                      </div>
                    </div>
                  </Card>
                ) : null}

                {!loading && data ? (
                  view === 'analysis' ? (
                    <AnalysisView
                      analysis={
                        data.analysis
                      }
                      onStartQuiz={() =>
                        setView('quiz')
                      }
                    />
                  ) : (
                    <QuizView
                      quiz={data.quiz}
                      onBackToAnalysis={() =>
                        setView(
                          'analysis'
                        )
                      }
                    />
                  )
                ) : null}
              </div>
            </main>
          </>
        )}

        <Footer />
      </div>
    </div>
  );
}