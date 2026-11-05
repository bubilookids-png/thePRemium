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
  useEffect(() => {
    let mounted = true;

    async function loadWords() {
      if (!currentUser?.id) {
        if (mounted) {
          setLoading(false);
          setSavedWords([]);
          setSelectedWords([]);
        }
        return;
      }

      try {
        setLoading(true);
        const res = (await apiFetch(`/api/saved-words?telegram_id=${currentUser.id}`)) as any;
        if (!mounted) return;

        if (res?.success && Array.isArray(res.words)) {
          const pairs: WordPair[] = res.words
            .filter((w: any) => Boolean(w.english_word || w.word))
            .map((w: any) => ({
              en: (w.english_word || w.word || '').trim(),
              uz: (w.translation || '').trim()
            }))
            .filter((p: WordPair) => p.en.length > 0 && p.uz.length > 0);

          setSavedWords(pairs);
          // Pick up to 5 random words for this session
          const shuffled = [...pairs].sort(() => 0.5 - Math.random());
          setSelectedWords(shuffled.slice(0, 5));
        } else {
          setSavedWords([]);
          setSelectedWords([]);
        }
      } catch (err) {
        if (mounted) {
          setSavedWords([]);
          setSelectedWords([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadWords();

    return () => {
      mounted = false;
    };
  }, [currentUser?.id]);

  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation();
    const word = selectedWords[currentIndex]?.en;
    if (!word || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsPlaying(false);
    }
  };

  const handleFlip = () => {
    setShowTranslation((prev) => !prev);
  };

  const handleScore = (remembered: boolean) => {
    if (remembered) {
      setRememberedCount((c) => c + 1);
    } else {
      setForgotCount((c) => c + 1);
    }

    if (currentIndex + 1 < selectedWords.length) {
      setCurrentIndex((i) => i + 1);
      setShowTranslation(false);
    } else {
      setSessionComplete(true);
    }
  };

  const handleRestartSession = () => {
    const shuffled = [...savedWords].sort(() => 0.5 - Math.random());
    setSelectedWords(shuffled.slice(0, 5));
    setCurrentIndex(0);
    setShowTranslation(false);
    setRememberedCount(0);
    setForgotCount(0);
    setSessionComplete(false);
    onRestart?.();
  };

  // Loading state
  if (loading) {
    return (
      <div className={`w-full rounded-2xl p-5 flex items-center justify-center gap-3 ${
        isEditorial ? 'bg-white border-2 border-[#1E2433] shadow-[4px_4px_0px_#1E2433] text-[#1E2433]' : 'bg-slate-900 border border-slate-800'
      }`}>
        <span className={`w-2 h-2 rounded-full animate-pulse ${isEditorial ? 'bg-[#6D28D9]' : 'bg-lime-400'}`} />
        <span className={`text-xs font-mono font-medium ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>Loading Active Recall session...</span>
      </div>
    );
  }

  // Empty state: User has no saved words yet
  if (!loading && (!savedWords || savedWords.length === 0)) {
    return (
      <div className={`w-full rounded-2xl p-5 sm:p-6 transition-all ${
        isEditorial
          ? 'bg-white border-2 border-[#1E2433] shadow-[4px_4px_0px_#1E2433] text-[#1E2433]'
          : 'bg-slate-900/90 border border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold ${
              isEditorial ? 'bg-purple-100 border-2 border-[#1E2433] text-[#6D28D9]' : 'bg-slate-800 border border-slate-700 text-lime-400'
            }`}>
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                  isEditorial ? 'text-[#1E2433]' : 'text-slate-400'
                }`}>
                  Active Recall
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                  isEditorial ? 'bg-slate-100 border-[#1E2433] text-[#1E2433] font-bold' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  0 Words Saved
                </span>
              </div>
              <p className={`text-xs mt-1 max-w-md font-sans font-medium ${
                isEditorial ? 'text-[#334155]' : 'text-slate-300'
              }`}>
                Active Recall uses words you save. Analyze a word and click <strong className={isEditorial ? 'text-[#6D28D9]' : 'text-lime-300'}>Save Word</strong> to build your recall deck.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onTryFirstWord}
            className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              isEditorial
                ? 'bg-[#1E2433] text-white hover:bg-[#6D28D9] border-2 border-[#1E2433] shadow-[3px_3px_0px_#1E2433]'
                : 'bg-slate-900 border border-lime-400/30 text-lime-300 hover:bg-lime-500/10'
            }`}
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
      <div className={`w-full rounded-2xl p-5 sm:p-6 transition-all animate-fadeIn ${
        isEditorial
          ? 'bg-white border-2 border-[#1E2433] shadow-[5px_5px_0px_#1E2433] text-[#1E2433]'
          : 'bg-slate-900/90 border border-lime-400/30'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold ${
              isEditorial ? 'bg-emerald-100 border-2 border-[#1E2433] text-emerald-800' : 'bg-lime-500/20 border border-lime-400/40 text-lime-300'
            }`}>
              ✓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                  isEditorial ? 'text-[#1E2433]' : 'text-lime-400'
                }`}>
                  Recall Warmup Complete
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  isEditorial ? 'bg-purple-100 text-purple-950 border border-purple-300' : 'bg-lime-500/20 text-lime-200'
                }`}>
                  {accuracy}% Accuracy
                </span>
              </div>
              <p className={`text-xs mt-0.5 font-medium ${isEditorial ? 'text-[#475569]' : 'text-slate-300'}`}>
                You remembered <span className={`font-bold ${isEditorial ? 'text-[#6D28D9]' : 'text-lime-300'}`}>{rememberedCount}</span> of {total} words in this round.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRestartSession}
            className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              isEditorial
                ? 'bg-[#1E2433] text-white hover:bg-[#6D28D9] border-2 border-[#1E2433] shadow-[3px_3px_0px_#1E2433]'
                : 'bg-slate-900 border border-lime-400/40 text-lime-300 hover:bg-lime-500/15'
            }`}
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
    <div className={`w-full rounded-2xl p-4 sm:p-5 transition-all duration-200 ${
      isEditorial
        ? 'bg-white border-2 border-[#1E2433] shadow-[5px_5px_0px_#1E2433] text-[#1E2433]'
        : 'bg-slate-900/90 border border-lime-400/25'
    }`}>
      {/* Header bar */}
      <div className={`flex items-center justify-between pb-3 mb-3 border-b ${
        isEditorial ? 'border-[#E2E8F0]' : 'border-lime-400/10'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${isEditorial ? 'bg-[#6D28D9]' : 'bg-lime-400'}`} />
          <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
            isEditorial ? 'text-[#1E2433]' : 'text-slate-300'
          }`}>
            Active Recall Warmup
          </span>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-bold ${
            isEditorial ? 'bg-purple-100 border-purple-300 text-purple-900' : 'bg-slate-900 border-lime-400/20 text-lime-400'
          }`}>
            {currentIndex + 1}/{selectedWords.length}
          </span>
        </div>

        <button
          type="button"
          onClick={handleRestartSession}
          className={`text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer ${
            isEditorial ? 'text-[#475569] hover:text-[#1E2433]' : 'text-slate-400 hover:text-lime-300'
          }`}
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
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              idx < currentIndex
                ? isEditorial ? 'bg-[#6D28D9]' : 'bg-lime-400'
                : idx === currentIndex
                ? isEditorial ? 'bg-[#9333EA]' : 'bg-lime-400/70'
                : isEditorial ? 'bg-slate-200' : 'bg-slate-800'
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
        className={`w-full min-h-[140px] rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none group relative border-2 ${
          isEditorial
            ? 'bg-[#FAF7F2] border-[#1E2433] hover:bg-slate-50 shadow-[3px_3px_0px_#1E2433]'
            : 'bg-slate-900/60 border-slate-800 hover:border-lime-400/35'
        }`}
      >
        <span className={`absolute top-2.5 left-3 text-[10px] font-mono uppercase tracking-widest font-bold ${
          isEditorial ? 'text-[#6D28D9]' : 'text-slate-400'
        }`}>
          {showTranslation ? 'Uzbek Translation' : 'English Word'}
        </span>

        <span className={`absolute top-2.5 right-3 text-[10px] font-mono font-medium ${
          isEditorial ? 'text-[#475569]' : 'text-slate-400'
        }`}>
          Click to {showTranslation ? 'hide' : 'reveal'}
        </span>

        <div className="my-2">
          {!showTranslation ? (
            <div className="flex items-center gap-3">
              <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isEditorial ? 'text-[#1E2433] font-serif' : 'text-slate-100'
              }`}>
                {currentWord?.en}
              </span>
              <button
                type="button"
                onClick={handlePronounce}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
                  isEditorial
                    ? 'bg-purple-100 border-[#1E2433] text-[#6D28D9] hover:bg-purple-200'
                    : isPlaying
                    ? 'bg-lime-500/20 border-lime-400 text-lime-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-lime-300'
                }`}
                title="Listen to pronunciation"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight animate-fadeIn ${
              isEditorial ? 'text-[#6D28D9] font-serif' : 'text-lime-300'
            }`}>
              {currentWord?.uz}
            </span>
          )}
        </div>

        <p className={`text-[11px] font-mono font-medium mt-1 ${isEditorial ? 'text-[#475569]' : 'text-slate-400'}`}>
          {showTranslation
            ? 'Did you recall this before flipping?'
            : 'Think of the meaning, then click or press Space'}
        </p>
      </div>

      {/* Answer feedback buttons */}
      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={() => handleScore(false)}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
            isEditorial
              ? 'bg-white border-[#1E2433] text-rose-800 shadow-[3px_3px_0px_#1E2433] hover:bg-rose-50'
              : 'bg-slate-900 border-rose-500/30 text-rose-300 hover:bg-rose-500/10'
          }`}
        >
          <X className="w-4 h-4 text-rose-600" />
          <span>Forgot</span>
        </button>

        <button
          type="button"
          onClick={() => handleScore(true)}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
            isEditorial
              ? 'bg-[#1E2433] border-[#1E2433] text-white shadow-[3px_3px_0px_#1E2433] hover:bg-emerald-700'
              : 'bg-lime-500/20 border-lime-400/50 text-lime-200 hover:bg-lime-500/30'
          }`}
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Remembered</span>
        </button>
      </div>
    </div>
  );
};
