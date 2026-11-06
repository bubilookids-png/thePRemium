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

  const isLive = status === 'live';
  const isWaking = status === 'waking';
  const isSleeping = status === 'sleeping' || status === 'error';
  const isEditorial = theme === 'editorial-milk';

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

      <div className="mt-4 sm:mt-6 w-full max-w-md select-none">
        <div
          ref={boxRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => {
            if (isSleeping) {
              wakeServer();
            }
          }}
          style={{
            transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
          }}
          className={`relative rounded-2xl sm:rounded-3xl p-3 sm:p-4 border transition-all duration-200 flex items-center justify-between gap-3 ${
            isEditorial
              ? `bg-white border-2 border-[#1E2433] ${
                  hovered ? 'shadow-[6px_6px_0px_#1E2433]' : 'shadow-[4px_4px_0px_#1E2433]'
                }`
              : isLive
              ? 'bg-slate-900/90 border border-lime-400/30 shadow-[0_0_20px_rgba(132,204,22,0.15)]'
              : isWaking
              ? 'bg-slate-900/90 border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
              : 'bg-slate-900/80 border border-slate-700'
          } ${isSleeping ? 'cursor-pointer' : ''}`}
          title={isSleeping ? (language === 'uz' ? 'AI Serverni uyg\'otish uchun bosing' : 'Click to wake AI server') : undefined}
        >
          <div className="flex items-center gap-3">
            {/* Icon badge */}
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm border transition-all duration-300 ${
                isEditorial
                  ? 'bg-purple-100 border-2 border-[#1E2433] text-[#1E2433] shadow-[2px_2px_0px_#1E2433]'
                  : isLive
                  ? 'bg-lime-500/20 border-lime-400/50 text-lime-300'
                  : isWaking
                  ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 animate-pulse'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {isLive ? '✦' : isWaking ? '⟳' : '💤'}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-black tracking-wider ${
                    isEditorial
                      ? 'text-[#1E2433] font-serif font-black'
                      : isLive
                      ? 'text-lime-300 font-mono'
                      : isWaking
                      ? 'text-cyan-300 font-mono'
                      : 'text-slate-400 font-mono'
                  }`}
                >
                  NEURAL MATRIX
                </span>

                {/* Status Indicator Dot */}
                <span
                  className={`w-2 h-2 rounded-full ${
                    isLive
                      ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                      : isWaking
                      ? 'bg-blue-400 animate-ping'
                      : 'bg-amber-400'
                  }`}
                />

                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    isEditorial
                      ? isLive
                        ? 'text-emerald-800 bg-emerald-100 border border-emerald-300'
                        : isWaking
                        ? 'text-blue-800 bg-blue-100 border border-blue-300'
                        : 'text-amber-800 bg-amber-100 border border-amber-300'
                      : isLive
                      ? 'text-emerald-400 bg-emerald-500/20'
                      : isWaking
                      ? 'text-blue-300 bg-blue-500/20 animate-pulse'
                      : 'text-amber-400 bg-amber-500/20'
                  }`}
                >
                  {isLive
                    ? 'Online'
                    : isWaking
                    ? (language === 'uz' ? 'Uyg\'onmoqda' : 'Waking')
                    : (language === 'uz' ? 'Uyquda' : 'Standby')}
                </span>
              </div>

              <p
                className={`text-[11px] font-mono mt-0.5 ${
                  isEditorial ? 'text-[#475569] font-medium' : 'text-slate-400'
                }`}
              >
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
                    isEditorial ? 'bg-[#6D28D9]' : 'bg-lime-400'
                  }`}
                />
                <span
                  className={`w-1 rounded-full eq-anim-2 ${
                    isEditorial ? 'bg-[#0284C7]' : 'bg-cyan-400'
                  }`}
                />
                <span
                  className={`w-1 rounded-full eq-anim-3 ${
                    isEditorial ? 'bg-[#DB2777]' : 'bg-lime-300'
                  }`}
                />
              </>
            ) : isWaking ? (
              <>
                <span className={`w-1 rounded-full eq-anim-waking ${isEditorial ? 'bg-[#8B5CF6]' : 'bg-cyan-400'}`} style={{ animationDelay: '0ms' }} />
                <span className={`w-1 rounded-full eq-anim-waking ${isEditorial ? 'bg-[#A78BFA]' : 'bg-blue-400'}`} style={{ animationDelay: '150ms' }} />
                <span className={`w-1 rounded-full eq-anim-waking ${isEditorial ? 'bg-[#C4B5FD]' : 'bg-cyan-300'}`} style={{ animationDelay: '300ms' }} />
              </>
            ) : (
              <>
                <span className={`w-1 rounded-full h-1 ${isEditorial ? 'bg-slate-300' : 'bg-slate-700'}`} />
                <span className={`w-1 rounded-full h-1.5 ${isEditorial ? 'bg-slate-300' : 'bg-slate-700'}`} />
                <span className={`w-1 rounded-full h-1 ${isEditorial ? 'bg-slate-300' : 'bg-slate-700'}`} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
