import React, { useRef } from 'react';
import { useAnimatedDismiss, useMotionEntrance } from '../utils/motion';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import type { TelegramUser } from './Header';

interface TelegramLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  deepLink: string | null;
  waitingAuth: boolean;
  authenticatedUser: TelegramUser | null;
}

export function TelegramLoginModal({
  isOpen,
  onClose,
  deepLink,
  waitingAuth,
  authenticatedUser,
}: TelegramLoginModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  useMotionEntrance(panelRef, isOpen);
  const dismiss = useAnimatedDismiss(overlayRef, panelRef, onClose);
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isEditorial = theme === 'editorial-milk';

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn select-none"
      onClick={() => dismiss()}
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md p-6 sm:p-8 rounded-3xl transition-all ${
          isEditorial
            ? 'bg-[#FFFDF9] border-2 border-[#1E2433] shadow-[8px_8px_0px_#1E2433] text-[#1E2433]'
            : 'bg-slate-950 border border-lime-400/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-slate-100'
        }`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => dismiss()}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition cursor-pointer ${
            isEditorial
              ? 'text-[#64748B] hover:text-[#1E2433] hover:bg-slate-100'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
          title="Yopish"
        >
          ✕
        </button>

        {/* Header Icon + Title */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-[#1E2433]/15">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
              isEditorial
                ? 'bg-purple-100 border-2 border-[#1E2433] text-[#6D28D9]'
                : 'bg-[#229ED9]/20 border border-[#229ED9]/40 text-[#229ED9]'
            }`}
          >
            <svg className="w-6 h-6 fill-[#229ED9]" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.92 9.06c-.14.65-.53.81-1.07.5l-2.97-2.19-1.43 1.38c-.16.16-.29.29-.6.29l.21-3.03 5.52-4.99c.24-.21-.05-.33-.37-.12l-6.82 4.3-2.94-.92c-.64-.2-.65-.64.13-.95l11.5-4.43c.53-.2 1 .12.89.98z" />
            </svg>
          </div>
          <div>
            <h3
              className={`text-lg sm:text-xl font-black tracking-tight ${
                isEditorial ? 'font-serif text-[#1E2433]' : 'text-white font-mono'
              }`}
            >
              {language === 'uz' ? 'Telegram orqali kirish' : 'Sync with Telegram'}
            </h3>
            <p className={`text-xs ${isEditorial ? 'text-[#64748B]' : 'text-slate-400'}`}>
              {language === 'uz' ? 'Parolsiz 1 bosqichda xavfsiz ulanish' : 'Instant passwordless authentication'}
            </p>
          </div>
        </div>

        {authenticatedUser ? (
          /* Success state */
          <div className="py-6 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-600 text-emerald-600 flex items-center justify-center text-2xl font-black animate-bounce">
              ✓
            </div>
            <h4 className={`text-lg font-black ${isEditorial ? 'text-[#1E2433]' : 'text-white'}`}>
              {language === 'uz'
                ? `Xush kelibsiz, ${authenticatedUser.first_name}!`
                : `Welcome, ${authenticatedUser.first_name}!`}
            </h4>
            <p className={`text-xs ${isEditorial ? 'text-[#475569]' : 'text-slate-300'}`}>
              {language === 'uz'
                ? 'Hisobingiz ulandi, tizim ishga tushirilmoqda...'
                : 'Account verified! Launching trainer...'}
            </p>
          </div>
        ) : (
          /* Step-by-step guidance */
          <div className="space-y-4">
            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-3 ${
                isEditorial
                  ? 'bg-[#FAF7F2] border-[#1E2433]/20 text-[#1E2433]'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#6D28D9] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  {language === 'uz' ? (
                    <>
                      Quyidagi tugma orqali Telegram botga o'ting va pastdagi <strong>"Start" (Boshlash)</strong> tugmasini bosing.
                    </>
                  ) : (
                    <>
                      Open the Telegram bot below and tap <strong>"Start"</strong>.
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#6D28D9] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  {language === 'uz' ? (
                    <>
                      Botdagi <strong>"🚀 Saytga kirish"</strong> tugmasini bosing yoki to'g'ridan-to'g'ri shu brauzer oynasiga qayting.
                    </>
                  ) : (
                    <>
                      Tap the <strong>"🚀 Open App"</strong> button sent by the bot or simply switch back to this tab.
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  3
                </span>
                <p>
                  {language === 'uz' ? (
                    <>
                      Hisobingiz <strong>avtomatik tarzda ulanadi</strong> va dars boshlanadi!
                    </>
                  ) : (
                    <>
                      Your profile will sync <strong>automatically</strong> and unlock your vocabulary trainer.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Direct Open Button */}
            {deepLink ? (
              <a
                href={deepLink}
                target="_blank"
                rel="noopener noreferrer"
                style={isEditorial ? { backgroundColor: '#6D28D9', color: '#FFFFFF' } : undefined}
                className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition cursor-pointer active:scale-[0.98] ${
                  isEditorial
                    ? 'border-2 border-[#1E2433] shadow-[4px_4px_0px_#1E2433] hover:bg-[#5B21B6]'
                    : 'bg-gradient-to-r from-lime-400 via-lime-300 to-cyan-400 text-slate-950 font-extrabold hover:shadow-[0_0_25px_rgba(132,204,22,0.4)]'
                }`}
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.92 9.06c-.14.65-.53.81-1.07.5l-2.97-2.19-1.43 1.38c-.16.16-.29.29-.6.29l.21-3.03 5.52-4.99c.24-.21-.05-.33-.37-.12l-6.82 4.3-2.94-.92c-.64-.2-.65-.64.13-.95l11.5-4.43c.53-.2 1 .12.89.98z" />
                </svg>
                <span>{language === 'uz' ? 'Telegram botni ochish' : 'Open Telegram Bot'}</span>
                <span>→</span>
              </a>
            ) : (
              <div className="py-3 text-center text-xs text-slate-400 animate-pulse">
                {language === 'uz' ? 'Havola tayyorlanmoqda...' : 'Preparing secure login link...'}
              </div>
            )}

            {/* Waiting status indicator */}
            <div className="flex items-center justify-center gap-2 pt-2 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className={isEditorial ? 'text-[#64748B]' : 'text-slate-400'}>
                {waitingAuth
                  ? (language === 'uz' ? 'Telegramdan tasdiq kutilmoqda...' : 'Waiting for Telegram confirmation...')
                  : (language === 'uz' ? 'Tayyor' : 'Ready')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
