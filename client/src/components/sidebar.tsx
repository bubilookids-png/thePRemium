// src/components/Sidebar.tsx
import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onFocusSearch: () => void;
  onOpenBlitz: () => void;
  onOpenTranslate: () => void;
  onOpenGetMore?: () => void;
  onOpenReading?: () => void;
  isAdmin?: boolean;
}

export function Sidebar({
  isOpen,
  onToggle,
  onFocusSearch,
  onOpenBlitz,
  onOpenTranslate,
  onOpenGetMore,
  onOpenReading,
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
          bg-slate-950/75 backdrop-blur-lg border-r border-lime-400/15 shadow-[10px_0_30px_rgba(0,0,0,0.5)] select-none
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-12'}
        `}
      >
        <div className="flex flex-col">
          <div className="h-14 flex items-center justify-between px-2 border-b border-lime-400/10">
            {isOpen ? (
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="min-w-[28px] h-[28px] rounded-lg bg-gradient-to-tr from-blue-600 to-lime-400 border border-lime-300/40 flex items-center justify-center text-xs shadow-lg shadow-lime-500/30">
                  ✦
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold tracking-wider text-lime-300">
                    UniveBooster
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">
                    Workspace
                  </span>
                </div>
              </div>
            ) : null}

            <button
              type="button"
              onClick={onToggle}
              className={`p-1.5 rounded-lg text-slate-300 hover:text-lime-300 hover:bg-lime-500/10 transition active:scale-95 cursor-pointer ${
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
              className={`group flex items-center p-2 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                isOpen ? 'justify-between hover:bg-lime-500/15 hover:shadow-[0_0_15px_rgba(132,204,22,0.3)] hover:border-lime-400/40 px-2.5 border border-transparent' : 'justify-center hover:bg-lime-500/15 hover:shadow-[0_0_15px_rgba(132,204,22,0.3)] w-full border border-transparent'
              }`}
              title="New Lookup"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-lime-400">🔍</span>
                {isOpen && <span className="text-xs font-mono text-slate-200 font-medium whitespace-nowrap">New Lookup</span>}
              </div>
              {isOpen && <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/70 border border-lime-400/30 text-lime-300/70">/</kbd>}
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenBlitz();
                if (window.innerWidth < 1024) onToggle();
              }}
              className={`group flex items-center p-2 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                isOpen ? 'justify-between hover:bg-lime-500/15 hover:shadow-[0_0_15px_rgba(132,204,22,0.3)] hover:border-lime-400/40 px-2.5 border border-transparent' : 'justify-center hover:bg-lime-500/15 hover:shadow-[0_0_15px_rgba(132,204,22,0.3)] w-full border border-transparent'
              }`}
              title="Word Blitz"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-lime-400">⚡</span>
                {isOpen && <span className="text-xs font-mono text-slate-200 font-medium whitespace-nowrap">Word Blitz</span>}
              </div>
              {isOpen && <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/70 border border-lime-400/30 text-lime-300/70">⇧B</kbd>}
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenTranslate();
                if (window.innerWidth < 1024) onToggle();
              }}
              className={`group flex items-center p-2 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                isOpen ? 'justify-between hover:bg-lime-500/15 hover:shadow-[0_0_15px_rgba(132,204,22,0.3)] hover:border-lime-400/40 px-2.5 border border-transparent' : 'justify-center hover:bg-lime-500/15 hover:shadow-[0_0_15px_rgba(132,204,22,0.3)] w-full border border-transparent'
              }`}
              title="Translator"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-lime-300">✦</span>
                {isOpen && <span className="text-xs font-mono text-slate-200 font-medium whitespace-nowrap">Translator</span>}
              </div>
              {isOpen && <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/70 border border-lime-400/30 text-lime-300/70">⇧T</kbd>}
            </button>
            

            {isAdmin && onOpenGetMore && (
              <>
                <div className="my-1.5 border-b border-lime-400/10 mx-1" />
                <button
                  type="button"
                  onClick={onOpenGetMore}
                  className={`group flex items-center p-2 rounded-xl bg-gradient-to-r from-blue-600/30 to-lime-400/30 hover:from-blue-600/40 hover:to-lime-400/40 border border-lime-400/50 hover:border-lime-300/70 transition-all duration-200 cursor-pointer active:scale-[0.98] hover:shadow-[0_0_20px_rgba(132,204,22,0.5)] ${
                    isOpen ? 'justify-between px-2.5' : 'justify-center w-full'
                  }`}
                  title="Get More (Admin Only)"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm">⭐</span>
                    {isOpen && <span className="text-xs font-mono text-lime-300 font-bold whitespace-nowrap">Get More</span>}
                  </div>
                  {isOpen && <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-lime-500/30 text-lime-200 border border-lime-400/50">VIP</span>}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-3 border-t border-lime-400/10 flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" title="System Active" />
        </div>
      </aside>
    </>
  );
}