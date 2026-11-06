// src/components/WordForm.tsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LiquidMetalButton } from './ui/liquid-metal-button';
import type { SupportedLanguageCode } from '../types/vocab';
import { useMotionEntrance } from '../utils/motion';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

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
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isEditorial = theme === 'editorial-milk';
  const [isOpen, setIsOpen] = useState(false);
  const buttonBoxRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useMotionEntrance(dropdownRef, isOpen, '.cyber-portal-option');
  const [menuCoords, setMenuCoords] = useState<{ top: number; left: number; width: number; maxHeight: number } | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const selectedLang =
    LANGUAGES.find((l) => l.code === languageCode) || LANGUAGES[0];

  // Dynamic positioning calculating available space above vs below the trigger
  function updateCoords() {
    if (buttonBoxRef.current) {
      const rect = buttonBoxRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const menuWidth = Math.max(rect.width, 190);
      const estimatedMenuHeight = 240;

      const spaceBelow = viewportHeight - rect.bottom - 12;
      const spaceAbove = rect.top - 12;

      // Position above trigger if space below is cramped and space above offers more room
      const placeAbove = spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow;
      const top = placeAbove
        ? Math.max(8, rect.top - Math.min(estimatedMenuHeight, spaceAbove) - 6)
        : rect.bottom + 6;

      let left = rect.left;
      if (left + menuWidth > viewportWidth - 12) {
        left = Math.max(12, viewportWidth - menuWidth - 12);
      }
      if (left < 12) {
        left = 12;
      }

      const maxHeight = placeAbove
        ? Math.max(140, Math.min(260, spaceAbove - 16))
        : Math.max(140, Math.min(260, spaceBelow - 16));

      setMenuCoords({
        top,
        left,
        width: menuWidth,
        maxHeight
      });
    }
  }

  function handleToggle() {
    if (disabled) return;
    if (!isOpen) {
      updateCoords();
      const currentIdx = LANGUAGES.findIndex((l) => l.code === languageCode);
      setFocusedIndex(currentIdx >= 0 ? currentIdx : 0);
    }
    setIsOpen((prev) => !prev);
  }

  // Update position on scroll/resize
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

  // Keyboard navigation for dropdown
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        triggerButtonRef.current?.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % LANGUAGES.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev <= 0 ? LANGUAGES.length - 1 : prev - 1));
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (focusedIndex >= 0 && focusedIndex < LANGUAGES.length) {
          e.preventDefault();
          const target = LANGUAGES[focusedIndex];
          onLanguageChange(target.code, target.label);
          setIsOpen(false);
          triggerButtonRef.current?.focus();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, onLanguageChange]);

  // Click outside listener
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
          <label className={`block text-[11px] font-mono font-bold mb-1.5 uppercase tracking-wider ${
            isEditorial ? 'text-[#1E2433]' : 'text-slate-400'
          }`}>
            {t.wordInputLabel}
          </label>
          <input
            type="text"
            value={word}
            onChange={(e) => onWordChange(e.target.value)}
            disabled={disabled}
            placeholder={t.wordInputPlaceholder}
            className={`w-full px-4 py-2.5 rounded-2xl text-sm focus:outline-none transition-all duration-200 ${
              isEditorial
                ? 'bg-white border-2 border-[#1E2433] text-[#1E2433] placeholder-[#94A3B8] shadow-[3px_3px_0px_#1E2433] focus:border-[#6D28D9]'
                : 'bg-slate-900/90 border border-lime-400/30 text-slate-100 placeholder-slate-400 focus:border-lime-400 focus:shadow-[0_0_15px_rgba(132,204,22,0.2)]'
            }`}
          />
        </div>

        {/* 2. Dropdown Trigger Tugmasi */}
        <div ref={buttonBoxRef} className="relative sm:w-44">
          <label className={`block text-[11px] font-mono font-bold mb-1.5 uppercase tracking-wider ${
            isEditorial ? 'text-[#1E2433]' : 'text-slate-400'
          }`}>
            {t.translateIntoLabel}
          </label>

          <div className="relative rounded-2xl">
            <button
              ref={triggerButtonRef}
              type="button"
              disabled={disabled}
              onClick={handleToggle}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              aria-label={t.translateIntoLabel}
              className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl border transition-all duration-200 ${
                isEditorial
                  ? 'bg-white border-2 border-[#1E2433] text-[#1E2433] shadow-[3px_3px_0px_#1E2433] hover:bg-slate-50'
                  : isOpen
                  ? 'bg-slate-900 border-lime-400/60 text-slate-100 shadow-[0_0_15px_rgba(132,204,22,0.3)]'
                  : 'bg-slate-900 border-lime-400/30 hover:border-lime-400/50 text-slate-200'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-2">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  isEditorial
                    ? 'bg-purple-100 text-purple-900 border border-purple-300'
                    : 'bg-blue-900/70 text-lime-300 border border-lime-400/30'
                }`}>
                  {selectedLang.badge}
                </span>
                <span className="text-xs font-semibold tracking-wide">
                  {selectedLang.label}
                </span>
              </div>

              <span
                className={`text-[9px] transition-transform duration-300 ${
                  isEditorial ? 'text-[#1E2433]' : 'text-lime-300'
                } ${isOpen ? 'rotate-180' : 'rotate-0'}`}
              >
                ▼
              </span>
            </button>
          </div>
        </div>

        {/* 3. Action Button */}
        <div className="sm:self-end flex items-center justify-center">
          {isEditorial ? (
            <button
              type="submit"
              disabled={disabled || !word.trim()}
              style={{
                backgroundColor: disabled || !word.trim() ? '#EDE9FE' : '#6D28D9',
                color: disabled || !word.trim() ? '#6D28D9' : '#FFFFFF',
              }}
              className={`px-6 py-2.5 rounded-2xl font-bold text-sm border-2 border-[#1E2433] transition-all flex items-center justify-center gap-2 whitespace-nowrap min-w-[140px] h-[44px] ${
                disabled || !word.trim()
                  ? 'shadow-[2px_2px_0px_#1E2433] opacity-90 cursor-not-allowed'
                  : 'shadow-[4px_4px_0px_#1E2433] hover:bg-[#5B21B6] hover:shadow-[5px_5px_0px_#1E2433] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer'
              }`}
            >
              <span>{disabled ? t.analyzingButton : t.analyzeButton}</span>
              <span className="font-black">→</span>
            </button>
          ) : (
            <LiquidMetalButton
              label={disabled ? t.analyzingButton : t.analyzeButton}
              type="submit"
              disabled={disabled || !word.trim()}
            />
          )}
        </div>
      </div>

      {/* 4. REACT PORTAL: Viewport-constrained dropdown above/below trigger */}
      {isOpen &&
        menuCoords &&
        createPortal(
          <div
            ref={dropdownRef}
            className={`cyber-portal-dropdown fixed z-[99999] rounded-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150 overflow-hidden ${
              isEditorial
                ? 'bg-white border-2 border-[#1E2433] shadow-[6px_6px_0px_#1E2433] text-[#1E2433]'
                : 'bg-slate-950/95 backdrop-blur-2xl border border-lime-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
            }`}
            style={{
              top: `${menuCoords.top}px`,
              left: `${menuCoords.left}px`,
              width: `${menuCoords.width}px`,
              maxHeight: `${menuCoords.maxHeight}px`,
            }}
          >
            <div
              className="relative w-full flex flex-col gap-1 overflow-y-auto"
              style={{ maxHeight: `${menuCoords.maxHeight - 12}px` }}
              role="listbox"
              aria-label={t.translateIntoLabel}
            >
              {LANGUAGES.map((lang, index) => {
                const isSelected = lang.code === selectedLang.code;
                const isFocused = focusedIndex === index;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={isFocused ? 0 : -1}
                    data-motion-option
                    onClick={() => {
                      onLanguageChange(lang.code, lang.label);
                      setIsOpen(false);
                      triggerButtonRef.current?.focus();
                    }}
                    className={`cyber-portal-option group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors duration-150 ${
                      isEditorial
                        ? isSelected
                          ? 'bg-purple-100 text-purple-950 font-bold border border-purple-300'
                          : isFocused
                          ? 'bg-slate-100 text-[#1E2433]'
                          : 'text-[#1E2433] hover:bg-slate-100'
                        : isSelected
                        ? 'bg-lime-500/20 text-lime-200 border border-lime-400/40 shadow-sm shadow-lime-500/20'
                        : isFocused
                        ? 'bg-slate-800/80 text-lime-300 border border-slate-700'
                        : 'text-slate-300 hover:text-lime-300 hover:bg-lime-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                        isEditorial ? 'bg-slate-100 text-[#475569] font-bold' : 'bg-slate-800/70 text-slate-400'
                      }`}>
                        {lang.badge}
                      </span>
                      <div className="flex flex-col text-left">
                        <span className="font-semibold leading-none">{lang.label}</span>
                        <span className={`text-[10px] font-mono mt-0.5 ${
                          isEditorial ? 'text-[#64748B]' : 'text-slate-500'
                        }`}>
                          {lang.native}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isEditorial ? 'bg-[#6D28D9]' : 'bg-lime-400 shadow-[0_0_8px_rgba(132,204,22,0.6)]'
                      }`} />
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
