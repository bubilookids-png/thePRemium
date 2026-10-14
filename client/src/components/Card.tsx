// src/components/Card.tsx
import React, { useRef, useState } from 'react';
import BorderGlow from './BorderGlow';
import { useMotionEntrance } from '../utils/motion';

export function Card(props: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  rightSlot?: React.ReactNode;
  subtitle?: string;
  onClick?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  useMotionEntrance(cardRef, true, '.section-head, .section-body');
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    // Telefonda (sensor ekranda) 3D tilt ishlamasligi kerak
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rx = ((y - centerY) / centerY) * -2;
    const ry = ((x - centerX) / centerX) * 2;
    cardRef.current.style.setProperty('--motion-pointer-x', `${x}px`);
    cardRef.current.style.setProperty('--motion-pointer-y', `${y}px`);
    cardRef.current.style.setProperty('--motion-tilt-x', `${rx}deg`);
    cardRef.current.style.setProperty('--motion-tilt-y', `${ry}deg`);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    cardRef.current?.style.setProperty('--motion-tilt-x', '0deg');
    cardRef.current?.style.setProperty('--motion-tilt-y', '0deg');
  }

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
          backgroundColor="#0f172a"
          borderRadius={24}
          glowRadius={30}
          glowIntensity={0.8}
          colors={['#84cc16', '#1e3a8a', '#06b6d4']}
          glowColor="132 204 22"
          edgeSensitivity={30}
          coneSpread={25}
          fillOpacity={0.65}
        >
          <section className={`section-card relative overflow-hidden p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md border border-lime-400/20 ${props.className || ''}`} onClick={props.onClick}>
            {/* Mouse glow: only works when hovering over card */}
            <div
              className="hidden sm:block pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
              style={{
                opacity: isHovered ? 1 : 0,
                background: 'radial-gradient(320px circle at var(--motion-pointer-x, 50%) var(--motion-pointer-y, 50%), rgba(132, 204, 22, 0.15), rgba(30, 58, 138, 0.25), transparent 75%)',
              }}
            />

            {(props.title || props.rightSlot) && (
              <header className="section-head relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  {props.title ? (
                    <h2 className="section-title text-base sm:text-lg font-bold text-lime-300 tracking-tight">
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
