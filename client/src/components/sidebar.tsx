// src/components/Sidebar.tsx
import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onFocusSearch: () => void;
  onOpenBlitz: () => void;
  onOpenTranslate: () => void;
  onOpenReading: () => void;
  onOpenGetMore?: () => void;
  isAdmin?: boolean;
}

export function Sidebar({
  isOpen,
  onToggle,
  onFocusSearch,
  onOpenBlitz,
  onOpenTranslate,
  onOpenReading,
  onOpenGetMore,
  isAdmin = false
}: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col justify-between
          bg-[#02130e]/95 backdrop-blur-2xl border-r border-[#F8E7C9]/15 shadow-[10px_0_30px_rgba(0,0,0,0.4)] select-none
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-12'}
        `}
      >
        <div className="flex flex-col">
          <div className="h-14 flex items-center justify-between px-2 border-b border-[#F8E7C9]/10">
            {isOpen ? (
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="min-w-[28px] h-[28px] rounded-lg bg-gradient-to-tr from-[#064E3B] to-[#10b981] border border-[#F8E7C9]/30 flex items-center justify-center text-xs shadow-md">
                  ✦
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold tracking-wider text-[#F8E7C9]">
                    UniveBooster
                  </span>
                  <span className="text-[9px] font-mono text-[#F8E7C9]/50">
                    Workspace
                  </span>
                </div>
              </div>
            ) : null}

            <button
              type="button"
              onClick={onToggle}
              className={`p-1.5 rounded-lg text-[#F8E7C9]/70 hover:text-[#F8E7C9] hover:bg-[#062b21]/70 transition active:scale-95 cursor-pointer ${
                !isOpen ? 'mx-auto' : ''
              }`}
              title={isOpen ? "Sidebarni toraytirish" : "Sidebarni kengaytirish"}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </button>
          </div>

          <div className="p-1 flex flex-col gap-1.5 mt-2">
            <button
              type="button"
              onClick={onFocusSearch}
              className={`group flex items-center p-2 rounded-xl transition cursor-pointer active:scale-[0.98] ${
                isOpen ? 'justify-between hover:bg-[#064E3B]/40 px-2.5' : 'justify-center hover:bg-[#064E3B]/40 w-full'
              }`}
              title="New Lookup"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#10b981]">🔍</span>
                {isOpen && <span className="text-xs font-mono text-[#F8E7C9] font-medium whitespace-nowrap">New Lookup</span>}
              </div>
              {isOpen && <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#02130e] border border-[#F8E7C9]/20 text-[#F8E7C9]/60">/</kbd>}
            </button>

            <button
              type="button"
              onClick={onOpenBlitz}
              className={`group flex items-center p-2 rounded-xl transition cursor-pointer active:scale-[0.98] ${
                isOpen ? 'justify-between hover:bg-[#064E3B]/40 px-2.5' : 'justify-center hover:bg-[#064E3B]/40 w-full'
              }`}
              title="Word Blitz"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#10b981]">⚡</span>
                {isOpen && <span className="text-xs font-mono text-[#F8E7C9] font-medium whitespace-nowrap">Word Blitz</span>}
              </div>
              {isOpen && <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#02130e] border border-[#F8E7C9]/20 text-[#F8E7C9]/60">⇧B</kbd>}
            </button>

            <button
              type="button"
              onClick={onOpenTranslate}
              className={`group flex items-center p-2 rounded-xl transition cursor-pointer active:scale-[0.98] ${
                isOpen ? 'justify-between hover:bg-[#064E3B]/40 px-2.5' : 'justify-center hover:bg-[#064E3B]/40 w-full'
              }`}
              title="Translator"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#F8E7C9]">✦</span>
                {isOpen && <span className="text-xs font-mono text-[#F8E7C9] font-medium whitespace-nowrap">Translator</span>}
              </div>
              {isOpen && <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#02130e] border border-[#F8E7C9]/20 text-[#F8E7C9]/60">⇧T</kbd>}
            </button>

            <div className="my-1.5 border-b border-[#F8E7C9]/10 mx-1" />

            {isOpen && <span className="text-[9px] font-mono uppercase tracking-wider text-[#F8E7C9]/40 px-2 mb-0.5 font-semibold">Active Labs</span>}

            <div
              className={`flex items-center p-2 rounded-xl bg-[#062b21]/40 hover:bg-[#064E3B]/60 border border-[#F8E7C9]/10 hover:border-[#F8E7C9]/30 transition cursor-pointer active:scale-[0.98] ${
                isOpen ? 'justify-between px-2.5' : 'justify-center w-full'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">🎵</span>
                {isOpen && <span className="text-xs font-mono text-[#F8E7C9] font-medium whitespace-nowrap">Music Recall</span>}
              </div>
              {isOpen && <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30">Live</span>}
            </div>

            <div
              className={`flex items-center p-2 rounded-xl opacity-60 ${
                isOpen ? 'justify-between hover:bg-white/5 px-2.5' : 'justify-center w-full'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">📖</span>
                {isOpen && <span className="text-xs font-mono text-[#F8E7C9] whitespace-nowrap">Reading Lab</span>}
              </div>
              {isOpen && <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#064E3B]/60 text-[#10b981] border border-[#10b981]/30">Soon</span>}
            </div>

            {/* GET MORE — Faqat Admin uchun */}
            {isAdmin && onOpenGetMore && (
              <>
                <div className="my-1.5 border-b border-[#F8E7C9]/10 mx-1" />
                <button
                  type="button"
                  onClick={onOpenGetMore}
                  className={`group flex items-center p-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 border border-amber-500/40 transition cursor-pointer active:scale-[0.98] ${
                    isOpen ? 'justify-between px-2.5' : 'justify-center w-full'
                  }`}
                  title="Get More (Admin Only)"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm">⭐</span>
                    {isOpen && <span className="text-xs font-mono text-[#F8E7C9] font-bold whitespace-nowrap">Get More</span>}
                  </div>
                  {isOpen && <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">VIP</span>}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-3 border-t border-[#F8E7C9]/10 flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" title="System Active" />
        </div>
      </aside>
    </>
  );
}