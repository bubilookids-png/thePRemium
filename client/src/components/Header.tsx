import React, { useState, useRef } from 'react';
import { ServerStatus } from './ServerStatus';

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
}

export function Header({ currentUser, onLogout, onToggleSidebar }: HeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
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

        @keyframes menuIconRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(90deg);
          }
        }

        @keyframes menuIconHover {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(2px);
          }
          75% {
            transform: translateX(-2px);
          }
        }

        @keyframes avatarPulse {
          0%, 100% {
            box-shadow: 0 0 0px rgba(132, 204, 22, 0);
          }
          50% {
            box-shadow: 0 0 12px rgba(132, 204, 22, 0.4);
          }
        }

        @keyframes logoutShake {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-8deg);
          }
          75% {
            transform: rotate(8deg);
          }
        }

        @keyframes borderGlow {
          0%, 100% {
            border-color: rgba(132, 204, 22, 0.2);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          }
          50% {
            border-color: rgba(132, 204, 22, 0.4);
            box-shadow: 0 8px 30px rgba(132, 204, 22, 0.15), 0 4px 20px rgba(0, 0, 0, 0.5);
          }
        }

        @keyframes pulseUser {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
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

        .animate-menu-hover {
          animation: menuIconHover 0.4s ease-in-out;
        }

        .animate-avatar-pulse {
          animation: avatarPulse 2.5s ease-in-out infinite;
        }

        .animate-logout-shake {
          animation: logoutShake 0.5s ease-in-out;
        }

        .header-border-glow {
          animation: borderGlow 2.5s ease-in-out infinite;
        }

        .animate-pulse-user {
          animation: pulseUser 1.5s ease-in-out infinite;
        }
      `}</style>

      <header className="sticky top-2 sm:top-3 z-30 w-full px-3 sm:px-6 flex justify-center select-none animate-header-slide">
        <div
          ref={headerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative flex items-center justify-between w-full max-w-4xl px-3 sm:px-4 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-xl border border-lime-400/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-500 header-border-glow"
        >
          {/* Radial gradient glow effect on hover */}
          <div
            className="hidden sm:block pointer-events-none absolute -inset-px rounded-full transition-opacity duration-500"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(130px circle at ${mousePos.x}px ${mousePos.y}px, rgba(132, 204, 22, 0.15), rgba(30, 58, 138, 0.25), transparent 80%)`,
            }}
          />

          {/* Left: Menu + Logo */}
          <div className="relative z-10 flex items-center gap-2">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                onMouseEnter={() => setIsMenuHovered(true)}
                onMouseLeave={() => setIsMenuHovered(false)}
                className={`lg:hidden p-1.5 rounded-lg text-lime-300 hover:text-lime-100 hover:bg-lime-500/15 transition-all duration-300 cursor-pointer active:scale-90 ${
                  isMenuHovered ? 'animate-menu-hover' : ''
                }`}
                title="Menu"
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

            <div className="flex items-center gap-1.5 group cursor-pointer">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-lime-400 border border-lime-400/40 transition-all duration-300 group-hover:border-lime-400/70 group-hover:shadow-[0_0_12px_rgba(132,204,22,0.3)] animate-logo-float">
                <span className="text-[11px] font-black text-white group-hover:animate-spin">U</span>
              </div>
              <span className="text-xs font-bold tracking-wider text-lime-300 font-mono uppercase transition-all duration-300 group-hover:text-lime-100 group-hover:drop-shadow-[0_0_8px_rgba(132,204,22,0.4)]">
                UniveBooster
              </span>
            </div>
          </div>

          {/* Right: ServerStatus + User */}
          <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
            <div className="scale-[0.75] origin-right transition-all duration-300 hover:scale-[0.85]">
              <ServerStatus />
            </div>

            {currentUser && (
              <div className="flex items-center gap-2 pl-2.5 ml-1 border-l border-lime-400/15 transition-all duration-300 hover:border-lime-400/40">
                {currentUser.photo_url ? (
                  <img
                    src={currentUser.photo_url}
                    alt={currentUser.first_name}
                    className="w-6 h-6 rounded-full object-cover border border-lime-400/30 transition-all duration-300 hover:border-lime-400/70 hover:shadow-[0_0_12px_rgba(132,204,22,0.3)] animate-avatar-pulse"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-lime-400 border border-lime-400/30 flex items-center justify-center text-[10px] font-bold text-white uppercase transition-all duration-300 hover:border-lime-400/70 hover:shadow-[0_0_12px_rgba(132,204,22,0.3)] animate-avatar-pulse">
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
                    onMouseEnter={() => setIsLogoutHovered(true)}
                    onMouseLeave={() => setIsLogoutHovered(false)}
                    className={`p-1 rounded-full text-lime-300/40 hover:text-rose-400 hover:bg-rose-500/15 transition-all duration-300 cursor-pointer active:scale-75 ${
                      isLogoutHovered ? 'animate-logout-shake' : ''
                    }`}
                    title="Chiqish"
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