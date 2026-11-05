// src/components/Card.tsx
import React, { useRef, useState } from 'react';
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
  useMotionEntrance(cardRef, true, '.section-head, .section-body');
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const isEditorial = theme === 'editorial-milk';
  const isSilver = theme === 'brushed-silver';

  return (
    <div className="w-full">
      <div
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full"
      >
        <section
          onClick={props.onClick}
          style={{
            transform: isHovered ? 'translateY(-2px)' : 'translateY(0px)',
            transition: 'transform 0.2s cubic-bezier(0.2, 0.75, 0.25, 1), box-shadow 0.2s ease, border-color 0.2s ease',
            backfaceVisibility: 'hidden',
            WebkitFontSmoothing: 'antialiased',
          }}
          className={`section-card relative overflow-hidden p-4 sm:p-6 ${
            isEditorial
              ? `editorial-card bg-white text-[#1E2433] border-2 border-[#1E2433] rounded-3xl ${
                  isHovered ? 'shadow-[8px_8px_0px_#1E2433]' : 'shadow-[5px_5px_0px_#1E2433]'
                }`
              : isSilver
              ? `bg-slate-900/90 border border-sky-400/30 rounded-3xl ${
                  isHovered ? 'border-sky-400/60 shadow-[0_0_25px_rgba(56,189,248,0.15)]' : ''
                }`
              : `bg-slate-900/90 border border-lime-400/30 rounded-3xl ${
                  isHovered ? 'border-lime-400/60 shadow-[0_0_25px_rgba(132,204,22,0.15)]' : ''
                }`
          } ${props.className || ''}`}
        >
          {/* Washi tape accent on editorial card */}
          {isEditorial && (
            <div className="washi-tape -top-3.5 right-8 hidden sm:block pointer-events-none" />
          )}

          {(props.title || props.rightSlot) && (
            <header className="section-head relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                {props.title ? (
                  <h2
                    className={`section-title text-base sm:text-lg font-bold tracking-tight transition-colors duration-200 ${
                      isEditorial
                        ? 'font-serif text-[#1E2433] font-black text-lg sm:text-xl'
                        : isSilver
                        ? 'text-sky-300'
                        : 'text-lime-300'
                    }`}
                  >
                    {props.title}
                  </h2>
                ) : null}
                {props.subtitle ? (
                  <p
                    className={`section-kicker text-xs mt-0.5 font-normal ${
                      isEditorial ? 'text-[#475569] font-sans font-medium' : 'text-slate-300'
                    }`}
                  >
                    {props.subtitle}
                  </p>
                ) : null}
              </div>
              {props.rightSlot}
            </header>
          )}

          <div
            className={`section-body relative z-10 font-sans ${
              isEditorial ? 'text-[#1E2433]' : 'text-slate-100'
            }`}
          >
            {props.children}
          </div>
        </section>
      </div>
    </div>
  );
}
