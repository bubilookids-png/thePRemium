import React, { useState } from 'react';

export const COOKIE_CONSENT_KEY = 'univebooster_cookie_consent_v1';

export function hasGivenCookieConsent(): boolean {
  try {
    const val = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!val) return false;
    const parsed = JSON.parse(val);
    return Boolean(parsed?.agreed);
  } catch {
    return false;
  }
}

interface CookieModalProps {
  onClose: () => void;
  onOpenLegal?: () => void;
}

export function CookieModal({ onClose, onOpenLegal }: CookieModalProps) {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [functionalEnabled, setFunctionalEnabled] = useState(true);

  const saveConsent = (analytics: boolean, functional: boolean) => {
    try {
      const payload = {
        agreed: true,
        essential: true,
        analytics,
        functional,
        timestamp: Date.now()
      };
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(payload));
    } catch (err) {
      console.error('Failed to store cookie consent', err);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn select-none font-mono">
      <div className="relative w-full max-w-xl flex flex-col p-6 sm:p-8 rounded-3xl bg-slate-950/95 border border-lime-400/25 shadow-[0_0_50px_rgba(0,0,0,0.9)] text-slate-100 backdrop-blur-2xl animate-retention-fade">
        {/* Glow ambient background accent */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b border-lime-400/15 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-lime-400/20 to-cyan-400/20 border border-lime-400/30 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(163,230,53,0.2)]">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                <span className="text-[10px] font-bold text-lime-400 uppercase tracking-widest">
                  XAVFSIZLIK VA MAXFIYLIK
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Maxfiylik va Cookie Siyosati
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition text-base w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-900 cursor-pointer"
            title="Yopish"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed relative z-10">
          <p>
            <strong>UniveBooster</strong> platformasiga xush kelibsiz! Biz tizimning xavfsiz va uzluksiz ishlashini ta'minlash, qidiruv limitlarini to'g'ri hisoblash hamda ta'lim progressini saqlab borish uchun brauzeringizning mahalliy xotirasidan (<code className="text-lime-300 font-bold">localStorage</code>) va zaruriy cookie fayllaridan foydalanamiz.
          </p>

          {/* Categorized Permission Switches */}
          <div className="space-y-2.5">
            {/* 1. Zaruriy */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-lime-400/15 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">
                    Zaruriy tizim xotirasi (Majburiy)
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-lime-500/15 text-lime-400 border border-lime-400/30 font-bold">
                    DOIM FAOL
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Telegram orqali kirish (avtorizatsiya), seans holati va kunlik so'z kvotasini nazorat qilish.
                </p>
              </div>
              <input
                type="checkbox"
                checked
                disabled
                className="accent-lime-400 w-4 h-4 cursor-not-allowed opacity-80"
              />
            </div>

            {/* 2. Funksional va Shaxsiy Lug'at */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-lime-400/30 transition flex items-center justify-between gap-3">
              <div>
                <span className="font-bold text-white text-xs block">
                  Lug'at tarixi va ta'lim statistikasi (Tavsiya etiladi)
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  So'nggi qidirilgan so'zlar, Active Recall o'rganish natijalari va interfeys sozlamalari.
                </p>
              </div>
              <input
                type="checkbox"
                checked={functionalEnabled}
                onChange={(e) => setFunctionalEnabled(e.target.checked)}
                className="accent-lime-400 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          {/* Legal Notice with Link */}
          <p className="text-[11px] text-slate-400 pt-1">
            Davom etish orqali siz bizning{' '}
            <button
              type="button"
              onClick={onOpenLegal}
              className="text-lime-300 underline underline-offset-2 hover:text-lime-200 cursor-pointer"
            >
              Foydalanish shartlari
            </button>{' '}
            va{' '}
            <button
              type="button"
              onClick={onOpenLegal}
              className="text-lime-300 underline underline-offset-2 hover:text-lime-200 cursor-pointer"
            >
              Maxfiylik siyosati
            </button>
            ga rozilik bildirasiz.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-5 mt-5 border-t border-lime-400/15 flex flex-col sm:flex-row items-center justify-end gap-3 relative z-10">
          <button
            onClick={() => saveConsent(false, false)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 font-semibold text-xs transition cursor-pointer"
          >
            Faqat zaruriylarini qabul qilish
          </button>

          <button
            onClick={() => saveConsent(true, true)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-950 font-extrabold text-xs shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_25px_rgba(163,230,53,0.5)] transition cursor-pointer"
          >
            Barchasini qabul qilish
          </button>
        </div>
      </div>
    </div>
  );
}
export default CookieModal;