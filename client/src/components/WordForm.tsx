// src/components/WordForm.tsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LiquidMetalButton } from './ui/liquid-metal-button';
import type { SupportedLanguageCode } from '../types/vocab';

interface WordFormProps {
  word: string;
  onWordChange: (val: string) => void;
  languageCode: SupportedLanguageCode;
  onLanguageChange: (code: SupportedLanguageCode, label: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

interface LanguageOption {
  code: SupportedLanguageCode;
  label: string;
  badge: string;
  native: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'uz', label: 'Uzbek', badge: 'UZ', native: "O'zbekcha" },
  { code: 'es', label: 'Spanish', badge: 'ES', native: 'Español' },
  { code: 'ru', label: 'Russian', badge: 'RU', native: 'Русский' },
  { code: 'fr', label: 'French', badge: 'FR', native: 'Français' },
  { code: 'de', label: 'German', badge: 'DE', native: 'Deutsch' },
  { code: 'tr', label: 'Turkish', badge: 'TR', native: 'Türkçe' },
];

export function WordForm({
  word,
  onWordChange,
  languageCode,
  onLanguageChange,
  onSubmit,
  disabled = false,
}: WordFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonBoxRef = useRef<HTMLDivElement>(null);
  const [menuCoords, setMenuCoords] = useState<{ top: number; left: number; width: number } | null>(null);

  const selectedLang =
    LANGUAGES.find((l) => l.code === languageCode) || LANGUAGES[0];

  // Tugmaning ekrandagi aniq koordinatasini hisoblash
  function updateCoords() {
    if (buttonBoxRef.current) {
      const rect = buttonBoxRef.current.getBoundingClientRect();
      setMenuCoords({
        top: rect.bottom + 8, // Tugmadan 8px pastda
        left: rect.left,
        width: Math.max(rect.width, 180),
      });
    }
  }

  function handleToggle() {
    if (disabled) return;
    if (!isOpen) {
      updateCoords();
    }
    setIsOpen((prev) => !prev);
  }

  // Scroll yoki Resize bo'lganda koordinatani yangilash yoki menyuni yopish
  useEffect(() => {
    function handleScrollOrResize() {
      if (isOpen) {
        updateCoords();
      }
    }
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);

  // Tashqariga bosganda menyuni yopish
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        buttonBoxRef.current &&
        !buttonBoxRef.current.contains(target) &&
        !target.closest('.cyber-portal-dropdown')
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!disabled && word.trim()) {
      onSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="word-form flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3.5">
        
        {/* 1. Input */}
        <div className="flex-1 relative">
          <label className="block text-[11px] font-mono font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
            English word / term
          </label>
          <input
            type="text"
            value={word}
            onChange={(e) => onWordChange(e.target.value)}
            disabled={disabled}
            placeholder='Try "resilient" or "take off"'
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-white/10 focus:border-purple-500 text-slate-100 placeholder-slate-500 text-sm focus:outline-none transition-all duration-300 shadow-inner"
          />
        </div>

        {/* 2. Dropdown Trigger Tugmasi */}
        <div ref={buttonBoxRef} className="relative sm:w-44">
          <label className="block text-[11px] font-mono font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
            Translate into
          </label>

          <div className="relative rounded-2xl p-[1px] overflow-hidden">
            {isOpen && (
              <div
                className="absolute inset-[-100%] animate-[spin_3s_linear_infinite]"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0 300deg, #c084fc 340deg, #38bdf8 360deg)',
                }}
              />
            )}

            <button
              type="button"
              disabled={disabled}
              onClick={handleToggle}
              className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-950/90 backdrop-blur-xl border transition-all duration-200 ${
                isOpen
                  ? 'border-transparent text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                  : 'border-white/10 hover:border-purple-500/40 text-slate-200'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {selectedLang.badge}
                </span>
                <span className="text-xs font-semibold tracking-wide">
                  {selectedLang.label}
                </span>
              </div>

              <span
                className={`text-[9px] text-purple-400 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : 'rotate-0'
                }`}
              >
                ▼
              </span>
            </button>
          </div>
        </div>

        {/* 3. Liquid Metal Tugmasi */}
        <div className="sm:self-end flex items-center justify-center">
          <LiquidMetalButton
            label={disabled ? 'Analyzing...' : 'Analyze word →'}
            type="submit"
            disabled={disabled || !word.trim()}
          />
        </div>
      </div>

      {/* 4. REACT PORTAL: Butun sahifa ustida erkin suzuvchi menyu (Karta ichiga tiqilmaydi!) */}
      {isOpen &&
        menuCoords &&
        createPortal(
          <div
            className="cyber-portal-dropdown fixed z-[99999] rounded-2xl p-[1px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-150"
            style={{
              top: `${menuCoords.top}px`,
              left: `${menuCoords.left}px`,
              width: `${menuCoords.width}px`,
            }}
          >
            {/* Menyu atrofidagi neon aylanuvchi lazer nuri */}
            <div
              className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0 320deg, #a855f7 350deg, #38bdf8 360deg)',
              }}
            />

            <div className="relative w-full rounded-2xl bg-slate-950/95 backdrop-blur-3xl border border-white/10 p-1.5 flex flex-col gap-1 max-h-56 overflow-y-auto">
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === selectedLang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      onLanguageChange(lang.code, lang.label);
                      setIsOpen(false);
                    }}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                      isSelected
                        ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/5 text-slate-400">
                        {lang.badge}
                      </span>
                      <div className="flex flex-col text-left">
                        <span className="font-semibold leading-none">{lang.label}</span>
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {lang.native}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </form>
  );
}