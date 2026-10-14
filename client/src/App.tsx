// src/App.tsx
import GradientWaves from './components/GradientWaves';
import WarpText from './components/WarpText';
import { ActiveRecallWidget } from './components/ActiveRecallWidget';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
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
import { CookieModal, hasGivenCookieConsent } from './components/CookieModal';
import { MySavedWords } from './components/MySavedWords';
import { SettingsView } from './components/SettingsView';
import { BotWarningModal } from './components/BotWarningModal';
import { hasValidCookieConsent, acceptCookieConsent } from './utils/consent';
import { detectBot } from './services/botDetection';
import { useAnimatedDismiss, useMotionEntrance } from './utils/motion';
import { ServerProvider } from './context/ServerContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

import type {
  AnalyzeResponse,
  SupportedLanguageCode
} from './types/vocab';

import { analyzeWord } from './services/vocabApi';

import {
  isLikelyValidTerm,
  normalizeTerm
} from './utils/string';

type View = 'analysis' | 'quiz' | 'reading' | 'saved-words' | 'settings';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  search_count?: number;
  is_premium?: boolean;
}

const HUD_STYLES = `
  @keyframes hudEnter {
    from { opacity: 0; transform: translateY(12px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes hudFillGrow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes hudShimmer {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes hudCountUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes hudBreath {
    0%, 100% { box-shadow: 0 0 0 0 rgba(132, 204, 22, 0.0); }
    50%      { box-shadow: 0 0 24px 0 rgba(132, 204, 22, 0.12); }
  }
  .hud-card {
    animation: hudEnter 600ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .hud-card:hover {
    animation: hudBreath 2.8s ease-in-out infinite;
  }
  .hud-fill {
    transform-origin: left center;
    animation: hudFillGrow 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .hud-shimmer {
    animation: hudShimmer 2.8s ease-in-out infinite;
  }
  .hud-count {
    animation: hudCountUp 500ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @media (prefers-reduced-motion: reduce) {
    .hud-card, .hud-fill, .hud-shimmer, .hud-count, .hud-card:hover {
      animation: none !important;
    }
  }
`;

