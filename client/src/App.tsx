// src/App.tsx
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
import { AiLoader } from './components/AiLoader';
import { CyberMatrixOrb } from './components/CyberMatrixOrb';

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

export default function App() {
  const [word, setWord] = useState('');
  const [langCode, setLangCode] = useState<SupportedLanguageCode>('es');
  const [langLabel, setLangLabel] = useState('Spanish');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [view, setView] = useState<View>('analysis');

  const normalized = useMemo(
    () => normalizeTerm(word),
    [word]
  );

  async function onAnalyze() {
    setError(null);
    setView('analysis');

    const term = normalizeTerm(word);

    if (!term) {
      setError('Please enter an English word.');
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
        e?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  function handleTryFirstWord() {
    const section = document.getElementById('analyze-word-section');
    if (!section) return;

    section.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    window.setTimeout(() => {
      const input = section.querySelector('input') as HTMLInputElement | null;
      if (input) {
        input.focus();
      }
    }, 500);
  }

  return (
    <div className="app-shell min-h-screen flex flex-col w-full overflow-x-hidden">
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

      <div className="app-content relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="page flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Hero bo'limi: telefonda 1 ta ustun, desktopda 2 ta ustun */}
          <section className="hero grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center mb-8 sm:mb-12">
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="eyebrow inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-3">
                ✦ AI vocabulary lab
              </div>

              <button
                type="button"
                className="try-first-word group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 transition-all duration-200 mb-4"
                onClick={handleTryFirstWord}
              >
                <span className="try-first-word-icon text-purple-400">✦</span>
                <span>Try your first word</span>
                <span className="try-first-arrow group-hover:translate-x-0.5 transition-transform">→</span>
              </button>

              <h1 className="w-full">
                <WarpText
                  text={'Turn one word into\nreal knowledge.'}
                  color="#f8f5ff"
                  warpStrength={0.08}
                  warpScale={1.7}
                  speed={0.55}
                  pointerInfluence={0.42}
                  pointerStrength={0.38}
                  refraction={0.018}
                  ripple
                  fontSize="clamp(2.1rem, 7.5vw, 5.2rem)"
                  fontWeight={800}
                  style={{ minHeight: '140px', height: 'auto', width: '100%' }}
                />
              </h1>

              {/* Jonli Cyber Matrix bloki */}
              <CyberMatrixOrb />
            </div>

            {/* O'ng panel: kichik ekranlarda to'liq kenglik, chiroyli kiber-panellar */}
            <div className="hero-panel lg:col-span-5 w-full rounded-3xl bg-slate-950/70 backdrop-blur-xl border border-white/10 p-5 sm:p-6 shadow-2xl">
              <div className="hero-panel-title text-xs font-mono font-bold uppercase tracking-wider text-purple-300 mb-4 pb-2 border-b border-white/5 flex items-center justify-between">
                <span>Everything in one analysis</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>

              <div className="feature-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                <div className="feature p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition">
                  <strong className="block text-xs font-mono text-white mb-0.5">✦ CEFR + grammar</strong>
                  <span className="text-xs text-slate-400 leading-snug">Know the level and word type.</span>
                </div>

                <div className="feature p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition">
                  <strong className="block text-xs font-mono text-white mb-0.5">✦ Natural context</strong>
                  <span className="text-xs text-slate-400 leading-snug">Learn how people actually use it.</span>
                </div>

                <div className="feature p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition">
                  <strong className="block text-xs font-mono text-white mb-0.5">✦ Translation</strong>
                  <span className="text-xs text-slate-400 leading-snug">Choose the language you need.</span>
                </div>

                <div className="feature p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition">
                  <strong className="block text-xs font-mono text-white mb-0.5">✦ Mini quiz</strong>
                  <span className="text-xs text-slate-400 leading-snug">Test memory immediately.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Asosiy ishchi maydon */}
          <div className="flex flex-col gap-6 w-full">
            <div id="analyze-word-section" className="w-full">
              <Card
                title="Analyze a word"
                subtitle="Enter a word or short phrase and let AI build your study card"
                className="form-card"
              >
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

                <div className="entered-line mt-3 text-xs font-mono text-slate-400">
                  You entered:{' '}
                  <strong className="text-purple-300">
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
              <div className="fade-in w-full">
                <AiLoader word={normalized || word} />
              </div>
            ) : null}

            {!loading && !data ? (
              <Card
                title="Your study workflow"
                subtitle="A simple loop that keeps you learning"
              >
                <div className="quick-start grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="quick-item p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                    <div className="quick-icon text-xs font-mono font-bold text-purple-400">01</div>
                    <strong className="text-xs text-white">Enter</strong>
                    <span className="text-[11px] text-slate-400">Type one word or phrase.</span>
                  </div>

                  <div className="quick-item p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                    <div className="quick-icon text-xs font-mono font-bold text-purple-400">02</div>
                    <strong className="text-xs text-white">Understand</strong>
                    <span className="text-[11px] text-slate-400">Read meaning and translation.</span>
                  </div>

                  <div className="quick-item p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                    <div className="quick-icon text-xs font-mono font-bold text-purple-400">03</div>
                    <strong className="text-xs text-white">See it</strong>
                    <span className="text-[11px] text-slate-400">Use examples and collocations.</span>
                  </div>

                  <div className="quick-item p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                    <div className="quick-icon text-xs font-mono font-bold text-purple-400">04</div>
                    <strong className="text-xs text-white">Recall</strong>
                    <span className="text-[11px] text-slate-400">Finish the mini quiz.</span>
                  </div>
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
    </div>
  );
}