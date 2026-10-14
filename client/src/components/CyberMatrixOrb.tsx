// src/components/CyberMatrixOrb.tsx
import React, { useRef, useState } from 'react';
import { useMotionEntrance } from '../utils/motion';
import { useServerStatus } from '../context/ServerContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export function CyberMatrixOrb() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const { status, wakeServer } = useServerStatus();
  const { theme } = useTheme();
  const { language } = useLanguage();
  useMotionEntrance(boxRef, true);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    boxRef.current.style.setProperty('--orb-tilt-x', `${-(y / rect.height) * 8}deg`);
    boxRef.current.style.setProperty('--orb-tilt-y', `${(x / rect.width) * 8}deg`);
  }

  const isLive = status === 'live';
  const isWaking = status === 'waking';
  const isSleeping = status === 'sleeping' || status === 'error';
  const isViolet = theme === 'cyber-violet';

  // Dynamic conic gradient depending on theme & state
  const conicGradient = isLive
    ? isViolet
      ? 'conic-gradient(from 0deg, transparent 0 290deg, #581c87 320deg, #ec4899 345deg, #a855f7 360deg)'
      : 'conic-gradient(from 0deg, transparent 0 290deg, #1e3a8a 320deg, #84cc16 345deg, #06b6d4 360deg)'
    : isWaking
    ? 'conic-gradient(from 0deg, transparent 0 260deg, #1d4ed8 300deg, #38bdf8 340deg, #60a5fa 360deg)'
    : 'conic-gradient(from 0deg, transparent 0 350deg, #334155 360deg)';

  return (
    <>
      <style>{`
        @keyframes eqBar1 {
          0%, 100% { height: 10px; }
          50% { height: 22px; }
        }
        @keyframes eqBar2 {
          0%, 100% { height: 20px; }
          50% { height: 8px; }
        }
        @keyframes eqBar3 {
          0%, 100% { height: 14px; }
          50% { height: 24px; }
        }
        @keyframes eqWaking {
          0%, 100% { height: 8px; opacity: 0.5; }
          50% { height: 18px; opacity: 1; }
        }
        .eq-anim-1 {
          animation: eqBar1 1.1s ease-in-out infinite;
        }
        .eq-anim-2 {
          animation: eqBar2 0.85s ease-in-out infinite;
        }
        .eq-anim-3 {
          animation: eqBar3 1.25s ease-in-out infinite;
        }
        .eq-anim-waking {
          animation: eqWaking 0.9s ease-in-out infinite;
        }
      `}</style>

      <div style={{ perspective: '900px' }} className="mt-4 sm:mt-6 w-full max-w-md select-none">
        <div
          ref={boxRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(false);
            boxRef.current?.style.setProperty('--orb-tilt-x', '0deg');
            boxRef.current?.style.setProperty('--orb-tilt-y', '0deg');
          }}
          onClick={() => {
            if (isSleeping) {
              wakeServer();
            }
          }}
          style={{
            transform: 'rotateX(var(--orb-tilt-x, 0deg)) rotateY(var(--orb-tilt-y, 0deg))',
            transition: hovered ? 'transform 0.08s ease-out' : 'transform 0.4s ease-out',
          }}
          className={`relative rounded-2xl sm:rounded-3xl p-[1.5px] overflow-hidden transition-all duration-500 shadow-2xl ${
            isSleeping ? 'cursor-pointer hover:shadow-amber-500/10' : ''
          }`}
          title={isSleeping ? (language === 'uz' ? 'AI Serverni uyg\'otish uchun bosing' : 'Click to wake AI server') : undefined}
        >
          {/* Animated conic gradient beam */}
          <div
            className={`absolute inset-[-150%] transition-opacity duration-700 ${
              isLive
                ? 'animate-[spin_4.5s_linear_infinite] opacity-100'
                : isWaking
                ? 'animate-[spin_2s_linear_infinite] opacity-80'
                : 'opacity-25'
            }`}
            style={{
              background: conicGradient,
            }}
          />

          <div
            className={`relative w-full rounded-2xl sm:rounded-3xl backdrop-blur-2xl p-3 sm:p-4 border transition-all duration-500 flex items-center justify-between gap-3 ${
              isLive
                ? 'bg-slate-950/95 border-lime-400/20 shadow-[0_0_25px_rgba(132,204,22,0.12)]'
                : isWaking
                ? 'bg-slate-950/95 border-cyan-400/30 shadow-[0_0_25px_rgba(6,182,212,0.2)]'
                : 'bg-slate-950/90 border-slate-800/80'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Icon badge */}
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm border transition-all duration-500 ${
                  isLive
                    ? isViolet
                      ? 'bg-purple-950/80 border-fuchsia-400/40 text-fuchsia-300 shadow-inner shadow-fuchsia-500/20'
                      : 'bg-blue-900/70 border-lime-400/35 text-lime-300 shadow-inner shadow-lime-500/20'
                    : isWaking
                    ? 'bg-blue-950/80 border-cyan-400/40 text-cyan-300 animate-pulse'
                    : 'bg-slate-900/70 border-slate-700 text-slate-500'
                }`}
              >
                {isLive ? '✦' : isWaking ? '⟳' : '💤'}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] sm:text-xs font-black font-mono tracking-wider transition-colors duration-300 ${
                      isLive
                        ? isViolet
                          ? 'text-fuchsia-300'
                          : 'text-lime-300'
                        : isWaking
                        ? 'text-cyan-300'
                        : 'text-slate-400'
                    }`}
                  >
                    NEURAL MATRIX
                  </span>

                  {/* Status Indicator Dot */}
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      isLive
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                        : isWaking
                        ? 'bg-blue-400 animate-ping'
                        : 'bg-amber-400/80'
                    }`}
                  />

                  <span
                    className={`text-[9px] font-mono px-1 rounded uppercase tracking-wider ${
                      isLive
                        ? 'text-emerald-400/90 bg-emerald-500/10'
                        : isWaking
                        ? 'text-blue-300 bg-blue-500/10 animate-pulse'
                        : 'text-amber-400/80 bg-amber-500/10'
                    }`}
                  >
                    {isLive
                      ? 'Online'
                      : isWaking
                      ? (language === 'uz' ? 'Uyg\'onmoqda' : 'Waking')
                      : (language === 'uz' ? 'Uyquda' : 'Standby')}
                  </span>
                </div>

                <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                  {isLive
                    ? (language === 'uz' ? 'Leksik grafik faol' : 'Lexical graph active')
                    : isWaking
                    ? (language === 'uz' ? 'Render AI uyg\'otilmoqda...' : 'Spinning up Render AI...')
                    : (language === 'uz' ? 'Server uyquda (15m) · Uyg\'otish' : 'Server sleeping (15m) · Click to wake')}
                </p>
              </div>
            </div>

            {/* Dynamic Equalizer Lines */}
            <div className="flex items-end gap-1.5 h-6 px-1">
              {isLive ? (
                <>
                  <span
                    className={`w-1 rounded-full eq-anim-1 ${
                      isViolet ? 'bg-fuchsia-400' : 'bg-lime-400'
                    }`}
                  />
                  <span
                    className={`w-1 rounded-full eq-anim-2 ${
                      isViolet ? 'bg-violet-400' : 'bg-cyan-400'
                    }`}
                  />
                  <span
                    className={`w-1 rounded-full eq-anim-3 ${
                      isViolet ? 'bg-pink-400' : 'bg-lime-300'
                    }`}
                  />
                </>
              ) : isWaking ? (
                <>
                  <span className="w-1 bg-cyan-400 rounded-full eq-anim-waking" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 bg-blue-400 rounded-full eq-anim-waking" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 bg-cyan-300 rounded-full eq-anim-waking" style={{ animationDelay: '300ms' }} />
                </>
              ) : (
                <>
                  {/* Flat / dormant bars when sleeping */}
                  <span className="w-1 bg-slate-700 rounded-full h-1" />
                  <span className="w-1 bg-slate-700 rounded-full h-1.5" />
                  <span className="w-1 bg-slate-700 rounded-full h-1" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
