// src/components/QuickTranslator.tsx
import React, { useState } from 'react';
import { translateText } from '../services/translatorApi';

const LANGUAGES = [
  { code: 'uz', label: 'Uzbek' },
  { code: 'ru', label: 'Russian' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'tr', label: 'Turkish' },
  { code: 'ar', label: 'Arabic' },
];

interface QuickTranslatorProps {
  onClose: () => void;
}

export function QuickTranslator({ onClose }: QuickTranslatorProps) {
  const [inputText, setInputText] = useState('');
  const [targetLang, setTargetLang] = useState('uz');
  const [result, setResult] = useState('');
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleTranslate() {
    if (!inputText.trim()) return;
    setTranslating(true);
    setError(null);

    try {
      const translated = await translateText(inputText, targetLang);
      setResult(translated);
    } catch (err: any) {
      setError(err.message || 'Tarjima qilib bo‘lmadi');
    } finally {
      setTranslating(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#02130e]/95 via-[#021812]/95 to-[#010b08]/95 border border-[#F8E7C9]/20 p-6 sm:p-7 shadow-[0_10px_60px_rgba(0,0,0,0.8)] text-[#F8E7C9] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Yopish tugmasi */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-20 text-[#F8E7C9]/50 hover:text-white transition text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 cursor-pointer"
        >
          ✕
        </button>

        {/* Yuqori yumshoq zumrad nuri */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-gradient-to-b from-[#10b981]/15 via-[#064E3B]/10 to-transparent blur-2xl pointer-events-none" />

        {/* Sarlavha qismi */}
        <div className="relative z-10 mb-5 flex items-center justify-between pb-3 border-b border-[#F8E7C9]/10 pr-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#064E3B]/70 border border-[#F8E7C9]/25 flex items-center justify-center text-sm shadow-md">
              ✦
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-wider text-[#F8E7C9] font-mono">
                Quick Translator
              </h3>
              <p className="text-[11px] font-mono text-[#F8E7C9]/60">
                Fast direct lexical inference
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#064E3B]/50 border border-[#F8E7C9]/15 text-[#10b981]">
            Active Engine
          </span>
        </div>

        <div className="relative z-10 space-y-4">
          {/* Kiritish va Boshqaruv qatori */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              className="flex-1 bg-[#062b21]/40 border border-[#F8E7C9]/15 rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#F8E7C9] placeholder-[#F8E7C9]/40 font-mono focus:outline-none focus:border-[#F8E7C9]/50 focus:bg-[#062b21]/70 transition shadow-inner"
              placeholder="Type word or phrase..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTranslate()}
              autoFocus
            />

            <div className="flex gap-2">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-[#062b21]/60 border border-[#F8E7C9]/15 rounded-2xl px-3.5 py-3 text-xs font-mono text-[#F8E7C9] focus:outline-none focus:border-[#F8E7C9]/40 transition cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-[#02130e] text-[#F8E7C9]">
                    {lang.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleTranslate}
                disabled={translating || !inputText.trim()}
                className="bg-[#F8E7C9] hover:bg-[#ebd7b5] text-[#02130e] disabled:opacity-40 font-mono font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl transition-all shadow-[0_0_20px_rgba(248,231,201,0.2)] active:scale-95 cursor-pointer whitespace-nowrap"
              >
                {translating ? '...' : 'Translate'}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-rose-300 text-xs font-mono px-3 py-2 rounded-xl bg-rose-950/40 border border-rose-500/30">
              {error}
            </div>
          )}

          {/* Natija kartochkasi */}
          {result && (
            <div className="mt-3 p-4 rounded-2xl bg-[#062b21]/50 border border-[#F8E7C9]/20 shadow-inner flex items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="overflow-hidden">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#10b981] block mb-0.5">
                  Translation
                </span>
                <div className="text-base sm:text-lg text-[#F8E7C9] font-medium font-mono break-words">
                  {result}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-[#064E3B]/70 hover:bg-[#064E3B] border border-[#F8E7C9]/20 text-[11px] font-mono text-[#F8E7C9] transition active:scale-95 cursor-pointer shadow-sm"
                title="Copy translation"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}