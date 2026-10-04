import React, { useState, useEffect } from 'react';

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
  isAdmin = false
}: SidebarProps) {
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [rippleCounter, setRippleCounter] = useState(0);

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: rippleCounter, x, y };
    setRipples([...ripples, newRipple]);
    setRippleCounter(rippleCounter + 1);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
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

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(-100%);
            opacity: 0;
          }
        }

        @keyframes menuItemSlide {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes iconRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
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
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes expandBorder {
          from {
            width: 0;
          }
          to {
            width: 100%;
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

        @keyframes tooltipSlide {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes badgePulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(132, 204, 22, 0.7);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 8px 2px rgba(132, 204, 22, 0.4);
          }
        }

        .animate-slide-in {
          animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-menu-item {
          animation: menuItemSlide 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-icon-pulse {
          animation: iconPulse 2s ease-in-out infinite;
        }

        .animate-glow-pulse {
          animation: glowPulse 2s ease-in-out infinite;
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
          background: rgba(132, 204, 22, 0.6);
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
          inset: -8px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(132, 204, 22, 0.3) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        button:hover .icon-glow {
          opacity: 1;
        }

        .sidebar-separator {
          animation: expandBorder 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: left;
        }
      `}</style>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col justify-between
          bg-slate-950/75 backdrop-blur-lg border-r border-lime-400/15 shadow-[10px_0_30px_rgba(0,0,0,0.5)] select-none
          transition-all duration-400 ease-out
          ${isOpen ? 'w-64 translate-x-0 animate-slide-in' : '-translate-x-full lg:translate-x-0 lg:w-12'}
        `}
      >
        {/* Header */}
        <div className="flex flex-col">
          <div className="h-14 flex items-center justify-between px-2 border-b border-lime-400/10 transition-all duration-300">
            {isOpen ? (
              <div className="flex items-center gap-2.5 overflow-hidden animate-menu-item">
                <div className="min-w-[28px] h-[28px] rounded-lg bg-gradient-to-tr from-blue-600 to-lime-400 border border-lime-300/40 flex items-center justify-center text-xs shadow-lg shadow-lime-500/30 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-110">
                  <div className="absolute inset-0 bg-gradient-to-tr from-lime-400 to-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 group-hover:animate-icon-pulse">✦</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold tracking-wider text-lime-300 transition-colors duration-300">
                    UniveBooster
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 group-hover:text-lime-400/60 transition-colors duration-300">
                    Workspace
                  </span>
                </div>
              </div>
            ) : null}

            <button
              type="button"
              onClick={(e) => {
                handleRipple(e);
                onToggle();
              }}
              className={`p-1.5 rounded-lg text-slate-300 hover:text-lime-300 hover:bg-lime-500/10 transition-all duration-300 active:scale-90 cursor-pointer button-ripple relative group ${
                !isOpen ? 'mx-auto' : ''
              }`}
              title={isOpen ? "Sidebarni toraytirish" : "Sidebarni kengaytirish"}
            >
              {ripples.map(ripple => (
                <div
                  key={ripple.id}
                  className="ripple"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: 0,
                    height: 0,
                    marginLeft: -ripple.x,
                    marginTop: -ripple.y
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
          </div>

          {/* Menu Items */}
          <div className="p-1 flex flex-col gap-1.5 mt-2">
            {/* New Lookup Button */}
            <button
              type="button"
              onClick={(e) => {
                handleRipple(e);
                onFocusSearch();
              }}
              onMouseEnter={() => setHoveredButton('search')}
              onMouseLeave={() => setHoveredButton(null)}
              className={`group flex items-center p-2 rounded-xl transition-all duration-300 cursor-pointer active:scale-[0.95] button-ripple relative overflow-hidden ${
                isOpen
                  ? 'justify-between hover:bg-lime-500/15 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] hover:border-lime-400/40 px-2.5 border border-transparent'
                  : 'justify-center hover:bg-lime-500/15 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] w-full border border-transparent'
              }`}
              title="New Lookup"
            >
              {ripples.map(ripple => (
                <div
                  key={ripple.id}
                  className="ripple"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: 0,
                    height: 0,
                    marginLeft: -ripple.x,
                    marginTop: -ripple.y
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
                    New Lookup
                  </span>
                )}
              </div>
              {isOpen && (
                <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/70 border border-lime-400/30 text-lime-300/70 transition-all duration-300 group-hover:bg-lime-500/20 group-hover:text-lime-300 group-hover:border-lime-400/50 animate-menu-item">
                  /
                </kbd>
              )}
            </button>

            {/* Word Blitz Button */}
            <button
              type="button"
              onClick={(e) => {
                handleRipple(e);
                onOpenBlitz();
                if (window.innerWidth < 1024) onToggle();
              }}
              onMouseEnter={() => setHoveredButton('blitz')}
              onMouseLeave={() => setHoveredButton(null)}
              className={`group flex items-center p-2 rounded-xl transition-all duration-300 cursor-pointer active:scale-[0.95] button-ripple relative overflow-hidden ${
                isOpen
                  ? 'justify-between hover:bg-lime-500/15 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] hover:border-lime-400/40 px-2.5 border border-transparent'
                  : 'justify-center hover:bg-lime-500/15 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] w-full border border-transparent'
              }`}
              title="Word Blitz"
            >
              {ripples.map(ripple => (
                <div
                  key={ripple.id}
                  className="ripple"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: 0,
                    height: 0,
                    marginLeft: -ripple.x,
                    marginTop: -ripple.y
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
                    Word Blitz
                  </span>
                )}
              </div>
              {isOpen && (
                <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/70 border border-lime-400/30 text-lime-300/70 transition-all duration-300 group-hover:bg-lime-500/20 group-hover:text-lime-300 group-hover:border-lime-400/50 animate-menu-item">
                  ⇧B
                </kbd>
              )}
            </button>

            {/* Translator Button */}
            <button
              type="button"
              onClick={(e) => {
                handleRipple(e);
                onOpenTranslate();
                if (window.innerWidth < 1024) onToggle();
              }}
              onMouseEnter={() => setHoveredButton('translate')}
              onMouseLeave={() => setHoveredButton(null)}
              className={`group flex items-center p-2 rounded-xl transition-all duration-300 cursor-pointer active:scale-[0.95] button-ripple relative overflow-hidden ${
                isOpen
                  ? 'justify-between hover:bg-lime-500/15 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] hover:border-lime-400/40 px-2.5 border border-transparent'
                  : 'justify-center hover:bg-lime-500/15 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)] w-full border border-transparent'
              }`}
              title="Translator"
            >
              {ripples.map(ripple => (
                <div
                  key={ripple.id}
                  className="ripple"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: 0,
                    height: 0,
                    marginLeft: -ripple.x,
                    marginTop: -ripple.y
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
                    Translator
                  </span>
                )}
              </div>
              {isOpen && (
                <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/70 border border-lime-400/30 text-lime-300/70 transition-all duration-300 group-hover:bg-lime-500/20 group-hover:text-lime-300 group-hover:border-lime-400/50 animate-menu-item">
                  ⇧T
                </kbd>
              )}
            </button>

            <button
  type="button"
  onClick={() => {
    if (onOpenReading) onOpenReading();
    if (window.innerWidth < 1024) onToggle();
  }}
  className={`group flex items-center p-2 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] ${
    isOpen 
      ? 'justify-between hover:bg-lime-500/15 hover:shadow-[0_0_15px_rgba(132,204,22,0.3)] hover:border-lime-400/40 px-2.5 border border-transparent' 
      : 'justify-center hover:bg-lime-500/15 hover:shadow-[0_0_15px_rgba(132,204,22,0.3)] w-full border border-transparent'
  }`}
  title="Retention Reading"
>
  <div className="flex items-center gap-3">
    <span className="text-sm text-lime-400">📖</span>
    {isOpen && <span className="text-xs font-mono text-slate-200 font-medium whitespace-nowrap">Retention Reading</span>}
  </div>
  {isOpen && <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/70 border border-lime-400/30 text-lime-300/70">⇧R</kbd>}
</button>

            {/* Admin Only Section */}
            {isAdmin && onOpenGetMore && (
              <>
                <div className="my-2 border-b border-lime-400/10 sidebar-separator" />
                <button
                  type="button"
                  onClick={(e) => {
                    handleRipple(e);
                    onOpenGetMore?.();
                  }}
                  onMouseEnter={() => setHoveredButton('admin')}
                  onMouseLeave={() => setHoveredButton(null)}
                  className={`group flex items-center p-2 rounded-xl bg-gradient-to-r from-blue-600/30 to-lime-400/30 hover:from-blue-600/50 hover:to-lime-400/50 border border-lime-400/50 hover:border-lime-300/80 transition-all duration-300 cursor-pointer active:scale-[0.95] button-ripple relative overflow-hidden animate-admin-glow ${
                    isOpen ? 'justify-between px-2.5' : 'justify-center w-full'
                  }`}
                  title="Get More (Admin Only)"
                >
                  {ripples.map(ripple => (
                    <div
                      key={ripple.id}
                      className="ripple"
                      style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: 0,
                        height: 0,
                        marginLeft: -ripple.x,
                        marginTop: -ripple.y
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
                        Get More
                      </span>
                    )}
                  </div>
                  {isOpen && (
                    <span className="text-[8px] font-mono px-2 py-1 rounded bg-gradient-to-r from-lime-500/40 to-cyan-500/40 text-lime-200 border border-lime-400/60 font-bold transition-all duration-300 group-hover:from-lime-500/60 group-hover:to-cyan-500/60 group-hover:border-lime-300 animate-badgePulse relative z-10">
                      VIP
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer Status */}
        <div className="p-4 border-t border-lime-400/10 flex items-center justify-center gap-2.5 transition-all duration-300">
          <div className="relative flex items-center justify-center">
            <span
              className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-status-pulse"
              title="System Active"
            />
            <span className="absolute inset-0 rounded-full bg-lime-400 opacity-20 animate-ping" />
          </div>
          {isOpen && (
            <span className="text-[9px] font-mono text-lime-300/70 transition-all duration-300 animate-menu-item">
              ONLINE
            </span>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;