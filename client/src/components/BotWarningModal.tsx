import React, { useEffect, useRef } from 'react';

interface BotWarningModalProps {
  botKind?: string;
  onClose: () => void;
  onRetry: () => void;
}

export function BotWarningModal({ botKind, onClose, onRetry }: BotWarningModalProps) {
  const retryButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Accessible autofocus on the primary recovery action
    retryButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bot-warning-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none font-mono"
    >
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-950 border border-amber-400/30 shadow-[0_0_50px_rgba(245,158,11,0.2)] text-slate-100 backdrop-blur-2xl animate-retention-fade text-center">
        {/* Glow ambient background accents */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close icon */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-amber-300 transition text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-900 cursor-pointer"
          aria-label="Yopish"
        >
          ✕
        </button>

        {/* Warning Icon */}
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-red-500/20 border border-amber-400/40 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(245,158,11,0.25)]">
          🤖
        </div>

        {/* Status tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[10px] font-bold tracking-widest uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          Avtomatlashtirilgan Faollik Aniqlandi
        </div>

        {/* Title */}
        <h3 id="bot-warning-title" className="text-xl font-extrabold text-white tracking-tight mb-2">
          Xavfsizlik Tekshiruvi
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
          Brauzeringizda avtomatlashtirilgan dasturiy ta'minot yoki skript signallari aniqlandi
          {botKind ? ` (${botKind})` : ''}. Xavfsizlik maqsadida tizimga kirish vaqtincha to'xtatildi.
        </p>

        {/* Recovery advice box */}
        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-amber-400/15 text-left mb-6 space-y-2 text-xs text-slate-400">
          <div className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">1.</span>
            <span>Brauzer plaginlari yoki avtomatlashtirish kengaytmalarini o'chirib ko'ring.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">2.</span>
            <span>Standart brauzer rejimiga o'ting va sahifani qayta yuklang.</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            Sahifani yangilash
          </button>
          <button
            type="button"
            ref={retryButtonRef}
            onClick={onRetry}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-lime-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] text-slate-950 font-bold text-xs transition cursor-pointer active:scale-95"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    </div>
  );
}
export default BotWarningModal;
