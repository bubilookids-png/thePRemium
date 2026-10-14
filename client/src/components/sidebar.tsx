// client/src/components/sidebar.tsx
import React, { useState, useRef } from 'react';
import { useMotionEntrance } from '../utils/motion';
import { NeonLogo } from './NeonLogo';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onFocusSearch: () => void;
  onOpenBlitz: () => void;
  onOpenTranslate: () => void;
  onOpenGetMore?: () => void;
  onOpenReading?: () => void;
  onOpenSavedWords?: () => void;
  onOpenSettings?: () => void;
  isAdmin?: boolean;
}

interface RippleEffect {
  id: number;
  x: number;
  y: number;
}

export function Sidebar({
  isOpen,
  onToggle,
  onFocusSearch,
  onOpenBlitz,
  onOpenTranslate,
  onOpenGetMore,
  onOpenReading,
  onOpenSavedWords,
  onOpenSettings,
  isAdmin = false
}: SidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);
  useMotionEntrance(sidebarRef, isOpen, '.sidebar-nav-item');
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [rippleCounter, setRippleCounter] = useState(0);
  const { language, setLanguage, t } = useLanguage();

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: rippleCounter, x, y };
    setRipples((prev) => [...prev, newRipple]);
    setRippleCounter((prev) => prev + 1);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes menuItemSlide {
          from {
            opacity: 0;
            transform: translateX(-15px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes iconPulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 0px rgba(132, 204, 22, 0));
          }
          50% {
            transform: scale(1.15);
            filter: drop-shadow(0 0 12px rgba(132, 204, 22, 0.6));
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 15px rgba(132, 204, 22, 0.2), inset 0 0 15px rgba(132, 204, 22, 0.05);
          }
          50% {
            box-shadow: 0 0 25px rgba(132, 204, 22, 0.4), inset 0 0 20px rgba(132, 204, 22, 0.1);
          }
        }

        @keyframes rippleEffect {
          0% {
            width: 0;
            height: 0;
            opacity: 0.6;
          }
          100% {
            width: 320px;
            height: 320px;
            opacity: 0;
          }
        }

        @keyframes rotateSvg {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.1);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        @keyframes adminGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(132, 204, 22, 0.3), inset 0 0 15px rgba(132, 204, 22, 0.1);
            border-color: rgba(132, 204, 22, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(132, 204, 22, 0.6), inset 0 0 25px rgba(132, 204, 22, 0.2);
            border-color: rgba(132, 204, 22, 0.7);
          }
        }

        @keyframes statusPulse {
          0%, 100% {
            box-shadow: 0 0 8px rgba(132, 204, 22, 0.5);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 16px rgba(132, 204, 22, 0.8);
            transform: scale(1.2);
          }
        }

        .animate-slide-in {
          animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-menu-item {
          animation: menuItemSlide 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-icon-pulse {
          animation: iconPulse 2s ease-in-out infinite;
        }

        .animate-status-pulse {
          animation: statusPulse 2s ease-in-out infinite;
        }

        .animate-admin-glow {
          animation: adminGlow 3s ease-in-out infinite;
        }

        .button-ripple {
          position: relative;
          overflow: hidden;
        }

        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(132, 204, 22, 0.45);
          pointer-events: none;
          animation: rippleEffect 0.6s ease-out;
        }

        .icon-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .icon-glow {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(132, 204, 22, 0.25) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        button:hover .icon-glow {
          opacity: 1;
        }
      `}</style>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
          onClick={onToggle}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full z-50 flex flex-col justify-between
          bg-slate-950/80 backdrop-blur-xl border-r border-lime-400/15 shadow-[10px_0_30px_rgba(0,0,0,0.5)] select-none
          transition-all duration-300 ease-out
          ${isOpen ? 'w-64 translate-x-0 animate-slide-in' : '-translate-x-full lg:translate-x-0 lg:w-12'}
        `}
      >
        {/* Header with Neon Logo instead of Star look button */}
        <div className="flex flex-col">
          <div
            onClick={() => {
              if (!isOpen) onToggle();
            }}
            className={`h-14 flex items-center ${
              isOpen ? 'justify-between px-2.5' : 'justify-center cursor-pointer hover:bg-lime-500/10'
            } border-b border-lime-400/10 transition-all duration-300`}
            title={!isOpen ? t.navExpand : undefined}
          >
            {isOpen ? (
              <>
                <div className="flex items-center gap-2.5 overflow-hidden animate-menu-item">
                  {/* Transparent Neon Logo instead of Star-look button */}
                  <NeonLogo size={28} />

                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-bold tracking-wider text-lime-300 transition-colors duration-300">
                      UniveBooster
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      Workspace
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    handleRipple(e);
                    onToggle();
                  }}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-lime-300 hover:bg-lime-500/10 transition-all duration-300 active:scale-90 cursor-pointer button-ripple relative group"
                  title={t.navCollapse}
                >
                  {ripples.map((ripple) => (
                    <div
                      key={ripple.id}
                      className="ripple"
                      style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: 0,
                        height: 0,
                        marginLeft: -ripple.x,
                        marginTop: -ripple.y,
                      }}
                    />
                  ))}
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  handleRipple(e);
                  onToggle();
                }}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-lime-300 hover:text-lime-100 hover:bg-lime-500/20 transition-all duration-300 active:scale-90 cursor-pointer button-ripple relative group"
                title={t.navExpand}
              >
                {ripples.map((ripple) => (
                  <div
                    key={ripple.id}
                    className="ripple"
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      width: 0,
                      height: 0,
                      marginLeft: -ripple.x,
                      marginTop: -ripple.y,
                    }}
                  />
                ))}
                <NeonLogo size={22} />
              </button>
            )}
          </div>

          {/* Menu Items with fully functional to'lqin ripple and smooth open/close */}
          <div className="p-1 flex flex-col gap-1.5 mt-2">
            {/* 1. New Lookup Button */}
            <button
              type="button"
              onClick={(e) => {
                handleRipple(e);
                onFocusSearch();
              }}
              onMouseEnter={() => setHoveredButton('search')}
              onMouseLeave={() => setHoveredButton(null)}
              className={`sidebar-nav-item group flex items-center p-2 rounded-xl transition-all duration-300 cursor-pointer active:scale-[0.96] button-ripple relative overflow-hidden ${
                isOpen
                  ? 'justify-between hover:bg-lime-500/15 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] hover:border-lime-400/40 px-2.5 border border-transparent'
                  : 'justify-center hover:bg-lime-500/15 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] w-full border border-transparent'
              }`}
              title={t.navNewLookup}
            >
              {ripples.map((ripple) => (
                <div
                  key={ripple.id}
                  className="ripple"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: 0,
                    height: 0,
                    marginLeft: -ripple.x,
                    marginTop: -ripple.y,
                  }}
                />
              ))}
              <div className="flex items-center gap-3 relative z-10">
                <div className="icon-wrapper">
                  <div className="icon-glow" />
                  <span className="text-sm transition-all duration-300 group-hover:scale-125 inline-block">🔍</span>
                </div>
                {isOpen && (
                  <span className="text-xs font-mono text-slate-200 font-medium whitespace-nowrap transition-all duration-300 group-hover:text-lime-300 animate-menu-item">
                    {t.navNewLookup}
                  </span>
                )}
              </div>
              {isOpen && (
                <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/70 border border-lime-400/30 text-lime-300/70 transition-all duration-300 group-hover:bg-lime-500/20 group-hover:text-lime-300 group-hover:border-lime-400/50 animate-menu-item">
                  /
                </kbd>
              )}
            </button>

            {/* 2. Word Blitz Button */}
            <button
              type="button"
              onClick={(e) => {
                handleRipple(e);
                onOpenBlitz();
                if (window.innerWidth < 1024) onToggle();
              }}
              onMouseEnter={() => setHoveredButton('blitz')}
              onMouseLeave={() => setHoveredButton(null)}
              className={`sidebar-nav-item group flex items-center p-2 rounded-xl transition-all duration-300 cursor-pointer active:scale-[0.96] button-ripple relative overflow-hidden ${
                isOpen
                  ? 'justify-between hover:bg-lime-500/15 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] hover:border-lime-400/40 px-2.5 border border-transparent'
                  : 'justify-center hover:bg-lime-500/15 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] w-full border border-transparent'
              }`}
              title={t.navWordBlitz}
            >
              {ripples.map((ripple) => (
                <div
                  key={ripple.id}
                  className="ripple"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: 0,
                    height: 0,
                    marginLeft: -ripple.x,
                    marginTop: -ripple.y,
                  }}
                />
              ))}
              <div className="flex items-center gap-3 relative z-10">
                <div className="icon-wrapper">
                  <div className="icon-glow" />
                  <span
                    className={`text-sm transition-all duration-300 group-hover:scale-125 inline-block ${
                      hoveredButton === 'blitz' ? 'animate-icon-pulse' : ''
                    }`}
                  >
                    ⚡
                  </span>
                </div>
                {isOpen && (
                  <span className="text-xs font-mono text-slate-200 font-medium whitespace-nowrap transition-all duration-300 group-hover:text-lime-300 animate-menu-item">
                    {t.navWordBlitz}
                  </span>
                )}
              </div>
              {isOpen && (
                <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/70 border border-lime-400/30 text-lime-300/70 transition-all duration-300 group-hover:bg-lime-500/20 group-hover:text-lime-300 group-hover:border-lime-400/50 animate-menu-item">
                  ⇧B
                </kbd>
              )}
            </button>

            {/* 3. Translator Button */}
            <button
              type="button"
              onClick={(e) => {
                handleRipple(e);
                onOpenTranslate();
                if (window.innerWidth < 1024) onToggle();
              }}
              onMouseEnter={() => setHoveredButton('translate')}
              onMouseLeave={() => setHoveredButton(null)}
              className={`sidebar-nav-item group flex items-center p-2 rounded-xl transition-all duration-300 cursor-pointer active:scale-[0.96] button-ripple relative overflow-hidden ${
                isOpen
                  ? 'justify-between hover:bg-lime-500/15 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] hover:border-lime-400/40 px-2.5 border border-transparent'
                  : 'justify-center hover:bg-lime-500/15 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] w-full border border-transparent'
              }`}
              title={t.navTranslator}
            >
              {ripples.map((ripple) => (
                <div
                  key={ripple.id}
                  className="ripple"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: 0,
                    height: 0,
                    marginLeft: -ripple.x,
                    marginTop: -ripple.y,
                  }}
                />
              ))}
              <div className="flex items-center gap-3 relative z-10">
                <div className="icon-wrapper">
                  <div className="icon-glow" />
                  <span
                    className={`text-sm transition-all duration-300 group-hover:scale-125 inline-block ${
                      hoveredButton === 'translate' ? 'animate-rotateSvg' : ''
                    }`}
                  >
                    ✦
                  </span>
                </div>
                {isOpen && (
                  <span className="text-xs font-mono text-slate-200 font-medium whitespace-nowrap transition-all duration-300 group-hover:text-lime-300 animate-menu-item">
                    {t.navTranslator}
                  </span>
                )}
              </div>
              {isOpen && (
                <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/70 border border-lime-400/30 text-lime-300/70 transition-all duration-300 group-hover:bg-lime-500/20 group-hover:text-lime-300 group-hover:border-lime-400/50 animate-menu-item">
                  ⇧T
                </kbd>
              )}
            </button>

            {/* 4. Retention Reading (Fixed wave ripple + open/close styling) */}
            <button
              type="button"
              onClick={(e) => {
                handleRipple(e);
                if (onOpenReading) onOpenReading();
                if (window.innerWidth < 1024) onToggle();
              }}
              onMouseEnter={() => setHoveredButton('reading')}
              onMouseLeave={() => setHoveredButton(null)}
              className={`sidebar-nav-item group flex items-center p-2 rounded-xl transition-all duration-300 cursor-pointer active:scale-[0.96] button-ripple relative overflow-hidden ${
                isOpen
                  ? 'justify-between hover:bg-lime-500/15 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] hover:border-lime-400/40 px-2.5 border border-transparent'
                  : 'justify-center hover:bg-lime-500/15 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] w-full border border-transparent'
              }`}
              title={t.navRetentionReading}
            >
              {ripples.map((ripple) => (
                <div
                  key={ripple.id}
                  className="ripple"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: 0,
                    height: 0,
                    marginLeft: -ripple.x,
                    marginTop: -ripple.y,
                  }}
                />
              ))}
              <div className="flex items-center gap-3 relative z-10">
                <div className="icon-wrapper">
                  <div className="icon-glow" />
                  <span className="text-sm transition-all duration-300 group-hover:scale-125 inline-block">📖</span>
                </div>
                {isOpen && (
                  <span className="text-xs font-mono text-slate-200 font-medium whitespace-nowrap transition-all duration-300 group-hover:text-lime-300 animate-menu-item">
                    {t.navRetentionReading}
                  </span>
                )}
              </div>
              {isOpen && (
                <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/70 border border-lime-400/30 text-lime-300/70 transition-all duration-300 group-hover:bg-lime-500/20 group-hover:text-lime-300 group-hover:border-lime-400/50 animate-menu-item">
                  ⇧R
                </kbd>
              )}
            </button>

            {/* 5. My Saved Words (Fixed wave ripple + open/close styling) */}
            <button
              type="button"
              onClick={(e) => {
                handleRipple(e);
                if (onOpenSavedWords) onOpenSavedWords();
                if (window.innerWidth < 1024) onToggle();
              }}
              onMouseEnter={() => setHoveredButton('saved')}
              onMouseLeave={() => setHoveredButton(null)}
              className={`sidebar-nav-item group flex items-center p-2 rounded-xl transition-all duration-300 cursor-pointer active:scale-[0.96] button-ripple relative overflow-hidden ${
                isOpen
                  ? 'justify-between hover:bg-lime-500/15 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] hover:border-lime-400/40 px-2.5 border border-transparent'
                  : 'justify-center hover:bg-lime-500/15 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] w-full border border-transparent'
              }`}
              title={t.navSavedWords}
            >
              {ripples.map((ripple) => (
                <div
                  key={ripple.id}
                  className="ripple"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: 0,
                    height: 0,
                    marginLeft: -ripple.x,
                    marginTop: -ripple.y,
                  }}
                />
              ))}
              <div className="flex items-center gap-3 relative z-10">
                <div className="icon-wrapper">
                  <div className="icon-glow" />
                  <span className="text-sm transition-all duration-300 group-hover:scale-125 inline-block">🔖</span>
                </div>
                {isOpen && (
                  <span className="text-xs font-mono text-slate-200 font-medium whitespace-nowrap transition-all duration-300 group-hover:text-lime-300 animate-menu-item">
                    {t.navSavedWords}
                  </span>
                )}
              </div>
              {isOpen && (
                <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/70 border border-lime-400/30 text-lime-300/70 transition-all duration-300 group-hover:bg-lime-500/20 group-hover:text-lime-300 group-hover:border-lime-400/50 animate-menu-item">
                  ⇧S
                </kbd>
              )}
            </button>

            {/* 6. Settings Page Button */}
            <button
              type="button"
              onClick={(e) => {
                handleRipple(e);
                if (onOpenSettings) onOpenSettings();
                if (window.innerWidth < 1024) onToggle();
              }}
              onMouseEnter={() => setHoveredButton('settings')}
              onMouseLeave={() => setHoveredButton(null)}
              className={`sidebar-nav-item group flex items-center p-2 rounded-xl transition-all duration-300 cursor-pointer active:scale-[0.96] button-ripple relative overflow-hidden ${
                isOpen
                  ? 'justify-between hover:bg-lime-500/15 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] hover:border-lime-400/40 px-2.5 border border-transparent'
                  : 'justify-center hover:bg-lime-500/15 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] w-full border border-transparent'
              }`}
              title={t.navSettings}
            >
              {ripples.map((ripple) => (
                <div
                  key={ripple.id}
                  className="ripple"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: 0,
                    height: 0,
                    marginLeft: -ripple.x,
                    marginTop: -ripple.y,
                  }}
                />
              ))}
              <div className="flex items-center gap-3 relative z-10">
                <div className="icon-wrapper">
                  <div className="icon-glow" />
                  <span
                    className={`text-sm transition-transform duration-500 group-hover:rotate-90 inline-block`}
                  >
                    ⚙️
                  </span>
                </div>
                {isOpen && (
                  <span className="text-xs font-mono text-slate-200 font-medium whitespace-nowrap transition-all duration-300 group-hover:text-lime-300 animate-menu-item">
                    {t.navSettings}
                  </span>
                )}
              </div>
              {isOpen && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/70 border border-lime-400/30 text-lime-300/70 transition-all duration-300 group-hover:bg-lime-500/20 group-hover:text-lime-300 animate-menu-item">
                  SET
                </span>
              )}
            </button>

            {/* Admin Only Section */}
            {isAdmin && onOpenGetMore && (
              <>
                <div className="my-2 border-b border-lime-400/10" />
                <button
                  type="button"
                  onClick={(e) => {
                    handleRipple(e);
                    onOpenGetMore?.();
                  }}
                  onMouseEnter={() => setHoveredButton('admin')}
                  onMouseLeave={() => setHoveredButton(null)}
                  className={`sidebar-nav-item group flex items-center p-2 rounded-xl bg-gradient-to-r from-blue-600/30 to-lime-400/30 hover:from-blue-600/50 hover:to-lime-400/50 border border-lime-400/50 hover:border-lime-300/80 transition-all duration-300 cursor-pointer active:scale-[0.96] button-ripple relative overflow-hidden animate-admin-glow ${
                    isOpen ? 'justify-between px-2.5' : 'justify-center w-full'
                  }`}
                  title={t.navGetMore}
                >
                  {ripples.map((ripple) => (
                    <div
                      key={ripple.id}
                      className="ripple"
                      style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: 0,
                        height: 0,
                        marginLeft: -ripple.x,
                        marginTop: -ripple.y,
                      }}
                    />
                  ))}
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="icon-wrapper">
                      <div className="icon-glow absolute inset-0 rounded-full" />
                      <span
                        className={`text-sm transition-all duration-300 group-hover:scale-125 inline-block ${
                          hoveredButton === 'admin' ? 'animate-bounce' : ''
                        }`}
                      >
                        ⭐
                      </span>
                    </div>
                    {isOpen && (
                      <span className="text-xs font-mono text-lime-300 font-bold whitespace-nowrap transition-all duration-300 group-hover:text-lime-200 animate-menu-item">
                        {t.navGetMore}
                      </span>
                    )}
                  </div>
                  {isOpen && (
                    <span className="text-[8px] font-mono px-2 py-1 rounded bg-gradient-to-r from-lime-500/40 to-cyan-500/40 text-lime-200 border border-lime-400/60 font-bold transition-all duration-300 relative z-10">
                      VIP
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom Section: Quick Language Switcher & System Status */}
        <div className="p-3 border-t border-lime-400/10 flex flex-col gap-2">
          {/* Quick Language Switcher in Sidebar (Requested: user can change general language to Uzbek & English) */}
          <button
            type="button"
            onClick={(e) => {
              handleRipple(e);
              setLanguage(language === 'uz' ? 'en' : 'uz');
            }}
            className={`w-full flex items-center p-2 rounded-xl border border-slate-800 hover:border-lime-400/40 bg-slate-900/60 transition-all duration-200 cursor-pointer button-ripple relative overflow-hidden ${
              isOpen ? 'justify-between px-2.5' : 'justify-center'
            }`}
            title={language === 'uz' ? 'Switch to English' : "O'zbekchaga o'tish"}
          >
            {ripples.map((ripple) => (
              <div
                key={ripple.id}
                className="ripple"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: 0,
                  height: 0,
                  marginLeft: -ripple.x,
                  marginTop: -ripple.y,
                }}
              />
            ))}
            <div className="flex items-center gap-2 relative z-10">
              <span className="text-xs">🌐</span>
              {isOpen && (
                <span className="text-xs font-mono text-slate-300 font-medium animate-menu-item">
                  {language === 'uz' ? "O'zbekcha" : 'English'}
                </span>
              )}
            </div>
            {isOpen && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-lime-500/20 text-lime-300 border border-lime-400/30 font-bold">
                {language === 'uz' ? 'UZ' : 'EN'}
              </span>
            )}
          </button>

          {/* Footer Status */}
          <div className="flex items-center justify-center gap-2 pt-1 transition-all duration-300">
            <div className="relative flex items-center justify-center">
              <span
                className="w-2 h-2 rounded-full bg-lime-400 animate-status-pulse"
                title="System Active"
              />
              <span className="absolute inset-0 rounded-full bg-lime-400 opacity-20 animate-ping" />
            </div>
            {isOpen && (
              <span className="text-[9px] font-mono text-lime-300/70 transition-all duration-300 animate-menu-item">
                {t.navOnline}
              </span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
