import React, { useState, useEffect, useRef } from 'react';

type WordPair = {
  en: string;
  uz: string;
};

interface ActiveRecallWidgetProps {
  onRestart?: () => void;
  onTryFirstWord?: () => void;
}

export const ActiveRecallWidget: React.FC<ActiveRecallWidgetProps> = ({
  onRestart,
  onTryFirstWord
}) => {
  // Core state
  const [history, setHistory] = useState<WordPair[]>([]);
  const [selectedWords, setSelectedWords] = useState<WordPair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [rememberedCount, setRememberedCount] = useState(0);
  const [forgotCount, setForgotCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [cardScale, setCardScale] = useState(1);
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const flipRef = useRef<number>(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const pulseIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load history from localStorage
  useEffect(() => {
    const loadHistory = () => {
      const rawHistory = localStorage.getItem('vacabbro_history');
      if (rawHistory) {
        try {
          const parsed: WordPair[] = JSON.parse(rawHistory);
          setHistory(parsed);

          if (parsed.length >= 3) {
            const count = Math.min(5, Math.max(3, parsed.length));
            const shuffled = [...parsed].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, count);
            setSelectedWords(selected);
          }
        } catch (error) {
          console.error('Failed to parse history:', error);
          setHistory([]);
        }
      }
    };

    loadHistory();
  }, []);

  // Flip animation completion
  useEffect(() => {
    if (isFlipping) {
      const timeout = setTimeout(() => {
        setIsFlipping(false);
      }, 600);

      return () => clearTimeout(timeout);
    }
  }, [isFlipping]);

  // Pulse effect for active card
  useEffect(() => {
    pulseIntervalRef.current = setInterval(() => {
      setPulseIntensity(prev => (prev + 0.15) % (Math.PI * 2));
    }, 50);

    return () => {
      if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current);
    };
  }, []);

  // Clean up speech
  useEffect(() => {
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const currentWord = selectedWords[currentIndex];
  const progress = `${currentIndex + 1}/${selectedWords.length}`;
  const progressPercent = selectedWords.length > 0
    ? Math.round(((currentIndex + 1) / selectedWords.length) * 100)
    : 0;

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    flipRef.current = Date.now();
    setShowTranslation(!showTranslation);
    
    // Scale animation
    setCardScale(0.95);
    setTimeout(() => setCardScale(1), 300);
  };

  const handleRemembered = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRememberedCount(prev => prev + 1);
    
    // Pulse animation
    setCardScale(1.05);
    setTimeout(() => setCardScale(1), 200);
    
    handleNextWord();
  };

  const handleForgot = (e: React.MouseEvent) => {
    e.stopPropagation();
    setForgotCount(prev => prev + 1);
    
    // Shake animation
    if (cardRef.current) {
      cardRef.current.style.animation = 'shake 0.4s ease-in-out';
      setTimeout(() => {
        if (cardRef.current) cardRef.current.style.animation = '';
      }, 400);
    }
    
    handleNextWord();
  };

  const handleNextWord = () => {
    if (currentIndex < selectedWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowTranslation(false);
    } else {
      setSessionComplete(true);
      setTimeout(() => setIsMinimized(true), 2000);
    }
  };

  const handleRestart = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsRestarting(true);
    setCurrentIndex(0);
    setShowTranslation(false);
    setRememberedCount(0);
    setForgotCount(0);
    setIsMinimized(false);
    setSessionComplete(false);

    if (history.length >= 3) {
      const count = Math.min(5, Math.max(3, history.length));
      const shuffled = [...history].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);
      setSelectedWords(selected);
    }

    setTimeout(() => {
      setIsRestarting(false);
    }, 500);

    if (onRestart) onRestart();
  };

  const handleMinimize = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  const handlePronounce = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentWord || !('speechSynthesis' in window)) return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(currentWord.en);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  // Minimized state
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
        <style>{`
          @keyframes slideIn {
            from {
              transform: translateY(20px) scale(0.9);
              opacity: 0;
            }
            to {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
          }
          .animate-slideIn {
            animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
        `}</style>
        <button
          onClick={handleMaximize}
          className="group relative flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-lime-400/30 shadow-[0_0_20px_rgba(132,204,22,0.2)] hover:border-lime-400/60 hover:shadow-[0_0_30px_rgba(132,204,22,0.4)] transition-all duration-300 animate-slideIn hover:scale-105"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-lime-500/20 flex items-center justify-center text-xl animate-bounce">
              🧠
            </div>
            {selectedWords.length > 0 && currentIndex < selectedWords.length - 1 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-lime-400 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-slate-950 animate-pulse">
                !
              </div>
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-mono font-bold text-lime-400 uppercase tracking-widest">Active Recall</span>
            <span className="text-xs font-mono text-slate-100">
              {sessionComplete ? 'Warmup Complete' : `Progress: ${progress}`}
            </span>
          </div>
          <div className="ml-2 w-5 h-5 rounded-lg bg-slate-900 border border-lime-400/20 flex items-center justify-center text-lime-400 text-[10px] group-hover:bg-lime-500/20 transition-colors group-hover:scale-110">
            ↗
          </div>
        </button>
      </div>
    );
  }

  // Insufficient history
  if (history.length < 3) {
    return (
      <div className="w-full mb-8 animate-fadeIn">
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
        <div className="relative w-full p-6 sm:p-7 rounded-3xl bg-slate-950/80 border border-lime-400/20 shadow-[0_0_20px_rgba(132,204,22,0.1)] backdrop-blur-md overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-lime-500/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" />
              <h3 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-widest">Active Recall System</h3>
            </div>
            <button
              onClick={handleMinimize}
              className="text-slate-500 hover:text-lime-300 transition text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-lime-500/10 hover:scale-110 duration-200"
            >
              −
            </button>
          </div>

          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center animate-float">
              <span className="text-2xl">🧠</span>
            </div>
            <h4 className="text-slate-200 font-bold mb-2">Insufficient Word History</h4>
            <p className="text-xs text-slate-400 mb-6 max-w-xs mx-auto leading-relaxed">
              Analyze at least <span className="text-lime-400">3 words</span> to activate your personalized Active Recall warmup protocol.
            </p>
            <button
              onClick={onTryFirstWord}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 border border-lime-400/30 text-lime-300 font-mono text-xs font-bold hover:bg-lime-500/10 hover:scale-105 transition-all duration-300"
            >
              <span>Initialize Analysis</span>
              <span className="text-lime-400">→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedWords.length === 0) {
    return null;
  }

  // Main widget
  return (
    <div className={`w-full mb-8 animate-fadeIn ${isRestarting ? 'opacity-50' : ''}`}>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes flip {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(90deg); }
          100% { transform: rotateY(180deg); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(132, 204, 22, 0.2); }
          50% { box-shadow: 0 0 40px rgba(132, 204, 22, 0.4); }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-flip {
          animation: flip 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .animate-glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        .animate-slideUp {
          animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .preserve-3d {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>

      <div className="relative w-full p-6 rounded-3xl bg-slate-950/80 border border-lime-400/20 shadow-[0_0_30px_rgba(132,204,22,0.1)] backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-lime-400/10">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse" />
            <h3 className="text-sm font-mono font-bold text-lime-300 uppercase tracking-widest">Active Recall: Warmup</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleRestart}
              className="text-slate-400 hover:text-lime-300 transition w-8 h-8 flex items-center justify-center rounded-lg hover:bg-lime-500/10 hover:scale-110 duration-200"
              title="Restart session"
            >
              ⟲
            </button>
            <button
              onClick={handleMinimize}
              className="text-slate-400 hover:text-lime-300 transition w-8 h-8 flex items-center justify-center rounded-lg hover:bg-lime-500/10 hover:scale-110 duration-200"
              title="Minimize"
            >
              −
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Progress Section */}
          <div className="md:col-span-4 flex flex-col justify-center space-y-6">
            {/* Progress bars */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {selectedWords.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                      index < currentIndex
                        ? 'bg-lime-400 shadow-[0_0_8px_rgba(132,204,22,0.5)]'
                        : index === currentIndex
                          ? 'bg-lime-500/40 animate-pulse'
                          : 'bg-slate-900'
                    }`}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-900/50 transition-colors">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Sequence</span>
                <span className="text-xs text-slate-100 font-bold">{progress}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-900/50 transition-colors">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Recall Rate</span>
                <span className="text-xs text-lime-400 font-bold">
                  {rememberedCount + forgotCount > 0
                    ? `${Math.round((rememberedCount / (rememberedCount + forgotCount)) * 100)}%`
                    : '--%'}
                </span>
              </div>

              {/* Protocol status bar */}
              <div className="pt-3 border-t border-lime-400/10">
                <div className="text-[10px] text-slate-500 uppercase mb-3 tracking-widest font-bold">Protocol Status</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-slate-900 overflow-hidden border border-lime-400/10">
                    <div
                      className="h-full bg-gradient-to-r from-lime-400 to-cyan-400 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{progressPercent}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Flashcard */}
          <div className="md:col-span-8">
            <div
              ref={cardRef}
              className="relative w-full h-[240px] preserve-3d cursor-pointer group"
              onClick={handleFlip}
              style={{
                transform: `scale(${cardScale})`,
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {/* Front - English */}
              <div
                className={`absolute inset-0 backface-hidden bg-gradient-to-br from-slate-900/60 to-slate-950/40 border border-lime-400/10 rounded-2xl flex flex-col items-center justify-center p-6 hover:border-lime-400/30 transition-all duration-300 ${
                  showTranslation ? 'pointer-events-none opacity-0' : 'opacity-100'
                }`}
              >
                <div className="absolute top-3 left-4 text-[9px] font-mono text-slate-500 uppercase tracking-widest">Input Term</div>

                <div className="absolute top-3 right-4 text-[9px] font-mono text-slate-500">
                  {currentIndex + 1} of {selectedWords.length}
                </div>

                <div className="text-4xl font-bold text-slate-100 mb-6 tracking-tight select-none">
                  {currentWord.en}
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={handlePronounce}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                      isPlaying
                        ? 'bg-lime-500/30 text-lime-300 animate-pulse border border-lime-400/50'
                        : 'bg-slate-950/60 text-slate-400 hover:text-lime-300 border border-lime-400/10 hover:border-lime-400/30'
                    }`}
                    title="Pronounce word"
                  >
                    🔊
                  </button>
                </div>

                <div className="text-[11px] font-mono text-slate-500 animate-pulse">
                  ↻ Tap card to reveal translation
                </div>
              </div>

              {/* Back - Uzbek */}
              <div
                className={`absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-slate-900/80 to-slate-950/60 border border-lime-400/30 rounded-2xl flex flex-col items-center justify-center p-6 shadow-[inset_0_0_30px_rgba(132,204,22,0.08)] ${
                  showTranslation ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                <div className="absolute top-3 left-4 text-[9px] font-mono text-lime-500 uppercase tracking-widest font-bold">Output / Answer</div>

                <div className="text-4xl font-bold text-lime-300 mb-8 tracking-tight select-none animate-slideUp">
                  {currentWord.uz}
                </div>

                <div className="flex items-center gap-3 w-full max-w-xs">
                  <button
                    onClick={handleRemembered}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-lime-400/20 to-lime-300/10 border border-lime-400/40 text-lime-300 text-xs font-mono font-bold hover:from-lime-400 hover:to-lime-300 hover:text-slate-950 hover:border-lime-300 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                  >
                    <span>REMEMBERED</span>
                    <span className="text-[11px]">✦</span>
                  </button>
                  <button
                    onClick={handleForgot}
                    className="flex-1 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-400 text-xs font-mono font-bold hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                  >
                    <span>FORGOT</span>
                    <span className="text-[11px]">↺</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-lime-400/10">
          <div className="flex items-center gap-6 text-[10px] font-mono">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/30 hover:bg-slate-900/50 transition-colors">
              <span className="text-slate-500 uppercase tracking-widest">✓ Correct:</span>
              <span className="text-lime-400 font-bold text-sm">{rememberedCount}</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/30 hover:bg-slate-900/50 transition-colors">
              <span className="text-slate-500 uppercase tracking-widest">✕ Missed:</span>
              <span className="text-slate-400 font-bold text-sm">{forgotCount}</span>
            </div>
          </div>

          <button
            onClick={handleNextWord}
            disabled={currentIndex >= selectedWords.length - 1}
            className={`px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-widest ${
              currentIndex >= selectedWords.length - 1
                ? 'bg-slate-900/50 text-slate-600 cursor-not-allowed border border-slate-800'
                : 'bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-950 hover:shadow-[0_0_25px_rgba(132,204,22,0.5)] hover:scale-105 active:scale-95 transition-all'
            }`}
          >
            <span>{currentIndex >= selectedWords.length - 1 ? 'COMPLETED' : 'NEXT'}</span>
            {currentIndex < selectedWords.length - 1 && <span className="text-lg">→</span>}
          </button>
        </div>

        {/* Completion overlay */}
        {sessionComplete && (
          <div className="absolute inset-0 z-20 bg-slate-950/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-8 text-center animate-slideUp">
            <div className="w-24 h-24 mb-6 rounded-3xl bg-lime-500/15 border border-lime-400/30 flex items-center justify-center relative animate-bounce">
              <span className="text-5xl">🎯</span>
              <div className="absolute inset-0 rounded-3xl border border-lime-400/40 animate-ping" />
            </div>
            <h4 className="text-2xl font-bold text-lime-300 mb-3 font-mono uppercase tracking-widest">Analysis Complete</h4>
            <p className="text-sm text-slate-300 mb-8 max-w-xs leading-relaxed font-mono">
              Warmup initialized. System optimized.
              <br />
              <span className="text-lime-400 font-bold block mt-2">
                {rememberedCount}/{selectedWords.length} tokens verified
              </span>
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRestart}
                className="px-6 py-3 rounded-xl bg-slate-900 border border-lime-400/30 text-lime-300 font-mono text-xs font-bold hover:bg-lime-500/10 hover:scale-105 transition-all duration-300 active:scale-95"
              >
                RESTART
              </button>
              <button
                onClick={handleMinimize}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-950 font-mono text-xs font-bold hover:shadow-[0_0_25px_rgba(132,204,22,0.5)] hover:scale-105 transition-all duration-300 active:scale-95"
              >
                CLOSE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveRecallWidget;