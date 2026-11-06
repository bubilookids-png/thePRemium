import React, { useState, useEffect, useRef } from 'react';
import { useAnimatedDismiss, useMotionEntrance } from '../utils/motion';
import { Card } from './Card';
import { apiFetch } from '../services/apiClient';
import { translateText } from '../services/translatorApi';
import { useTheme } from '../context/ThemeContext';

// --- Types ---
type Level = 'A2' | 'B1' | 'B2';
type Phase = 'selection' | 'setup' | 'reading' | 'recall' | 'evaluation' | 'review';

interface TextData {
  id: string;
  level: Level;
  title: string;
  content: string;
  keyConcepts: string[];
}

interface RetentionReadingProps {
  currentUser?: { id: number; is_premium?: boolean } | null;
  onExit?: () => void;
}

// Reading text data is loaded dynamically from Turso Cloud Database (/api/reading/articles)

// --- Minimalist Stroke SVG Icons (No Emojis) ---
function IconBrain({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
    </svg>
  );
}

function IconBook({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconClock({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconX({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconLogOut({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconVolume({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function IconBookmark({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconArrowLeft({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function IconSparkles({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
    </svg>
  );
}

function IconRotate({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

export function RetentionReading({ currentUser, onExit }: RetentionReadingProps) {
  const { theme } = useTheme();
  const isEditorial = theme === 'editorial-milk';
  const readingRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('selection');
  const [level, setLevel] = useState<Level | null>(null);
  const [currentText, setCurrentText] = useState<TextData | null>(null);
  const [availableArticles, setAvailableArticles] = useState<TextData[]>([]);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [extensions, setExtensions] = useState(0);

  // Recall & Eval State
  const [recallText, setRecallText] = useState('');
  const [score, setScore] = useState(0);
  const [matchedConcepts, setMatchedConcepts] = useState<string[]>([]);
  const [missedConcepts, setMissedConcepts] = useState<string[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Interaction State
  const [showTooltip, setShowTooltip] = useState<{ word: string; x: number; y: number } | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [wordSaved, setWordSaved] = useState(false);
  const [highlightConceptsInReview, setHighlightConceptsInReview] = useState(false);
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0); // -1, 0, +1

  const [loadingArticle, setLoadingArticle] = useState(false);
  const [selectedCardLevel, setSelectedCardLevel] = useState<Level | null>(null);
  const [articleError, setArticleError] = useState<string | null>(null);
  const articlesCacheRef = useRef<Record<string, TextData[]>>({});

  // Cognitive Analysis Terminal States
  const [evalTab, setEvalTab] = useState<'forensic' | 'matrix' | 'comparator'>('forensic');
  const [savingConcept, setSavingConcept] = useState<string | null>(null);
  const [savedConceptList, setSavedConceptList] = useState<string[]>([]);
  const [dossierCopied, setDossierCopied] = useState(false);
  const [recallDurationSec, setRecallDurationSec] = useState(0);

  // Exit Confirmation Modal State
  const [showExitModal, setShowExitModal] = useState(false);
  const exitOverlayRef = useRef<HTMLDivElement>(null);
  const exitPanelRef = useRef<HTMLDivElement>(null);
  useMotionEntrance(readingRef, phase, '[data-retention-phase]');
  useMotionEntrance(readingRef, evalTab, '[data-eval-panel]');
  useMotionEntrance(readingRef, `${showTooltip?.word ?? ''}:${translation ?? ''}:${translating}`, '[data-word-tooltip]');
  useMotionEntrance(exitPanelRef, showExitModal);
  const dismissExit = useAnimatedDismiss(exitOverlayRef, exitPanelRef, () => setShowExitModal(false));

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const activeWordRef = useRef<string | null>(null);

  useEffect(() => {
    return () => stopTimer();
  }, []);

  const startTimer = (seconds: number) => {
    stopTimer();
    setTimeLeft(seconds);
    setInitialTime(seconds);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Auto-transitions
  useEffect(() => {
    if (phase === 'reading' && timeLeft === 0 && initialTime > 0) {
      handleReadyToRecall();
    }
  }, [timeLeft, phase, initialTime]);

  useEffect(() => {
    if (phase === 'recall' && timeLeft === 0 && initialTime > 0) {
      handleSubmitRecall();
    }
  }, [timeLeft, phase, initialTime]);

  // Handle Safe Exit
  const handleTriggerExit = () => {
    if (phase === 'reading' || phase === 'recall') {
      setShowExitModal(true);
    } else {
      executeExit();
    }
  };

  const executeExit = () => {
    stopTimer();
    setShowExitModal(false);
    setShowTooltip(null);
    setRecallText('');
    setPhase('selection');
    if (onExit) onExit();
  };

  // Phase Handlers
  const handleSelectLevel = async (selectedLevel: Level) => {
    setSelectedCardLevel(selectedLevel);
    setLevel(selectedLevel);
    setLoadingArticle(true);
    setArticleError(null);

    // Instant switch if in client-side memory cache
    const cached = articlesCacheRef.current[selectedLevel];
    if (cached && cached.length > 0) {
      setAvailableArticles(cached);
      const randomText = cached[Math.floor(Math.random() * cached.length)];
      setCurrentText(randomText);
      setPhase('setup');
      setLoadingArticle(false);
      setSelectedCardLevel(null);
      return;
    }

    try {
      const res = await apiFetch<{ articles: TextData[] }>(`/api/reading/articles?level=${selectedLevel}`);
      if (res.articles && res.articles.length > 0) {
        articlesCacheRef.current[selectedLevel] = res.articles;
        setAvailableArticles(res.articles);
        const randomText = res.articles[Math.floor(Math.random() * res.articles.length)];
        setCurrentText(randomText);
        setPhase('setup');
        return;
      }
      setArticleError(`No articles found for Level ${selectedLevel}.`);
    } catch (err: any) {
      console.error('Failed to load articles:', err);
      setArticleError('Failed to fetch articles. Please check your connection.');
    } finally {
      setLoadingArticle(false);
      setSelectedCardLevel(null);
    }
  };

  const handleStartReading = () => {
    setPhase('reading');
    setExtensions(0);
    setInitialTime(180); // 3 minutes
    startTimer(180);
  };

  const handleExtendReading = () => {
    if (extensions < 1) {
      setExtensions((e) => e + 1);
      setTimeLeft((prev) => prev + 120);
      setInitialTime((prev) => prev + 120);
      if (timeLeft === 0) startTimer(120);
    }
  };

  const handleReadyToRecall = () => {
    stopTimer();
    setPhase('recall');
    setExtensions(0);
    setRecallText('');
    setInitialTime(240); // 4 minutes
    startTimer(240);
  };

  const handleSubmitRecall = async () => {
    const timeSpent = Math.max(1, initialTime - timeLeft);
    setRecallDurationSec(timeSpent);
    stopTimer();
    setIsEvaluating(true);
    await evaluateRecall(recallText);
    setIsEvaluating(false);
  };

  const evaluateRecall = async (text: string) => {
    if (!currentText) return;

    // Clean user text by lowercasing and replacing punctuation with spaces
    const cleanUserText = text.toLowerCase().replace(/[.,!?;:()\[\]{}"'\\\/—\-]/g, ' ');
    const userWords = cleanUserText.split(/\s+/).filter(Boolean);

    const matched: string[] = [];
    const missed: string[] = [];

    // Helper for fuzzy word matching (stem / root matching for plurals and suffixes)
    const matchesWord = (conceptWord: string, userWord: string) => {
      if (conceptWord === userWord) return true;
      if (conceptWord.length >= 4 && userWord.length >= 4) {
        const stemLength = Math.min(conceptWord.length, userWord.length, 5);
        if (conceptWord.slice(0, stemLength) === userWord.slice(0, stemLength)) {
          return true;
        }
      }
      return false;
    };

    currentText.keyConcepts.forEach((concept) => {
      const cleanConcept = concept.toLowerCase().replace(/[.,!?;:()\[\]{}"'\\\/—\-]/g, ' ').trim();
      
      // 1. Direct phrase match
      if (cleanUserText.includes(cleanConcept)) {
        matched.push(concept);
        return;
      }

      // 2. Word-level breakdown (key facts and names)
      const conceptWords = cleanConcept.split(/\s+/).filter((w) => w.length > 2);
      const hasMatch = conceptWords.length > 0
        ? conceptWords.some((cWord) => userWords.some((uWord) => matchesWord(cWord, uWord)))
        : userWords.some((uWord) => matchesWord(cleanConcept, uWord));

      if (hasMatch) {
        matched.push(concept);
      } else {
        missed.push(concept);
      }
    });

    const calculatedScore = Math.min(
      100,
      Math.max(0, Math.round((matched.length / Math.max(1, currentText.keyConcepts.length)) * 100))
    );
    setScore(calculatedScore);
    setMatchedConcepts(matched);
    setMissedConcepts(missed);
    setPhase('evaluation');

    if (currentUser?.id) {
      try {
        await apiFetch('/api/reading/session', {
          method: 'POST',
          body: JSON.stringify({
            telegram_id: currentUser.id,
            level: currentText.level,
            score: calculatedScore,
            words_recalled: userWords.length
          })
        });
      } catch (err) {
        console.error('Failed to save session', err);
      }
    }
  };

  // Dismiss tooltip when clicking anywhere outside
  useEffect(() => {
    if (!showTooltip) return;
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-word-tooltip]')) {
        setShowTooltip(null);
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [showTooltip]);

  // Word Interaction - Accessible in BOTH Reading and Review phases
  const handleWordClick = async (word: string, e: React.MouseEvent) => {
    if (phase !== 'reading' && phase !== 'review') return;

    const cleanWord = word.replace(/[.,!?;:"()]/g, '').toLowerCase();
    if (!cleanWord) return;

    activeWordRef.current = cleanWord;

    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    const POPUP_WIDTH = 280;
    const POPUP_HEIGHT = 160;

    // Viewport-relative coordinates (guaranteed zero container drift!)
    let x = rect.left + rect.width / 2 - POPUP_WIDTH / 2;
    let y = rect.bottom + 8;

    // Strict clamping within viewport with safe 16px margins
    if (x + POPUP_WIDTH > window.innerWidth - 16) {
      x = window.innerWidth - POPUP_WIDTH - 16;
    }
    if (x < 16) x = 16;

    // If popup would overflow bottom edge of viewport, flip it above the word
    if (y + POPUP_HEIGHT > window.innerHeight - 16) {
      y = Math.max(16, rect.top - POPUP_HEIGHT - 8);
    }

    setShowTooltip({ word: cleanWord, x, y });
    setTranslation(null);
    setTranslating(true);
    setWordSaved(false);

    try {
      const translationResult = await translateText(cleanWord, 'uz');
      if (activeWordRef.current !== cleanWord) return;

      if (translationResult) {
        setTranslation(translationResult);
      } else {
        setTranslation('Translation unavailable');
      }
    } catch {
      if (activeWordRef.current !== cleanWord) return;
      setTranslation('Error translating');
    } finally {
      if (activeWordRef.current === cleanWord) {
        setTranslating(false);
      }
    }
  };

  const playAudio = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const saveWord = async () => {
    if (!showTooltip || !translation || !currentUser?.id) return;
    try {
      await apiFetch('/api/saved-words', {
        method: 'POST',
        body: JSON.stringify({
          telegram_id: currentUser.id,
          english_word: showTooltip.word,
          translation,
          level: level || 'B1',
          source_feature: 'retention_reading'
        })
      });
      setWordSaved(true);
    } catch (err) {
      console.error('Failed to save word:', err);
    }
  };

  const handleSaveMissedConcept = async (concept: string) => {
    if (!currentUser?.id) {
      alert("So'zni Turso bazasiga saqlash uchun avval Telegram orqali kiring!");
      return;
    }
    try {
      setSavingConcept(concept);
      let uzTrans = '';
      try {
        const tr = await translateText(concept, 'uz');
        uzTrans = tr || concept;
      } catch {
        uzTrans = concept;
      }

      await apiFetch('/api/saved-words', {
        method: 'POST',
        body: JSON.stringify({
          telegram_id: currentUser.id,
          english_word: concept,
          translation: uzTrans,
          level: level || 'B1',
          source_feature: 'retention_reading'
        })
      });
      setSavedConceptList((prev) => [...prev, concept]);
    } catch (err) {
      console.error('Failed to save missed concept:', err);
    } finally {
      setSavingConcept(null);
    }
  };

  const handleCopyDossier = () => {
    if (!currentText) return;
    const report = `[UNIVEBOOSTER // COGNITIVE DOSSIER]\nArticle: "${currentText.title}" (Level ${currentText.level})\nRetention Accuracy: ${score}%\nConcepts Retained: ${matchedConcepts.length}/${currentText.keyConcepts.length} (${matchedConcepts.join(', ')})\nConcepts Omitted: ${missedConcepts.join(', ')}\nReconstruction Output: ${recallText.trim().split(/\s+/).filter(Boolean).length} words in ${recallDurationSec}s`;
    navigator.clipboard.writeText(report);
    setDossierCopied(true);
    setTimeout(() => setDossierCopied(false), 2000);
  };

  const getProgressWidth = () => {
    if (initialTime === 0) return '0%';
    return `${((initialTime - timeLeft) / initialTime) * 100}%`;
  };

  const isWarningTime = timeLeft <= 30 && timeLeft > 0;

  // Text font size modifier
  const readerFontClass = fontSizeOffset === -1 ? 'text-base leading-relaxed' : fontSizeOffset === 1 ? 'text-xl leading-[2.3]' : 'text-lg leading-[2]';

  return (
    <div ref={readingRef} className="w-full max-w-4xl mx-auto px-4 py-6 font-sans text-slate-200 select-none">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(163, 230, 53, 0.25); }
          50% { box-shadow: 0 0 30px rgba(163, 230, 53, 0.45); }
        }
        @keyframes urgentPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.02); }
        }
        .animate-retention-fade {
          animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .urgent-timer-glow {
          animation: urgentPulse 1s ease-in-out infinite;
        }
      `}</style>

      {/* --- Global Top Navigation Sub-Bar (Shown in all phases except Selection) --- */}
      {phase !== 'selection' && (
        <div
          className={`retention-subnav mb-6 flex items-center justify-between border-b pb-4 ${
            isEditorial ? 'border-[#1E2433]/15' : 'border-slate-800/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-lg shadow-sm ${
                isEditorial
                  ? 'bg-purple-100 border-2 border-[#1E2433] text-[#6D28D9]'
                  : 'bg-lime-400/10 border border-lime-400/30 text-lime-400'
              }`}
            >
              <IconBrain className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-black tracking-wider uppercase ${
                    isEditorial ? 'text-[#6D28D9]' : 'text-lime-400'
                  }`}
                >
                  Retention Studio
                </span>
                {level && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded ${
                      isEditorial
                        ? 'bg-purple-100 text-[#6D28D9] border border-[#1E2433]'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {level}
                  </span>
                )}
              </div>
              <p
                className={`text-xs font-medium truncate max-w-[200px] sm:max-w-xs ${
                  isEditorial ? 'text-[#475569]' : 'text-slate-400'
                }`}
              >
                {currentText?.title || 'Active Recall Exercise'}
              </p>
            </div>
          </div>

          {/* Stepper Indicator */}
          <div
            className={`hidden md:flex items-center gap-2 text-xs font-bold ${
              isEditorial ? 'text-[#64748B]' : 'text-slate-500'
            }`}
          >
            <span className={phase === 'setup' ? (isEditorial ? 'text-[#6D28D9] font-black' : 'text-lime-400 font-semibold') : ''}>Brief</span>
            <span>&rarr;</span>
            <span className={phase === 'reading' ? (isEditorial ? 'text-[#6D28D9] font-black' : 'text-lime-400 font-semibold') : ''}>Read</span>
            <span>&rarr;</span>
            <span className={phase === 'recall' ? (isEditorial ? 'text-[#6D28D9] font-black' : 'text-lime-400 font-semibold') : ''}>Recall</span>
            <span>&rarr;</span>
            <span className={phase === 'evaluation' || phase === 'review' ? (isEditorial ? 'text-[#6D28D9] font-black' : 'text-lime-400 font-semibold') : ''}>Evaluate</span>
          </div>

          {/* Leave Session Button */}
          <button
            onClick={handleTriggerExit}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isEditorial
                ? 'bg-white border-2 border-[#1E2433] text-[#1E2433] shadow-[2px_2px_0px_#1E2433] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-600'
                : 'border border-slate-700/80 bg-slate-900/60 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/10'
            }`}
            title="Leave session"
          >
            <IconLogOut className="w-3.5 h-3.5" />
            <span>Leave</span>
          </button>
        </div>
      )}

      {/* --- Phase 1: LEVEL SELECTION --- */}
      {phase === 'selection' && (
        <section data-retention-phase className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2 pt-4">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
                isEditorial
                  ? 'bg-purple-100 border-2 border-[#1E2433] text-[#6D28D9]'
                  : 'bg-lime-400/10 border border-lime-400/20 text-lime-400'
              }`}
            >
              <IconSparkles className="w-3.5 h-3.5" /> Active Retention Method
            </div>
            <h1
              className={`text-2xl sm:text-3xl font-black tracking-tight ${
                isEditorial ? 'text-[#1E2433] font-serif' : 'text-white font-extrabold'
              }`}
            >
              Select Reading Difficulty
            </h1>
            <p className={`text-sm max-w-md mx-auto ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
              Strengthen reading comprehension and cognitive retrieval through timed retention training.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 'A2' as Level,
                title: 'Elementary',
                words: '70–100 words',
                desc: 'Everyday vocabulary, direct facts, basic sentence structures.',
                time: '3 min read',
                tag: 'Foundation',
                accentColor: 'border-lime-500/30 hover:border-lime-400'
              },
              {
                id: 'B1' as Level,
                title: 'Intermediate',
                words: '130–170 words',
                desc: 'Historical context, compound clauses, technical nuances.',
                time: '3 min read',
                tag: 'Standard',
                accentColor: 'border-cyan-500/30 hover:border-cyan-400'
              },
              {
                id: 'B2' as Level,
                title: 'Advanced',
                words: '200–260 words',
                desc: 'Scientific concepts, dense syntax, analytical deductions.',
                time: '3 min read',
                tag: 'Rigorous',
                accentColor: 'border-lime-500/30 hover:border-lime-400'
              }
            ].map((lvl) => {
              const isSelected = selectedCardLevel === lvl.id;
              const isAnyLoading = loadingArticle && selectedCardLevel !== null;
              return (
                <div
                  key={lvl.id}
                  onClick={() => !loadingArticle && handleSelectLevel(lvl.id)}
                  className={`group relative rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    isEditorial
                      ? isSelected
                        ? 'bg-white border-2 border-[#1E2433] ring-2 ring-[#6D28D9] shadow-[8px_8px_0px_#1E2433] -translate-y-0.5'
                        : isAnyLoading
                        ? 'bg-slate-100 border-2 border-slate-300 opacity-50 pointer-events-none'
                        : 'bg-white hover:bg-[#FAF7F2] border-2 border-[#1E2433] shadow-[4px_4px_0px_#1E2433] hover:shadow-[6px_6px_0px_#1E2433] hover:-translate-y-0.5'
                      : isSelected
                      ? 'bg-slate-900 border border-lime-400 ring-2 ring-lime-400/30 shadow-[0_0_30px_rgba(163,230,53,0.2)] -translate-y-0.5'
                      : isAnyLoading
                      ? 'bg-slate-900/30 border border-slate-800 opacity-50 pointer-events-none'
                      : `bg-slate-900/50 hover:bg-slate-900/90 border ${lvl.accentColor} hover:-translate-y-0.5 shadow-sm hover:shadow-[0_0_25px_rgba(163,230,53,0.12)]`
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                          isEditorial
                            ? 'bg-purple-100 text-[#6D28D9] border-[#1E2433]'
                            : 'bg-slate-800 text-lime-400 border-lime-400/20'
                        }`}
                      >
                        Level {lvl.id}
                      </span>
                      <span className={`text-[11px] font-mono ${isEditorial ? 'text-[#64748B]' : 'text-slate-500'}`}>
                        {lvl.tag}
                      </span>
                    </div>
                    <h2
                      className={`text-base font-bold transition-colors ${
                        isEditorial
                          ? 'text-[#1E2433] font-serif font-black group-hover:text-[#6D28D9]'
                          : 'text-slate-100 group-hover:text-lime-300'
                      }`}
                    >
                      {lvl.title}
                    </h2>
                    <p className={`mt-2 text-xs leading-relaxed min-h-[48px] ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
                      {lvl.desc}
                    </p>
                  </div>

                  <div
                    className={`mt-5 pt-3 border-t flex items-center justify-between text-xs ${
                      isEditorial ? 'border-[#1E2433]/15' : 'border-slate-800/80'
                    }`}
                  >
                    <span className={`font-mono ${isEditorial ? 'text-[#64748B]' : 'text-slate-500'}`}>{lvl.words}</span>
                    <span
                      className={`flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform ${
                        isEditorial ? 'text-[#6D28D9] font-bold' : 'text-lime-400'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <span className="inline-block animate-spin text-xs">⟳</span>
                          <span>Preparing...</span>
                        </>
                      ) : (
                        <>
                          <span>Start</span> <IconArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className={`p-4 rounded-2xl text-xs flex items-start gap-3 ${
              isEditorial
                ? 'bg-white border-2 border-[#1E2433] shadow-[4px_4px_0px_#1E2433] text-[#334155]'
                : 'bg-slate-900/40 border border-slate-800 text-slate-400'
            }`}
          >
            <div
              className={`p-1.5 rounded-lg mt-0.5 ${
                isEditorial ? 'bg-purple-100 text-[#6D28D9] border border-[#1E2433]' : 'bg-slate-800 text-cyan-400'
              }`}
            >
              <IconBook className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className={`font-bold ${isEditorial ? 'text-[#1E2433]' : 'text-slate-300'}`}>
                How Retention Works:
              </span>{' '}
              You read without taking notes for 3 minutes. When the text hides, you actively write all concepts you recall from memory.
            </div>
          </div>
        </section>
      )}

      {/* --- Phase 2: SETUP / BRIEFING --- */}
      {phase === 'setup' && currentText && (
        <section data-retention-phase className="max-w-xl mx-auto space-y-6 pt-4">
          <div
            className={`rounded-2xl p-6 transition-all space-y-6 ${
              isEditorial
                ? 'bg-white border-2 border-[#1E2433] shadow-[6px_6px_0px_#1E2433] text-[#1E2433]'
                : 'bg-slate-900/60 border border-slate-800 shadow-lg backdrop-blur-sm'
            }`}
          >
            <div className={`flex items-center justify-between pb-4 border-b ${isEditorial ? 'border-[#1E2433]/15' : 'border-slate-800'}`}>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md ${
                    isEditorial
                      ? 'bg-purple-100 text-[#6D28D9] border-2 border-[#1E2433]'
                      : 'bg-lime-400/10 border border-lime-400/30 text-lime-400'
                  }`}
                >
                  {currentText.level}
                </span>
                <span className={`text-xs font-medium ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
                  Session Protocol
                </span>
              </div>
              <span className={`text-xs font-mono ${isEditorial ? 'text-[#64748B]' : 'text-slate-500'}`}>
                {currentText.content.split(/\s+/).length} words
              </span>
            </div>

            <div>
              <h2
                className={`text-xl font-bold mb-2 ${
                  isEditorial ? 'text-[#1E2433] font-serif font-black' : 'text-white'
                }`}
              >
                {currentText.title}
              </h2>
              <p className={`text-xs leading-relaxed ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
                You will be given uninterrupted time to read and comprehend the text. Focus on facts, mechanisms, and names.
              </p>
            </div>

            {/* Topic Selector / Shuffle Bar */}
            {availableArticles.length > 1 && (
              <div
                className={`p-3.5 rounded-xl space-y-2 ${
                  isEditorial
                    ? 'bg-[#FAF7F2] border-2 border-[#1E2433]'
                    : 'bg-slate-950/80 border border-lime-400/20'
                }`}
              >
                <div className={`flex items-center justify-between text-[11px] ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
                  <span className={`font-mono font-bold ${isEditorial ? 'text-[#6D28D9]' : 'text-lime-400'}`}>
                    ARTICLE {(availableArticles.findIndex((a) => a.id === currentText.id) + 1)} OF {availableArticles.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const curIdx = availableArticles.findIndex((a) => a.id === currentText.id);
                      const nextIdx = (curIdx + 1) % availableArticles.length;
                      setCurrentText(availableArticles[nextIdx]);
                    }}
                    className={`text-xs font-bold cursor-pointer flex items-center gap-1 transition ${
                      isEditorial ? 'text-[#6D28D9] hover:underline' : 'text-lime-400 hover:text-lime-300'
                    }`}
                  >
                    <span>🔀 Next Article</span>
                  </button>
                </div>
                <select
                  value={currentText.id}
                  onChange={(e) => {
                    const found = availableArticles.find((a) => a.id === e.target.value);
                    if (found) setCurrentText(found);
                  }}
                  className={`w-full rounded-lg px-2.5 py-2 text-xs font-medium focus:outline-none cursor-pointer ${
                    isEditorial
                      ? 'bg-white border-2 border-[#1E2433] text-[#1E2433] focus:border-[#6D28D9]'
                      : 'bg-slate-900 border border-slate-700/80 text-lime-300 focus:border-lime-400/60'
                  }`}
                >
                  {availableArticles.map((art, idx) => (
                    <option key={art.id} value={art.id}>
                      [{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}] {art.title} ({art.content.split(/\s+/).length} words)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div
              className={`space-y-3 p-4 rounded-xl text-xs ${
                isEditorial
                  ? 'bg-[#FAF7F2] border-2 border-[#1E2433] text-[#334155]'
                  : 'bg-slate-950/60 border border-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`flex items-center gap-2 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
                  <IconClock className={`w-3.5 h-3.5 ${isEditorial ? 'text-[#6D28D9]' : 'text-lime-400'}`} /> Reading Duration
                </span>
                <span className={`font-mono font-bold ${isEditorial ? 'text-[#1E2433]' : 'text-slate-200'}`}>3 minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`flex items-center gap-2 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
                  <IconBrain className={`w-3.5 h-3.5 ${isEditorial ? 'text-[#6D28D9]' : 'text-cyan-400'}`} /> Recall Duration
                </span>
                <span className={`font-mono font-bold ${isEditorial ? 'text-[#1E2433]' : 'text-slate-200'}`}>4 minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`flex items-center gap-2 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
                  <IconSparkles className={`w-3.5 h-3.5 ${isEditorial ? 'text-[#6D28D9]' : 'text-lime-400'}`} /> Target Key Points
                </span>
                <span className={`font-mono font-bold ${isEditorial ? 'text-[#1E2433]' : 'text-slate-200'}`}>{currentText.keyConcepts.length} concepts</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setPhase('selection')}
                className={`w-1/3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isEditorial
                    ? 'border-2 border-[#1E2433] bg-[#FAF7F2] text-[#1E2433] hover:bg-slate-100 shadow-[2px_2px_0px_#1E2433]'
                    : 'border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                }`}
              >
                Change Level
              </button>
              <button
                onClick={handleStartReading}
                style={isEditorial ? { backgroundColor: '#6D28D9', color: '#FFFFFF' } : undefined}
                className={`w-2/3 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                  isEditorial
                    ? 'bg-[#6D28D9] text-white border-2 border-[#1E2433] shadow-[4px_4px_0px_#1E2433] hover:bg-[#5B21B6]'
                    : 'bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_25px_rgba(163,230,53,0.45)]'
                }`}
              >
                <span className={isEditorial ? 'text-white' : undefined}>Begin Reading</span>
                <IconArrowRight className={`w-3.5 h-3.5 ${isEditorial ? 'text-white' : ''}`} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* --- Phase 3: READING --- */}
      {phase === 'reading' && currentText && (
        <section data-retention-phase className="max-w-2xl mx-auto space-y-4">
          {/* Reader HUD */}
          <div
            className={`sticky top-3 z-30 rounded-xl p-3 shadow-md transition-all ${
              isEditorial
                ? 'bg-white border-2 border-[#1E2433] shadow-[4px_4px_0px_#1E2433] text-[#1E2433]'
                : 'bg-slate-900/90 backdrop-blur-md border border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                    isEditorial
                      ? 'bg-purple-100 text-[#6D28D9] border-2 border-[#1E2433]'
                      : 'bg-slate-800 text-lime-400 border border-lime-400/20'
                  }`}
                >
                  {currentText.level}
                </span>
                <div
                  className={`flex items-center gap-1 border-l pl-2 ${
                    isEditorial ? 'border-[#1E2433]/20' : 'border-slate-800'
                  }`}
                >
                  <button
                    onClick={() => setFontSizeOffset((p) => Math.max(p - 1, -1))}
                    className={`px-1.5 py-0.5 text-[11px] font-mono rounded transition cursor-pointer ${
                      fontSizeOffset === -1
                        ? isEditorial
                          ? 'bg-[#1E2433] text-white font-bold'
                          : 'bg-slate-800 text-lime-400'
                        : isEditorial
                        ? 'text-[#475569] hover:bg-slate-100'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Smaller text"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSizeOffset((p) => Math.min(p + 1, 1))}
                    className={`px-1.5 py-0.5 text-[11px] font-mono rounded transition cursor-pointer ${
                      fontSizeOffset === 1
                        ? isEditorial
                          ? 'bg-[#1E2433] text-white font-bold'
                          : 'bg-slate-800 text-lime-400'
                        : isEditorial
                        ? 'text-[#475569] hover:bg-slate-100'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Larger text"
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* Timer HUD */}
              <div className="flex items-center gap-3">
                {extensions < 1 && timeLeft < 60 && (
                  <button
                    onClick={handleExtendReading}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition cursor-pointer ${
                      isEditorial
                        ? 'bg-purple-100 hover:bg-purple-200 text-[#6D28D9] border-2 border-[#1E2433]'
                        : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-400/30'
                    }`}
                  >
                    +2m
                  </button>
                )}

                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono font-bold text-sm ${
                    isWarningTime
                      ? 'bg-rose-500/10 text-rose-500 border-2 border-rose-500/40 urgent-timer-glow'
                      : isEditorial
                      ? 'bg-[#FAF7F2] text-[#6D28D9] border-2 border-[#1E2433] shadow-[2px_2px_0px_#1E2433]'
                      : 'bg-slate-950 text-lime-400 border border-slate-800'
                  }`}
                >
                  <IconClock className="w-3.5 h-3.5" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>

            {/* Glowing Linear Progress Bar */}
            <div
              className={`w-full h-1.5 rounded-full overflow-hidden mt-3 ${
                isEditorial ? 'bg-slate-100 border border-[#1E2433]/30' : 'bg-slate-950'
              }`}
            >
              <div
                className={`h-full transition-all duration-1000 ease-linear ${
                  isWarningTime
                    ? 'bg-rose-500'
                    : isEditorial
                    ? 'bg-[#6D28D9]'
                    : 'bg-gradient-to-r from-lime-400 to-cyan-400'
                }`}
                style={{ width: getProgressWidth() }}
              />
            </div>
          </div>

          {/* Reading Card */}
          <div
            className={`rounded-2xl p-6 sm:p-8 min-h-[360px] flex flex-col justify-between transition-all ${
              isEditorial
                ? 'bg-white border-2 border-[#1E2433] shadow-[6px_6px_0px_#1E2433] text-[#1E2433]'
                : 'bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm text-slate-200'
            }`}
          >
            <div>
              <h1
                className={`text-xl sm:text-2xl font-black mb-6 tracking-tight ${
                  isEditorial ? 'text-[#1E2433] font-serif' : 'text-white'
                }`}
              >
                {currentText.title}
              </h1>
              <div
                className={`select-text leading-relaxed ${readerFontClass} ${
                  isEditorial ? 'text-[#1E2433]' : 'text-slate-200'
                }`}
              >
                {currentText.content.split(' ').map((word, i) => (
                  <span
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWordClick(word, e);
                    }}
                    className={`inline-block mr-1.5 cursor-pointer rounded px-0.5 transition-colors ${
                      isEditorial
                        ? 'hover:bg-purple-100 hover:text-[#6D28D9]'
                        : 'hover:bg-cyan-500/10 hover:text-cyan-300'
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div
              className={`mt-8 pt-4 border-t flex items-center justify-between text-xs ${
                isEditorial
                  ? 'border-[#1E2433]/15 text-[#64748B]'
                  : 'border-slate-800/60 text-slate-500'
              }`}
            >
              <span className="font-mono">{currentText.keyConcepts.length} core concepts embedded</span>
              <button
                onClick={handleReadyToRecall}
                style={isEditorial ? { backgroundColor: '#6D28D9', color: '#FFFFFF' } : undefined}
                className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isEditorial
                    ? 'bg-[#6D28D9] text-white border-2 border-[#1E2433] shadow-[3px_3px_0px_#1E2433] hover:bg-[#5B21B6]'
                    : 'bg-lime-400 text-slate-950 hover:bg-lime-300 shadow-[0_0_15px_rgba(163,230,53,0.25)]'
                }`}
              >
                <span className={isEditorial ? 'text-white' : undefined}>Ready to Recall</span>
                <IconArrowRight className={`w-3.5 h-3.5 ${isEditorial ? 'text-white' : ''}`} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* --- Phase 4: RECALL --- */}
      {phase === 'recall' && (
        <section data-retention-phase className="max-w-2xl mx-auto space-y-4">
          {/* Header */}
          <div
            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
              isEditorial
                ? 'bg-white border-2 border-[#1E2433] shadow-[4px_4px_0px_#1E2433] text-[#1E2433]'
                : 'bg-slate-900/90 border border-slate-800 backdrop-blur-md'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`p-1.5 rounded-md ${
                  isEditorial
                    ? 'bg-purple-100 text-[#6D28D9] border-2 border-[#1E2433]'
                    : 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20'
                }`}
              >
                <IconBrain className="w-4 h-4" />
              </div>
              <div>
                <span className={`text-xs font-bold block ${isEditorial ? 'text-[#1E2433]' : 'text-white'}`}>
                  Active Recall Reconstruction
                </span>
                <span className={`text-[11px] ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
                  Type everything you remember from the text
                </span>
              </div>
            </div>

            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono font-bold text-sm ${
                isWarningTime
                  ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30 urgent-timer-glow'
                  : isEditorial
                  ? 'bg-[#FAF7F2] text-[#6D28D9] border-2 border-[#1E2433]'
                  : 'bg-slate-950 text-cyan-400 border border-slate-800'
              }`}
            >
              <IconClock className="w-3.5 h-3.5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Textarea Canvas */}
          <div className="relative">
            <textarea
              value={recallText}
              onChange={(e) => setRecallText(e.target.value)}
              disabled={isEvaluating}
              rows={10}
              placeholder="Start recalling facts, names, numbers, and relationships..."
              className={`w-full rounded-2xl p-5 text-sm sm:text-base resize-none transition-all leading-relaxed ${
                isEditorial
                  ? 'bg-white border-2 border-[#1E2433] shadow-[4px_4px_0px_#1E2433] text-[#1E2433] placeholder-[#94A3B8] focus:border-[#6D28D9] focus:outline-none'
                  : 'bg-slate-900/50 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/30'
              }`}
              autoFocus
            />

            <div
              className={`absolute bottom-3 right-4 flex items-center gap-3 text-xs font-mono px-2.5 py-1 rounded-md border ${
                isEditorial
                  ? 'bg-[#FAF7F2] text-[#475569] border-[#1E2433]/30'
                  : 'bg-slate-950/70 text-slate-500 border-slate-800 backdrop-blur-sm'
              }`}
            >
              <span>{recallText.trim() === '' ? 0 : recallText.trim().split(/\s+/).length} words</span>
              <span>{recallText.length} chars</span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleSubmitRecall}
              disabled={isEvaluating || recallText.trim().length === 0}
              style={isEditorial ? { backgroundColor: '#6D28D9', color: '#FFFFFF' } : undefined}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer ${
                isEditorial
                  ? 'bg-[#6D28D9] text-white border-2 border-[#1E2433] shadow-[4px_4px_0px_#1E2433] hover:bg-[#5B21B6] disabled:opacity-50'
                  : 'bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(163,230,53,0.25)] hover:shadow-[0_0_25px_rgba(163,230,53,0.4)] disabled:opacity-50'
              }`}
            >
              {isEvaluating ? (
                <>
                  <IconRotate className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating Concepts...</span>
                </>
              ) : (
                <>
                  <span className={isEditorial ? 'text-white' : undefined}>Submit Recall for Evaluation</span>
                  <IconArrowRight className={`w-3.5 h-3.5 ${isEditorial ? 'text-white' : ''}`} />
                </>
              )}
            </button>
          </div>
        </section>
      )}

      {/* --- Phase 5: JAW-DROPPING COGNITIVE ANALYSIS TERMINAL --- */}
      {phase === 'evaluation' && currentText && (() => {
        const recalledWordsList = recallText.trim().split(/\s+/).filter(Boolean);
        const recalledWordCount = recalledWordsList.length;
        const sourceWordsList = currentText.content.trim().split(/\s+/).filter(Boolean);
        const sourceWordCount = sourceWordsList.length;
        const reconstructionRatio = Math.min(100, Math.round((recalledWordCount / Math.max(1, sourceWordCount)) * 100));
        const wpm = recallDurationSec > 0 ? Math.round((recalledWordCount / recallDurationSec) * 60) : 0;
        
        const tier = score >= 75
          ? { label: 'SYNAPSE OVERDRIVE', color: 'text-lime-400', border: 'border-lime-400/40', bg: 'bg-lime-400/10', glow: 'rgba(163,230,53,0.4)', desc: 'Elite conceptual retention: core mental model preserved with structural accuracy.' }
          : score >= 45
          ? { label: 'PARTIAL RECONSTRUCTION', color: 'text-cyan-400', border: 'border-cyan-400/40', bg: 'bg-cyan-400/10', glow: 'rgba(34,211,238,0.4)', desc: 'Moderate retention: essential facts captured with minor omissions.' }
          : { label: 'COGNITIVE TRACE DECAY', color: 'text-rose-400', border: 'border-rose-400/40', bg: 'bg-rose-400/10', glow: 'rgba(244,63,94,0.4)', desc: 'Accelerated memory drift: prompt neural restudy recommended.' };

        const strokeDashoffset = 376.99 - (score / 100) * 376.99;

        // Render user recall text with forensic concept highlighting
        const renderForensicText = () => {
          if (!recallText.trim()) {
            return <span className="text-slate-600 italic">No recall text submitted.</span>;
          }

          const words = recallText.split(/\s+/);
          return (
            <div className="leading-relaxed text-sm sm:text-base font-sans select-text">
              {words.map((w, idx) => {
                const clean = w.toLowerCase().replace(/[.,!?;:"()]/g, '');
                const isMatched = clean.length > 2 && matchedConcepts.some((c) => {
                  const cLow = c.toLowerCase();
                  return cLow.includes(clean) || clean.includes(cLow) || (clean.length >= 4 && cLow.includes(clean.slice(0, 4)));
                });
                if (isMatched) {
                  return (
                    <span
                      key={idx}
                      className="inline-block mx-0.5 px-1.5 py-0.5 rounded font-bold bg-lime-400/20 text-lime-300 border border-lime-400/40 shadow-[0_0_10px_rgba(163,230,53,0.25)] transition-all"
                      title="Cognitive Anchor: Key Concept Matched"
                    >
                      {w}
                    </span>
                  );
                }
                return (
                  <span key={idx} className="text-slate-300 mx-0.5">
                    {w}
                  </span>
                );
              })}
            </div>
          );
        };

        return (
          <section data-retention-phase className="max-w-3xl mx-auto space-y-6 font-mono select-none">
            {/* Terminal Main Enclosure */}
            <div className="bg-slate-950/90 border border-lime-400/20 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
              {/* Sci-Fi Decorative Grid Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-lime-400/15 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-lime-400/20 via-cyan-400/10 to-slate-900 border border-lime-400/30 flex items-center justify-center text-lime-300 shadow-[0_0_15px_rgba(163,230,53,0.2)]">
                    <IconBrain className="w-5 h-5 text-lime-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                      <span className="text-[10px] font-bold tracking-widest text-lime-400 uppercase">
                        COGNITIVE RECONSTRUCTION AUDIT // VERIFIED
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {currentText.title}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900 text-lime-400 border border-lime-400/30">
                    LEVEL {currentText.level}
                  </span>
                  <button
                    onClick={handleCopyDossier}
                    className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-lime-400/40 text-slate-300 hover:text-lime-300 text-xs transition cursor-pointer flex items-center gap-1.5"
                    title="Copy full cognitive audit report"
                  >
                    <span>{dossierCopied ? '✓ Copied' : '📋 Copy Audit'}</span>
                  </button>
                </div>
              </div>

              {/* Holographic Diagnostic Centerpiece */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-900/40 border border-lime-400/15 rounded-2xl p-6 relative">
                {/* SVG Neon Circular Gauge */}
                <div className="md:col-span-5 flex flex-col items-center justify-center relative">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
                      {/* Track */}
                      <circle
                        cx="70"
                        cy="70"
                        r="60"
                        stroke="#1e293b"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      {/* Neon Dynamic Indicator */}
                      <circle
                        cx="70"
                        cy="70"
                        r="60"
                        stroke={score >= 75 ? '#a3e635' : score >= 45 ? '#22d3ee' : '#fb7185'}
                        strokeWidth="8"
                        strokeDasharray="376.99"
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        style={{
                          transition: 'stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          filter: `drop-shadow(0 0 10px ${tier.glow})`
                        }}
                      />
                    </svg>

                    {/* Gauge Internal Numerical Display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                        {score}
                        <span className="text-xl font-bold text-slate-400">%</span>
                      </span>
                      <span className="text-[10px] tracking-widest font-bold text-slate-400 uppercase mt-0.5">
                        RETENTION
                      </span>
                    </div>
                  </div>

                  <span className={`mt-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${tier.bg} ${tier.color} border ${tier.border}`}>
                    {tier.label}
                  </span>
                </div>

                {/* Cognitive Evaluation Summary & Narrative */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase font-bold text-slate-500 block mb-1">
                      NEURAL RETRIEVAL ASSESSMENT
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {score >= 75 ? 'Superior Conceptual Reconstruction' : score >= 45 ? 'Substantial Retrieval with Anchor Gaps' : 'Critical Semantic Attenuation'}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {tier.desc}
                    </p>
                  </div>

                  {/* Micro Progress Bar for Conceptual Coverage */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Core Conceptual Pillars:</span>
                      <span className="font-bold text-lime-400">
                        {matchedConcepts.length} / {currentText.keyConcepts.length} Retained
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-lime-400 to-cyan-400 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.round((matchedConcepts.length / Math.max(1, currentText.keyConcepts.length)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Analytical KPI Telemetry Pods */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6">
                <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">RECALL PACE</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-black text-cyan-400">{wpm}</span>
                    <span className="text-[10px] text-slate-400">WPM</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Output Velocity</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">OUTPUT VOLUME</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-black text-white">{recalledWordCount}</span>
                    <span className="text-[10px] text-slate-400">/ {sourceWordCount} words</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">{reconstructionRatio}% Reconstructed</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">CONCEPT YIELD</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-black text-lime-400">
                      {Math.round((matchedConcepts.length / Math.max(1, currentText.keyConcepts.length)) * 100)}%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Target Capture Rate</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">MEMORY HALF-LIFE</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-base font-bold text-amber-300">
                      {score >= 75 ? '72h Steady' : score >= 45 ? '18h Retrievable' : '4h High Drift'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Projected Stability</span>
                </div>
              </div>

              {/* Navigation Tabs for Deep Inspection */}
              <div className="mt-8 border-b border-lime-400/15 flex items-center justify-between pb-3">
                <div className="flex items-center gap-2 overflow-x-auto">
                  <button
                    onClick={() => setEvalTab('forensic')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      evalTab === 'forensic'
                        ? 'bg-lime-400 text-slate-950 shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                        : 'bg-slate-900/70 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>🔬 Forensic Text Inspector</span>
                  </button>

                  <button
                    onClick={() => setEvalTab('matrix')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      evalTab === 'matrix'
                        ? 'bg-lime-400 text-slate-950 shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                        : 'bg-slate-900/70 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>⚡ Concept Spectrum</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-lime-300 border border-lime-400/20">
                      {missedConcepts.length} Missed
                    </span>
                  </button>

                  <button
                    onClick={() => setEvalTab('comparator')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      evalTab === 'comparator'
                        ? 'bg-lime-400 text-slate-950 shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                        : 'bg-slate-900/70 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>⚖️ Dual Trace Comparator</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Forensic Recall Inspector */}
              {evalTab === 'forensic' && (
                <div data-eval-panel className="mt-5 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Reconstruction Forensic Transcript:</span>
                    <span className="text-lime-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-lime-400 inline-block shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
                      Highlighted tokens represent verified key concepts
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 min-h-[160px] max-h-[300px] overflow-y-auto leading-relaxed text-slate-200">
                    {renderForensicText()}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                    <span className="text-slate-500">Verified Conceptual Anchors:</span>
                    {matchedConcepts.length > 0 ? (
                      matchedConcepts.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-lime-500/10 text-lime-300 border border-lime-400/30 text-[11px] font-bold">
                          ✓ {c}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No conceptual anchors identified.</span>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Concept Matrix with Instant Save to Turso */}
              {evalTab === 'matrix' && (
                <div data-eval-panel className="mt-5 space-y-6">
                  {/* Missed Concepts with Turso Quick Save */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                        <IconX className="w-3.5 h-3.5 text-rose-400" />
                        Omitted Concepts ({missedConcepts.length})
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Click "+ Save Word" to inject straight to your Turso Database
                      </span>
                    </div>

                    {missedConcepts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {missedConcepts.map((concept, i) => {
                          const isAlreadySaved = savedConceptList.includes(concept);
                          const isSaving = savingConcept === concept;
                          return (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-rose-500/20 hover:border-rose-500/40 transition"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-rose-400 text-xs">✕</span>
                                <span className="text-xs font-bold text-slate-200 capitalize">
                                  {concept}
                                </span>
                              </div>

                              <button
                                onClick={() => handleSaveMissedConcept(concept)}
                                disabled={isAlreadySaved || isSaving}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                                  isAlreadySaved
                                    ? 'bg-lime-500/20 text-lime-300 border border-lime-400/30'
                                    : 'bg-slate-800 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/15'
                                }`}
                              >
                                {isSaving ? (
                                  <span>Saving...</span>
                                ) : isAlreadySaved ? (
                                  <span>✓ In Turso</span>
                                ) : (
                                  <span>+ Save Word</span>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-lime-500/10 border border-lime-400/30 text-lime-300 text-xs text-center font-bold">
                        🎉 Perfect Concept Coverage! Zero missed ideas.
                      </div>
                    )}
                  </div>

                  {/* Retained Concepts */}
                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <span className="text-xs font-bold text-lime-400 flex items-center gap-1.5">
                      <IconCheck className="w-3.5 h-3.5 text-lime-400" />
                      Retained Concepts ({matchedConcepts.length})
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {matchedConcepts.map((item, i) => (
                        <div
                          key={i}
                          className="px-3 py-1.5 rounded-xl bg-lime-500/10 border border-lime-400/20 text-lime-300 text-xs font-medium flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                          <span className="capitalize">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Dual Trace Comparator */}
              {evalTab === 'comparator' && (
                <div data-eval-panel className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Original */}
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-400 font-bold">
                        <span>ORIGINAL TEXT</span>
                        <span className="font-mono text-[10px]">{sourceWordCount} words</span>
                      </div>
                      <p className="leading-relaxed text-slate-300 select-text">
                        {currentText.content}
                      </p>
                    </div>
                  </div>

                  {/* Recall */}
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-cyan-300 font-bold">
                        <span>YOUR RECONSTRUCTION</span>
                        <span className="font-mono text-[10px]">{recalledWordCount} words</span>
                      </div>
                      <p className="leading-relaxed text-slate-200 select-text">
                        {recallText || <span className="text-slate-600 italic">No text provided.</span>}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tactical Actions Ribbon */}
              <div className="mt-8 pt-6 border-t border-lime-400/15 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => handleSelectLevel(level!)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <IconRotate className="w-3.5 h-3.5" />
                  <span>Next Text Challenge</span>
                </button>

                <button
                  onClick={() => setPhase('review')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-950 font-extrabold text-xs shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_25px_rgba(163,230,53,0.45)] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <IconBook className="w-3.5 h-3.5" />
                  <span>Inspect Full Text & Translate Words</span>
                </button>
              </div>
            </div>
          </section>
        );
      })()}

      {/* --- Phase 6: REVIEW & TRANSLATE --- */}
      {phase === 'review' && currentText && (
        <section
          data-retention-phase
          className="max-w-2xl mx-auto space-y-4"
        >
          {/* Review Action Bar */}
          <div
            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
              isEditorial
                ? 'bg-white border-2 border-[#1E2433] shadow-[4px_4px_0px_#1E2433] text-[#1E2433]'
                : 'bg-slate-900/90 border border-slate-800 backdrop-blur-md'
            }`}
          >
            <div>
              <span className={`text-xs font-bold block ${isEditorial ? 'text-[#1E2433]' : 'text-white'}`}>
                Analytical Text Review
              </span>
              <span className={`text-[11px] ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
                Click any word to translate to Uzbek
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setHighlightConceptsInReview(!highlightConceptsInReview)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  highlightConceptsInReview
                    ? isEditorial
                      ? 'bg-purple-100 text-[#6D28D9] border-2 border-[#1E2433]'
                      : 'bg-lime-400/10 text-lime-300 border-lime-400/40'
                    : isEditorial
                    ? 'bg-[#FAF7F2] text-[#475569] border border-[#1E2433]/30 hover:text-[#1E2433]'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                {highlightConceptsInReview ? 'Concepts On' : 'Highlight Concepts'}
              </button>
              <button
                onClick={() => setPhase('evaluation')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isEditorial
                    ? 'bg-white border-2 border-[#1E2433] text-[#1E2433] shadow-[2px_2px_0px_#1E2433] hover:bg-slate-50'
                    : 'bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700'
                }`}
              >
                Back to Score
              </button>
            </div>
          </div>

          {/* Interactive Text Display */}
          <div
            className={`rounded-2xl p-6 sm:p-8 transition-all ${
              isEditorial
                ? 'bg-white border-2 border-[#1E2433] shadow-[6px_6px_0px_#1E2433] text-[#1E2433]'
                : 'bg-slate-900/40 border border-slate-800 backdrop-blur-sm'
            }`}
          >
            <h2
              className={`text-lg font-bold mb-4 ${
                isEditorial ? 'text-[#1E2433] font-serif font-black' : 'text-white'
              }`}
            >
              {currentText.title}
            </h2>
            <div
              className={`text-base sm:text-lg leading-[2] ${
                isEditorial ? 'text-[#1E2433]' : 'text-slate-200'
              }`}
            >
              {currentText.content.split(' ').map((word, i) => {
                const clean = word.toLowerCase().replace(/[.,!?;:"()]/g, '');
                const isKeyConcept = currentText.keyConcepts.some((c) => c.toLowerCase().includes(clean) && clean.length > 2);

                return (
                  <span
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWordClick(word, e);
                    }}
                    className={`inline-block mr-1.5 cursor-pointer rounded px-0.5 transition-colors ${
                      highlightConceptsInReview && isKeyConcept
                        ? isEditorial
                          ? 'bg-purple-100 text-[#6D28D9] underline decoration-[#6D28D9] decoration-2 font-black'
                          : 'text-lime-300 underline decoration-lime-400/60 decoration-2 font-medium bg-lime-400/10'
                        : isEditorial
                        ? 'hover:bg-purple-100 hover:text-[#6D28D9]'
                        : 'hover:bg-cyan-500/10 hover:text-cyan-300'
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* --- Viewport-Anchored Fixed Translation Popover (Available across Reading & Review phases) --- */}
      {showTooltip && (
        <div
          data-word-tooltip
          className={`fixed z-[99999] rounded-2xl p-4 shadow-2xl flex flex-col gap-3 w-[280px] transition-all animate-in fade-in zoom-in-95 duration-150 ${
            isEditorial
              ? 'bg-white border-2 border-[#1E2433] shadow-[8px_8px_0px_#1E2433] text-[#1E2433]'
              : 'bg-slate-950/95 border border-slate-800 text-slate-100 backdrop-blur-md'
          }`}
          style={{ top: `${showTooltip.y}px`, left: `${showTooltip.x}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`flex items-center justify-between pb-2.5 border-b ${
              isEditorial ? 'border-[#1E2433]/15' : 'border-slate-800/80'
            }`}
          >
            <span
              className={`font-black text-base truncate pr-2 capitalize ${
                isEditorial ? 'text-[#1E2433] font-serif' : 'text-white'
              }`}
            >
              {showTooltip.word}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => playAudio(showTooltip.word)}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  isEditorial
                    ? 'text-[#1E2433] hover:bg-purple-100 border border-[#1E2433]/20'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-900'
                }`}
                title="Listen pronunciation"
              >
                <IconVolume className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setShowTooltip(null)}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  isEditorial
                    ? 'text-[#64748B] hover:text-[#1E2433] hover:bg-slate-100'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Close"
              >
                <IconX className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="text-sm min-h-[26px] flex items-center font-medium">
            {translating ? (
              <span
                className={`font-mono text-xs animate-pulse ${
                  isEditorial ? 'text-[#6D28D9]' : 'text-slate-500'
                }`}
              >
                Translating...
              </span>
            ) : (
              <span
                className={`font-bold ${
                  isEditorial ? 'text-[#6D28D9]' : 'text-lime-300'
                }`}
              >
                {translation}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={saveWord}
            disabled={wordSaved || !translation || translating}
            style={
              isEditorial
                ? {
                    backgroundColor: wordSaved ? '#D1FAE5' : '#6D28D9',
                    color: wordSaved ? '#065F46' : '#FFFFFF',
                  }
                : undefined
            }
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              wordSaved
                ? isEditorial
                  ? 'border-2 border-emerald-600'
                  : 'bg-lime-500/10 text-lime-400 border border-lime-400/30'
                : isEditorial
                ? 'border-2 border-[#1E2433] shadow-[3px_3px_0px_#1E2433] hover:bg-[#5B21B6] active:translate-x-0.5 active:translate-y-0.5'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {wordSaved ? (
              <>
                <IconCheck className={`w-3.5 h-3.5 ${isEditorial ? 'text-emerald-700' : 'text-lime-400'}`} />
                <span>Saved to Vocab</span>
              </>
            ) : (
              <>
                <IconBookmark className={`w-3.5 h-3.5 ${isEditorial ? 'text-white' : 'text-cyan-400'}`} />
                <span style={isEditorial ? { color: '#FFFFFF' } : undefined}>Save Word</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* --- Safe Exit Confirmation Modal --- */}
      {showExitModal && (
        <div
          ref={exitOverlayRef}
          className={`fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4 ${
            isEditorial ? 'bg-[#1E2433]/60' : 'bg-slate-950/80'
          }`}
        >
          <div
            ref={exitPanelRef}
            className={`rounded-2xl p-6 max-w-sm w-full space-y-4 ${
              isEditorial
                ? 'bg-white border-2 border-[#1E2433] shadow-[8px_8px_0px_#1E2433] text-[#1E2433]'
                : 'bg-slate-900 border border-slate-800 shadow-2xl'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isEditorial
                  ? 'bg-rose-100 text-rose-600 border-2 border-rose-300'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              <IconLogOut className="w-5 h-5" />
            </div>

            <div>
              <h3 className={`text-base font-bold ${isEditorial ? 'text-[#1E2433] font-serif font-black' : 'text-white'}`}>
                Leave Active Session?
              </h3>
              <p className={`text-xs mt-1 leading-relaxed ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
                If you leave now, your current timed reading and recall progress will not be saved.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => dismissExit()}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isEditorial
                    ? 'border-2 border-[#1E2433] bg-[#FAF7F2] text-[#1E2433] hover:bg-slate-100'
                    : 'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                Stay
              </button>
              <button
                onClick={() => dismissExit(executeExit)}
                className="flex-1 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Exit Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
