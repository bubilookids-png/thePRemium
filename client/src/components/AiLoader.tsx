import React, { useRef, useState, useEffect } from 'react';
import { useMotionEntrance } from '../utils/motion';
import { useLanguage } from '../context/LanguageContext';

interface AiLoaderProps {
  word: string;
  onCancel?: () => void;
}

const STAGES = {
  uz: [
    { title: "Lug'at bazasi va ta'riflar tahlil qilinmoqda...", hint: "Ingliz tili korpusidan ma'lumotlar olinmoqda" },
    { title: "CEFR darajasi va kontekstual birikmalar aniqlanmoqda...", hint: "Foydali misollar va tarjima shakllanmoqda" },
    { title: "Interaktiv test va grammatik qoidalar tayyorlanmoqda...", hint: "O'rganish kartasi yakunlanmoqda" }
  ],
  en: [
    { title: 'Consulting lexical corpus & definitions...', hint: 'Retrieving core lexical records and phonetics' },
    { title: 'Synthesizing CEFR level & contextual collocations...', hint: 'Generating precise translations and real-world usage' },
    { title: 'Formulating interactive quiz & recall patterns...', hint: 'Finalizing your personalized study card' }
  ]
};

export const AiLoader: React.FC<AiLoaderProps> = ({ word, onCancel }) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const stages = language === 'uz' ? STAGES.uz : STAGES.en;
  const [currentStage, setCurrentStage] = useState(0);

  useMotionEntrance(loaderRef, word);

  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStage(1), 1400);
    const t2 = setTimeout(() => setCurrentStage(2), 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [word]);

  const stage = stages[currentStage] || stages[0];

  return (
    <div
      ref={loaderRef}
      role="status"
      aria-live="polite"
      className="relative overflow-hidden rounded-3xl bg-slate-950/90 border border-lime-400/20 p-6 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-300"
    >
      {/* Header with active word and restrained animated ring */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 pb-6 border-b border-lime-400/10">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="relative flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-900 border border-lime-400/30 flex items-center justify-center shadow-inner">
            <div
              aria-hidden="true"
              className="absolute inset-1 rounded-xl border border-dashed border-lime-400/40 animate-[spin_8s_linear_infinite]"
            />
            <div
              aria-hidden="true"
              className="w-2.5 h-2.5 rounded-full bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.8)] animate-pulse"
            />
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-lime-400 px-2 py-0.5 rounded bg-lime-500/10 border border-lime-400/20">
                Analysis in Progress
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mt-1">
              Analyzing <span className="text-lime-300">“{word}”</span>
            </h2>
          </div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-mono font-medium text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 bg-slate-900/60 px-3.5 py-1.5 rounded-xl transition-colors duration-200 cursor-pointer self-center sm:self-start"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Real-time Stage Progression */}
      <div className="py-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-1.5 flex-1">
            {stages.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  idx <= currentStage
                    ? 'bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.4)]'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-slate-500 font-medium">
            Stage {currentStage + 1} of {stages.length}
          </span>
        </div>

        <div className="min-h-[44px] flex flex-col justify-center">
          <p className="text-sm font-medium text-slate-200 transition-all duration-300">
            {stage.title}
          </p>
          <p className="text-xs text-slate-400 font-mono mt-0.5 transition-all duration-300">
            {stage.hint}
          </p>
        </div>
      </div>

      {/* Structured Card Skeleton Preview */}
      <div
        aria-hidden="true"
        className="pt-4 border-t border-lime-400/10 space-y-3 opacity-70 select-none"
      >
        <div className="flex items-center gap-2">
          <div className="h-5 w-24 rounded-md bg-slate-800/80 animate-pulse" />
          <div className="h-5 w-14 rounded-md bg-slate-800/60 animate-pulse" />
          <div className="h-5 w-16 rounded-md bg-slate-800/40 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="h-3.5 w-full rounded bg-slate-800/70 animate-pulse" />
          <div className="h-3.5 w-4/5 rounded bg-slate-800/50 animate-pulse" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
          <div className="h-10 rounded-xl bg-slate-900/60 border border-slate-800/80 p-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-700 animate-pulse" />
            <div className="h-2.5 w-16 rounded bg-slate-800 animate-pulse" />
          </div>
          <div className="h-10 rounded-xl bg-slate-900/60 border border-slate-800/80 p-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-700 animate-pulse" />
            <div className="h-2.5 w-20 rounded bg-slate-800 animate-pulse" />
          </div>
          <div className="h-10 rounded-xl bg-slate-900/60 border border-slate-800/80 p-2 hidden sm:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-700 animate-pulse" />
            <div className="h-2.5 w-14 rounded bg-slate-800 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
