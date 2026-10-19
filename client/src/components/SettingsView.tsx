// client/src/components/SettingsView.tsx
import React, { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useServerStatus } from '../context/ServerContext';
import { Card } from './Card';
import { Footer } from './Footer';
import { useMotionEntrance } from '../utils/motion';

interface SettingsViewProps {
  currentUser?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    is_premium?: boolean;
  } | null;
  onOpenLegal: () => void;
  onOpenCookie: () => void;
  sessionCount: number;
  maxAllowedLimit: number;
  isPremium: boolean;
}

export function SettingsView({
  currentUser,
  onOpenLegal,
  onOpenCookie,
  sessionCount,
  maxAllowedLimit,
  isPremium,
}: SettingsViewProps) {
  const settingsRef = useRef<HTMLDivElement>(null);
  useMotionEntrance(settingsRef, true, '.settings-card');
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, bgAnimation, setBgAnimation } = useTheme();
  const { status, wakeServer, message } = useServerStatus();
  const isEditorial = theme === 'editorial-milk';

  const accentBorder = isEditorial ? 'border-ink-900' : 'border-lime-400/50';
  const accentBg = isEditorial ? 'bg-lavender-100' : 'bg-lime-500/15';
  const accentText = isEditorial ? 'text-lavender-700' : 'text-lime-300';
  const accentGlow = isEditorial ? 'shadow-[3px_3px_0px_#1E2433]' : 'shadow-[0_0_15px_rgba(132,204,22,0.25)]';

  return (
    <div ref={settingsRef} className="settings-page w-full flex flex-col gap-5 pb-4 max-w-4xl mx-auto">
      {/* Compact Page Header */}
      <div className={`flex flex-col gap-1 border-b pb-3 ${isEditorial ? 'border-ink-900/20' : 'border-lime-400/15'}`}>
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg">⚙️</span>
          <h1 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight">
            {t.settingsTitle}
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          {t.settingsSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* 1. Language Setting */}
        <div className="settings-card">
          <Card
            title={t.interfaceLanguage}
            subtitle={t.interfaceLanguageDesc}
            className="h-full"
          >
            <div className="flex flex-col gap-2.5 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('uz')}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col gap-0.5 ${
                    language === 'uz'
                      ? `${accentBg} ${accentBorder} ${accentGlow} text-slate-100`
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">O'zbekcha</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded bg-slate-800/80 font-mono font-bold ${accentText} border border-slate-700`}>
                      UZ
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Interfeys o'zbek tilida</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col gap-0.5 ${
                    language === 'en'
                      ? `${accentBg} ${accentBorder} ${accentGlow} text-slate-100`
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">English</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800/80 font-mono font-bold text-cyan-300 border border-slate-700">
                      EN
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">UI chrome in English</span>
                </button>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800/80 text-[10px] text-slate-400 flex items-center gap-1.5">
                <span className={accentText}>ℹ</span>
                <span>
                  {language === 'uz'
                    ? "Lug'at tahlilidagi maqsadli til (nemischa, ispancha...) alohida ishlaydi."
                    : 'Target translation language in analyzer remains independent.'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* 2. Visual Theme Setting */}
        <div className="settings-card">
          <Card
            title={t.siteTheme}
            subtitle={t.siteThemeDesc}
            className="h-full"
          >
            <div className="flex flex-col gap-2.5 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Theme 1: Lime */}
                <button
                  type="button"
                  onClick={() => setTheme('neon-lime')}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col gap-1.5 ${
                    theme === 'neon-lime'
                      ? 'bg-lime-500/15 border-lime-400/60 shadow-[0_0_15px_rgba(132,204,22,0.25)] text-lime-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-blue-600 to-lime-400 border border-lime-300/40" />
                    <span className="font-bold text-xs">Neon Lime</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#84cc16]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0d3b66]" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {language === 'uz' ? 'Klassik limon-moviy' : 'Classic Lime & Ocean'}
                  </span>
                </button>

                {/* Theme 2: Editorial Milk (Claude & Journal Adventure) */}
                <button
                  type="button"
                  onClick={() => setTheme('editorial-milk')}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col gap-1.5 ${
                    theme === 'editorial-milk'
                      ? 'bg-amber-100/90 border-[#1E2433] shadow-[3px_3px_0px_#1E2433] text-ink-900 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#DDD6FE] via-[#FAF7F2] to-[#FBCFE8] border-2 border-[#1E2433]" />
                    <span className="font-serif font-bold text-xs">Editorial Milk</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FAF7F2] border border-[#1E2433]" title="Milk Ivory" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#DDD6FE] border border-[#1E2433]" title="Lavender" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FBCFE8] border border-[#1E2433]" title="Blush" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1E2433]" title="Ink 900" />
                  </div>
                  <span className="text-[10px] font-sans opacity-80">
                    {language === 'uz' ? 'Klod iliq sut & siyoh' : 'Claude Warm Milk & Ink'}
                  </span>
                </button>

                {/* Theme 3: Silver */}
                <button
                  type="button"
                  onClick={() => setTheme('brushed-silver')}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col gap-1.5 ${
                    theme === 'brushed-silver'
                      ? 'bg-slate-300/15 border-slate-300/70 shadow-[0_0_15px_rgba(226,232,240,0.25)] text-slate-100'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-slate-500 via-slate-200 to-sky-400 border border-slate-300/60" />
                    <span className="font-bold text-xs">Brushed Silver</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e2e8f0]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#64748b]" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {language === 'uz' ? 'Metall kumush & muz safir' : 'Silver & Ice Sapphire'}
                  </span>
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* 3. Background Waves Animation Setting */}
        <div className="settings-card">
          <Card
            title={t.bgAnimation}
            subtitle={t.bgAnimationDesc}
            className="h-full"
          >
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 mt-2">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-200">
                  {bgAnimation ? t.stateOn : t.stateOff}
                </span>
                <span className="text-[10px] text-slate-400">
                  {bgAnimation
                    ? (language === 'uz' ? 'WebGL interaktiv to\'lqinlar faol' : 'Real-time WebGL shader active')
                    : (language === 'uz' ? 'Statik minimal fon (energiya tejaydi)' : 'Minimal static background')}
                </span>
              </div>

              {/* Compact Switch */}
              <button
                type="button"
                onClick={() => setBgAnimation(!bgAnimation)}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 cursor-pointer relative ${
                  bgAnimation ? (isEditorial ? 'bg-lavender-500' : 'bg-lime-500') : 'bg-slate-800'
                }`}
                aria-label="Toggle background animation"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-slate-950 shadow transition-transform duration-300 ${
                    bgAnimation ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </Card>
        </div>

        {/* 4. AI Server Diagnostics (Render.com) */}
        <div className="settings-card">
          <Card
            title={t.serverSection}
            subtitle={t.serverSectionDesc}
            className="h-full"
          >
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      status === 'live'
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                        : status === 'waking'
                        ? 'bg-blue-400 animate-ping'
                        : 'bg-amber-400'
                    }`}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-200">
                      {status === 'live'
                        ? (language === 'uz' ? 'Server faol (Onlayn)' : 'Live & Active')
                        : status === 'waking'
                        ? (language === 'uz' ? 'Uyg\'otilmoqda...' : 'Waking up...')
                        : (language === 'uz' ? 'Uyquda (Kutish rejimi)' : 'Sleeping (Standby)')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {message}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={wakeServer}
                  disabled={status === 'waking' || status === 'live'}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold font-mono transition-all duration-200 cursor-pointer ${
                    status === 'live'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 cursor-default'
                      : status === 'waking'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                      : isEditorial
                      ? 'bg-lavender-200 hover:bg-lavender-300 text-ink-900 border-2 border-ink-900 shadow-[2px_2px_0px_#1E2433] font-bold active:scale-95'
                      : 'bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold active:scale-95'
                  }`}
                >
                  {status === 'live' ? '✓ Online' : status === 'waking' ? '⏳ Waking...' : `⚡ ${t.serverWakeBtn}`}
                </button>
              </div>

              <p className="text-[10px] text-slate-400 font-mono">
                {status === 'live' ? t.serverLiveDesc : status === 'waking' ? t.serverWakingDesc : t.serverSleepingDesc}
              </p>
            </div>
          </Card>
        </div>

        {/* 5. Account & Quota summary */}
        {currentUser && (
          <div className="settings-card md:col-span-2">
            <Card
              title={t.accountSection}
              subtitle={t.accountDesc}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-1">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col">
                  <span className="text-[9px] text-slate-400 font-mono uppercase">Foydalanuvchi</span>
                  <span className="text-xs font-bold text-slate-100 mt-0.5 truncate">
                    {currentUser.first_name} {currentUser.last_name || ''}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    ID: {currentUser.id}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col">
                  <span className="text-[9px] text-slate-400 font-mono uppercase">{t.planType}</span>
                  <span className={`text-xs font-bold mt-0.5 ${isPremium ? 'text-amber-300' : 'text-cyan-300'}`}>
                    {isPremium ? '⭐ VIP Cheksiz' : 'Oddiy rejim'}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    {isPremium ? '24 soatlik sikl' : '48 soatlik sikl'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col">
                  <span className="text-[9px] text-slate-400 font-mono uppercase">{t.dailyLimit}</span>
                  <span className={`text-xs font-bold mt-0.5 ${accentText}`}>
                    {sessionCount} / {maxAllowedLimit} ta so'z
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    {maxAllowedLimit - sessionCount} ta qoldi
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* FOOTER: Only visible in Settings at the very end when user scrolls down! */}
      <div className={`w-full mt-6 pt-4 border-t ${isEditorial ? 'border-ink-900/20' : 'border-lime-400/15'}`}>
        <Footer
          onOpenLegal={onOpenLegal}
          onOpenCookie={onOpenCookie}
        />
      </div>
    </div>
  );
}
