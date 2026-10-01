// src/components/CookieModal.tsx
import React, { useState } from 'react';

interface CookieModalProps {
  onClose: () => void;
}

export function CookieModal({ onClose }: CookieModalProps) {
  const [analytics, setAnalytics] = useState(true);
  const [functional, setFunctional] = useState(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none font-mono">
      <div className="relative w-full max-w-lg flex flex-col p-6 sm:p-7 rounded-3xl bg-slate-950 border border-lime-400/20 shadow-2xl text-slate-100">

        {/* Yopish tugmasi */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-lime-300 transition text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-lime-500/10 cursor-pointer"
        >
          ✕
        </button>

        {/* Sarlavha */}
        <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-lime-400/15">
          <span className="text-xl">🍪</span>
          <h3 className="text-lg font-bold text-lime-300">Cookie Sozlamalari</h3>
        </div>

        {/* Mazmun */}
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <p>
            Biz sayt ish faoliyatini ta'minlash, kunlik limitlarni saqlash va tajribangizni yaxshilash uchun <code className="text-lime-300">localStorage</code> va cookie'lardan foydalanamiz.
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-lime-400/15 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-100 block">Zaruriy (Strictly Necessary)</span>
                <span className="text-[10px] text-slate-400">Sessiya va login uchun doim faol</span>
              </div>
              <input type="checkbox" checked disabled className="accent-lime-400 w-4 h-4 cursor-not-allowed" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-lime-400/15">
              <div>
                <span className="font-bold text-slate-100 block">Analitika & Xotira</span>
                <span className="text-[10px] text-slate-400">Qidiruv tarixi va limitlar statistikasi</span>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="accent-lime-400 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Saqlash va yopish */}
        <div className="pt-5 mt-5 border-t border-lime-400/15 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-100 text-xs transition cursor-pointer border border-lime-400/15"
          >
            Bekor qilish
          </button>
          <button
            onClick={() => {
              localStorage.setItem('vacabbro_cookie_prefs', JSON.stringify({ analytics }));
              onClose();
              alert('✅ Cookie sozlamalari saqlandi!');
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 hover:shadow-[0_0_25px_rgba(132,204,22,0.5)] text-slate-950 font-bold text-xs transition cursor-pointer"
          >
            Saqlash
          </button>
        </div>

      </div>
    </div>
  );
}