// src/components/Card.tsx
import React, { useRef, useState, useEffect } from 'react';
import BorderGlow from './BorderGlow';
import { useMotionEntrance } from '../utils/motion';
import { useTheme } from '../context/ThemeContext';

export function Card(props: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  rightSlot?: React.ReactNode;
  subtitle?: string;
  onClick?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  useMotionEntrance(cardRef, true, '.section-head, .section-body');
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const isViolet = theme === 'cyber-violet';
  const isSilver = theme === 'brushed-silver';

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
    if (!cardRef.current) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rx = ((y - centerY) / centerY) * -2;
      const ry = ((x - centerX) / centerX) * 2;
      cardRef.current.style.setProperty('--motion-pointer-x', `${x}px`);
      cardRef.current.style.setProperty('--motion-pointer-y', `${y}px`);
      cardRef.current.style.setProperty('--motion-tilt-x', `${rx.toFixed(2)}deg`);
      cardRef.current.style.setProperty('--motion-tilt-y', `${ry.toFixed(2)}deg`);
    });
  }

  function handleMouseLeave() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsHovered(false);
    cardRef.current?.style.setProperty('--motion-tilt-x', '0deg');
    cardRef.current?.style.setProperty('--motion-tilt-y', '0deg');
  }

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div style={{ perspective: '1200px' }} className="w-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: 'rotateX(var(--motion-tilt-x, 0deg)) rotateY(var(--motion-tilt-y, 0deg)) translateZ(0px)',
          transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.4s ease-out',
        }}
        className="relative w-full"
      >
        <BorderGlow
          backgroundColor={isSilver ? '#0b0f14' : '#0f172a'}
          borderRadius={24}
          glowRadius={30}
          glowIntensity={0.8}
          colors={
            isViolet
              ? ['#c084fc', '#ec4899', '#7e22ce']
              : isSilver
              ? ['#38bdf8', '#94a3b8', '#64748b']
              : ['#84cc16', '#1e3a8a', '#06b6d4']
          }
          glowColor={isViolet ? '280 85 70' : isSilver ? '200 90 60' : '132 204 22'}
          edgeSensitivity={30}
          coneSpread={25}
          fillOpacity={0.65}
        >
          <section
            className={`section-card relative overflow-hidden p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md border ${
              isViolet ? 'border-fuchsia-400/25' : isSilver ? 'border-sky-400/25' : 'border-lime-400/20'
            } ${props.className || ''}`}
            onClick={props.onClick}
          >
            {/* Mouse glow: only works when hovering over card */}
            <div
              className="hidden sm:block pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
              style={{
                opacity: isHovered ? 1 : 0,
                background: isViolet
                  ? 'radial-gradient(320px circle at var(--motion-pointer-x, 50%) var(--motion-pointer-y, 50%), rgba(192, 132, 252, 0.22), rgba(236, 72, 153, 0.22), transparent 75%)'
                  : isSilver
                  ? 'radial-gradient(320px circle at var(--motion-pointer-x, 50%) var(--motion-pointer-y, 50%), rgba(56, 189, 248, 0.18), rgba(100, 116, 139, 0.22), transparent 75%)'
                  : 'radial-gradient(320px circle at var(--motion-pointer-x, 50%) var(--motion-pointer-y, 50%), rgba(132, 204, 22, 0.15), rgba(30, 58, 138, 0.25), transparent 75%)',
              }}
            />

            {(props.title || props.rightSlot) && (
              <header className="section-head relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  {props.title ? (
                    <h2
                      className={`section-title text-base sm:text-lg font-bold tracking-tight transition-colors duration-300 ${
                        isViolet ? 'text-fuchsia-300' : isSilver ? 'text-sky-300' : 'text-lime-300'
                      }`}
                    >
                      {props.title}
                    </h2>
                  ) : null}
                  {props.subtitle ? (
                    <p className="section-kicker text-xs text-slate-400 mt-0.5 font-normal">
                      {props.subtitle}
                    </p>
                  ) : null}
                </div>
                {props.rightSlot}
              </header>
            )}

            <div className="section-body relative z-10 text-slate-100">
              {props.children}
            </div>
          </section>
        </BorderGlow>
      </div>
    </div>
  );
}
