// src/components/LandingPage.tsx
import React, { useState, useRef } from 'react';
import { useMotionEntrance, useScrollReveal } from '../utils/motion';
import { useTheme } from '../context/ThemeContext';
import {
  Zap,
  BookOpen,
  Brain,
  Volume2,
  ArrowRight,
  Flame,
  Globe,
  Layers,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
  isLoggedIn: boolean;
  waitingAuth?: boolean;
}

interface DemoWordData {
  word: string;
  pos: string;
  level: string;
  ipa: string;
  uz: string;
  ru: string;
  en: string;
  collocations: string[];
  mistake: string;
  ieltsTip: string;
  interval: string;
}

const DEMO_WORDS: Record<string, DemoWordData> = {
  pragmatic: {
    word: 'pragmatic',
    pos: 'adjective',
    level: 'C1',
    ipa: '/præɡˈmæt.ɪk/',
    uz: 'amaliy, hayotiy, ishbilarmon',
    ru: 'прагматичный, практичный',
    en: 'Dealing with matters sensibly and realistically based on practical conditions rather than theoretical or ideological considerations.',
    collocations: ['pragmatic approach', 'pragmatic solution', 'pragmatic compromise'],
    mistake: 'Avoid: "He is very pragmatic person to study..." -> Use: "He takes a pragmatic approach to his research."',
    ieltsTip: 'High-value descriptor for IELTS Writing Task 2 when assessing government policy, resource allocation, and practical trade-offs.',
    interval: 'Next test: in 3 days (SM-2 Interval 2)'
  },
  resilience: {
    word: 'resilience',
    pos: 'noun',
    level: 'B2',
    ipa: '/rɪˈzɪl.jəns/',
    uz: 'chidamlilik, bardoshlilik',
    ru: 'устойчивость, жизнестойкость',
    en: 'The capacity to withstand or recover quickly from difficulties; toughness and elasticity under adverse stress.',
    collocations: ['demonstrate resilience', 'economic resilience', 'psychological resilience'],
    mistake: 'Avoid: "She had strong resilient." -> Use: "She displayed remarkable resilience in the face of setbacks."',
    ieltsTip: 'Crucial for IELTS Speaking Part 3 and Writing Task 2 topics involving mental health, climate change adaptation, and economic shocks.',
    interval: 'Next test: in 7 days (SM-2 Interval 3)'
  },
  ephemeral: {
    word: 'ephemeral',
    pos: 'adjective',
    level: 'C2',
    ipa: '/ɪˈfem.ər.əl/',
    uz: 'o‘tkinchi, qisqa muddatli',
    ru: 'эфемерный, недолговечный',
    en: 'Lasting for a very short time; fleeting and transient in nature.',
    collocations: ['ephemeral nature', 'ephemeral pleasure', 'ephemeral trend'],
    mistake: 'Avoid: "The ephemeral was fast." -> Use: "Social media fame is often ephemeral and fades rapidly."',
    ieltsTip: 'Distinguished lexical resource for IELTS Band 8.5+ essays discussing digital culture, environmental phenomena, or artistic trends.',
    interval: 'Next test: in 14 days (SM-2 Interval 4)'
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onLogin,
  isLoggedIn,
  waitingAuth = false
}) => {
  const landingRef = useRef<HTMLDivElement>(null);
  useMotionEntrance(landingRef, true, '[data-motion-enter]');
  useScrollReveal(landingRef, '[data-motion-reveal]');

  const { theme } = useTheme();
  const isEditorial = theme === 'editorial-milk';

  // Interactive Live Demo Word State
  const [activeWordKey, setActiveWordKey] = useState<string>('pragmatic');
  const activeWord = DEMO_WORDS[activeWordKey];

  // Interactive Mini-Quiz State
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);

  // Audio Pronunciation Helper
  const playPronunciation = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      ref={landingRef}
      className={`relative w-full flex flex-col items-center overflow-hidden font-mono select-none transition-colors duration-200 ${
        isEditorial ? 'text-[#1E2433]' : 'text-slate-200'
      }`}
    >
      {/* BACKGROUND AURA */}
      <div
        className={`absolute top-12 left-1/2 -translate-x-1/2 w-[650px] h-[350px] blur-[120px] pointer-events-none rounded-full ${
          isEditorial
            ? 'bg-gradient-to-tr from-purple-200/50 via-pink-100/40 to-blue-100/30'
            : 'bg-gradient-to-tr from-lime-500/25 via-emerald-500/15 to-cyan-500/10'
        }`}
      />

      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center px-4 pt-10 pb-12 text-center">
        {/* Live System Badge */}
        <div
          data-motion-enter
          className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-7 ${
            isEditorial
              ? 'border-2 border-[#1E2433] bg-white text-[#1E2433] shadow-[3px_3px_0px_#1E2433]'
              : 'border border-lime-400/30 bg-slate-950/70 text-lime-300 backdrop-blur-xl shadow-[0_0_20px_rgba(132,204,22,0.12)]'
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isEditorial ? 'bg-[#6D28D9] animate-pulse' : 'bg-lime-400 animate-pulse'
            }`}
          />
          <span className="text-xs font-mono font-bold tracking-wide">
            Engineered for IELTS Academic & CEFR Mastery (A1 to C2)
          </span>
        </div>

        {/* Main Heading — EXACT PRESERVED REQUIREMENT */}
        <h1
          data-motion-enter
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] max-w-4xl mx-auto mb-6"
        >
          <span className={isEditorial ? 'text-[#1E2433] font-serif font-black' : 'text-slate-100'}>
            AI-Powered English.
          </span>
          <br />
          <span
            className={
              isEditorial
                ? 'bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#DB2777] bg-clip-text text-transparent font-serif font-black'
                : 'bg-gradient-to-b from-lime-300 via-lime-400 to-cyan-400 bg-clip-text text-transparent'
            }
          >
            All-in-One Trainer.
          </span>
        </h1>

        {/* Precise, Unslopped Subtitle */}
        <p
          data-motion-enter
          className={`text-xs sm:text-sm max-w-2xl mx-auto mb-8 leading-relaxed font-sans font-medium ${
            isEditorial ? 'text-[#334155]' : 'text-slate-300'
          }`}
        >
          Look up any word with zero delay. Get IPA phonetics, CEFR banding, Uzbek & Russian translations, academic collocations, and common pitfalls — locked into permanent memory with automated spaced repetition.
        </p>

        {/* Hero CTAs */}
        <div data-motion-enter className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md mb-12">
          <button
            type="button"
            onClick={onStart}
            style={isEditorial ? { backgroundColor: '#6D28D9', color: '#FFFFFF' } : undefined}
            className={`btn-dark w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer group ${
              isEditorial
                ? 'bg-[#6D28D9] text-white border-2 border-[#1E2433] shadow-[4px_4px_0px_#1E2433] hover:bg-[#5B21B6] active:translate-x-0.5 active:translate-y-0.5'
                : 'bg-gradient-to-r from-lime-400 via-lime-300 to-cyan-400 text-slate-950 hover:shadow-[0_0_35px_rgba(132,204,22,0.5)] active:scale-[0.98]'
            }`}
          >
            <span className="font-extrabold text-white" style={{ color: '#FFFFFF' }}>
              Open Vocabulary Trainer
            </span>
            <ArrowRight
              className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0 text-white"
              style={{ color: '#FFFFFF' }}
            />
          </button>

          {!isLoggedIn && (
            <button
              type="button"
              onClick={onLogin}
              disabled={waitingAuth}
              style={isEditorial ? { backgroundColor: '#FFFFFF', color: '#1E2433' } : undefined}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] cursor-pointer ${
                isEditorial
                  ? 'border-2 border-[#1E2433] shadow-[3px_3px_0px_#1E2433] hover:bg-slate-50 text-[#1E2433]'
                  : 'bg-slate-900/80 backdrop-blur-md border border-lime-400/40 text-lime-300 hover:bg-slate-800/80'
              }`}
            >
              <svg className="w-4 h-4 fill-[#229ED9] shrink-0" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.92 9.06c-.14.65-.53.81-1.07.5l-2.97-2.19-1.43 1.38c-.16.16-.29.29-.6.29l.21-3.03 5.52-4.99c.24-.21-.05-.33-.37-.12l-6.82 4.3-2.94-.92c-.64-.2-.65-.64.13-.95l11.5-4.43c.53-.2 1 .12.89.98z" />
              </svg>
              <span>{waitingAuth ? 'Connecting...' : 'Sync via Telegram'}</span>
            </button>
          )}
        </div>

        {/* Architecture Proof Metrics */}
        <div data-motion-enter className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-3xl w-full mx-auto">
          {[
            { label: 'Reading Passages', val: '180 articles', sub: 'CEFR A2 through C2' },
            { label: 'Lookup Latency', val: '< 180 ms', sub: 'Local SQLite cache' },
            { label: 'Memory Protocol', val: 'SuperMemo SM-2', sub: 'Dynamic intervals' },
            { label: 'Access Model', val: '100% Free', sub: 'Zero credit card required' }
          ].map((m, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-2xl text-left flex flex-col justify-between transition-all ${
                isEditorial
                  ? 'bg-white border-2 border-[#1E2433] shadow-[4px_4px_0px_#1E2433]'
                  : 'bg-slate-900/80 border border-slate-800 backdrop-blur-md'
              }`}
            >
              <span className={`text-[10px] uppercase tracking-wider font-extrabold ${isEditorial ? 'text-[#1E2433]' : 'text-slate-400'}`}>
                {m.label}
              </span>
              <span className={`text-lg font-black font-mono mt-1 ${isEditorial ? 'text-[#6D28D9]' : 'text-lime-400'}`}>
                {m.val}
              </span>
              <span className={`text-[11px] font-medium mt-0.5 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
                {m.sub}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. LIVE INTERACTIVE DEMO */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-8">
          <span
            className={`text-xs font-mono font-bold tracking-wider uppercase ${
              isEditorial ? 'text-[#6D28D9]' : 'text-lime-400'
            }`}
          >
            Live Interactive Preview
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
            See the linguistic breakdown in real-time.
          </h2>
          <p className={`text-xs mt-2 max-w-lg mx-auto font-sans font-medium ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
            Click any sample word below to inspect how UniveBooster structures grammatical, phonetic, and contextual knowledge.
          </p>
        </div>

        {/* Word Switcher Tabs */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          {Object.keys(DEMO_WORDS).map((key) => {
            const item = DEMO_WORDS[key];
            const isActive = activeWordKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveWordKey(key)}
                style={isActive && isEditorial ? { backgroundColor: '#1E2433', color: '#FFFFFF' } : undefined}
                className={`btn-dark px-4 py-2 rounded-xl text-xs font-mono transition-all border-2 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? isEditorial
                      ? 'border-[#1E2433] text-white shadow-[4px_4px_0px_#6D28D9] font-bold'
                      : 'bg-lime-400/20 border-lime-400 text-lime-300 shadow-[0_0_20px_rgba(132,204,22,0.3)] font-bold'
                    : isEditorial
                    ? 'bg-white border-[#1E2433] text-[#1E2433] shadow-[2px_2px_0px_#1E2433] hover:bg-slate-50'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span style={isActive && isEditorial ? { color: '#FFFFFF' } : undefined} className="font-bold">{item.word}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    item.level === 'C2'
                      ? 'bg-purple-500/20 text-purple-700 border border-purple-400'
                      : item.level === 'C1'
                      ? 'bg-blue-500/20 text-blue-700 border border-blue-400'
                      : 'bg-emerald-500/20 text-emerald-700 border border-emerald-400'
                  }`}
                >
                  {item.level}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Analyzer Card */}
        <div
          data-motion-reveal
          className={`relative rounded-3xl p-6 sm:p-8 transition-all ${
            isEditorial
              ? 'bg-white border-2 border-[#1E2433] shadow-[8px_8px_0px_#1E2433] text-[#1E2433]'
              : 'bg-slate-900/90 border border-lime-400/30 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]'
          }`}
        >
          {/* Card Header */}
          <div className={`flex flex-wrap items-center justify-between gap-4 pb-6 border-b ${isEditorial ? 'border-[#E2E8F0]' : 'border-slate-800'}`}>
            <div className="flex items-center gap-3">
              <h3 className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${isEditorial ? 'text-[#1E2433]' : 'text-slate-100'}`}>
                {activeWord.word}
              </h3>
              <button
                type="button"
                onClick={() => playPronunciation(activeWord.word)}
                title="Listen to native pronunciation"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                  isEditorial
                    ? 'bg-purple-100 border-2 border-[#1E2433] text-[#6D28D9] hover:bg-purple-200'
                    : 'bg-slate-800 border border-slate-700 text-lime-400 hover:bg-slate-700'
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <span className={`text-xs font-mono font-bold ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
                {activeWord.ipa}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase ${
                isEditorial ? 'bg-slate-100 border border-[#1E2433] text-[#1E2433]' : 'bg-slate-800 border border-slate-700 text-slate-300'
              }`}>
                {activeWord.pos}
              </span>
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase border ${
                activeWord.level === 'C2'
                  ? 'bg-purple-100 border-purple-500 text-purple-900'
                  : activeWord.level === 'C1'
                  ? 'bg-blue-100 border-blue-500 text-blue-900'
                  : 'bg-emerald-100 border-emerald-500 text-emerald-900'
              }`}>
                CEFR {activeWord.level}
              </span>
              <span className={`hidden sm:inline-block px-2.5 py-1 rounded-md text-[11px] font-mono font-medium ${
                isEditorial ? 'bg-slate-100 border border-slate-300 text-[#475569]' : 'bg-slate-800 border border-slate-700 text-slate-400'
              }`}>
                {activeWord.interval}
              </span>
            </div>
          </div>

          {/* Meaning & Translations */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 pb-6 border-b ${isEditorial ? 'border-[#E2E8F0]' : 'border-slate-800'}`}>
            <div className="md:col-span-2">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isEditorial ? 'text-[#1E2433]' : 'text-slate-400'}`}>
                English Definition
              </span>
              <p className={`text-sm mt-1.5 leading-relaxed font-sans font-medium ${isEditorial ? 'text-[#1E2433]' : 'text-slate-200'}`}>
                {activeWord.en}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <span className={`text-[10px] uppercase font-bold tracking-wider ${isEditorial ? 'text-[#1E2433]' : 'text-slate-400'}`}>
                  O‘zbekcha tarjima
                </span>
                <p className={`text-xs font-bold mt-1 ${isEditorial ? 'text-[#6D28D9]' : 'text-lime-300'}`}>
                  {activeWord.uz}
                </p>
              </div>
              <div>
                <span className={`text-[10px] uppercase font-bold tracking-wider ${isEditorial ? 'text-[#1E2433]' : 'text-slate-400'}`}>
                  Русский перевод
                </span>
                <p className={`text-xs font-bold mt-1 ${isEditorial ? 'text-[#0284C7]' : 'text-cyan-300'}`}>
                  {activeWord.ru}
                </p>
              </div>
            </div>
          </div>

          {/* Collocations & Common Pitfalls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div>
              <span className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 ${isEditorial ? 'text-[#1E2433]' : 'text-slate-400'}`}>
                <Layers className={`w-3.5 h-3.5 ${isEditorial ? 'text-[#6D28D9]' : 'text-lime-400'}`} />
                Academic Collocations
              </span>
              <div className="flex flex-wrap gap-2 mt-2.5">
                {activeWord.collocations.map((c, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${
                      isEditorial ? 'bg-slate-100 border-[#1E2433] text-[#1E2433]' : 'bg-slate-800 border-slate-700 text-slate-200'
                    }`}
                  >
                    {c}
                  </span>
                ))}
              </div>
              <p className={`text-[11px] mt-3 leading-relaxed font-sans ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
                💡 <span className={`font-bold ${isEditorial ? 'text-[#1E2433]' : 'text-slate-200'}`}>IELTS Strategy:</span> {activeWord.ieltsTip}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border-2 ${
              isEditorial ? 'bg-amber-50 border-amber-500/60 text-amber-950' : 'bg-amber-500/10 border-amber-500/25 text-amber-200'
            }`}>
              <span className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                Common Candidate Pitfall
              </span>
              <p className="text-xs mt-2 leading-relaxed font-medium">
                {activeWord.mistake}
              </p>
            </div>
          </div>

          {/* Action Trigger */}
          <div className={`mt-8 pt-5 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isEditorial ? 'border-[#E2E8F0]' : 'border-slate-800'}`}>
            <span className={`text-xs font-mono font-medium ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
              ⚡ Analyzed in 84ms via local lexicon + context verification
            </span>
            <button
              type="button"
              onClick={onStart}
              className={`inline-flex items-center gap-2 text-xs font-bold transition cursor-pointer ${
                isEditorial ? 'text-[#6D28D9] hover:underline' : 'text-lime-300 hover:text-lime-200'
              }`}
            >
              <span>Test with your own word</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE PILLARS */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <span className={`text-xs font-mono font-bold tracking-wider uppercase ${isEditorial ? 'text-[#6D28D9]' : 'text-lime-400'}`}>
            The Learning Pipeline
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Engineered around how human memory retains syntax.
          </h2>
          <p className={`text-xs mt-2 max-w-lg mx-auto font-sans font-medium ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
            Traditional rote-memorization fails because words are detached from context. UniveBooster closes the retention loop in four steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              step: '01',
              tag: 'Sub-Second Parsing',
              title: 'Instant Linguistic Dissection',
              desc: 'Paste any single word or full sentence. Receive immediate CEFR grading, grammatical role, phonetic transcription, and common false friends.',
              meta: 'Output: IPA • CEFR Level • Uzbek/Russian • Collocations'
            },
            {
              step: '02',
              tag: 'Context Immersion',
              title: '180 Graded Retention Articles',
              desc: 'Read authentic passages written across IELTS domains: astrophysics, behavioural economics, environmental law, and history. Tap any unfamiliar term mid-sentence.',
              meta: 'A2 to C2 Library • Zero dictionary app switching'
            },
            {
              step: '03',
              tag: 'Spaced Intervals',
              title: 'SuperMemo SM-2 Active Recall',
              desc: 'Quizzes trigger exactly when synaptic retrieval strength begins to dip (1, 3, 7, and 21 days), strengthening neural pathways with up to 4x less study time.',
              meta: 'Active Recall • Forgetting Curve Interception'
            },
            {
              step: '04',
              tag: 'Timed Stress Test',
              title: 'Word Blitz 60-Second Sprint',
              desc: 'Simulate real exam pressure. Test rapid-fire recognition of high-frequency academic vocabulary in 60-second timed sprints so you never hesitate during IELTS Speaking or Writing.',
              meta: 'Streak Multipliers • Exam Condition Speed Drill'
            }
          ].map((pillar, i) => (
            <div
              key={i}
              data-motion-reveal
              className={`p-7 rounded-3xl transition-all flex flex-col justify-between ${
                isEditorial
                  ? 'bg-white border-2 border-[#1E2433] shadow-[5px_5px_0px_#1E2433]'
                  : 'bg-slate-900/80 border border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isEditorial
                        ? 'bg-purple-100 border-2 border-[#1E2433] text-[#1E2433]'
                        : 'bg-lime-400/10 border border-lime-400/25 text-lime-400'
                    }`}
                  >
                    {pillar.step}
                  </div>
                  <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                    isEditorial ? 'bg-slate-100 text-[#1E2433] border border-slate-300 font-bold' : 'border border-slate-800 text-slate-400'
                  }`}>
                    {pillar.tag}
                  </span>
                </div>
                <h3 className={`text-base font-bold mb-2 ${isEditorial ? 'text-[#1E2433]' : 'text-slate-100'}`}>
                  {pillar.title}
                </h3>
                <p className={`text-xs leading-relaxed font-sans font-medium ${isEditorial ? 'text-[#334155]' : 'text-slate-300'}`}>
                  {pillar.desc}
                </p>
              </div>
              <div className={`mt-5 pt-4 border-t text-[11px] font-mono font-bold ${
                isEditorial ? 'border-[#E2E8F0] text-[#6D28D9]' : 'border-slate-800 text-lime-400'
              }`}>
                {pillar.meta}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE MINI QUIZ WIDGET */}
      <section className="w-full max-w-4xl mx-auto px-4 pb-20">
        <div
          className={`p-7 sm:p-9 rounded-3xl relative overflow-hidden transition-all ${
            isEditorial
              ? 'bg-white border-2 border-[#1E2433] shadow-[8px_8px_0px_#1E2433] text-[#1E2433]'
              : 'bg-slate-900/90 border border-lime-400/30 backdrop-blur-xl'
          }`}
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className={`text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 ${
              isEditorial ? 'text-[#6D28D9]' : 'text-lime-400'
            }`}>
              <Brain className="w-4 h-4" />
              Interactive Active Recall Test
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              isEditorial ? 'bg-purple-100 border border-purple-300 text-purple-900' : 'bg-slate-800 border border-slate-700 text-slate-300'
            }`}>
              C1 Academic Test
            </span>
          </div>

          <h3 className={`text-base sm:text-lg font-bold mb-2 ${isEditorial ? 'text-[#1E2433]' : 'text-slate-100'}`}>
            Select the word that accurately completes the IELTS Task 2 sentence:
          </h3>
          <p className={`text-xs sm:text-sm italic mb-6 p-4 rounded-xl border leading-relaxed ${
            isEditorial ? 'bg-[#F8FAFC] border-[#CBD5E1] text-[#1E2433]' : 'bg-slate-950/60 border-slate-800 text-slate-300'
          }`}>
            &ldquo;Rather than pursuing ideological dogmas, municipal councils must adopt a <span className={`font-bold underline underline-offset-4 ${isEditorial ? 'text-[#6D28D9]' : 'text-lime-300'}`}>_______</span> strategy that allocates municipal funds directly to infrastructure maintenance.&rdquo;
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {[
              { id: 0, word: 'superficial', correct: false },
              { id: 1, word: 'pragmatic', correct: true },
              { id: 2, word: 'redundant', correct: false },
              { id: 3, word: 'ambiguous', correct: false }
            ].map((opt) => {
              const isSelected = selectedQuiz === opt.id;
              let btnClass = isEditorial
                ? 'bg-white border-2 border-[#1E2433] text-[#1E2433] shadow-[3px_3px_0px_#1E2433] hover:bg-slate-50'
                : 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700';

              if (isSelected) {
                btnClass = opt.correct
                  ? isEditorial
                    ? 'bg-emerald-100 border-2 border-emerald-700 text-emerald-950 font-bold shadow-[4px_4px_0px_#047857]'
                    : 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : isEditorial
                  ? 'bg-rose-100 border-2 border-rose-700 text-rose-950 font-bold shadow-[4px_4px_0px_#be123c]'
                  : 'bg-rose-500/20 border-rose-400 text-rose-300';
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedQuiz(opt.id)}
                  className={`p-3.5 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold border ${
                      isEditorial ? 'bg-slate-100 border-[#1E2433] text-[#1E2433]' : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + opt.id)}
                    </span>
                    <span className="font-semibold">{opt.word}</span>
                  </div>
                  {isSelected && (
                    <span>
                      {opt.correct ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selectedQuiz !== null && (
            <div className={`p-3.5 rounded-xl border text-xs font-medium animate-in fade-in duration-200 ${
              selectedQuiz === 1
                ? isEditorial ? 'bg-emerald-50 border-emerald-500 text-emerald-950' : 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                : isEditorial ? 'bg-rose-50 border-rose-500 text-rose-950' : 'bg-rose-950/60 border-rose-500 text-rose-300'
            }`}>
              {selectedQuiz === 1 ? (
                <span>
                  ✅ Spot on! &ldquo;Pragmatic&rdquo; fits academic and governance contexts where decisions are based on practical utility.
                </span>
              ) : (
                <span>
                  ❌ Incorrect choice. The sentence requires a word conveying practical feasibility under real-world constraints (&ldquo;pragmatic&rdquo;).
                </span>
              )}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between">
            <span className={`text-[11px] font-mono font-medium ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
              Spaced Repetition engine auto-schedules missed items for early review.
            </span>
            <button
              type="button"
              onClick={onStart}
              className={`text-xs font-bold inline-flex items-center gap-1 cursor-pointer ${
                isEditorial ? 'text-[#6D28D9] hover:underline' : 'text-lime-400 hover:text-lime-300'
              }`}
            >
              Start full quiz session →
            </button>
          </div>
        </div>
      </section>

      {/* 5. FEATURE BENTO GRID */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <span className={`text-xs font-mono font-bold tracking-wider uppercase ${isEditorial ? 'text-[#6D28D9]' : 'text-lime-400'}`}>
            Product Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Complete vocabulary toolkit. Zero bloat.
          </h2>
          <p className={`text-xs mt-2 max-w-lg mx-auto font-sans font-medium ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
            Every feature is purposefully built to replace fragmented tools, paper lists, and clunky dictionary lookups.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: <Zap className="w-5 h-5" />,
              title: 'Sub-Second Local Lexicon',
              desc: 'Backed by local SQLite and Turso Cloud. High-frequency queries resolve in under 180ms with offline fallback.',
              meta: 'Response time: ~84ms avg'
            },
            {
              icon: <BookOpen className="w-5 h-5" />,
              title: '180 CEFR Reading Library',
              desc: 'Curated articles across science, climate, psychology, and arts. Tap any word to view definitions and save to your review bank.',
              meta: 'Levels: A2, B1, B2, C1, C2'
            },
            {
              icon: <Brain className="w-5 h-5" />,
              title: 'Spaced Repetition (SRS)',
              desc: 'Interval calculation based on difficulty score. Easy terms advance to 7+ days; struggling terms recycle within 24 hours.',
              meta: 'Ebbinghaus curve calibrated'
            },
            {
              icon: <Flame className="w-5 h-5" />,
              title: 'Word Blitz Sprint Mode',
              desc: 'Rapid 60-second sessions designed to test lexical retrieval under timed exam stress. Tracks streaks and accuracy.',
              meta: '60s countdown • Combo multipliers'
            },
            {
              icon: <Globe className="w-5 h-5" />,
              title: 'Dual-Language Localization',
              desc: 'Every entry includes tailored Uzbek and Russian academic translations so bilingual learners never miss regional nuances.',
              meta: 'English • O‘zbek • Русский'
            },
            {
              icon: <ShieldCheck className="w-5 h-5" />,
              title: 'Telegram One-Tap Auth',
              desc: 'Sign in with zero passwords or email forms. Your saved words and quiz statistics synchronize instantly across phone and browser.',
              meta: 'No password • Instant session sync'
            }
          ].map((f, i) => (
            <div
              key={i}
              data-motion-reveal
              className={`p-6 rounded-3xl transition-all flex flex-col justify-between ${
                isEditorial
                  ? 'bg-white border-2 border-[#1E2433] shadow-[5px_5px_0px_#1E2433]'
                  : 'bg-slate-900/80 border border-slate-800 hover:border-lime-400/30'
              }`}
            >
              <div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                    isEditorial
                      ? 'bg-purple-100 border-2 border-[#1E2433] text-[#6D28D9]'
                      : 'bg-lime-400/10 border border-lime-400/20 text-lime-400'
                  }`}
                >
                  {f.icon}
                </div>
                <h3 className={`text-sm font-bold mb-2 ${isEditorial ? 'text-[#1E2433]' : 'text-slate-100'}`}>
                  {f.title}
                </h3>
                <p className={`text-xs leading-relaxed font-sans font-medium ${isEditorial ? 'text-[#334155]' : 'text-slate-400'}`}>
                  {f.desc}
                </p>
              </div>
              <div className={`mt-4 pt-3 border-t text-[10px] font-mono font-bold ${
                isEditorial ? 'border-[#E2E8F0] text-[#6D28D9]' : 'border-slate-800 text-slate-400'
              }`}>
                {f.meta}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. COMPARISON MATRIX */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-10">
          <span className={`text-xs font-mono font-bold tracking-wider uppercase ${isEditorial ? 'text-[#6D28D9]' : 'text-lime-400'}`}>
            Head-to-Head Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Why conventional vocabulary tools fall short.
          </h2>
          <p className={`text-xs mt-2 max-w-lg mx-auto font-sans font-medium ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
            Comparing UniveBooster against traditional flashcard decks, gamified consumer apps, and static paper dictionaries.
          </p>
        </div>

        <div className={`overflow-x-auto rounded-2xl border-2 transition-all ${
          isEditorial ? 'border-[#1E2433] bg-white shadow-[6px_6px_0px_#1E2433]' : 'border-slate-800 bg-slate-900/60'
        }`}>
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className={`border-b-2 ${
                isEditorial ? 'border-[#1E2433] bg-[#F8FAFC] text-[#1E2433]' : 'border-slate-800 bg-slate-950 text-slate-400'
              }`}>
                <th className="p-4 font-bold">Capabilities</th>
                <th className={`p-4 font-extrabold ${
                  isEditorial ? 'bg-purple-100 text-[#6D28D9] border-x-2 border-[#1E2433]' : 'bg-lime-400/10 text-lime-400 border-x border-lime-400/20'
                }`}>
                  UniveBooster
                </th>
                <th className="p-4 font-bold">Generic Flashcards (Anki/Quizlet)</th>
                <th className="p-4 font-bold">Gamified Apps (Duolingo)</th>
                <th className="p-4 font-bold">Standard Online Lexicon</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isEditorial ? 'divide-[#E2E8F0] text-[#1E2433]' : 'divide-slate-800 text-slate-300'}`}>
              <tr>
                <td className="p-4 font-bold">Sub-second CEFR level & IPA parsing</td>
                <td className={`p-4 font-bold ${isEditorial ? 'bg-purple-50 text-[#6D28D9] border-x-2 border-[#1E2433]' : 'bg-lime-400/5 text-lime-400 border-x border-lime-400/20'}`}>
                  Instant (&lt; 180ms)
                </td>
                <td className={`p-4 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>Manual entry required</td>
                <td className={`p-4 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>Fixed basic decks</td>
                <td className={`p-4 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>Static, slow lookup</td>
              </tr>
              <tr>
                <td className="p-4 font-bold">180 Graded articles with in-text inspection</td>
                <td className={`p-4 font-bold ${isEditorial ? 'bg-purple-50 text-[#6D28D9] border-x-2 border-[#1E2433]' : 'bg-lime-400/5 text-lime-400 border-x border-lime-400/20'}`}>
                  Integrated
                </td>
                <td className={`p-4 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>No reading mode</td>
                <td className={`p-4 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>Childlike stories</td>
                <td className={`p-4 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>No curated passages</td>
              </tr>
              <tr>
                <td className="p-4 font-bold">Academic collocations & mistake alerts</td>
                <td className={`p-4 font-bold ${isEditorial ? 'bg-purple-50 text-[#6D28D9] border-x-2 border-[#1E2433]' : 'bg-lime-400/5 text-lime-400 border-x border-lime-400/20'}`}>
                  Automatic for every term
                </td>
                <td className={`p-4 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>User must author</td>
                <td className={`p-4 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>Unavailable</td>
                <td className={`p-4 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>Buried in text walls</td>
              </tr>
              <tr>
                <td className="p-4 font-bold">Spaced Repetition scheduling</td>
                <td className={`p-4 font-bold ${isEditorial ? 'bg-purple-50 text-[#6D28D9] border-x-2 border-[#1E2433]' : 'bg-lime-400/5 text-lime-400 border-x border-lime-400/20'}`}>
                  SM-2 Automated
                </td>
                <td className={`p-4 ${isEditorial ? 'text-[#1E2433]' : 'text-slate-300'}`}>Manual algorithm setup</td>
                <td className={`p-4 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>Arbitrary streak pressure</td>
                <td className={`p-4 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>None</td>
              </tr>
              <tr>
                <td className="p-4 font-bold">Bilingual Uzbek & Russian definitions</td>
                <td className={`p-4 font-bold ${isEditorial ? 'bg-purple-50 text-[#6D28D9] border-x-2 border-[#1E2433]' : 'bg-lime-400/5 text-lime-400 border-x border-lime-400/20'}`}>
                  Native context included
                </td>
                <td className={`p-4 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>Manual typing</td>
                <td className={`p-4 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>Restricted / poor Uz</td>
                <td className={`p-4 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>Single language only</td>
              </tr>
              <tr>
                <td className="p-4 font-bold">Paywalls & Credit Card barriers</td>
                <td className={`p-4 font-bold ${isEditorial ? 'bg-purple-50 text-[#6D28D9] border-x-2 border-[#1E2433]' : 'bg-lime-400/5 text-lime-400 border-x border-lime-400/20'}`}>
                  Zero paywall
                </td>
                <td className={`p-4 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>Subscriptions / Pro locks</td>
                <td className={`p-4 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>Aggressive ads & hearts</td>
                <td className={`p-4 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>Banner ads & popups</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. CEFR & IELTS PROFICIENCY TIERS */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-10">
          <span className={`text-xs font-mono font-bold tracking-wider uppercase ${isEditorial ? 'text-[#6D28D9]' : 'text-lime-400'}`}>
            Curriculum Alignment
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Calibrated for CEFR standards & IELTS target bands.
          </h2>
          <p className={`text-xs mt-2 max-w-lg mx-auto font-sans font-medium ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
            Whether preparing for foundation coursework or scoring Band 8.0+ for top universities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              tier: 'A2 - B1',
              ielts: 'IELTS Band 4.5 - 5.5',
              focus: 'Core Working Vocabulary',
              desc: 'High-frequency daily verbs, essential phrasal verbs, and structural connective words required for conversational fluency.'
            },
            {
              tier: 'B2',
              ielts: 'IELTS Band 6.0 - 6.5',
              focus: 'Independent & Academic Core',
              desc: 'Abstract concepts, analytical discourse markers, and topic-specific vocabulary across technology, health, and society.'
            },
            {
              tier: 'C1',
              ielts: 'IELTS Band 7.0 - 8.0',
              focus: 'Advanced Academic Writing',
              desc: 'Sophisticated collocations, nuanced evaluative adjectives, and formal syntax suitable for peer-reviewed arguments and Task 2.'
            },
            {
              tier: 'C2',
              ielts: 'IELTS Band 8.5 - 9.0',
              focus: 'Near-Native Precision',
              desc: 'Subtle idiomatic precision, literary register, historical etymologies, and mastery over rare rhetoric.'
            }
          ].map((t, i) => (
            <div
              key={i}
              data-motion-reveal
              className={`p-5 rounded-2xl flex flex-col justify-between transition-all ${
                isEditorial
                  ? 'bg-white border-2 border-[#1E2433] shadow-[4px_4px_0px_#1E2433]'
                  : 'bg-slate-900/80 border border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-extrabold font-mono ${isEditorial ? 'text-[#6D28D9]' : 'text-lime-400'}`}>
                    {t.tier}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isEditorial ? 'bg-slate-100 border-[#1E2433] text-[#1E2433] font-bold' : 'border-slate-800 text-slate-400'
                  }`}>
                    {t.ielts}
                  </span>
                </div>
                <h4 className={`text-xs font-bold mb-2 ${isEditorial ? 'text-[#1E2433]' : 'text-slate-100'}`}>
                  {t.focus}
                </h4>
                <p className={`text-xs leading-relaxed font-sans font-medium ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
                  {t.desc}
                </p>
              </div>
              <div className={`mt-4 pt-3 border-t text-[10px] font-mono font-bold ${
                isEditorial ? 'border-[#E2E8F0] text-[#6D28D9]' : 'border-slate-800 text-lime-400/80'
              }`}>
                Full article & quiz support
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. NO-FLUFF FAQ */}
      <section className="w-full max-w-4xl mx-auto px-4 pb-20">
        <div className="text-center mb-10">
          <span className={`text-xs font-mono font-bold tracking-wider uppercase ${isEditorial ? 'text-[#6D28D9]' : 'text-lime-400'}`}>
            Questions & Clarity
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Common questions. Straight answers.
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'Do I need to sign up to test words or practice reading?',
              a: 'No. You can look up words, read passages, and run quizzes immediately without creating an account. Sign-in via Telegram is only needed when you want your personal saved word list and test scores saved across sessions.'
            },
            {
              q: 'How does the Spaced Repetition (SRS) interval work?',
              a: 'We use the SuperMemo SM-2 algorithm. When you recall a word correctly on a quiz, its review interval expands (e.g. 1 day -> 3 days -> 7 days -> 21 days). If you answer incorrectly, the interval drops back to Day 1 so you reinforce weak memory connections.'
            },
            {
              q: 'Are the 180 reading articles authentic or computer-generated slop?',
              a: 'All 180 articles are curated across academic CEFR bands (A2 through C2), structured with authentic IELTS reading topics such as climate policy, behavioral psychology, and economic history, enriched with in-text keyword metadata.'
            },
            {
              q: 'Why Telegram instead of standard email and password?',
              a: 'Passwords are friction. With Telegram bot authentication, there are no verification emails, forgotten passwords, or spam. You tap one link, and you are logged in on any browser in 2 seconds.'
            }
          ].map((faq, i) => (
            <div
              key={i}
              data-motion-reveal
              className={`p-5 rounded-2xl transition-all ${
                isEditorial
                  ? 'bg-white border-2 border-[#1E2433] shadow-[4px_4px_0px_#1E2433] text-[#1E2433]'
                  : 'bg-slate-900/80 border border-slate-800'
              }`}
            >
              <h4 className={`text-sm font-bold mb-2 flex items-start gap-2 ${isEditorial ? 'text-[#1E2433]' : 'text-slate-100'}`}>
                <span className={`font-mono font-black ${isEditorial ? 'text-[#6D28D9]' : 'text-lime-400'}`}>Q:</span>
                <span>{faq.q}</span>
              </h4>
              <p className={`text-xs leading-relaxed font-sans font-medium pl-5 ${isEditorial ? 'text-[#334155]' : 'text-slate-300'}`}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. BOTTOM CONVERSION STRIP — EDITORIAL BRUTALIST */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-28">
        <div
          className={`relative rounded-3xl p-10 sm:p-14 text-center overflow-hidden transition-all ${
            isEditorial
              ? 'bg-white border-2 border-[#1E2433] shadow-[8px_8px_0px_#1E2433] text-[#1E2433]'
              : 'border-2 border-slate-800 bg-[#0f172a] text-white shadow-2xl'
          }`}
        >
          <span
            className={`text-xs font-mono font-black uppercase tracking-widest mb-3 inline-block px-3 py-1 rounded-full ${
              isEditorial
                ? 'bg-purple-100 text-[#6D28D9] border-2 border-[#1E2433]'
                : 'text-lime-400 bg-lime-400/10'
            }`}
          >
            Immediate Access
          </span>
          <h2
            className={`text-3xl sm:text-4xl font-black mb-4 tracking-tight font-serif ${
              isEditorial ? 'text-[#1E2433]' : 'text-white'
            }`}
          >
            Level up your academic English today.
          </h2>
          <p
            className={`text-xs sm:text-sm mb-8 max-w-lg mx-auto leading-relaxed font-sans font-medium ${
              isEditorial ? 'text-[#475569]' : 'text-slate-300'
            }`}
          >
            No subscription fees. No paywalls. Just a fast, scientifically grounded vocabulary engine built for serious learners.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onStart}
              style={isEditorial ? { backgroundColor: '#6D28D9', color: '#FFFFFF' } : undefined}
              className={`btn-dark inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-xl font-black text-sm transition-all cursor-pointer ${
                isEditorial
                  ? 'bg-[#6D28D9] text-white border-2 border-[#1E2433] shadow-[4px_4px_0px_#1E2433] hover:bg-[#5B21B6] active:translate-x-0.5 active:translate-y-0.5'
                  : 'bg-gradient-to-r from-lime-400 via-lime-300 to-cyan-400 text-slate-950 hover:shadow-[0_0_35px_rgba(132,204,22,0.4)] active:scale-[0.98]'
              }`}
            >
              <span
                style={isEditorial ? { color: '#FFFFFF' } : undefined}
                className={isEditorial ? 'text-white font-black' : 'text-slate-950 font-black'}
              >
                Launch UniveBooster
              </span>
              <ArrowRight
                className={`w-4 h-4 ${isEditorial ? 'text-white' : 'text-slate-950'}`}
                style={isEditorial ? { color: '#FFFFFF' } : undefined}
              />
            </button>
            {!isLoggedIn && (
              <button
                type="button"
                onClick={onLogin}
                disabled={waitingAuth}
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl transition text-sm font-bold cursor-pointer ${
                  isEditorial
                    ? 'bg-[#FAF7F2] text-[#1E2433] border-2 border-[#1E2433] shadow-[3px_3px_0px_#1E2433] hover:bg-[#F3EDE4]'
                    : 'bg-white/10 text-white border-2 border-white/40 hover:bg-white/20'
                }`}
              >
                <span className={isEditorial ? 'text-[#1E2433]' : 'text-white'}>Telegram Quick Sync</span>
              </button>
            )}
          </div>

          <div
            className={`mt-8 flex items-center justify-center gap-4 text-[11px] font-mono font-medium ${
              isEditorial ? 'text-[#64748B]' : 'text-slate-400'
            }`}
          >
            <span>⚡ Instant Launch</span>
            <span>•</span>
            <span>🔒 Zero Data Tracking</span>
            <span>•</span>
            <span>🌐 Multi-Device Sync</span>
          </div>
        </div>
      </section>
    </div>
  );
};
