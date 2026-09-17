// src/components/LandingPage.tsx
import React from 'react';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
  isLoggedIn: boolean;
  waitingAuth?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onLogin,
  isLoggedIn,
  waitingAuth = false
}) => {
  return (
    <div className="relative w-full flex flex-col items-center overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[78vh] flex flex-col items-center justify-center px-4 pt-12 pb-16 text-center">
        
        {/* Emerald Glow Aura */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-[#064E3B]/70 via-[#10b981]/15 to-transparent blur-3xl pointer-events-none rounded-full" />

        {/* Minimal Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F8E7C9]/15 bg-[#062b21]/70 backdrop-blur-md mb-8">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          <span className="text-xs font-mono tracking-wide text-[#F8E7C9]">
            Next-Gen Learning Architecture
          </span>
        </div>

        {/* Asosiy Sarlavha */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] max-w-4xl mx-auto mb-6">
          <span className="text-[#F8E7C9]">AI-Powered English.</span><br />
          <span className="bg-gradient-to-b from-[#F8E7C9] via-[#d8c7aa] to-[#736a5b] bg-clip-text text-transparent">
            All-in-One Trainer.
          </span>
        </h1>

        {/* Asosiy Tugmalar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-sm">
          <button
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#F8E7C9] text-[#064E3B] font-bold text-sm hover:bg-[#ebd7b5] active:scale-[0.98] transition shadow-[0_0_30px_rgba(248,231,201,0.18)]"
          >
            <span>Try for now</span>
            <span>→</span>
          </button>

          {!isLoggedIn && (
            <button
              type="button"
              onClick={onLogin}
              disabled={waitingAuth}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#062b21] border border-[#F8E7C9]/20 text-[#F8E7C9] font-medium text-sm hover:bg-[#083a2d] transition active:scale-[0.98]"
            >
              <svg className="w-4 h-4 fill-current text-[#F8E7C9]" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
              <span>{waitingAuth ? "Kutilmoqda..." : "Sign Up"}</span>
            </button>
          )}
        </div>
      </section>

      {/* 2. BENTO GRID VITRINASI */}
      <section className="w-full max-w-6xl mx-auto px-4 pb-20">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold text-[#F8E7C9]/60 tracking-wider uppercase">
            Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8E7C9] mt-1">
            Everything you need to master English
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Vocab Studio */}
          <div 
            onClick={onStart}
            className="p-6 rounded-3xl bg-[#062b21]/50 border border-[#F8E7C9]/12 hover:border-[#F8E7C9]/30 transition cursor-pointer group flex flex-col justify-between min-h-[220px]"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#064E3B] border border-[#F8E7C9]/20 flex items-center justify-center text-[#F8E7C9] mb-4 group-hover:scale-105 transition">
                ✦
              </div>
              <h3 className="text-base font-bold text-[#F8E7C9]">Deep Vocab Analysis</h3>
              <p className="text-xs text-[#F8E7C9]/70 mt-2 leading-relaxed">
                Har bir so‘zning CEFR darajasi, tabiiy konteksti, birikmalari va mini-testlari.
              </p>
            </div>
            <span className="text-xs font-mono text-[#F8E7C9] flex items-center gap-1 mt-4">
              Ishlatib ko‘rish →
            </span>
          </div>

          {/* Card 2: Music Gap-Fill */}
          <div className="p-6 rounded-3xl bg-[#062b21]/50 border border-[#F8E7C9]/12 hover:border-[#F8E7C9]/25 transition flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#064E3B] border border-[#F8E7C9]/20 flex items-center justify-center text-[#F8E7C9] mb-4">
                🎵
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#F8E7C9]">Music & Lyrics Gap-Fill</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#F8E7C9]/10 border border-[#F8E7C9]/20 text-[#F8E7C9] text-[10px] font-mono">
                  Tez kunda
                </span>
              </div>
              <p className="text-xs text-[#F8E7C9]/70 mt-2 leading-relaxed">
                Qo‘shiq eshitib, matndagi bo‘sh qolgan so‘zlarni ritm bilan to‘ldiring.
              </p>
            </div>
            <span className="text-xs font-mono text-[#F8E7C9]/40">13-modul</span>
          </div>

          {/* Card 3: Retention Reading */}
          <div className="p-6 rounded-3xl bg-[#062b21]/50 border border-[#F8E7C9]/12 hover:border-[#F8E7C9]/25 transition flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#064E3B] border border-[#F8E7C9]/20 flex items-center justify-center text-[#F8E7C9] mb-4">
                📖
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#F8E7C9]">Retention Reading</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#F8E7C9]/10 border border-[#F8E7C9]/20 text-[#F8E7C9] text-[10px] font-mono">
                  Tez kunda
                </span>
              </div>
              <p className="text-xs text-[#F8E7C9]/70 mt-2 leading-relaxed">
                Matn o‘qish jarayonida Active Recall va xotira tekshiruvi orqali chuqur tushunish.
              </p>
            </div>
            <span className="text-xs font-mono text-[#F8E7C9]/40">14-modul</span>
          </div>

        </div>
      </section>

    </div>
  );
};