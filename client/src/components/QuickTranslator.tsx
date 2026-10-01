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
      <div className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-950/95 border border-lime-400/25 p-6 sm:p-7 shadow-[0_10px_60px_rgba(0,0,0,0.8)] text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 text-slate-400 hover:text-lime-300 transition text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-lime-500/10 cursor-pointer"
        >
          ✕
        </button>

        {/* Lime glow aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-gradient-to-b from-lime-500/20 via-blue-500/10 to-transparent blur-2xl pointer-events-none" />

        {/* Header section */}
        <div className="relative z-10 mb-5 flex items-center justify-between pb-3 border-b border-lime-400/15 pr-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-900/70 border border-lime-400/30 flex items-center justify-center text-sm shadow-lg shadow-lime-500/20">
              ✦
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-wider text-lime-300 font-mono">
                Quick Translator
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Fast direct lexical inference
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-lime-500/20 border border-lime-400/40 text-lime-300">
            Active Engine
          </span>
        </div>

        <div className="relative z-10 space-y-4">
          {/* Input and control row */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              className="flex-1 bg-slate-900/70 backdrop-blur-md border border-lime-400/25 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-400 font-mono focus:outline-none focus:border-lime-400/50 focus:bg-slate-800/70 focus:shadow-[0_0_15px_rgba(132,204,22,0.2)] transition shadow-inner"
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
                className="bg-slate-900/70 backdrop-blur-md border border-lime-400/25 rounded-2xl px-3.5 py-3 text-xs font-mono text-slate-100 focus:outline-none focus:border-lime-400/50 focus:shadow-[0_0_15px_rgba(132,204,22,0.2)] transition cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-100">
                    {lang.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleTranslate}
                disabled={translating || !inputText.trim()}
                className="bg-gradient-to-r from-lime-400 to-cyan-400 hover:shadow-[0_0_25px_rgba(132,204,22,0.5)] text-slate-950 disabled:opacity-40 font-mono font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl transition-all active:scale-95 cursor-pointer whitespace-nowrap"
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

          {/* Result card */}
          {result && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-lime-400/30 shadow-[0_0_20px_rgba(132,204,22,0.2)] flex items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="overflow-hidden">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-lime-400 block mb-0.5">
                  Translation
                </span>
                <div className="text-base sm:text-lg text-slate-100 font-medium font-mono break-words">
                  {result}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-blue-900/70 hover:bg-blue-800/70 border border-lime-400/30 text-[11px] font-mono text-lime-300 transition active:scale-95 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(132,204,22,0.3)]"
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