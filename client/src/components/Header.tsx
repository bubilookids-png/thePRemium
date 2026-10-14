import React, { useState, useRef } from 'react';
import { ServerStatus } from './ServerStatus';
import { NeonLogo } from './NeonLogo';
import { useMotionEntrance } from '../utils/motion';
import { useLanguage } from '../context/LanguageContext';

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
  onToggleSidebar?: () => void;
  onLogoClick?: () => void;
}

export function Header({ currentUser, onLogout, onToggleSidebar, onLogoClick }: HeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  useMotionEntrance(headerRef, true, '[data-header-entry]');
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    headerRef.current.style.setProperty('--header-pointer-x', `${e.clientX - rect.left}px`);
    headerRef.current.style.setProperty('--header-pointer-y', `${e.clientY - rect.top}px`);
  }

  return (
    <>
      <style>{`
        @keyframes headerSlide {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 10px rgba(132, 204, 22, 0.2);
          }
          50% {
            box-shadow: 0 0 20px rgba(132, 204, 22, 0.4);
          }
        }

        .animate-header-slide {
          animation: headerSlide 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-logo-float {
          animation: logoFloat 3s ease-in-out infinite;
        }

        .animate-glow-pulse {
          animation: glowPulse 2s ease-in-out infinite;
        }
      `}</style>

      <header className="sticky top-2 sm:top-3 z-30 w-full px-3 sm:px-6 flex justify-center select-none">
        <div
          ref={headerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative flex items-center justify-between w-full max-w-4xl px-3 sm:px-4 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-xl border border-lime-400/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-500"
        >
          {/* Radial gradient glow effect on hover */}
          <div
            className="hidden sm:block pointer-events-none absolute -inset-px rounded-full transition-opacity duration-500"
            style={{
              opacity: isHovered ? 1 : 0,
              background: 'radial-gradient(130px circle at var(--header-pointer-x, 50%) var(--header-pointer-y, 50%), rgba(132, 204, 22, 0.15), rgba(30, 58, 138, 0.25), transparent 80%)',
            }}
          />

          {/* Left: Menu + Transparent Neon Logo */}
          <div data-header-entry className="relative z-10 flex items-center gap-2">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="p-1.5 rounded-lg text-lime-300 hover:text-lime-100 hover:bg-lime-500/15 transition-all duration-300 cursor-pointer active:scale-90"
                title="Sidebar"
              >
                <svg
                  className="w-5 h-5 transition-all duration-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            )}

            <div
              onClick={onLogoClick}
              className="flex items-center gap-2 group cursor-pointer"
            >
              {/* Transparent Neon Logo instead of the spinning 'U' letter */}
              <NeonLogo size={24} />

              <span className="text-xs font-bold tracking-wider text-lime-300 font-mono uppercase transition-all duration-300 group-hover:text-lime-100 group-hover:drop-shadow-[0_0_8px_rgba(132,204,22,0.4)]">
                UniveBooster
              </span>
            </div>
          </div>

          {/* Right: ServerStatus + User */}
          <div data-header-entry className="relative z-10 flex items-center gap-1.5 sm:gap-2">
            <div className="scale-[0.75] origin-right transition-all duration-300 hover:scale-[0.85]">
              <ServerStatus />
            </div>

            {currentUser && (
              <div className="flex items-center gap-2 pl-2.5 ml-1 border-l border-lime-400/15 transition-all duration-300 hover:border-lime-400/40">
                {currentUser.photo_url ? (
                  <img
                    src={currentUser.photo_url}
                    alt={currentUser.first_name}
                    className="w-6 h-6 rounded-full object-cover border border-lime-400/30 transition-all duration-300 hover:border-lime-400/70 hover:shadow-[0_0_12px_rgba(132,204,22,0.3)]"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-lime-400 border border-lime-400/30 flex items-center justify-center text-[10px] font-bold text-white uppercase transition-all duration-300 hover:border-lime-400/70 hover:shadow-[0_0_12px_rgba(132,204,22,0.3)]">
                    {currentUser.first_name ? currentUser.first_name.charAt(0) : 'U'}
                  </div>
                )}

                <span className="text-xs font-semibold text-lime-300 max-w-[90px] truncate transition-all duration-300 group-hover:text-lime-100">
                  {currentUser.first_name}
                </span>

                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="p-1 rounded-full text-lime-300/40 hover:text-rose-400 hover:bg-rose-500/15 transition-all duration-300 cursor-pointer active:scale-95"
                    title={t.logout}
                  >
                    <svg
                      className="w-3.5 h-3.5 transition-all duration-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
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
    </>
  );
}
