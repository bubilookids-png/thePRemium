// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { ServerStatus } from './ServerStatus';
import { QuickTranslator } from './QuickTranslator';
import { WordBlitzModal } from './WordBlitzModal';

export function Header() {
  const [isTranslateOpen, setIsTranslateOpen] = useState(false);
  const [isBlitzOpen, setIsBlitzOpen] = useState(false);

  // 'Escape' tugmasi bosilganda barcha ochiq modallarni yopish
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsTranslateOpen(false);
        setIsBlitzOpen(false);
      }
    }

    if (isTranslateOpen || isBlitzOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTranslateOpen, isBlitzOpen]);

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner flex items-center justify-between">
          <div className="brand">
            <div className="brand-mark" aria-hidden="true">
              ✦
            </div>

            <div className="min-w-0">
              <h1 className="brand-title truncate">
                English Vocabulary Trainer
              </h1>

              <p className="brand-subtitle">
                AI-powered vocabulary lab
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* 1. Vocab Blitz O'yin Tugmasi */}
            <button
              type="button"
              onClick={() => setIsBlitzOpen(true)}
              className="group relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-pink-200 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 hover:border-pink-500/50 backdrop-blur-md transition-all duration-300 shadow-[0_0_15px_rgba(236,72,153,0.18)] hover:shadow-[0_0_22px_rgba(236,72,153,0.35)] active:scale-95"
            >
              <span className="text-pink-400 group-hover:scale-125 transition-transform duration-200">
                ⚡
              </span>
              <span className="tracking-wide">Vocab Blitz</span>
            </button>

            {/* 2. Quick Translate Tugmasi */}
            <button
              type="button"
              onClick={() => setIsTranslateOpen(true)}
              className="group relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-purple-200 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/50 backdrop-blur-md transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.18)] hover:shadow-[0_0_22px_rgba(168,85,247,0.35)] active:scale-95"
            >
              <span className="text-purple-400 group-hover:rotate-12 transition-transform duration-300">
                ✦
              </span>
              <span className="tracking-wide">Quick Translate</span>
            </button>

            {/* 3. Server Holati */}
            <ServerStatus />
          </div>
        </div>
      </header>

      {/* Quick Translate Modal */}
      {isTranslateOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity"
          onClick={() => setIsTranslateOpen(false)}
        >
          <div 
            className="relative w-full max-w-lg transition-transform animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsTranslateOpen(false)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800/90 text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-700 transition shadow-lg"
              aria-label="Close translate modal"
            >
              ✕
            </button>
            <QuickTranslator />
          </div>
        </div>
      )}

      {/* Vocab Blitz Game Modal */}
      {isBlitzOpen && (
        <WordBlitzModal onClose={() => setIsBlitzOpen(false)} />
      )}
    </>
  );
}