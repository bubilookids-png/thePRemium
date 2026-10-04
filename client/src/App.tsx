// src/App.tsx
import GradientWaves from './components/GradientWaves';
import WarpText from './components/WarpText';
import { ActiveRecallWidget } from './components/ActiveRecallWidget';
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
import { RetentionReading } from './components/RetentionReading';
import { WordBlitzModal } from './components/WordBlitzModal';
import { QuickTranslator } from './components/QuickTranslator';
import { LegalModal } from './components/LegalModal';
import { ConsentModal } from './components/ConsentModal';
import { hasValidCookieConsent, acceptCookieConsent } from './utils/consent';

import type {
  AnalyzeResponse,
  SupportedLanguageCode
} from './types/vocab';

import { analyzeWord } from './services/vocabApi';

import {
  isLikelyValidTerm,
  normalizeTerm
} from './utils/string';

type View = 'analysis' | 'quiz' | 'reading';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  search_count?: number;
  is_premium?: boolean;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<TelegramUser | null>(() => {
    try {
      const saved = localStorage.getItem('vacabbro_user');
      if (!saved) return null;
      const user = JSON.parse(saved);
      if (typeof user?.id === 'number' && typeof user?.first_name === 'string') {
        return user;
      }
      return null;
    } catch {
      localStorage.removeItem('vacabbro_user');
      return null;
    }
  });

  // Pronunciation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const [showLanding, setShowLanding] = useState<boolean>(() => {
    return !localStorage.getItem('vacabbro_user');
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBlitzModal, setShowBlitzModal] = useState(false);
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showCookieSettingsModal, setShowCookieSettingsModal] = useState(false);

  const [word, setWord] = useState('');
  const [langCode, setLangCode] = useState<SupportedLanguageCode>('uz');
  const [langLabel, setLangLabel] = useState('Uzbek');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [view, setView] = useState<View>('analysis');
  const [waitingAuth, setWaitingAuth] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showGetMoreModal, setShowGetMoreModal] = useState(false);

  // 1. O'ZINGIZNING TELEGRAM ID RAQAMINGIZNI SHU YERGA YOZING!
  // Misol uchun: 123456789. Buni @userinfobot orqali bilishingiz mumkin.
  const MY_TELEGRAM_ID = 7462228079; // SHU SONNI O'ZGARTIRING

  // 2. Admin huquqi: yo premium bo'lsin, yoki O'ZINGIZ bo'ling
  const isAdmin = currentUser?.is_premium === true || currentUser?.id === MY_TELEGRAM_ID;
  const canAccessAdminPanel = isAdmin;

  // 3. VIP Cheklovlar va Limitlar: sizga doim 400 ta!
  const isPremium = Boolean(currentUser?.is_premium) || currentUser?.id === MY_TELEGRAM_ID;
  const maxAllowedLimit = isPremium ? 400 : 100;
  const periodDays = isPremium ? 1 : 2;

  const limitStorageKey = 'vacabbro_period_limit_data';
  const currentPeriodData = useMemo(() => {
    try {
      const saved = localStorage.getItem(limitStorageKey);
      const now = Date.now();
      const periodMs = periodDays * 24 * 60 * 60 * 1000;

      if (saved) {
        const parsed = JSON.parse(saved);
        if (now - parsed.startTime < periodMs) {
          return parsed;
        }
      }
      const fresh = { count: 0, startTime: now, goal: 0, goalSet: false };
      localStorage.setItem(limitStorageKey, JSON.stringify(fresh));
      return fresh;
    } catch {
      return { count: 0, startTime: Date.now(), goal: 0, goalSet: false };
    }
  }, [periodDays]);

  const [sessionCount, setSessionCount] = useState<number>(currentPeriodData.count);
  const [dailyTarget, setDailyTarget] = useState<number>(currentPeriodData.goal || 0);
  const [isGoalSet, setIsGoalSet] = useState<boolean>(currentPeriodData.goalSet || false);
  const [tempGoalInput, setTempGoalInput] = useState<string>(currentPeriodData.goal ? currentPeriodData.goal.toString() : '');

  const totalSearches = sessionCount;
  const progressPercent = Math.min(100, Math.round((totalSearches / Math.max(1, dailyTarget)) * 100));

  const normalized = useMemo(
    () => normalizeTerm(word),
    [word]
  );

  const triggerBlitz = () => {
    setShowBlitzModal(true);
  };

  const triggerTranslate = () => {
    setShowTranslateModal(true);
  };

  const triggerReading = () => {
    setShowLanding(false);
    setView('reading');
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
      const keyLower = e.key.toLowerCase();

      if ((e.metaKey || e.ctrlKey) && keyLower === 'b') {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
        return;
      }

      if (e.shiftKey && keyLower === 'b') {
        e.preventDefault();
        triggerBlitz();
        return;
      }

      if (e.shiftKey && keyLower === 't') {
        e.preventDefault();
        triggerTranslate();
        return;
      }

      if (e.shiftKey && keyLower === 'r') {
        e.preventDefault();
        triggerReading();
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
    let interval: NodeJS.Timeout | null = null;
    let timeout: NodeJS.Timeout | null = null;

    try {
      setWaitingAuth(true);
      const backendUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:8787'
        : 'https://thepremium.onrender.com';

      const res = await fetch(`${backendUrl}/api/auth/session`);
      const sessionData = await res.json();
      const token = sessionData.token;

      if (!token) throw new Error('Sessiya tokeni olinmadi');

      const botUsername = 'Givacabbro_bot';
      // Telegram requires the start parameter to be passed as part of the deep link
      // Format: https://t.me/botname?start=PAYLOAD
      // The payload is automatically extracted by Telegram and passed to the bot
      const deepLink = `https://t.me/${botUsername}?start=${token}`;
      console.log(`🔗 Opening Telegram bot with link: ${deepLink}`);

      // Store token in sessionStorage as backup in case deep link fails
      sessionStorage.setItem('telegram_auth_token', token);

      window.open(deepLink, '_blank');

      interval = setInterval(async () => {
        try {
          console.log(`🔄 Polling session... (token: ${token.slice(0, 20)}...)`);
          const checkRes = await fetch(`${backendUrl}/api/auth/check-session/${token}`);
          const checkData = await checkRes.json();

          console.log("📡 Auth check response:", checkData);

          // Check if authenticated
          if (checkData?.authenticated === true && checkData?.user) {
            console.log("✅ Authentication successful!");
            if (interval) clearInterval(interval);
            if (timeout) clearTimeout(timeout);
            setWaitingAuth(false);

            const savedUser = checkData.user;
            const userData: TelegramUser = {
              id: savedUser.telegram_id,
              first_name: savedUser.first_name,
              last_name: savedUser.last_name,
              username: savedUser.username,
              photo_url: savedUser.photo_url,
              search_count: savedUser.search_count || 0,
              is_premium: savedUser.is_premium || false
            };
            console.log("💾 Saving user to localStorage:", userData);
            localStorage.setItem('vacabbro_user', JSON.stringify(userData));
            setCurrentUser(userData);
            setShowLanding(false);
          } else {
            console.log("⏳ Still waiting for Telegram auth...");
          }
        } catch (e) {
          console.error("❌ Auth polling error:", e);
        }
      }, 2000);

      timeout = setTimeout(() => {
        if (interval) clearInterval(interval);
        setWaitingAuth(false);
      }, 60000);

    } catch (err) {
      console.error(err);
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
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

    if (sessionCount >= maxAllowedLimit) {
      setShowLimitModal(true);
      return;
    }

    setLoading(true);

    try {
      const res = await analyzeWord({
        word: term,
        targetLanguageCode: langCode,
        targetLanguageLabel: langLabel
      });

      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      try {
        const saved = localStorage.getItem(limitStorageKey);
        const parsed = saved ? JSON.parse(saved) : { startTime: Date.now(), goal: dailyTarget, goalSet: isGoalSet };
        localStorage.setItem(limitStorageKey, JSON.stringify({ ...parsed, count: newCount }));
      } catch {}

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

  function handleConfirmGoal() {
    const val = parseInt(tempGoalInput, 10);
    if (!val || val <= 0) return;
    const clamped = Math.min(val, maxAllowedLimit);
    setDailyTarget(clamped);
    setIsGoalSet(true);

    try {
      const saved = localStorage.getItem(limitStorageKey);
      const parsed = saved ? JSON.parse(saved) : { startTime: Date.now(), count: sessionCount };
      localStorage.setItem(limitStorageKey, JSON.stringify({ ...parsed, goal: clamped, goalSet: true }));
    } catch {}
  }

  // Pronunciation handling
  const handlePronounce = () => {
    if (!normalized || !('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    if (speechUtterance) {
      window.speechSynthesis.cancel();
    }

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(normalized);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // For clarity

    utterance.onend = () => {
      setIsPlaying(false);
      setSpeechUtterance(null);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setSpeechUtterance(null);
    };

    setIsPlaying(true);
    setSpeechUtterance(utterance);
    window.speechSynthesis.speak(utterance);
  };

  // Consent handling
  const handleConsentAccept = () => {
    acceptCookieConsent(false); // We don't use analytics
    setShowConsentModal(false);
    handleTelegramLogin(); // Continue with Telegram login after consent
  };

  const handleConsentCancel = () => {
    setShowConsentModal(false);
  };

  const handleOpenTerms = () => {
    setShowLegalModal(true);
    // We'll open the LegalModal on the terms tab
    // We need to pass initialTab to LegalModal
    // We'll update LegalModal to accept an initialTab prop
    // For now, we'll just open it and the user can switch tabs.
    // We'll update LegalModal in a moment.
  };

  const handleOpenPrivacy = () => {
    setShowLegalModal(true);
    // Same as above
  };

  // New sign-up flow with consent
  const handleSignUpWithConsent = () => {
    if (hasValidCookieConsent()) {
      handleTelegramLogin();
    } else {
      setShowConsentModal(true);
    }
  };

  return (
    <div className="app-shell min-h-screen flex flex-col w-full overflow-x-hidden">
      <div className="app-background">
        <GradientWaves
          horizonColor="#051e3e"
          waveColor="#0d3b66"
          crestColor="#84cc16"
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
        onOpenGetMore={() => setShowGetMoreModal(true)}
        isAdmin={isAdmin}
      />

      <div
        className={`app-content relative z-10 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:pl-64' : 'lg:pl-12'
        }`}
      >
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        {!currentUser && (
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-2 flex justify-start">
            {!showLanding ? (
              <button
                type="button"
                onClick={() => setShowLanding(true)}
                className="px-3 py-1 rounded-full bg-slate-900/70 hover:bg-blue-900/70 border border-lime-400/20 text-[11px] font-mono text-lime-300 transition cursor-pointer"
              >
                ← Bosh sahifa
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowLanding(false)}
                className="px-3 py-1 rounded-full bg-blue-900/70 hover:bg-blue-800/70 border border-lime-400/30 text-[11px] font-mono text-lime-300 transition cursor-pointer"
              >
                Trainerga o'tish →
              </button>
            )}
          </div>
        )}

        {showLanding ? (
          <LandingPage
            onStart={handleTryFirstWord}
            onLogin={handleSignUpWithConsent} // Changed to use consent-aware sign-up
            isLoggedIn={Boolean(currentUser)}
            waitingAuth={waitingAuth}
          />
        ) : (
          <main className="page flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            {view !== 'reading' && (
              <section className="hero grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center mb-8 sm:mb-10">
              <div className="lg:col-span-7 flex flex-col items-start">
                <button
                  type="button"
                  className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 hover:bg-blue-900/60 border border-lime-400/15 text-xs font-mono text-lime-300 transition-all duration-200 mb-4 cursor-pointer"
                  onClick={handleTryFirstWord}
                >
                  <span className="text-lime-300">✦</span>
                  <span>Try your first word</span>
                  <span className="group-hover:translate-x-0.5 transition-transform text-lime-300/70">→</span>
                </button>

                <h1 className="w-full">
                  <WarpText
                    text={
                      currentUser?.first_name
                        ? `Ready to train,\n${currentUser.first_name}.`
                        : 'Vocabulary Lab\nActive.'
                    }
                    color="#84cc16"
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

              <div className="lg:col-span-5 w-full rounded-3xl bg-slate-950/85 backdrop-blur-xl border border-lime-400/15 p-5 sm:p-6 shadow-2xl flex flex-col justify-between min-h-[310px]">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-lime-300 pb-3 border-b border-lime-400/10 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                    Session Telemetry
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Realtime</span>
                </div>

                <div className="space-y-4">
                  {/* Usage Stats */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-mono text-slate-400">
                        Words Analyzed ({periodDays === 1 ? '1-day quota' : '2-day quota'})
                      </span>
                      <div className="flex items-baseline mt-1">
                        <span className="text-2xl font-bold font-mono text-slate-100">
                          {totalSearches}
                        </span>
                        <span className="text-xs font-mono text-slate-500 ml-1.5">/ {maxAllowedLimit}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-900/60 border border-lime-400/20 text-center">
                      <span className="text-[10px] font-mono text-lime-300 block font-bold">STATUS</span>
                      <span className="text-xs font-mono text-slate-100">
                        {isPremium ? 'Premium' : 'Free (2d/100w)'}
                      </span>
                    </div>
                  </div>

                  {/* Practice Goal */}
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
                      <span>Practice Goal</span>
                      <span className="text-slate-100 font-bold">
                        {isGoalSet ? `${progressPercent}%` : 'Set Goal'}
                      </span>
                    </div>

                    {!isGoalSet ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max={maxAllowedLimit}
                          value={tempGoalInput}
                          onChange={(e) => setTempGoalInput(e.target.value)}
                          placeholder={`Max ${maxAllowedLimit}`}
                          className="flex-1 px-3 py-2 bg-slate-900/60 border border-lime-400/30 rounded-xl text-slate-100 text-xs font-mono focus:outline-none focus:border-lime-400/50 focus:shadow-[0_0_10px_rgba(132,204,22,0.2)]"
                        />
                        <button
                          type="button"
                          onClick={handleConfirmGoal}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 hover:shadow-[0_0_15px_rgba(132,204,22,0.4)] text-slate-950 text-xs font-mono font-bold transition cursor-pointer"
                        >
                          Set Goal
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-full h-2.5 rounded-full bg-slate-900/60 border border-lime-400/10 overflow-hidden mt-2">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 via-lime-400 to-cyan-400 transition-all duration-500 rounded-full"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <div className="text-xs font-mono text-slate-500 mt-1.5">
                          Target: {dailyTarget} words • Locked for this period
                        </div>
                      </>
                    )}
                  </div>

                  {/* System Status */}
                  <div className="pt-3 border-t border-lime-400/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Recall Readiness</span>
                    <span className="px-2 py-0.5 rounded-full bg-lime-500/15 text-lime-300 border border-lime-400/30 text-[10px] font-bold">
                      Active System
                    </span>
                  </div>
                </div>
              </div>
            </section>
            )}

            <div className="flex flex-col gap-6 w-full">
              {/* Active Recall Warmup Widget */}
              {currentUser && !showLanding && view !== 'reading' && (
                <ActiveRecallWidget
                  onTryFirstWord={handleTryFirstWord}
                  onRestart={() => {
                    // Optional: handle widget restart if needed
                  }}
                />
              )}
              {view !== 'reading' && (
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
                  <div className="entered-line mt-3 flex items-baseline gap-2 text-xs font-mono text-slate-400">
                    You entered:{' '}
                    <strong className="text-slate-100">
                      {normalized || '—'}
                    </strong>
                    {/* Pronunciation Button */}
                    <button
                      onClick={handlePronounce}
                      disabled={!normalized || loading || !('speechSynthesis' in window)}
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                        isPlaying
                          ? 'bg-lime-500/20 text-lime-400 animate-pulse'
                          : 'bg-slate-900/60 text-slate-400 hover:bg-slate-900/70'
                      }`}
                      aria-label={isPlaying ? 'Stop pronunciation' : 'Pronounce word'}
                      title={isPlaying ? 'Stop pronunciation' : 'Pronounce word'}
                    >
                      {isPlaying ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5a9 9 0 11-4.5 18.5" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m7.072 0a5 5 0 01-7.072 0M4.464 4.464A5 5 0 003.393 11.527l-.392.392a1 1 0 001.414 1.414l.392.392a1 1 0 001.414-1.414l.392-.392A5 5 0 0111.527 3.393l.392-.392a1 1 0 00-1.414-1.414l-.392-.392z" />
                        </svg>
                      )}
                    </button>
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
              )}

              {loading && view !== 'reading' ? (
                <div className="fade-in w-full">
                  <AiLoader word={normalized || word} />
                </div>
              ) : null}


              {!loading && data && view !== 'reading' ? (
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
              {view === 'reading' && (
                <section id="reading-section" className="w-full">
                  <RetentionReading currentUser={currentUser} />
                </section>
              )}
            </div>
          </main>
        )}

        {showLanding ? null : (
          <Footer
            onOpenLegal={() => setShowLegalModal(true)}
            onOpenCookie={() => setShowCookieSettingsModal(true)}
          />
        )}
      </div>

      {showBlitzModal && (
        <WordBlitzModal onClose={() => setShowBlitzModal(false)} />
      )}

      {showTranslateModal && (
        <QuickTranslator onClose={() => setShowTranslateModal(false)} />
      )}

      {showLegalModal && (
        <LegalModal
          onClose={() => setShowLegalModal(false)}
        />
      )}

      {showConsentModal && (
        <ConsentModal
          mode="consent"
          onClose={handleConsentCancel}
          onAccept={handleConsentAccept}
          onOpenTerms={handleOpenTerms}
          onOpenPrivacy={handleOpenPrivacy}
        />
      )}

      {showCookieSettingsModal && (
        <ConsentModal
          mode="settings"
          onClose={() => setShowCookieSettingsModal(false)}
          onAccept={() => {}} // Just close the modal, no action needed
          onOpenTerms={handleOpenTerms}
          onOpenPrivacy={handleOpenPrivacy}
        />
      )}

      {showGetMoreModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm p-6 sm:p-7 rounded-3xl bg-slate-950 border border-lime-400/30 shadow-[0_0_40px_rgba(132,204,22,0.15)] text-center">
            <button
              onClick={() => setShowGetMoreModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-lime-300 transition text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-lime-500/10 cursor-pointer"
            >
              ✕
            </button>

            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-lime-500 border border-lime-400/30 flex items-center justify-center text-2xl shadow-lg">
              ⭐
            </div>

            <h3 className="text-xl font-bold text-lime-300 mb-1">
              UniveBooster VIP
            </h3>
            <p className="text-xs text-amber-300/80 font-mono mb-4">
              Maxsus Admin Tarifi
            </p>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-lime-400/15 text-left mb-6 space-y-2 text-xs font-mono text-slate-300">
              <div className="flex items-center justify-between">
                <span>Kunlik limit:</span>
                <span className="text-lime-300 font-bold">400 ta so'z</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Davomiylik:</span>
                <span className="text-slate-100 font-bold">1 kunlik sikl</span>
              </div>
              <div className="flex items-center justify-between">
                <span>AI Generator:</span>
                <span className="text-lime-300 font-bold">Cheklovsiz VIP</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (currentUser) {
                  const updated = { ...currentUser, is_premium: true };
                  setCurrentUser(updated);
                  localStorage.setItem('vacabbro_user', JSON.stringify(updated));
                }
                setShowGetMoreModal(false);
                alert('🎉 Premium muvaffaqiyatli faollashtirildi!');
                window.location.reload();
              }}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 hover:shadow-[0_0_25px_rgba(132,204,22,0.4)] text-slate-950 font-extrabold text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              🚀 Xarid qilish va Yoqish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}