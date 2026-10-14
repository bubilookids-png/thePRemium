import React, { useRef } from 'react';
import { useMotionEntrance } from '../utils/motion';

export const AiLoader = ({ word, onCancel }: { word: string; onCancel?: () => void }) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  useMotionEntrance(loaderRef, word);

  return (
    <div
      ref={loaderRef}
      role="status"
      aria-live="polite"
      className="relative overflow-hidden rounded-3xl bg-slate-950/90 border border-lime-400/15 p-8 sm:p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
    >
      <div
        aria-hidden="true"
        className="mx-auto mb-6 h-10 w-10 rounded-full border-2 border-lime-300/20 border-t-lime-300 animate-spin"
      />
      <h2 className="text-xl sm:text-2xl font-light text-slate-100 tracking-tight">
        Analyzing <span className="font-semibold text-lime-400">“{word}”</span>
      </h2>
      <p className="mt-3 text-sm font-light text-slate-400">
        Preparing your vocabulary study card…
      </p>
      {onCancel && (
        <button
          onClick={onCancel}
          className="mt-6 px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600 rounded-lg transition-colors duration-200"
        >
          Cancel
        </button>
      )}
    </div>
  );
};
