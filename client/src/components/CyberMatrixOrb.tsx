// src/components/CyberMatrixOrb.tsx
import React, { useRef, useState } from 'react';
import { useMotionEntrance } from '../utils/motion';

export function CyberMatrixOrb() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
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

  return (
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
        style={{
          transform: 'rotateX(var(--orb-tilt-x, 0deg)) rotateY(var(--orb-tilt-y, 0deg))',
          transition: hovered ? 'transform 0.08s ease-out' : 'transform 0.4s ease-out',
        }}
        className="relative rounded-2xl sm:rounded-3xl p-[1.5px] overflow-hidden shadow-2xl"
      >
        {/* Aylana yorug'lik: Navy & Lime tuslarida */}
        <div
          className="absolute inset-[-150%] animate-[spin_5s_linear_infinite]"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0 290deg, #1e3a8a 320deg, #84cc16 345deg, #06b6d4 360deg)',
          }}
        />

        <div className="relative w-full rounded-2xl sm:rounded-3xl bg-slate-950/95 backdrop-blur-2xl p-3 sm:p-4 border border-lime-400/15 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-900/70 border border-lime-400/25 flex items-center justify-center text-lime-300 font-black text-xs sm:text-sm shadow-inner shadow-lime-500/20">
              ✦
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] sm:text-xs font-black font-mono tracking-wider text-lime-300">
                  NEURAL MATRIX
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
              </div>
              <p className="text-[10px] font-mono text-slate-400">
                Lexical graph active
              </p>
            </div>
          </div>

          {/* Dinamik to'lqin chiziqlari (Ekvalayzer) */}
          <div className="flex items-end gap-1.5 h-6 px-1">
            <span className="w-1 bg-lime-400 rounded-full h-3.5" />
            <span className="w-1 bg-cyan-400 rounded-full h-5" />
            <span className="w-1 bg-lime-300 rounded-full h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
