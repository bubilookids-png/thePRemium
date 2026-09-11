// src/components/Header.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ServerStatus } from './ServerStatus';
import { QuickTranslator } from './QuickTranslator';
import { WordBlitzModal } from './WordBlitzModal';

export function Header() {
  const [isTranslateOpen, setIsTranslateOpen] = useState(false);
  const [isBlitzOpen, setIsBlitzOpen] = useState(false);

  // Sichqoncha koordinatalari va hover holati
  const headerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

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
      {/* Suzuvchi (Floating Capsule) Kiber-Header */}
      <header className="sticky top-4 z-40 w-full px-4 sm:px-6 flex justify-center select-none">
        <div
          ref={headerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative flex items-center justify-between w-full max-w-5xl px-4 sm:px-5 py-2.5 rounded-full bg-slate-950/80 backdrop-blur-2xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-300"
        >
          {/* 1. MOUSE-FOLLOWING SPOTLIGHT GLOW (Sichqoncha orqasidan ergashuvchi kiber-nur) */}
          <div
            className="pointer-events-none absolute -inset-px rounded-full transition-opacity duration-500"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(180px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.22), rgba(56, 189, 248, 0.12), transparent 80%)`,
            }}
          />

          {/* 2. Dinamik Hoshiya Nuri (Sichqoncha yaqinlashganda ramkani yoritadi) */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full border border-purple-500/40 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              maskImage: `radial-gradient(140px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
              WebkitMaskImage: `radial-gradient(140px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
            }}
          />

          {/* Pastki nozik kiber-lazer nuri */}
          <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-purple-500/70 to-transparent pointer-events-none opacity-80" />

          {/* 3. Chap tomon: VACABBRO Kiber-Logosi */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[1px] shadow-[0_0_16px_rgba(168,85,247,0.45)] group-hover:shadow-[0_0_22px_rgba(168,85,247,0.7)] transition-shadow duration-300">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                <span className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300 font-black">
                  V
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black tracking-wider text-white font-mono uppercase bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text">
                VACABBRO
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                PRO
              </span>
            </div>
          </div>

          {/* 4. O'ng tomon: Interaktiv Kapsula Tugmalari va Status */}
          <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
            {/* Word Blitz */}
            <button
              type="button"
              onClick={() => setIsBlitzOpen(true)}
              className="group/btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-pink-500/20 border border-white/5 hover:border-pink-500/40 transition-all duration-200 active:scale-95 shadow-sm"
            >
              <span className="text-pink-400 group-hover/btn:scale-125 transition-transform duration-200">
                ⚡
              </span>
              <span className="hidden xs:inline tracking-wide font-mono text-[11px]">
                Blitz
              </span>
            </button>

            {/* Quick Translate */}
            <button
              type="button"
              onClick={() => setIsTranslateOpen(true)}
              className="group/btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-500/40 transition-all duration-200 active:scale-95 shadow-sm"
            >
              <span className="text-cyan-400 group-hover/btn:rotate-45 transition-transform duration-200">
                ✦
              </span>
              <span className="hidden xs:inline tracking-wide font-mono text-[11px]">
                Translate
              </span>
            </button>

            <div className="h-4 w-[1px] bg-white/10 mx-0.5 sm:mx-1" />

            {/* Server Status */}
            <div className="scale-90 sm:scale-95">
              <ServerStatus />
            </div>
          </div>
        </div>
      </header>

      {/* Modallar */}
      {isTranslateOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsTranslateOpen(false)}
        >
          <div 
            className="relative w-full max-w-lg animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsTranslateOpen(false)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-700 transition"
              aria-label="Close modal"
            >
              ✕
            </button>
            <QuickTranslator />
          </div>
        </div>
      )}

      {isBlitzOpen && (
        <WordBlitzModal onClose={() => setIsBlitzOpen(false)} />
      )}
    </>
  );
}