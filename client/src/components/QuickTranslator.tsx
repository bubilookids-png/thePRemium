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
  const [focusedInput, setFocusedInput] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  async function handleTranslate() {
    if (!inputText.trim()) return;
    setTranslating(true);
    setError(null);

    try {
      const translated = await translateText(inputText, targetLang);
      setResult(translated);
    } catch (err: any) {
      setError(err.message || 'Tarjima qilib bolmadi');
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
    <>
      <style>{`
        @keyframes translatorSlideIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(30px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes headerGlide {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes inputFocus {
          from {
            box-shadow: 0 0 0px rgba(132, 204, 22, 0);
            border-color: rgba(132, 204, 22, 0.25);
          }
          to {
            box-shadow: 0 0 20px rgba(132, 204, 22, 0.3), inset 0 0 15px rgba(132, 204, 22, 0.05);
            border-color: rgba(132, 204, 22, 0.5);
          }
        }

        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-6px) rotate(5deg);
          }
        }

        @keyframes resultSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(132, 204, 22, 0.2), inset 0 0 15px rgba(132, 204, 22, 0.05);
          }
          50% {
            box-shadow: 0 0 40px rgba(132, 204, 22, 0.4), inset 0 0 25px rgba(132, 204, 22, 0.1);
          }
        }

        @keyframes errorShake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        @keyframes copyPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes buttonGlow {
          0%, 100% {
            box-shadow: 0 0 15px rgba(132, 204, 22, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(132, 204, 22, 0.6);
          }
        }

        @keyframes translateSpinner {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes topGlowBreathe {
          0%, 100% {
            opacity: 0.4;
            filter: blur(20px);
          }
          50% {
            opacity: 0.8;
            filter: blur(24px);
          }
        }

        @keyframes borderGlow {
          0%, 100% {
            border-color: rgba(132, 204, 22, 0.25);
          }
          50% {
            border-color: rgba(132, 204, 22, 0.45);
          }
        }

        @keyframes selectGlow {
          0%, 100% {
            box-shadow: 0 0 0px rgba(132, 204, 22, 0);
          }
          50% {
            box-shadow: 0 0 12px rgba(132, 204, 22, 0.25);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .translator-slide {
          animation: translatorSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .header-glide {
          animation: headerGlide 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
        }

        .input-focused {
          animation: inputFocus 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .icon-float {
          animation: iconFloat 3s ease-in-out infinite;
        }

        .result-slide {
          animation: resultSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .glow-pulse {
          animation: glowPulse 2.5s ease-in-out infinite;
        }

        .error-shake {
          animation: errorShake 0.4s ease-in-out;
        }

        .copy-pulse {
          animation: copyPulse 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .button-glow {
          animation: buttonGlow 2s ease-in-out infinite;
        }

        .translate-spinner {
          animation: translateSpinner 1s linear infinite;
        }

        .top-glow-breathe {
          animation: topGlowBreathe 4s ease-in-out infinite;
        }

        .border-glow {
          animation: borderGlow 2.5s ease-in-out infinite;
        }

        .select-glow {
          animation: selectGlow 2s ease-in-out infinite;
        }

        .slide-left {
          animation: slideInLeft 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .fade-up {
          animation: fadeInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        input::placeholder {
          color: rgba(148, 163, 184, 0.6);
        }

        input:autofill,
        input:autofill:hover,
        input:autofill:focus,
        input:autofill:active {
          -webkit-box-shadow: 0 0 0 30px rgba(15, 23, 42, 0.7) inset !important;
          -webkit-text-fill-color: rgb(226, 232, 240) !important;
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
        <div
          className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-950/95 border border-lime-400/25 p-6 sm:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.9)] text-slate-100 overflow-hidden translator-slide border-glow backdrop-blur-xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Top glow aura */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-32 bg-gradient-to-b from-lime-500/25 via-blue-500/15 to-transparent blur-3xl pointer-events-none transition-all duration-500 ${isHovered ? 'top-2' : 'top-0'} top-glow-breathe`} />
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-lime-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 text-slate-400 hover:text-lime-300 transition-all duration-300 text-lg w-9 h-9 flex items-center justify-center rounded-full hover:bg-lime-500/15 cursor-pointer font-mono font-bold active:scale-90 border border-lime-400/20 hover:border-lime-400/40"
            title="Close translator"
          >
            ✕
          </button>

          {/* Header section */}
          <div className="relative z-10 mb-6 flex items-center justify-between pb-4 border-b border-lime-400/15 pr-8 header-glide">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600/50 to-lime-400/30 border border-lime-400/40 flex items-center justify-center text-sm font-bold shadow-lg shadow-lime-500/25 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:border-lime-400/70 hover:shadow-lime-500/40">
                <div className="absolute inset-0 bg-gradient-to-br from-lime-400 to-cyan-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <span className="relative z-10 icon-float">✦</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black tracking-wider text-lime-300 font-mono uppercase drop-shadow-[0_0_15px_rgba(132,204,22,0.2)]">
                  Translator
                </h3>
                <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">
                  Direct Lexical Engine
                </p>
              </div>
            </div>

            <span className="text-[9px] font-mono font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-lime-500/30 to-cyan-500/20 border border-lime-400/50 text-lime-300 shadow-[0_0_12px_rgba(132,204,22,0.2)] whitespace-nowrap">
              ⚡ LIVE
            </span>
          </div>

          <div className="relative z-10 space-y-4">
            {/* Input and control row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                className={`flex-1 bg-slate-900/50 backdrop-blur-md border border-lime-400/25 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none transition-all duration-300 shadow-inner ${
                  focusedInput ? 'input-focused' : ''
                } hover:border-lime-400/35 hover:bg-slate-800/60`}
                placeholder="Enter word or phrase to translate..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTranslate()}
                onFocus={() => setFocusedInput(true)}
                onBlur={() => setFocusedInput(false)}
                autoFocus
              />

              <div className="flex gap-2.5">
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="bg-slate-900/50 backdrop-blur-md border border-lime-400/25 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-mono text-slate-100 focus:outline-none focus:border-lime-400/50 transition-all duration-300 cursor-pointer hover:border-lime-400/35 hover:bg-slate-800/60 shadow-inner select-glow appearance-none pr-8 bg-no-repeat"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgb(148, 163, 184)' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundSize: '1.2em 1.2em',
                    backgroundPosition: 'right 0.5rem center'
                  }}
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
                  className={`bg-gradient-to-r from-lime-400 via-lime-300 to-cyan-400 hover:shadow-[0_0_30px_rgba(132,204,22,0.6)] text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed font-mono font-black text-xs sm:text-sm px-6 sm:px-8 py-3.5 rounded-2xl transition-all duration-300 active:scale-95 cursor-pointer whitespace-nowrap overflow-hidden relative group ${
                    translating ? 'button-glow' : ''
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-lime-300 to-cyan-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {translating ? (
                      <>
                        <span className="translate-spinner">⟳</span>
                        <span>Translating</span>
                      </>
                    ) : (
                      'Translate'
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className={`text-rose-300 text-xs font-mono px-4 py-3 rounded-2xl bg-rose-950/40 backdrop-blur-md border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)] error-shake fade-up`}>
                <span className="text-rose-400 font-bold">⚠</span> {error}
              </div>
            )}

            {/* Result card */}
            {result && (
              <div className={`mt-4 p-5 rounded-2xl bg-gradient-to-br from-slate-900/70 to-slate-950/60 backdrop-blur-md border border-lime-400/35 shadow-[0_0_30px_rgba(132,204,22,0.25)] flex items-start justify-between gap-4 result-slide glow-pulse group relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-lime-500/0 via-lime-500/5 to-cyan-500/0" />
                
                <div className="overflow-hidden flex-1 relative z-10">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-lime-400 block mb-2 drop-shadow-[0_0_8px_rgba(132,204,22,0.3)]">
                    Translation Output
                  </span>
                  <div className="text-base sm:text-lg text-slate-100 font-medium font-mono break-words leading-relaxed">
                    {result}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-br from-blue-900/60 to-blue-950/40 hover:from-blue-800/70 hover:to-blue-900/50 border border-lime-400/40 hover:border-lime-400/70 text-xs font-mono text-lime-300 transition-all duration-300 active:scale-90 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(132,204,22,0.35)] relative z-10 whitespace-nowrap font-bold ${
                    copied ? 'copy-pulse' : ''
                  }`}
                  title="Copy translation to clipboard"
                >
                  {copied ? (
                    <>
                      <span>✓</span> Copied
                    </>
                  ) : (
                    <>
                      <span>📋</span> Copy
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}