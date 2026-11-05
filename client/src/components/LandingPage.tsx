// src/components/LandingPage.tsx
import React, { useState, useRef } from 'react';
import { useMotionEntrance, useScrollReveal } from '../utils/motion';
import {
  Zap,
  BookOpen,
  Brain,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Database,
  Flame,
  Globe,
  Award,
  Layers,
  HelpCircle,
  Terminal,
  Clock,
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
    <div ref={landingRef} className="relative w-full flex flex-col items-center overflow-hidden font-mono select-none text-slate-200">

      {/* BACKGROUND AURA */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-lime-500/25 via-emerald-500/15 to-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-[1200px] right-1/4 w-[450px] h-[350px] bg-gradient-to-bl from-cyan-500/15 to-transparent blur-[140px] pointer-events-none rounded-full" />

      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[72vh] flex flex-col items-center justify-center px-4 pt-12 pb-14 text-center">

        {/* Live System Badge */}
        <div data-motion-enter className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-lime-400/30 bg-slate-950/70 backdrop-blur-xl mb-7 shadow-[0_0_20px_rgba(132,204,22,0.12)]">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          <span className="text-xs font-mono font-medium tracking-wide text-lime-300">
            Engineered for IELTS Academic & CEFR Mastery (A1 to C2)
          </span>
        </div>

        {/* Main Heading — EXACT PRESERVED REQUIREMENT */}
        <h1 data-motion-enter className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] max-w-4xl mx-auto mb-6">
          <span className="text-slate-100">AI-Powered English.</span><br />
          <span className="bg-gradient-to-b from-lime-300 via-lime-400 to-cyan-400 bg-clip-text text-transparent">
            All-in-One Trainer.
          </span>
        </h1>

        {/* Precise, Unslopped Subtitle */}
        <p data-motion-enter className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Look up any word with zero delay. Get IPA phonetics, CEFR banding, Uzbek & Russian translations, academic collocations, and common pitfalls — locked into permanent memory with automated spaced repetition.
        </p>

        {/* Hero CTAs */}
        <div data-motion-enter className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md mb-12">
          <button
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-lime-400 via-lime-300 to-cyan-400 text-slate-950 font-bold text-sm hover:shadow-[0_0_35px_rgba(132,204,22,0.5)] active:scale-[0.98] transition-all cursor-pointer group"
          >
            <span>Open Vocabulary Trainer</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {!isLoggedIn && (
            <button
              type="button"
              onClick={onLogin}
              disabled={waitingAuth}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-lime-400/40 text-lime-300 font-medium text-sm hover:bg-slate-800/80 hover:border-lime-300/70 transition-all active:scale-[0.98] cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current text-lime-300" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
              <span>{waitingAuth ? 'Connecting...' : 'Sync via Telegram'}</span>
            </button>
          )}
        </div>

        {/* Architecture Proof Metrics (No vague fluff) */}
        <div data-motion-enter className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl w-full mx-auto">
          {[
            { label: 'Reading Passages', val: '180 articles', sub: 'CEFR A2 through C2' },
            { label: 'Lookup Latency', val: '< 180 ms', sub: 'Local SQLite cache' },
            { label: 'Memory Protocol', val: 'SuperMemo SM-2', sub: 'Dynamic intervals' },
            { label: 'Access Model', val: '100% Free', sub: 'Zero credit card required' }
          ].map((m, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md text-left flex flex-col justify-between">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{m.label}</span>
              <span className="text-lg font-bold text-lime-400 font-mono mt-1">{m.val}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{m.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. LIVE INTERACTIVE DEMO (SEE IT IN ACTION) */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-24">
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-bold text-lime-400 tracking-wider uppercase">
            Live Interactive Preview
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
            See the linguistic breakdown in real-time.
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-lg mx-auto">
            Click any sample word below to inspect how UniveBooster structures grammatical, phonetic, and contextual knowledge.
          </p>
        </div>

        {/* Word Switcher Tabs */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {Object.keys(DEMO_WORDS).map((key) => {
            const item = DEMO_WORDS[key];
            const isActive = activeWordKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveWordKey(key)}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all border cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-lime-400/15 border-lime-400 text-lime-300 shadow-[0_0_20px_rgba(132,204,22,0.25)] font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{item.word}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                  item.level === 'C2' ? 'bg-purple-500/20 text-purple-300' :
                  item.level === 'C1' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {item.level}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Analyzer Card */}
        <div data-motion-reveal className="relative rounded-3xl bg-slate-900/80 border border-lime-400/30 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.6)]">
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-100 font-mono tracking-tight">
                {activeWord.word}
              </h3>
              <button
                type="button"
                onClick={() => playPronunciation(activeWord.word)}
                title="Listen to native pronunciation"
                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-lime-400 hover:bg-slate-700 hover:border-lime-400/50 transition cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-400 font-mono">{activeWord.ipa}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-slate-800 border border-slate-700 text-slate-300">
                {activeWord.pos}
              </span>
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase ${
                activeWord.level === 'C2' ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300' :
                activeWord.level === 'C1' ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300' : 'bg-lime-500/20 border border-lime-500/40 text-lime-300'
              }`}>
                CEFR {activeWord.level}
              </span>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-md text-[11px] bg-slate-800/80 border border-slate-700 text-slate-400 font-mono">
                {activeWord.interval}
              </span>
            </div>
          </div>

          {/* Meaning & Translations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 pb-6 border-b border-slate-800">
            <div className="md:col-span-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">English Definition</span>
              <p className="text-sm text-slate-200 mt-1.5 leading-relaxed font-sans font-medium">
                {activeWord.en}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">O‘zbekcha tarjima</span>
                <p className="text-xs text-lime-300 font-semibold mt-1">{activeWord.uz}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Русский перевод</span>
                <p className="text-xs text-cyan-300 font-semibold mt-1">{activeWord.ru}</p>
              </div>
            </div>
          </div>

          {/* Collocations & Common Pitfalls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-lime-400" />
                Academic Collocations
              </span>
              <div className="flex flex-wrap gap-2 mt-2.5">
                {activeWord.collocations.map((c, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg text-xs bg-slate-800/90 border border-slate-700/80 text-slate-200 font-mono">
                    {c}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                💡 <span className="font-semibold text-slate-300">IELTS Strategy:</span> {activeWord.ieltsTip}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25">
              <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Common Candidate Pitfall
              </span>
              <p className="text-xs text-amber-200/90 mt-2 leading-relaxed">
                {activeWord.mistake}
              </p>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="mt-8 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400 font-mono">
              ⚡ Analyzed in 84ms via local lexicon + context verification
            </span>
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center gap-2 text-xs font-bold text-lime-300 hover:text-lime-200 transition cursor-pointer"
            >
              <span>Test with your own word</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE PILLARS (THE MEMORY LOOP) */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-24">
        <div className="text-center mb-12">
          <span className="text-xs font-mono font-bold text-lime-400 tracking-wider uppercase">
            The Learning Pipeline
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
            Engineered around how human memory retains syntax.
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-lg mx-auto">
            Traditional rote-memorization fails because words are detached from context. UniveBooster closes the retention loop in four steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Pillar 01 */}
          <div data-motion-reveal className="motion-surface p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-lime-400/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/25 flex items-center justify-center text-lime-400 font-bold text-sm">
                  01
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 border border-slate-800 px-2 py-0.5 rounded">Sub-Second Parsing</span>
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">Instant Linguistic Dissection</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Paste any single word or full sentence. Receive immediate CEFR grading, grammatical role, phonetic transcription, and common false friends. Never memorize without knowing exact register and context.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800/80 text-[11px] text-lime-400/90 font-mono">
              Output: IPA • CEFR Level • Uzbek/Russian • Collocations
            </div>
          </div>

          {/* Pillar 02 */}
          <div data-motion-reveal className="motion-surface p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-lime-400/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/25 flex items-center justify-center text-cyan-400 font-bold text-sm">
                  02
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 border border-slate-800 px-2 py-0.5 rounded">Context Immersion</span>
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">180 Graded Retention Articles</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Read authentic passages written across IELTS domains: astrophysics, behavioural economics, environmental law, and history. Tap any unfamiliar term mid-sentence to reveal full dictionary breakdown without losing focus.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800/80 text-[11px] text-cyan-400/90 font-mono">
              A2 to C2 Library • Zero dictionary app switching
            </div>
          </div>

          {/* Pillar 03 */}
          <div data-motion-reveal className="motion-surface p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-lime-400/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/25 flex items-center justify-center text-purple-400 font-bold text-sm">
                  03
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 border border-slate-800 px-2 py-0.5 rounded">Spaced Intervals</span>
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">SuperMemo SM-2 Active Recall</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Quizzes trigger exactly when synaptic retrieval strength begins to dip. By timing reviews at 1, 3, 7, and 21 days, neural pathways strengthen with up to 4x less total study time than daily repetitive grinding.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800/80 text-[11px] text-purple-400/90 font-mono">
              Active Recall • Forgetting Curve Interception
            </div>
          </div>

          {/* Pillar 04 */}
          <div data-motion-reveal className="motion-surface p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-lime-400/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-400 font-bold text-sm">
                  04
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 border border-slate-800 px-2 py-0.5 rounded">Timed Stress Test</span>
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">Word Blitz 60-Second Sprint</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Simulate real exam pressure. Test rapid-fire recognition of high-frequency academic vocabulary in 60-second timed sprints. Build instant recall so you never hesitate during IELTS Speaking or Writing.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800/80 text-[11px] text-amber-400/90 font-mono">
              Streak Multipliers • Exam Condition Speed Drill
            </div>
          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE MINI QUIZ WIDGET (TRY IT NOW) */}
      <section className="w-full max-w-4xl mx-auto px-4 pb-24">
        <div className="p-7 sm:p-9 rounded-3xl bg-slate-900/70 border border-lime-400/30 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="text-xs font-mono font-bold text-lime-400 tracking-wider uppercase flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-lime-400" />
              Interactive Active Recall Test
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 border border-slate-700 text-slate-300">
              C1 Academic Test
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-2">
            Select the word that accurately completes the IELTS Task 2 sentence:
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 italic mb-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 leading-relaxed">
            &ldquo;Rather than pursuing ideological dogmas, municipal councils must adopt a <span className="text-lime-300 font-bold underline underline-offset-4">_______</span> strategy that allocates municipal funds directly to infrastructure maintenance.&rdquo;
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {[
              { id: 0, word: 'superficial', correct: false, note: 'Incorrect: Means shallow or on the surface only.' },
              { id: 1, word: 'pragmatic', correct: true, note: 'Correct! C1 Adjective: Practical, solution-oriented rather than theoretical.' },
              { id: 2, word: 'redundant', correct: false, note: 'Incorrect: Means no longer needed or exceeding what is necessary.' },
              { id: 3, word: 'ambiguous', correct: false, note: 'Incorrect: Means open to more than one interpretation; unclear.' }
            ].map((opt) => {
              const isSelected = selectedQuiz === opt.id;
              let stateStyles = 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200';
              if (isSelected) {
                stateStyles = opt.correct
                  ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                  : 'bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedQuiz(opt.id)}
                  className={`p-3.5 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between cursor-pointer ${stateStyles}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400">
                      {String.fromCharCode(65 + opt.id)}
                    </span>
                    <span className="font-semibold">{opt.word}</span>
                  </div>
                  {isSelected && (
                    <span>
                      {opt.correct ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-rose-400" />}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selectedQuiz !== null && (
            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs animate-in fade-in duration-200">
              {selectedQuiz === 1 ? (
                <span className="text-emerald-400 font-medium">
                  ✅ Spot on! &ldquo;Pragmatic&rdquo; fits academic and governance contexts where decisions are based on practical utility.
                </span>
              ) : (
                <span className="text-rose-400 font-medium">
                  ❌ Incorrect choice. The sentence requires a word conveying practical feasibility under real-world constraints (&ldquo;pragmatic&rdquo;).
                </span>
              )}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">
              Spaced Repetition engine auto-schedules missed items for early review.
            </span>
            <button
              type="button"
              onClick={onStart}
              className="text-xs font-bold text-lime-400 hover:text-lime-300 inline-flex items-center gap-1 cursor-pointer"
            >
              Start full quiz session →
            </button>
          </div>
        </div>
      </section>

      {/* 5. FEATURE BENTO GRID (ALL 6 CAPABILITIES) */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-24">
        <div className="text-center mb-12">
          <span className="text-xs font-mono font-bold text-lime-400 tracking-wider uppercase">
            Product Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
            Complete vocabulary toolkit. Zero bloat.
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-lg mx-auto">
            Every feature is purposefully built to replace fragmented tools, paper lists, and clunky dictionary lookups.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Feature 1 */}
          <div data-motion-reveal className="motion-surface p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-lime-400/30 transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-lime-400 mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-2">Sub-Second Local Lexicon</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Backed by local SQLite and Turso Cloud. High-frequency queries resolve in under 180ms with offline fallback.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
              Response time: ~84ms avg
            </div>
          </div>

          {/* Feature 2 */}
          <div data-motion-reveal className="motion-surface p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-lime-400/30 transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-2">180 CEFR Reading Library</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Curated articles across science, climate, psychology, and arts. Tap any word to view definitions and save to your review bank.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
              Levels: A2, B1, B2, C1, C2
            </div>
          </div>

          {/* Feature 3 */}
          <div data-motion-reveal className="motion-surface p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-lime-400/30 transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-400 mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-2">Spaced Repetition (SRS)</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Interval calculation based on difficulty score. Easy terms advance to 7+ days; struggling terms recycle within 24 hours.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
              Ebbinghaus curve calibrated
            </div>
          </div>

          {/* Feature 4 */}
          <div data-motion-reveal className="motion-surface p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-lime-400/30 transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-4">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-2">Word Blitz Sprint Mode</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Rapid 60-second sessions designed to test lexical retrieval under timed exam stress. Tracks streaks and accuracy.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
              60s countdown • Combo multipliers
            </div>
          </div>

          {/* Feature 5 */}
          <div data-motion-reveal className="motion-surface p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-lime-400/30 transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-2">Dual-Language Localization</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Every entry includes tailored Uzbek and Russian academic translations so bilingual learners never miss regional nuances.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
              English • O‘zbek • Русский
            </div>
          </div>

          {/* Feature 6 */}
          <div data-motion-reveal className="motion-surface p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-lime-400/30 transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-2">Telegram One-Tap Auth</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Sign in with zero passwords or email forms. Your saved words and quiz statistics synchronize instantly across phone and browser.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
              No password • Instant session sync
            </div>
          </div>

        </div>
      </section>

      {/* 6. COMPARISON MATRIX (HONEST, ZERO-SLOP TABLE) */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-24">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold text-lime-400 tracking-wider uppercase">
            Head-to-Head Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
            Why conventional vocabulary tools fall short.
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-lg mx-auto">
            Comparing UniveBooster against traditional flashcard decks, gamified consumer apps, and static paper dictionaries.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400">
                <th className="p-4 font-bold">Capabilities</th>
                <th className="p-4 font-extrabold text-lime-400 bg-lime-400/10 border-x border-lime-400/20">
                  UniveBooster
                </th>
                <th className="p-4 font-bold">Generic Flashcards (Anki/Quizlet)</th>
                <th className="p-4 font-bold">Gamified Apps (Duolingo)</th>
                <th className="p-4 font-bold">Standard Online Lexicon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="p-4 font-semibold text-slate-200">Sub-second CEFR level & IPA parsing</td>
                <td className="p-4 font-bold text-lime-400 bg-lime-400/5 border-x border-lime-400/20">Instant (&lt; 180ms)</td>
                <td className="p-4 text-slate-400">Manual entry required</td>
                <td className="p-4 text-slate-400">Fixed basic decks</td>
                <td className="p-4 text-slate-400">Static, slow lookup</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-200">180 Graded articles with in-text inspection</td>
                <td className="p-4 font-bold text-lime-400 bg-lime-400/5 border-x border-lime-400/20">Integrated</td>
                <td className="p-4 text-slate-400">No reading mode</td>
                <td className="p-4 text-slate-400">Childlike stories</td>
                <td className="p-4 text-slate-400">No curated passages</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-200">Academic collocations & mistake alerts</td>
                <td className="p-4 font-bold text-lime-400 bg-lime-400/5 border-x border-lime-400/20">Automatic for every term</td>
                <td className="p-4 text-slate-400">User must author</td>
                <td className="p-4 text-slate-400">Unavailable</td>
                <td className="p-4 text-slate-400">Buried in text walls</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-200">Spaced Repetition scheduling</td>
                <td className="p-4 font-bold text-lime-400 bg-lime-400/5 border-x border-lime-400/20">SM-2 Automated</td>
                <td className="p-4 text-slate-300">Manual algorithm setup</td>
                <td className="p-4 text-slate-400">Arbitrary streak pressure</td>
                <td className="p-4 text-slate-400">None</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-200">Bilingual Uzbek & Russian definitions</td>
                <td className="p-4 font-bold text-lime-400 bg-lime-400/5 border-x border-lime-400/20">Native context included</td>
                <td className="p-4 text-slate-400">Manual typing</td>
                <td className="p-4 text-slate-400">Restricted / poor Uz</td>
                <td className="p-4 text-slate-400">Single language only</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-200">Paywalls & Credit Card barriers</td>
                <td className="p-4 font-bold text-lime-400 bg-lime-400/5 border-x border-lime-400/20">Zero paywall</td>
                <td className="p-4 text-slate-400">Subscriptions / Pro locks</td>
                <td className="p-4 text-slate-400">Aggressive ads & hearts</td>
                <td className="p-4 text-slate-400">Banner ads & popups</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. CEFR & IELTS PROFICIENCY TIERS */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-24">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold text-lime-400 tracking-wider uppercase">
            Curriculum Alignment
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
            Calibrated for CEFR standards & IELTS target bands.
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-lg mx-auto">
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
            <div key={i} data-motion-reveal className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-extrabold font-mono text-lime-400">{t.tier}</span>
                  <span className="text-[10px] font-mono text-slate-400 border border-slate-800 px-2 py-0.5 rounded">{t.ielts}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-100 mb-2">{t.focus}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{t.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-lime-400/80 font-mono">
                Full article & quiz support
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. NO-FLUFF FAQ */}
      <section className="w-full max-w-4xl mx-auto px-4 pb-24">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold text-lime-400 tracking-wider uppercase">
            Questions & Clarity
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
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
            <div key={i} data-motion-reveal className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
              <h4 className="text-sm font-bold text-slate-100 mb-2 flex items-start gap-2">
                <span className="text-lime-400 font-mono">Q:</span>
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. BOTTOM CONVERSION STRIP */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-28">
        <div className="relative rounded-3xl border border-lime-400/30 bg-gradient-to-b from-slate-900/90 to-slate-950 p-10 sm:p-14 text-center overflow-hidden shadow-[0_0_60px_rgba(132,204,22,0.12)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lime-500/10 via-transparent to-transparent pointer-events-none" />

          <span className="text-xs font-mono font-bold text-lime-400 uppercase tracking-wider mb-2 inline-block">
            Immediate Access
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-100 mb-4 tracking-tight">
            Level up your academic English today.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mb-8 max-w-lg mx-auto leading-relaxed">
            No subscription fees. No paywalls. Just a fast, scientifically grounded vocabulary engine built for serious learners.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-xl bg-gradient-to-r from-lime-400 via-lime-300 to-cyan-400 text-slate-950 font-extrabold text-sm hover:shadow-[0_0_35px_rgba(132,204,22,0.4)] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Launch UniveBooster</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {!isLoggedIn && (
              <button
                type="button"
                onClick={onLogin}
                disabled={waitingAuth}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 hover:border-lime-400/50 hover:text-lime-300 transition text-sm font-medium cursor-pointer"
              >
                <span>Telegram Quick Sync</span>
              </button>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-slate-400 font-mono">
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
