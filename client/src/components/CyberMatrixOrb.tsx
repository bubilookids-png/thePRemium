// src/components/CyberMatrixOrb.tsx
import React, { useRef, useState } from 'react';

export function CyberMatrixOrb() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ rx: 0, ry: 0 });
  const [hovered, setHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setCoords({
      rx: -(y / rect.height) * 10,
      ry: (x / rect.width) * 10,
    });
  }

  return (
    <div style={{ perspective: '900px' }} className="mt-4 sm:mt-6 w-full max-w-md select-none">
      <div
        ref={boxRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setCoords({ rx: 0, ry: 0 }); }}
        style={{
          transform: hovered ? `rotateX(${coords.rx}deg) rotateY(${coords.ry}deg) scale(1.01)` : 'none',
          transition: hovered ? 'transform 0.08s ease-out' : 'transform 0.4s ease-out',
        }}
        className="relative rounded-2xl sm:rounded-3xl p-[1.5px] overflow-hidden shadow-xl"
      >
        <div
          className="absolute inset-[-150%] animate-[spin_4s_linear_infinite]"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0 310deg, #38bdf8 335deg, #a855f7 350deg, #ec4899 360deg)',
          }}
        />

        <div className="relative w-full rounded-2xl sm:rounded-3xl bg-slate-950/95 backdrop-blur-2xl p-3 sm:p-4 border border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-cyan-300 font-black text-xs sm:text-sm">
              ✦
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] sm:text-xs font-black font-mono tracking-wider text-white">
                  NEURAL MATRIX
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] font-mono text-slate-400">
                Lexical graph active
              </p>
            </div>
          </div>

          <div className="flex items-end gap-1 h-6 px-1">
            <span className="w-1 bg-purple-500 rounded-full animate-[bounce_0.8s_infinite_100ms] h-3.5" />
            <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_0.8s_infinite_300ms] h-5" />
            <span className="w-1 bg-pink-500 rounded-full animate-[bounce_0.8s_infinite_200ms] h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}