function AppInner() {
  const { theme, bgAnimation } = useTheme();
  const { language, t } = useLanguage();

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
  const [showFirstTimeCookieModal, setShowFirstTimeCookieModal] = useState<boolean>(() => !hasGivenCookieConsent());

  const [word, setWord] = useState('');
  const [langCode, setLangCode] = useState<SupportedLanguageCode>('uz');
  const [langLabel, setLangLabel] = useState('Uzbek');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [view, setView] = useState<View>('analysis');
  const appContentRef = useRef<HTMLDivElement>(null);
  const vipOverlayRef = useRef<HTMLDivElement>(null);
  const vipPanelRef = useRef<HTMLDivElement>(null);

  const [waitingAuth, setWaitingAuth] = useState(false);
  const [isCheckingBot, setIsCheckingBot] = useState(false);
  const [botWarning, setBotWarning] = useState<{ isBot: boolean; botKind?: string } | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showGetMoreModal, setShowGetMoreModal] = useState(false);
  useMotionEntrance(appContentRef, `${showLanding}:${view}`, '[data-app-stage]');
  useMotionEntrance(vipPanelRef, showGetMoreModal);
  const dismissVip = useAnimatedDismiss(vipOverlayRef, vipPanelRef, () => setShowGetMoreModal(false));

  const MY_TELEGRAM_ID = 7462228079;
  const isAdmin = currentUser?.is_premium === true || currentUser?.id === MY_TELEGRAM_ID;
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
  const quotaRemaining = Math.max(0, maxAllowedLimit - totalSearches);
  const quotaPercent = Math.min(100, Math.round((totalSearches / maxAllowedLimit) * 100));

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

  const triggerSavedWords = () => {
    setShowLanding(false);
    setView('saved-words');
  };

  const triggerSettings = () => {
    setShowLanding(false);
    setView('settings');
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
        if (!showLanding) setIsSidebarOpen((prev) => !prev);
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

      if (e.shiftKey && keyLower === 's') {
        e.preventDefault();
        triggerSavedWords();
        return;
      }

      if (e.shiftKey && (keyLower === 'p' || keyLower === ',')) {
        e.preventDefault();
        triggerSettings();
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
  }, [word, showLanding]);

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
      const deepLink = `https://t.me/${botUsername}?start=${token}`;
      sessionStorage.setItem('telegram_auth_token', token);
      window.open(deepLink, '_blank');

      interval = setInterval(async () => {
        try {
          const checkRes = await fetch(`${backendUrl}/api/auth/check-session/${token}`);
          const checkData = await checkRes.json();

          if (checkData?.authenticated === true && checkData?.user) {
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
            localStorage.setItem('vacabbro_user', JSON.stringify(userData));
            setCurrentUser(userData);
            setShowLanding(false);
          }
        } catch (e) {
          console.error("Auth polling error:", e);
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

  const handlePronounce = () => {
    if (!normalized || !('speechSynthesis' in window)) return;

    if (speechUtterance) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(normalized);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;

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

  const runBotCheckAndLogin = async () => {
    setIsCheckingBot(true);
    try {
      const check = await detectBot();
      if (check.bot) {
        setBotWarning({ isBot: true, botKind: check.botKind });
        return;
      }
      handleTelegramLogin();
    } catch (err) {
      console.warn('[BotD] Error checking bot status, gracefully proceeding:', err);
      handleTelegramLogin();
    } finally {
      setIsCheckingBot(false);
    }
  };

  const handleConsentAccept = () => {
    acceptCookieConsent(false);
    setShowConsentModal(false);
    runBotCheckAndLogin();
  };

  const handleConsentCancel = () => {
    setShowConsentModal(false);
  };

  const handleOpenTerms = () => {
    setShowLegalModal(true);
  };

  const handleOpenPrivacy = () => {
    setShowLegalModal(true);
  };

  const handleSignUpWithConsent = () => {
    if (hasValidCookieConsent()) {
      runBotCheckAndLogin();
    } else {
      setShowConsentModal(true);
    }
  };

  return (
    <div className="app-shell min-h-screen flex flex-col w-full overflow-x-hidden">
      <style>{HUD_STYLES}</style>

      {/* Dynamic Background: WebGL wave simulation or static ambient backdrop */}
      <div className="app-background">
        {bgAnimation ? (
          <GradientWaves
            horizonColor={theme === 'cyber-violet' ? '#150326' : '#051e3e'}
            waveColor={theme === 'cyber-violet' ? '#2e0854' : '#0d3b66'}
            crestColor={theme === 'cyber-violet' ? '#ec4899' : '#84cc16'}
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
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 opacity-95">
            <div
              className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[140px] pointer-events-none"
              style={{
                background:
                  theme === 'cyber-violet'
                    ? 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(236,72,153,0.12) 60%, transparent 80%)'
                    : 'radial-gradient(circle, rgba(132,204,22,0.14) 0%, rgba(6,182,212,0.1) 60%, transparent 80%)',
              }}
            />
          </div>
        )}
      </div>

      {!showLanding && (
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
          onFocusSearch={focusSearchInput}
          onOpenBlitz={triggerBlitz}
          onOpenTranslate={triggerTranslate}
          onOpenReading={triggerReading}
          onOpenSavedWords={triggerSavedWords}
          onOpenSettings={triggerSettings}
          onOpenGetMore={() => setShowGetMoreModal(true)}
          isAdmin={isAdmin}
        />
      )}

      <div
        ref={appContentRef}
        className={`app-content relative z-10 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          showLanding ? '' : isSidebarOpen ? 'lg:pl-64' : 'lg:pl-12'
        }`}
      >
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
          onToggleSidebar={showLanding ? undefined : () => setIsSidebarOpen((prev) => !prev)}
          onLogoClick={() => {
            setShowLanding(false);
            setView('analysis');
          }}
        />

        {!currentUser && (
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-2 flex justify-start">
            {!showLanding ? (
              <button
                type="button"
                onClick={() => {
                  setIsSidebarOpen(false);
                  setShowLanding(true);
                }}
                className="group px-3 py-1.5 rounded-full bg-slate-900/70 hover:bg-slate-800/80 border border-lime-400/20 hover:border-lime-400/40 text-[11px] font-medium text-lime-300 transition-all duration-200 cursor-pointer active:scale-95"
              >
                <span className="inline-block transition-transform duration-200 group-hover:-translate-x-0.5">←</span> {t.home}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowLanding(false)}
                className="group px-3 py-1.5 rounded-full bg-slate-900/70 hover:bg-slate-800/80 border border-lime-400/30 hover:border-lime-400/50 text-[11px] font-medium text-lime-300 transition-all duration-200 cursor-pointer active:scale-95"
              >
                {t.goToTrainer} <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </button>
            )}
          </div>
        )}

        {showLanding ? (
          <LandingPage
            onStart={handleTryFirstWord}
            onLogin={handleSignUpWithConsent}
            isLoggedIn={Boolean(currentUser)}
            waitingAuth={waitingAuth || isCheckingBot}
          />
        ) : (
          <main className="page flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            {/* Hero & Study Progress section (shown only on vocabulary analysis view) */}
            {view !== 'reading' && view !== 'saved-words' && view !== 'settings' && (
              <section data-app-stage className="hero grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center mb-8 sm:mb-10">
                <div className="lg:col-span-7 flex flex-col items-start">
                  <button
                    type="button"
                    className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 hover:bg-slate-800/70 border border-lime-400/15 hover:border-lime-400/35 text-xs font-medium text-lime-300 transition-all duration-200 mb-4 cursor-pointer active:scale-95"
                    onClick={handleTryFirstWord}
                  >
                    <span className="text-lime-300 transition-transform duration-300 group-hover:rotate-12">✦</span>
                    <span>{t.tryFirstWord}</span>
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200 text-lime-300/70">→</span>
                  </button>

                  <h1 className="w-full">
                    <WarpText
                      text={
                        currentUser?.first_name
                          ? `${t.readyToTrain}${currentUser.first_name}.`
                          : t.vocabLabActive
                      }
                      color={theme === 'cyber-violet' ? '#f472b6' : '#84cc16'}
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

                {/* Study progress panel: all values are real app state */}
                <div className="hud-card lg:col-span-5 w-full rounded-3xl bg-slate-950/90 backdrop-blur-2xl border border-lime-400/20 p-5 sm:p-6 shadow-[0_0_40px_rgba(0,0,0,0.85)] relative overflow-hidden flex flex-col justify-between min-h-[330px] transition-colors duration-300 hover:border-lime-400/35">
                  {/* Header */}
                  <div className="relative z-10 flex items-center justify-between pb-3.5 border-b border-lime-400/15">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-100">{t.yourProgress}</h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {periodDays === 1 ? t.reset24 : t.reset48}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${
                      isPremium
                        ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                        : 'bg-cyan-500/10 text-cyan-300 border-cyan-400/30'
                    }`}>
                      {isPremium ? t.vipPlan : t.freePlan}
                    </span>
                  </div>

                  {/* Words analyzed + quota */}
                  <div className="relative z-10 py-4 space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                      <div className="flex items-end justify-between mb-3">
                        <div>
                          <span className="text-[11px] text-slate-400">{t.wordsAnalyzed}</span>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span key={totalSearches} className="hud-count text-3xl font-bold text-white tabular-nums">
                              {totalSearches}
                            </span>
                            <span className="text-xs text-slate-500">{t.ofWords} {maxAllowedLimit}</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400 tabular-nums">
                          {quotaRemaining} {t.leftWords}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="hud-fill h-full rounded-full bg-gradient-to-r from-lime-400 to-cyan-400"
                          style={{ width: `${quotaPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Daily goal */}
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-lime-400/15 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-200 font-medium">{t.dailyGoal}</span>
                        <span className="text-lime-300 font-semibold tabular-nums">
                          {isGoalSet ? `${progressPercent}%` : t.notSet}
                        </span>
                      </div>

                      {!isGoalSet ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              max={maxAllowedLimit}
                              value={tempGoalInput}
                              onChange={(e) => setTempGoalInput(e.target.value)}
                              placeholder={`Up to ${maxAllowedLimit}`}
                              className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs placeholder:text-slate-500 focus:outline-none focus:border-lime-400/60 focus:ring-2 focus:ring-lime-400/15 transition-all duration-200"
                            />
                            <button
                              type="button"
                              onClick={handleConfirmGoal}
                              className="px-3.5 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95"
                            >
                              {t.setGoal}
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 pt-0.5">
                            <span className="text-[10px] text-slate-500">{t.quickPick}</span>
                            {[20, 50, 100].map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => setTempGoalInput(String(Math.min(preset, maxAllowedLimit)))}
                                className="px-2 py-0.5 rounded-md text-[10px] bg-slate-950 border border-slate-700 hover:border-lime-400/40 text-slate-300 hover:text-lime-300 transition-all duration-200 cursor-pointer active:scale-95"
                              >
                                {preset}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-full h-2 rounded-full bg-slate-950 border border-lime-400/15 overflow-hidden relative">
                            <div
                              className="hud-fill h-full rounded-full bg-gradient-to-r from-blue-600 via-lime-400 to-cyan-300 relative transition-[width] duration-700 ease-out"
                              style={{ width: `${progressPercent}%` }}
                            >
                              <div className="hud-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>{t.goalWords}: {dailyTarget} words</span>
                            <span className="text-lime-300 font-medium tabular-nums">
                              {Math.max(0, dailyTarget - totalSearches)} {t.wordsToGo}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer status */}
                  <div className="relative z-10 pt-3 border-t border-lime-400/15 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      {isGoalSet && totalSearches >= dailyTarget
                        ? t.goalReached
                        : t.keepGoing}
                    </span>
                    {quotaRemaining === 0 && (
                      <span className="text-amber-300 font-medium">{t.limitReached}</span>
                    )}
                  </div>
                </div>
              </section>
            )}

            <div className="flex flex-col gap-6 w-full">
              {/* Active Recall Warmup Widget */}
              {currentUser && !showLanding && view !== 'reading' && view !== 'saved-words' && view !== 'settings' && (
                <ActiveRecallWidget
                  onTryFirstWord={handleTryFirstWord}
                  onRestart={() => {}}
                />
              )}

              {/* Word Analyzer Form */}
              {view !== 'reading' && view !== 'saved-words' && view !== 'settings' && (
                <div id="analyze-word-section" data-app-stage className="w-full">
                  <Card
                    title={t.analyzeTitle}
                    subtitle={t.analyzeSubtitle}
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
                    <div className="entered-line mt-3 flex items-center gap-2 text-xs text-slate-400">
                      <span>{t.youEntered}</span>
                      <strong className="text-slate-100 font-semibold">
                        {normalized || '—'}
                      </strong>
                      {/* Pronunciation Button */}
                      <button
                        onClick={handlePronounce}
                        disabled={!normalized || loading || !('speechSynthesis' in window)}
                        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 cursor-pointer active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed ${
                          isPlaying
                            ? 'bg-lime-500/20 text-lime-300 ring-2 ring-lime-400/30'
                            : 'bg-slate-900/60 text-slate-400 hover:text-lime-300 hover:bg-slate-800/80'
                        }`}
                        aria-label={t.pronounceWord}
                        title={t.pronounceWord}
                      >
                        {isPlaying ? (
                          <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

              {loading && view !== 'reading' && view !== 'saved-words' && view !== 'settings' ? (
                <div className="fade-in w-full">
                  <AiLoader word={normalized || word} />
                </div>
              ) : null}

              {!loading && data && view !== 'reading' && view !== 'saved-words' && view !== 'settings' ? (
                view === 'analysis' ? (
                  <AnalysisView
                    analysis={data.analysis}
                    source={data.source}
                    sources={data.sources}
                    onStartQuiz={() => setView('quiz')}
                    currentUser={currentUser}
                  />
                ) : (
                  <QuizView
                    quiz={data.quiz}
                    onBackToAnalysis={() => setView('analysis')}
                  />
                )
              ) : null}

              {/* Retention Reading View */}
              {view === 'reading' && (
                <section id="reading-section" data-app-stage className="w-full">
                  <RetentionReading currentUser={currentUser} />
                </section>
              )}

              {/* My Saved Words View */}
              {view === 'saved-words' && (
                <section id="saved-words-section" data-app-stage className="w-full">
                  <MySavedWords
                    currentUser={currentUser}
                    onBack={() => setView('analysis')}
                    onAnalyzeWord={(w) => {
                      setWord(w);
                      setView('analysis');
                      setTimeout(() => {
                        focusSearchInput();
                      }, 100);
                    }}
                    onOpenLogin={handleSignUpWithConsent}
                  />
                </section>
              )}

              {/* Settings View (Footer is inside SettingsView at the end!) */}
              {view === 'settings' && (
                <section id="settings-section" data-app-stage className="w-full">
                  <SettingsView
                    currentUser={currentUser}
                    onOpenLegal={handleOpenPrivacy}
                    onOpenCookie={() => setShowCookieSettingsModal(true)}
                    sessionCount={sessionCount}
                    maxAllowedLimit={maxAllowedLimit}
                    isPremium={isPremium}
                  />
                </section>
              )}
            </div>
          </main>
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

      {botWarning?.isBot && (
        <BotWarningModal
          botKind={botWarning.botKind}
          onClose={() => setBotWarning(null)}
          onRetry={() => {
            setBotWarning(null);
            runBotCheckAndLogin();
          }}
        />
      )}

      {/* First-Time Localized Cookie Policy Modal */}
      {showFirstTimeCookieModal && (
        <CookieModal
          onClose={() => setShowFirstTimeCookieModal(false)}
          onOpenLegal={handleOpenPrivacy}
        />
      )}

      {/* Cookie Settings Modal opened from Footer */}
      {showCookieSettingsModal && (
        <CookieModal
          onClose={() => setShowCookieSettingsModal(false)}
          onOpenLegal={handleOpenPrivacy}
        />
      )}

      {showGetMoreModal && isAdmin && (
        <div ref={vipOverlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div ref={vipPanelRef} className="relative w-full max-w-sm p-6 sm:p-7 rounded-3xl bg-slate-950 border border-lime-400/25 shadow-2xl text-center">
            <button
              onClick={() => dismissVip()}
              className="absolute top-4 right-4 text-slate-400 hover:text-lime-300 transition-all duration-200 text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800/80 cursor-pointer active:scale-90"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-lime-500 flex items-center justify-center text-2xl shadow-lg">
              ⭐
            </div>

            <h3 className="text-xl font-bold text-slate-100 mb-1">
              UniveBooster VIP
            </h3>
            <p className="text-xs text-amber-300/80 mb-4">
              Maxsus Admin Tarifi
            </p>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-left mb-6 space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span>Kunlik limit:</span>
                <span className="text-lime-300 font-semibold">400 ta so'z</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Davomiylik:</span>
                <span className="text-slate-100 font-semibold">1 kunlik sikl</span>
              </div>
              <div className="flex items-center justify-between">
                <span>AI Generator:</span>
                <span className="text-lime-300 font-semibold">Cheklovsiz VIP</span>
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
              className="w-full py-3.5 px-6 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-semibold text-sm shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              Activate VIP
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ServerProvider>
          <AppInner />
        </ServerProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}