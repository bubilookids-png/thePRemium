// src/components/LandingPage.tsx
import React, { useRef } from 'react';
import { useMotionEntrance, useScrollReveal } from '../utils/motion';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
  isLoggedIn: boolean;
  waitingAuth?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onLogin,
  isLoggedIn,
  waitingAuth = false
}) => {
  const landingRef = useRef<HTMLDivElement>(null);
  useMotionEntrance(landingRef, true, '[data-motion-enter]');
  useScrollReveal(landingRef, '[data-motion-reveal]');

  return (
    <div ref={landingRef} className="relative w-full flex flex-col items-center overflow-hidden font-mono select-none">

      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[75vh] flex flex-col items-center justify-center px-4 pt-10 pb-14 text-center">

        {/* Lime Glow Aura */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-lime-500/50 via-blue-500/20 to-transparent blur-3xl pointer-events-none rounded-full" />

        {/* Badge */}
        <div data-motion-enter className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lime-400/30 bg-slate-950/60 backdrop-blur-lg mb-8">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
          <span className="text-xs font-mono tracking-wide text-lime-300">
            Built for IELTS & Academic English
          </span>
        </div>

        {/* Main Heading — untouched */}
        <h1 data-motion-enter className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] max-w-4xl mx-auto mb-6">
          <span className="text-slate-100">AI-Powered English.</span><br />
          <span className="bg-gradient-to-b from-lime-300 via-lime-400 to-cyan-400 bg-clip-text text-transparent">
            All-in-One Trainer.
          </span>
        </h1>

        <p data-motion-enter className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
          Paste any word. Get CEFR level, usage examples, and etymology in under a second — then lock it into memory with spaced repetition quizzes.
        </p>

        {/* CTA Buttons */}
        <div data-motion-enter className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-sm">
          <button
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-950 font-bold text-sm hover:shadow-[0_0_30px_rgba(132,204,22,0.5)] active:scale-[0.98] transition cursor-pointer"
          >
            <span>Try for now</span>
            <span>→</span>
          </button>

          {!isLoggedIn && (
            <button
              type="button"
              onClick={onLogin}
              disabled={waitingAuth}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-slate-900/70 backdrop-blur-md border border-lime-400/40 text-lime-300 font-medium text-sm hover:bg-slate-800/70 hover:border-lime-300/60 transition active:scale-[0.98] cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current text-lime-300" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
              <span>{waitingAuth ? "Kutilmoqda..." : "Sign Up"}</span>
            </button>
          )}
        </div>
      </section>

      {/* 2. HOW IT WORKS — 3 cards, unslopped */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold text-lime-400 tracking-wider uppercase">
            How it works
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
            Three steps. Zero fluff.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1 */}
          <div data-motion-reveal className="motion-surface p-6 rounded-3xl bg-slate-900/60 backdrop-blur-lg border border-lime-400/20 hover:border-lime-400/40 hover:shadow-[0_0_20px_rgba(132,204,22,0.15)] transition flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-lime-400/20 flex items-center justify-center text-lime-400 text-base font-bold shrink-0">
              01
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 mb-1">Paste any word</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Type or paste a word. UniveBooster returns CEFR level, pronunciation, 3 usage examples, etymology, and synonyms — in one shot.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div data-motion-reveal className="motion-surface p-6 rounded-3xl bg-slate-900/60 backdrop-blur-lg border border-lime-400/20 hover:border-lime-400/40 hover:shadow-[0_0_20px_rgba(132,204,22,0.15)] transition flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-lime-400/20 flex items-center justify-center text-lime-400 text-base font-bold shrink-0">
              02
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 mb-1">Save and get tested</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Save words to your personal list. The system schedules spaced-repetition quizzes timed to your forgetting curve — not a fixed schedule.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div data-motion-reveal className="motion-surface p-6 rounded-3xl bg-slate-900/60 backdrop-blur-lg border border-lime-400/20 hover:border-lime-400/40 hover:shadow-[0_0_20px_rgba(132,204,22,0.15)] transition flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-lime-400/20 flex items-center justify-center text-lime-400 text-base font-bold shrink-0">
              03
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 mb-1">Progress syncs everywhere</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your word bank, quiz history, and streaks live in Turso Cloud. Open the app on any device — everything's already there.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. FEATURES GRID */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-24">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold text-lime-400 tracking-wider uppercase">
            Features
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
            Everything you actually need.
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-lg mx-auto">
            No paywalled flashcard decks. No recycled word lists. Just clean tooling built around how memory works.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {[
            {
              icon: '⚡',
              title: 'Sub-second AI analysis',
              desc: 'CEFR level, context, and sentence examples delivered before you finish reading the word.',
            },
            {
              icon: '🎯',
              title: 'Active Recall quizzes',
              desc: 'Multiple-choice and fill-in-the-blank tests triggered at the optimal forgetting interval — not daily spam.',
            },
            {
              icon: '📖',
              title: 'Retention Reading',
              desc: 'Read curated IELTS-level articles. Tap any unknown word mid-read for an instant breakdown without leaving the page.',
            },
            {
              icon: '🌐',
              title: 'Word Blitz mode',
              desc: '60-second word sprints. Build speed recognition for high-frequency academic vocabulary under real exam pressure.',
            },
            {
              icon: '☁️',
              title: 'Cloud sync',
              desc: 'Turso-backed storage. Your saved words and stats are intact across every session and device.',
            },
            {
              icon: '🔒',
              title: 'Telegram auth — no password',
              desc: 'Sign in with one Telegram message. No forms, no email verification, no forgotten passwords.',
            },
          ].map((f, i) => (
            <div
              key={i}
              data-motion-reveal
              className="motion-surface group p-5 rounded-2xl bg-slate-900/50 border border-slate-700/50 hover:border-lime-400/30 hover:bg-slate-900/70 transition-all duration-200 flex flex-col gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-base group-hover:border-lime-400/30 transition">
                {f.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-100 leading-snug">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* 4. BOTTOM CTA STRIP */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-28">
        <div className="relative rounded-3xl border border-lime-400/20 bg-slate-900/60 backdrop-blur-lg p-10 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-lime-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mb-3">
            Start learning. Right now.
          </h2>
          <p className="text-xs text-slate-400 mb-7 max-w-sm mx-auto">
            No account required to try it. Sign up only when you want your progress saved.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center justify-center gap-2 px-10 py-3.5 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-950 font-bold text-sm hover:shadow-[0_0_30px_rgba(132,204,22,0.4)] active:scale-[0.98] transition cursor-pointer"
          >
            Open the trainer →
          </button>
        </div>
      </section>

    </div>
  );
};
