// src/components/Header.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ServerStatus } from './ServerStatus';
import { QuickTranslator } from './QuickTranslator';
import { WordBlitzModal } from './WordBlitzModal';

export function Header() {
  const [isTranslateOpen, setIsTranslateOpen] = useState(false);
  const [isBlitzOpen, setIsBlitzOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsTranslateOpen(false);
        setIsBlitzOpen(false);
      }
    }
    if (isTranslateOpen || isBlitzOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTranslateOpen, isBlitzOpen]);

  return (
    <>
      <header className="sticky top-2 sm:top-4 z-40 w-full px-2.5 sm:px-6 flex justify-center select-none">
        <div
          ref={headerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative flex items-center justify-between w-full max-w-5xl px-3 sm:px-5 py-2 rounded-full bg-slate-950/85 backdrop-blur-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.7)]"
        >
          {/* Mouse Nur (Desktop) */}
          <div
            className="hidden sm:block pointer-events-none absolute -inset-px rounded-full transition-opacity duration-500"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(160px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.2), rgba(56, 189, 248, 0.1), transparent 80%)`,
            }}
          />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                <span className="text-[11px] sm:text-xs text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300 font-black">
                  V
                </span>
              </div>
            </div>
            <span className="text-xs sm:text-sm font-black tracking-wider text-white font-mono uppercase">
              VACABBRO
            </span>
          </div>

          {/* Tugmalar paneli */}
          <div className="relative z-10 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsBlitzOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] font-semibold text-slate-300 hover:text-white bg-white/5 border border-white/5 active:scale-95"
            >
              <span className="text-pink-400">⚡</span>
              <span className="hidden sm:inline font-mono">Blitz</span>
            </button>

            <button
              type="button"
              onClick={() => setIsTranslateOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] font-semibold text-slate-300 hover:text-white bg-white/5 border border-white/5 active:scale-95"
            >
              <span className="text-cyan-400">✦</span>
              <span className="hidden sm:inline font-mono">Translate</span>
            </button>

            <div className="scale-75 sm:scale-90 origin-right">
              <ServerStatus />
            </div>
          </div>
        </div>
      </header>

      {/* Modallar */}
      {isTranslateOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md"
          onClick={() => setIsTranslateOpen(false)}
        >
          <div className="relative w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <QuickTranslator />
          </div>
        </div>
      )}

      {isBlitzOpen && <WordBlitzModal onClose={() => setIsBlitzOpen(false)} />}
    </>
  );
}