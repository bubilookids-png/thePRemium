// src/components/Card.tsx
import React, { useRef, useState } from 'react';
import BorderGlow from './BorderGlow';

export function Card(props: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  rightSlot?: React.ReactNode;
  subtitle?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    // Telefonda (sensor ekranda) 3D tilt ishlamasligi kerak
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rx = ((y - centerY) / centerY) * -4;
    const ry = ((x - centerX) / centerX) * 4;

    setTilt({ rx, ry });
  }

  function handleMouseLeave() {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
  }

  return (
    <div style={{ perspective: '1100px' }} className="w-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(4px)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.4s ease-out',
        }}
        className="relative w-full"
      >
        <BorderGlow
          backgroundColor="#02130e"
          borderRadius={24}
          glowRadius={30}
          glowIntensity={0.8}
          colors={['#10b981', '#064E3B', '#F8E7C9']}
          glowColor="160 84 39"
          edgeSensitivity={30}
          coneSpread={25}
          fillOpacity={0.65}
        >
          <section className={`section-card relative overflow-hidden p-4 sm:p-6 bg-[#02130e]/80 ${props.className || ''}`}>
            {/* Sichqoncha nuri: Emerald & Champagne (desktop) */}
            <div
              className="hidden sm:block pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
              style={{
                opacity: isHovered ? 1 : 0,
                background: `radial-gradient(320px circle at ${mousePos.x}px ${mousePos.y}px, rgba(248, 231, 201, 0.12), rgba(6, 78, 59, 0.22), transparent 75%)`,
              }}
            />

            {(props.title || props.rightSlot) && (
              <header className="section-head relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  {props.title ? (
                    <h2 className="section-title text-base sm:text-lg font-bold text-[#F8E7C9] tracking-tight">
                      {props.title}
                    </h2>
                  ) : null}
                  {props.subtitle ? (
                    <p className="section-kicker text-xs text-[#F8E7C9]/60 mt-0.5 font-normal">
                      {props.subtitle}
                    </p>
                  ) : null}
                </div>
                {props.rightSlot}
              </header>
            )}

            <div className="section-body relative z-10 text-[#F8E7C9]">
              {props.children}
            </div>
          </section>
        </BorderGlow>
      </div>
    </div>
  );
}