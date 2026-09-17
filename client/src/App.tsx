// src/App.tsx
import GradientWaves from './components/GradientWaves';
import WarpText from './components/WarpText';
import React, { useMemo, useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar } from './components/sidebar';
import { Card } from './components/Card';
import { WordForm } from './components/WordForm';
import { Alert } from './components/Alert';
import { AnalysisView } from './components/AnalysisView';
import { QuizView } from './components/QuizView';
import { AiLoader } from './components/AiLoader';
import { CyberMatrixOrb } from './components/CyberMatrixOrb';
import { LandingPage } from './components/LandingPage';

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

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  search_count?: number;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<TelegramUser | null>(() => {
    try {
      const saved = localStorage.getItem('vacabbro_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [showLanding, setShowLanding] = useState<boolean>(() => {
    return !localStorage.getItem('vacabbro_user');
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [word, setWord] = useState('');
  const [langCode, setLangCode] = useState<SupportedLanguageCode>('uz');
  const [langLabel, setLangLabel] = useState('Uzbek');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [view, setView] = useState<View>('analysis');
  const [waitingAuth, setWaitingAuth] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const guestSearches = parseInt(localStorage.getItem('vacabbro_guest_searches') || '0', 10);
  const totalSearches = currentUser ? (currentUser.search_count || 0) : guestSearches;
  const dailyTarget = 10;
  const progressPercent = Math.min(100, Math.round((totalSearches / dailyTarget) * 100));

  const normalized = useMemo(
    () => normalizeTerm(word),
    [word]
  );

  const triggerBlitz = () => {
    window.dispatchEvent(new CustomEvent('vacabbro:open-blitz'));
  };

  const triggerTranslate = () => {
    window.dispatchEvent(new CustomEvent('vacabbro:open-translate'));
  };

  const triggerReading = () => {
    window.dispatchEvent(new CustomEvent('vacabbro:open-reading'));
  };

  const focusSearchInput = () => {
    setShowLanding(false);
    setView('analysis');
    setTimeout(() => {
      const input = document.getElementById('analyze-word-section')?.querySelector('input');
      input?.focus();
      input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if ((e.metaKey || e.ctrlKey) && (e.code === 'KeyB' || e.key.toLowerCase() === 'b')) {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
        return;
      }

      if (e.shiftKey && (e.code === 'KeyB' || e.key === 'B' || e.key === 'b')) {
        e.preventDefault();
        triggerBlitz();
        return;
      }

      if (e.shiftKey && (e.code === 'KeyT' || e.key === 'T' || e.key === 't')) {
        e.preventDefault();
        triggerTranslate();
        return;
      }

      if (e.key === '/' && !isInput) {
        e.preventDefault();
        focusSearchInput();
        return;
      }

      if (e.key === 'Escape') {
        if (word) setWord('');
        if (isInput) target.blur();
        return;
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [word]);

  async function handleTelegramLogin() {
    try {
      setWaitingAuth(true);
      const backendUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:8787'
        : 'https://thepremium.onrender.com';

      const res = await fetch(`${backendUrl}/api/auth/session`);
      const sessionData = await res.json();
      const token = sessionData.token;

      if (!token) throw new Error('Sessiya tokeni olinmadi');

      const botUsername = 'GIvacabbro_bot';
      window.open(`https://t.me/${botUsername}?start=${token}`, '_blank');

      const interval = setInterval(async () => {
        try {
          const checkRes = await fetch(`${backendUrl}/api/auth/check-session/${token}`);
          const checkData = await checkRes.json();

          if (checkData.authenticated && checkData.user) {
            clearInterval(interval);
            setWaitingAuth(false);
            const userData: TelegramUser = {
              id: checkData.user.telegram_id,
              first_name: checkData.user.first_name,
              last_name: checkData.user.last_name,
              username: checkData.user.username,
              photo_url: checkData.user.photo_url,
              search_count: checkData.user.search_count || 0
            };
            localStorage.setItem('vacabbro_user', JSON.stringify(userData));
            setCurrentUser(userData);
            setShowLanding(false);
          }
        } catch (e) {
          console.error("Auth tekshirishda xatolik:", e);
        }
      }, 2000);

      setTimeout(() => {
        clearInterval(interval);
        setWaitingAuth(false);
      }, 60000);

    } catch (err) {
      console.error(err);
      setWaitingAuth(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('vacabbro_user');
    setCurrentUser(null);
    setShowLanding(true);
  }

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

    if (!currentUser) {
      const guestCount = parseInt(localStorage.getItem('vacabbro_guest_searches') || '0', 10);
      if (guestCount >= 10) {
        setShowLimitModal(true);
        return;
      }
      localStorage.setItem('vacabbro_guest_searches', (guestCount + 1).toString());
    }

    setLoading(true);

    try {
      const res = await analyzeWord({
        word: term,
        targetLanguageCode: langCode,
        targetLanguageLabel: langLabel,
        telegramId: currentUser?.id
      } as any);

      if (currentUser) {
        const updated = {
          ...currentUser,
          search_count: (currentUser.search_count || 0) + 1
        };
        setCurrentUser(updated);
        localStorage.setItem('vacabbro_user', JSON.stringify(updated));
      }

      try {
        const translationText = res.analysis?.translation || '';
        if (translationText) {
          const rawHistory = localStorage.getItem('vacabbro_history');
          const historyList: { en: string; uz: string }[] = rawHistory ? JSON.parse(rawHistory) : [];
          
          const filtered = historyList.filter((item) => item.en.toLowerCase() !== term.toLowerCase());
          filtered.unshift({ en: term, uz: translationText.split(/[,;\.]/)[0].trim() });
          
          localStorage.setItem('vacabbro_history', JSON.stringify(filtered.slice(0, 50)));
        }
      } catch (err) {
        console.warn('History saqlashda xato:', err);
      }

      setData(res);
    } catch (e: any) {
      setError(e?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleTryFirstWord() {
    setShowLanding(false);
    setView('analysis');
    window.setTimeout(() => {
      focusSearchInput();
    }, 200);
  }

  return (
    <div className="app-shell min-h-screen flex flex-col w-full overflow-x-hidden">
      <div className="app-background">
        <GradientWaves
          horizonColor="#02130e"
          waveColor="#064E3B"
          crestColor="#F8E7C9"
          speed={0.2}
          amplitude={2.1}
          waveScale={0.55}
          waveRatio={0.9}
          swell={26}
          turbulence={15}
          tilt={1.11}
          zoom={1.0}
          height={5.5}
          fogDepth={18}
          detail="medium"
          brightness={0.75}
          opacity={0.82}
          mouseInteraction={true}
          parallaxStrength={0.32}
          grain={true}
          grainIntensity={0.02}
        />
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
        onFocusSearch={focusSearchInput}
        onOpenBlitz={triggerBlitz}
        onOpenTranslate={triggerTranslate}
        onOpenReading={triggerReading}
      />

      <div
        className={`app-content relative z-10 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:pl-64' : 'lg:pl-12'
        }`}
      >
        <Header currentUser={currentUser} onLogout={handleLogout} />

        {!currentUser && (
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-2 flex justify-start">
            {!showLanding ? (
              <button
                type="button"
                onClick={() => setShowLanding(true)}
                className="px-3 py-1 rounded-full bg-[#062b21]/70 hover:bg-[#064E3B] border border-[#F8E7C9]/20 text-[11px] font-mono text-[#F8E7C9] transition cursor-pointer"
              >
                ← Bosh sahifa
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowLanding(false)}
                className="px-3 py-1 rounded-full bg-[#064E3B] hover:bg-[#08634c] border border-[#F8E7C9]/30 text-[11px] font-mono text-[#F8E7C9] transition cursor-pointer"
              >
                Trainerga o'tish →
              </button>
            )}
          </div>
        )}

        {showLanding ? (
          <LandingPage
            onStart={handleTryFirstWord}
            onLogin={handleTelegramLogin}
            isLoggedIn={Boolean(currentUser)}
            waitingAuth={waitingAuth}
          />
        ) : (
          <main className="page flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <section className="hero grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center mb-8 sm:mb-10">
              <div className="lg:col-span-7 flex flex-col items-start">
                <button
                  type="button"
                  className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#062b21]/60 hover:bg-[#064E3B]/60 border border-[#F8E7C9]/15 text-xs font-mono text-[#F8E7C9] transition-all duration-200 mb-4 cursor-pointer"
                  onClick={handleTryFirstWord}
                >
                  <span className="text-[#F8E7C9]">✦</span>
                  <span>Try your first word</span>
                  <span className="group-hover:translate-x-0.5 transition-transform text-[#F8E7C9]/70">→</span>
                </button>

                <h1 className="w-full">
                  <WarpText
                    text={
                      currentUser?.first_name 
                        ? `Ready to train,\n${currentUser.first_name}.` 
                        : 'Vocabulary Lab\nActive.'
                    }
                    color="#F8E7C9"
                    warpStrength={0.08}
                    warpScale={1.7}
                    speed={0.55}
                    pointerInfluence={0.42}
                    pointerStrength={0.38}
                    refraction={0.018}
                    ripple
                    fontSize="clamp(2.3rem, 7vw, 5rem)"
                    fontWeight={800}
                    style={{ minHeight: '140px', height: 'auto', width: '100%' }}
                  />
                </h1>

                <div className="mt-4 w-full">
                  <CyberMatrixOrb />
                </div>
              </div>

              <div className="lg:col-span-5 w-full rounded-3xl bg-[#02130e]/85 backdrop-blur-xl border border-[#F8E7C9]/15 p-5 sm:p-6 shadow-2xl flex flex-col justify-between min-h-[310px]">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#F8E7C9] pb-3 border-b border-[#F8E7C9]/10 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                    Session Telemetry
                  </span>
                  <span className="text-[10px] text-[#F8E7C9]/40 font-normal">Realtime</span>
                </div>

                <div className="my-4 p-4 rounded-2xl bg-[#062b21]/40 border border-[#F8E7C9]/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-[#F8E7C9]/60 block mb-0.5">
                      {currentUser ? 'Words Analyzed' : 'Free Trial Searches'}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold font-mono text-[#F8E7C9]">
                        {totalSearches}
                      </span>
                      {!currentUser && (
                        <span className="text-xs font-mono text-[#F8E7C9]/40">/ 10</span>
                      )}
                    </div>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-[#064E3B]/60 border border-[#F8E7C9]/20 text-right">
                    <span className="text-[10px] font-mono text-[#10b981] block font-bold">STATUS</span>
                    <span className="text-xs font-mono text-[#F8E7C9]">
                      {currentUser ? 'Unlimited' : `${10 - guestSearches} left`}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs font-mono text-[#F8E7C9]/80 mb-1.5">
                    <span>Daily Practice Goal</span>
                    <span className="text-[#F8E7C9] font-bold">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#062b21] border border-[#F8E7C9]/10 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#064E3B] via-[#10b981] to-[#F8E7C9] transition-all duration-500 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-[#F8E7C9]/40 mt-1 block">
                    Target: {dailyTarget} words per day
                  </span>
                </div>

                <div className="pt-3 border-t border-[#F8E7C9]/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F8E7C9]/60">Recall Readiness</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 text-[10px] font-bold">
                    Active System
                  </span>
                </div>
              </div>
            </section>

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

                  <div className="entered-line mt-3 text-xs font-mono text-[#F8E7C9]/60">
                    You entered:{' '}
                    <strong className="text-[#F8E7C9]">
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
                <div className="w-full rounded-2xl bg-[#02130e]/70 border border-[#F8E7C9]/10 p-4 sm:p-5 backdrop-blur-md select-none">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F8E7C9]/10 text-xs font-mono text-[#F8E7C9]/60">
                    <span className="flex items-center gap-1.5 text-[#F8E7C9] font-bold">
                      <span className="text-[#10b981]">⌘</span> Live Shortcuts & Actions
                    </span>
                    <span className="text-[10px]">Press key or click item</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        if (word.trim()) onAnalyze();
                        else focusSearchInput();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#062b21]/40 hover:bg-[#064E3B]/40 border border-[#F8E7C9]/10 hover:border-[#F8E7C9]/30 transition active:scale-[0.98] text-left cursor-pointer"
                    >
                      <span className="text-[#F8E7C9]/70 text-[11px]">Analyze term</span>
                      <kbd className="px-2 py-0.5 rounded bg-[#064E3B] border border-[#F8E7C9]/20 text-[#F8E7C9] text-[10px] shadow-sm font-bold">
                        ↵ Enter
                      </kbd>
                    </button>

                    <button
                      type="button"
                      onClick={triggerBlitz}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#062b21]/40 hover:bg-[#064E3B]/40 border border-[#F8E7C9]/10 hover:border-[#F8E7C9]/30 transition active:scale-[0.98] text-left cursor-pointer"
                    >
                      <span className="text-[#F8E7C9]/70 text-[11px]">Quick Blitz</span>
                      <kbd className="px-2 py-0.5 rounded bg-[#064E3B] border border-[#F8E7C9]/20 text-[#F8E7C9] text-[10px] shadow-sm font-bold">
                        ⇧ Shift+B
                      </kbd>
                    </button>

                    <button
                      type="button"
                      onClick={triggerTranslate}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#062b21]/40 hover:bg-[#064E3B]/40 border border-[#F8E7C9]/10 hover:border-[#F8E7C9]/30 transition active:scale-[0.98] text-left cursor-pointer"
                    >
                      <span className="text-[#F8E7C9]/70 text-[11px]">Translation</span>
                      <kbd className="px-2 py-0.5 rounded bg-[#064E3B] border border-[#F8E7C9]/20 text-[#F8E7C9] text-[10px] shadow-sm font-bold">
                        ⇧ Shift+T
                      </kbd>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWord('')}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#062b21]/40 hover:bg-[#064E3B]/40 border border-[#F8E7C9]/10 hover:border-[#F8E7C9]/30 transition active:scale-[0.98] text-left cursor-pointer"
                    >
                      <span className="text-[#F8E7C9]/70 text-[11px]">Clear input</span>
                      <kbd className="px-2 py-0.5 rounded bg-[#064E3B] border border-[#F8E7C9]/20 text-[#F8E7C9] text-[10px] shadow-sm font-bold">
                        Esc
                      </kbd>
                    </button>
                  </div>
                </div>
              ) : null}

              {!loading && data ? (
                view === 'analysis' ? (
                  <AnalysisView
                    analysis={data.analysis}
                    source={data.source}
                    sources={data.sources}
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
        )}

        <Footer />
      </div>

      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#02130e] border border-[#F8E7C9]/20 shadow-2xl text-center">
            <button 
              onClick={() => setShowLimitModal(false)}
              className="absolute top-4 right-4 text-[#F8E7C9]/50 hover:text-white transition text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 cursor-pointer"
            >
              ✕
            </button>

            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#064E3B] border border-[#F8E7C9]/20 flex items-center justify-center text-3xl shadow-lg">
              ✨
            </div>

            <h3 className="text-xl font-bold text-[#F8E7C9] mb-2">
              Sinov qidiruvlari yakunlandi
            </h3>

            <p className="text-xs sm:text-sm text-[#F8E7C9]/80 leading-relaxed mb-6">
              Siz bepul taqdim etilgan <b>10 ta</b> so‘z tahlilidan foydalandingiz. 
              Cheklovlarsiz izlash uchun Telegram orqali kiring.
            </p>

            <button
              onClick={() => {
                setShowLimitModal(false);
                handleTelegramLogin();
              }}
              className="w-full py-3.5 px-6 rounded-xl bg-[#F8E7C9] text-[#064E3B] font-bold text-sm shadow-lg hover:bg-[#ebd7b5] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
              Telegram orqali davom etish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}