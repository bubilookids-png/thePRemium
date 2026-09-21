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
      <div className="relative w-full max-w-lg flex flex-col p-6 sm:p-7 rounded-3xl bg-[#02130e] border border-[#F8E7C9]/20 shadow-2xl text-[#F8E7C9]">
        
        {/* Yopish tugmasi */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#F8E7C9]/50 hover:text-white transition text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 cursor-pointer"
        >
          ✕
        </button>

        {/* Sarlavha */}
        <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-[#F8E7C9]/10">
          <span className="text-xl">🍪</span>
          <h3 className="text-lg font-bold">Cookie Sozlamalari</h3>
        </div>

        {/* Mazmun */}
        <div className="space-y-4 text-xs text-[#F8E7C9]/80 leading-relaxed">
          <p>
            Biz sayt ish faoliyatini ta'minlash, kunlik limitlarni saqlash va tajribangizni yaxshilash uchun <code className="text-[#10b981]">localStorage</code> va cookie'lardan foydalanamiz.
          </p>

          <div className="p-3.5 rounded-2xl bg-[#062b21]/60 border border-[#F8E7C9]/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-[#F8E7C9] block">Zaruriy (Strictly Necessary)</span>
                <span className="text-[10px] text-[#F8E7C9]/50">Sessiya va login uchun doim faol</span>
              </div>
              <input type="checkbox" checked disabled className="accent-[#10b981] w-4 h-4 cursor-not-allowed" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F8E7C9]/10">
              <div>
                <span className="font-bold text-[#F8E7C9] block">Analitika & Xotira</span>
                <span className="text-[10px] text-[#F8E7C9]/50">Qidiruv tarixi va limitlar statistikasi</span>
              </div>
              <input 
                type="checkbox" 
                checked={analytics} 
                onChange={(e) => setAnalytics(e.target.checked)}
                className="accent-[#10b981] w-4 h-4 cursor-pointer" 
              />
            </div>
          </div>
        </div>

        {/* Saqlash va yopish */}
        <div className="pt-5 mt-5 border-t border-[#F8E7C9]/10 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#062b21] hover:bg-[#064E3B] text-[#F8E7C9] text-xs transition cursor-pointer"
          >
            Bekor qilish
          </button>
          <button
            onClick={() => {
              localStorage.setItem('vacabbro_cookie_prefs', JSON.stringify({ analytics }));
              onClose();
              alert('✅ Cookie sozlamalari saqlandi!');
            }}
            className="px-5 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-[#02130e] font-bold text-xs transition cursor-pointer"
          >
            Saqlash
          </button>
        </div>

      </div>
    </div>
  );
}