import React from 'react';
import { hasValidCookieConsent, acceptCookieConsent, CONSENT_VERSION } from '../utils/consent';

interface ConsentModalProps {
  onClose: () => void;
  onAccept: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  mode?: 'consent' | 'settings';
}

export function ConsentModal({
  onClose,
  onAccept,
  onOpenTerms,
  onOpenPrivacy,
  mode = 'consent'
}: ConsentModalProps) {
  // For settings mode, we don't have any real settings to save, so onAccept just closes the modal
  const handleAccept = () => {
    if (mode === 'consent') {
      // In consent mode, we accept the consent and then call the onAccept callback (which will continue the sign-up)
      acceptCookieConsent(false); // We don't use analytics, so set to false
      onAccept();
    } else {
      // In settings mode, we just close the modal (no actual settings to save)
      onClose();
    }
  };

  if (mode === 'consent') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none font-mono">
        <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col p-6 sm:p-8 rounded-3xl bg-slate-950 border border-lime-400/20 shadow-2xl text-slate-100">

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-lime-300 transition text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-lime-500/10 cursor-pointer"
          >
            ✕
          </button>

          {/* Icon and Title */}
          <div className="flex items-center gap-3 pb-6 mb-6 border-b border-lime-400/15">
            <div className="w-10 h-10 rounded-xl bg-blue-900/70 flex items-center justify-center text-lime-400 mb-0">
              🛡️
            </div>
            <div>
              <h3 className="text-lg font-bold text-lime-300">Your privacy matters</h3>
              <p className="text-sm text-slate-300">
                We use essential localStorage to save your session, preferences, and secure your learning progress.
              </p>
            </div>
          </div>

          {/* Consent explanation */}
          <div className="space-y-6">
            <p className="text-sm text-slate-300 leading-relaxed">
              To provide you with a personalized and secure learning experience, we use your browser's localStorage to store:
            </p>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 text-lime-300">•</span>
                <span>Your authentication state and session (so you don't have to log in every time)</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 text-lime-300">•</span>
                <span>Your daily word limits and progress tracking</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 text-lime-300">•</span>
                <span>Your UI preferences (theme, layout, etc.)</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              By continuing, you agree to our <span className="text-lime-300 cursor-hover underline"
                onClick={onOpenTerms}>
                Terms of Service
              </span> and acknowledge our <span className="text-lime-300 cursor-hover underline"
                onClick={onOpenPrivacy}>
                Privacy Policy
              </span>.
            </p>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-100 text-sm font-medium transition border border-lime-400/15 hover:border-lime-300/20"
            >
              Cancel
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-950 font-bold text-sm hover:shadow-[0_0_25px_rgba(132,204,22,0.5)] transition active:scale-[0.98]"
            >
              Agree & Continue
            </button>
          </div>

        </div>
      </div>
    );
  } else {
    // settings mode
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none font-mono">
        <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col p-6 sm:p-8 rounded-3xl bg-slate-950 border border-lime-400/20 shadow-2xl text-slate-100">

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-lime-300 transition text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-lime-500/10 cursor-pointer"
          >
            ✕
          </button>

          {/* Icon and Title */}
          <div className="flex items-center gap-3 pb-6 mb-6 border-b border-lime-400/15">
            <div className="w-10 h-10 rounded-xl bg-blue-900/70 flex items-center justify-center text-lime-400 mb-0">
              🍪
            </div>
            <div>
              <h3 className="text-lg font-bold text-lime-300">Cookie Settings</h3>
              <p className="text-sm text-slate-300">
                We only use essential cookies and localStorage to save your session, preferences, and secure your learning progress. There are no optional cookies.
              </p>
            </div>
          </div>

          {/* Settings explanation */}
          <div className="space-y-6">
            <p className="text-sm text-slate-300 leading-relaxed">
              Your current settings:
            </p>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 text-lime-300">•</span>
                <span>Essential cookies: Required (always on)</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-100 text-sm font-medium transition border border-lime-400/15 hover:border-lime-300/20"
            >
              Cancel
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-950 font-bold text-sm hover:shadow-[0_0_25px_rgba(132,204,22,0.5)] transition active:scale-[0.98]"
            >
              Save Preferences
            </button>
          </div>

        </div>
      </div>
    );
  }
}