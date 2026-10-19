import React, { useState, useEffect, useRef } from 'react';
import { useMotionEntrance } from '../utils/motion';
import { useTheme } from '../context/ThemeContext';
import { apiFetch } from '../services/apiClient';
import { Volume2, RotateCcw, Check, X, ArrowRight, Brain } from 'lucide-react';

type WordPair = {
  en: string;
  uz: string;
};

interface ActiveRecallWidgetProps {
  currentUser?: { id: number; first_name?: string } | null;
  onRestart?: () => void;
  onTryFirstWord?: () => void;
}

export const ActiveRecallWidget: React.FC<ActiveRecallWidgetProps> = ({
  currentUser,
  onRestart,
  onTryFirstWord
}) => {
  const { theme } = useTheme();
  const isEditorial = theme === 'editorial-milk';
  const isSilver = theme === 'brushed-silver';

  const [loading, setLoading] = useState(true);
  const [savedWords, setSavedWords] = useState<WordPair[]>([]);
  const [selectedWords, setSelectedWords] = useState<WordPair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [rememberedCount, setRememberedCount] = useState(0);
  const [forgotCount, setForgotCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  useMotionEntrance(cardRef, `${selectedWords[currentIndex]?.en ?? 'empty'}:${showTranslation}`);

  // Fetch verified user saved words from API
  const fetchUserSavedWords = async () => {
    if (!currentUser?.id) {
      setLoading(false);
      setSavedWords([]);
      setSelectedWords([]);
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch<{ success: boolean; words: Array<{ english_word: string; translation: string }> }>(
        `/api/saved-words?telegram_id=${currentUser.id}`
      );

      if (res.words && res.words.length > 0) {
        const mapped: WordPair[] = res.words.map((w) => ({
          en: w.english_word,
          uz: w.translation
        }));
        setSavedWords(mapped);

        // Session uses 3 to 6 words from saved vocabulary
        const count = Math.min(6, Math.max(2, mapped.length));
        const shuffled = [...mapped].sort(() => 0.5 - Math.random()).slice(0, count);
        setSelectedWords(shuffled);
        setCurrentIndex(0);
        setShowTranslation(false);
        setRememberedCount(0);
        setForgotCount(0);
        setSessionComplete(false);
      } else {
        setSavedWords([]);
        setSelectedWords([]);
      }
    } catch (err) {
      console.error('Failed to load saved words for active recall:', err);
      setSavedWords([]);
      setSelectedWords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSavedWords();
  }, [currentUser?.id]);

  // Clean up speech synthesis
  useEffect(() => {
    return () => {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation();
    const wordToSpeak = selectedWords[currentIndex]?.en;
    if (!wordToSpeak || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(wordToSpeak);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;

    setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleFlip = () => {
    setShowTranslation((prev) => !prev);
  };

  const handleNextCard = (remembered: boolean) => {
    if (remembered) {
      setRememberedCount((c) => c + 1);
    } else {
      setForgotCount((c) => c + 1);
    }

    setShowTranslation(false);

    if (currentIndex + 1 < selectedWords.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setSessionComplete(true);
    }
  };

  const handleRestartSession = () => {
    if (savedWords.length > 0) {
      const count = Math.min(6, Math.max(2, savedWords.length));
      const shuffled = [...savedWords].sort(() => 0.5 - Math.random()).slice(0, count);
      setSelectedWords(shuffled);
      setCurrentIndex(0);
      setShowTranslation(false);
      setRememberedCount(0);
      setForgotCount(0);
      setSessionComplete(false);
    }
    if (onRestart) onRestart();
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full rounded-2xl bg-slate-950/70 border border-slate-800 p-5 flex items-center justify-center gap-3">
        <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
        <span className="text-xs font-mono text-slate-400">Loading Active Recall session...</span>
      </div>
    );
  }

  // Empty state: User has no saved words yet
  if (!loading && (!savedWords || savedWords.length === 0)) {
    return (
      <div className="w-full rounded-2xl bg-slate-950/80 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lime-400 flex-shrink-0">
              <Brain className="w-5 h-5 text-lime-400" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Active Recall
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-500 border border-slate-800">
                  0 Words Saved
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-md">
                Active Recall uses words you save. Analyze a word and click <strong className="text-lime-300">Save Word</strong> to build your recall deck.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onTryFirstWord}
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-lime-400/30 text-lime-300 font-mono text-xs font-bold hover:bg-lime-500/10 hover:border-lime-400/60 transition-all duration-200 cursor-pointer"
          >
            <span>Analyze a Word</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  const currentWord = selectedWords[currentIndex];

  // Session Completed State
  if (sessionComplete) {
    const total = selectedWords.length;
    const accuracy = total > 0 ? Math.round((rememberedCount / total) * 100) : 0;

    return (
      <div className="w-full rounded-2xl bg-slate-950/80 border border-lime-400/30 p-5 sm:p-6 backdrop-blur-md shadow-sm animate-fadeIn">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-lime-500/20 border border-lime-400/40 flex items-center justify-center text-lime-300 flex-shrink-0 font-bold">
              ✓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-lime-400">
                  Recall Warmup Complete
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-500/20 text-lime-200 font-bold">
                  {accuracy}% Accuracy
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                You remembered <span className="text-lime-300 font-bold">{rememberedCount}</span> of {total} words in this session.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRestartSession}
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-lime-400/40 text-lime-300 font-mono text-xs font-bold hover:bg-lime-500/15 transition-all duration-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Practice Again</span>
          </button>
        </div>
      </div>
    );
  }

  // Active Flashcard Session
  return (
    <div className="w-full rounded-2xl bg-slate-950/80 border border-lime-400/25 p-4 sm:p-5 backdrop-blur-md shadow-sm transition-all duration-200">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-lime-400/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Active Recall Warmup
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-lime-400/20 text-lime-400">
            {currentIndex + 1}/{selectedWords.length}
          </span>
        </div>

        <button
          type="button"
          onClick={handleRestartSession}
          className="text-slate-400 hover:text-lime-300 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
          title="Restart recall session"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Progress segment bar */}
      <div className="flex gap-1 mb-4">
        {selectedWords.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              idx < currentIndex
                ? 'bg-lime-400 shadow-[0_0_6px_rgba(163,230,53,0.4)]'
                : idx === currentIndex
                ? 'bg-lime-400/70'
                : 'bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Flashcard container */}
      <div
        ref={cardRef}
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFlip();
          }
        }}
        className="w-full min-h-[140px] rounded-xl bg-slate-900/60 border border-slate-800 hover:border-lime-400/35 p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none group relative"
      >
        <span className="absolute top-2.5 left-3 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
          {showTranslation ? 'Uzbek Translation' : 'English Word'}
        </span>

        <span className="absolute top-2.5 right-3 text-[10px] font-mono text-slate-500">
          Click to {showTranslation ? 'hide' : 'reveal'}
        </span>

        <div className="my-2">
          {!showTranslation ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                {currentWord?.en}
              </span>
              <button
                type="button"
                onClick={handlePronounce}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                  isPlaying
                    ? 'bg-lime-500/20 text-lime-300'
                    : 'bg-slate-800/80 text-slate-400 hover:text-lime-300'
                }`}
                title="Listen to pronunciation"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-2xl sm:text-3xl font-bold text-lime-300 tracking-tight animate-fadeIn">
              {currentWord?.uz}
            </span>
          )}
        </div>

        <span className="text-[10px] font-mono text-slate-500 mt-1">
          {showTranslation ? 'Did you recall this correctly?' : 'Tap card to check your recall'}
        </span>
      </div>

      {/* Action controls */}
      {showTranslation && (
        <div className="flex items-center gap-3 mt-3 animate-fadeIn">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNextCard(false);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Need Practice</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNextCard(true);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-lime-500/15 hover:bg-lime-500/25 border border-lime-400/40 text-lime-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-lime-500/10"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Remembered</span>
          </button>
        </div>
      )}
    </div>
  );
};
