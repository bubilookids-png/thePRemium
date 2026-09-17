// src/components/Header.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ServerStatus } from './ServerStatus';
import { QuickTranslator } from './QuickTranslator';
import { WordBlitzModal } from './WordBlitzModal';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  search_count?: number;
}

interface HeaderProps {
  currentUser?: TelegramUser | null;
  onLogout?: () => void;
}

export function Header({ currentUser, onLogout }: HeaderProps) {
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

  useEffect(() => {
    const handleOpenBlitz = () => setIsBlitzOpen(true);
    const handleOpenTranslate = () => setIsTranslateOpen(true);

    window.addEventListener('vacabbro:open-blitz', handleOpenBlitz);
    window.addEventListener('vacabbro:open-translate', handleOpenTranslate);

    return () => {
      window.removeEventListener('vacabbro:open-blitz', handleOpenBlitz);
      window.removeEventListener('vacabbro:open-translate', handleOpenTranslate);
    };
  }, []);

  return (
    <>
      <header className="sticky top-2 sm:top-3 z-40 w-full px-3 sm:px-6 flex justify-center select-none">
        <div
          ref={headerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative flex items-center justify-between w-full max-w-4xl px-3 sm:px-4 py-1.5 rounded-full bg-[#02130e]/85 backdrop-blur-xl border border-[#F8E7C9]/15 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
        >
          {/* Emerald & Champagne Nuri */}
          <div
            className="hidden sm:block pointer-events-none absolute -inset-px rounded-full transition-opacity duration-500"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(130px circle at ${mousePos.x}px ${mousePos.y}px, rgba(248, 231, 201, 0.1), rgba(6, 78, 59, 0.25), transparent 80%)`,
            }}
          />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-1.5">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#064E3B] border border-[#F8E7C9]/30">
              <span className="text-[11px] font-black text-[#F8E7C9]">V</span>
            </div>
            <span className="text-xs font-bold tracking-wider text-[#F8E7C9] font-mono uppercase">
              VACABBRO
            </span>
          </div>

          {/* O'ng taraf: Blitz, Translate, ServerStatus va Mukammal Profil */}
          <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsBlitzOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-[#F8E7C9]/85 hover:text-[#F8E7C9] bg-[#062b21]/70 hover:bg-[#064E3B]/70 border border-[#F8E7C9]/15 transition active:scale-95 cursor-pointer"
            >
              <span className="text-[#10b981] text-[10px]">⚡</span>
              <span className="font-mono">Blitz</span>
            </button>

            <button
              type="button"
              onClick={() => setIsTranslateOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-[#F8E7C9]/85 hover:text-[#F8E7C9] bg-[#062b21]/70 hover:bg-[#064E3B]/70 border border-[#F8E7C9]/15 transition active:scale-95 cursor-pointer"
            >
              <span className="text-[#F8E7C9] text-[10px]">✦</span>
              <span className="font-mono">Translate</span>
            </button>

            <div className="scale-[0.75] origin-right">
              <ServerStatus />
            </div>

            {/* 🔥 MUKAMMAL TOP-RIGHT PROFIL */}
            {currentUser && (
              <div className="flex items-center gap-2 pl-2.5 ml-1 border-l border-[#F8E7C9]/15">
                {currentUser.photo_url ? (
                  <img
                    src={currentUser.photo_url}
                    alt={currentUser.first_name}
                    className="w-6 h-6 rounded-full object-cover border border-[#F8E7C9]/30"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#064E3B] border border-[#F8E7C9]/30 flex items-center justify-center text-[10px] font-bold text-[#F8E7C9] uppercase">
                    {currentUser.first_name ? currentUser.first_name.charAt(0) : 'U'}
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-[#F8E7C9] max-w-[90px] truncate">
                    {currentUser.first_name}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                </div>

                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="p-1 rounded-full text-[#F8E7C9]/40 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                    title="Chiqish"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                )}
              </div>
            )}
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