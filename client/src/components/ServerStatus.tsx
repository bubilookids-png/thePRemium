// client/src/components/ServerStatus.tsx
import React, { useRef } from 'react';
import { useMotionEntrance } from '../utils/motion';
import { useServerStatus } from '../context/ServerContext';
import { useLanguage } from '../context/LanguageContext';

export function ServerStatus() {
  const { status, wakeServer } = useServerStatus();
  const { language } = useLanguage();
  const statusRef = useRef<HTMLButtonElement>(null);
  useMotionEntrance(statusRef, status);

  return (
    <>
      <style>{`
        @keyframes serverPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(132, 204, 22, 0.7);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(132, 204, 22, 0);
          }
        }

        @keyframes serverSpinner {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .server-status {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid rgba(132, 204, 22, 0.3);
          background: rgba(15, 23, 42, 0.6);
          cursor: pointer;
          transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
          font-size: 11px;
          font-weight: 600;
          font-family: monospace;
          outline: none;
        }

        .server-status:disabled {
          cursor: not-allowed;
        }

        .server-status-sleeping {
          color: rgba(132, 204, 22, 0.7);
        }

        .server-status-sleeping:hover:not(:disabled) {
          background: rgba(132, 204, 22, 0.15);
          border-color: rgba(132, 204, 22, 0.5);
          box-shadow: 0 0 16px rgba(132, 204, 22, 0.3);
          transform: translateY(-2px);
        }

        .server-status-waking {
          color: rgba(59, 130, 246, 0.9);
        }

        .server-status-live {
          color: rgba(34, 197, 94, 0.9);
        }

        .server-status-error {
          color: rgba(244, 63, 94, 0.8);
        }

        .server-status-error:hover:not(:disabled) {
          background: rgba(244, 63, 94, 0.15);
          border-color: rgba(244, 63, 94, 0.5);
          box-shadow: 0 0 16px rgba(244, 63, 94, 0.3);
        }

        .server-status-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 12px;
          height: 12px;
          position: relative;
        }

        .server-spinner {
          display: inline-block;
          width: 10px;
          height: 10px;
          border: 2px solid rgba(59, 130, 246, 0.3);
          border-top: 2px solid rgba(59, 130, 246, 0.8);
          border-radius: 50%;
          animation: serverSpinner 1s linear infinite;
        }

        .server-spark {
          display: inline-block;
        }

        .server-status-live .server-spark {
          color: rgba(34, 197, 94, 1);
          text-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
        }

        .server-status-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .server-status-label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
          opacity: 0.6;
          font-weight: 700;
        }

        .server-status-message {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
        }

        .server-status-dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: currentColor;
        }

        .server-status-sleeping .server-status-dot {
          opacity: 0.5;
        }

        .server-status-waking .server-status-dot {
          background: rgba(59, 130, 246, 0.9);
        }

        .server-status-live .server-status-dot {
          background: rgba(34, 197, 94, 1);
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
        }

        .server-status-error .server-status-dot {
          background: rgba(244, 63, 94, 0.9);
        }

        .server-status-arrow {
          display: inline-block;
          font-size: 11px;
          transition: all 0.3s ease;
          opacity: 0.7;
        }

        .server-status:hover:not(:disabled) .server-status-arrow {
          opacity: 1;
        }

        @media (max-width: 640px) {
          .server-status {
            padding: 5px 8px;
            font-size: 9px;
            gap: 6px;
          }

          .server-status-icon {
            width: 10px;
            height: 10px;
          }

          .server-spinner {
            width: 8px;
            height: 8px;
            border-width: 1.5px;
          }

          .server-status-text {
            gap: 1px;
          }

          .server-status-label {
            font-size: 8px;
            letter-spacing: 0.5px;
          }

          .server-status-message {
            font-size: 9px;
            gap: 4px;
          }

          .server-status-dot {
            width: 3px;
            height: 3px;
          }
        }
      `}</style>

      <button
        ref={statusRef}
        type="button"
        className={`server-status server-status-${status}`}
        onClick={wakeServer}
        disabled={status === 'waking' || status === 'live'}
        aria-label={`AI server status: ${status}`}
        title={
          status === 'sleeping'
            ? language === 'uz'
              ? 'Render AI serverni uyg\'otish uchun bosing'
              : 'Click to wake AI server'
            : status === 'waking'
            ? language === 'uz'
              ? 'AI server uyg\'onmoqda...'
              : 'Waking up AI server...'
            : status === 'live'
            ? language === 'uz'
              ? 'AI server faol va tayyor'
              : 'AI server is live and ready'
            : language === 'uz'
            ? 'Xatolik yuz berdi - qayta urinish uchun bosing'
            : 'Server error - click to retry'
        }
      >
        <span className="server-status-icon">
          {status === 'waking' ? (
            <span className="server-spinner" />
          ) : (
            <span className="server-spark">
              {status === 'live' ? '⚡' : status === 'error' ? '⚠' : '✦'}
            </span>
          )}
        </span>

        <span className="server-status-text">
          <span className="server-status-label">
            AI SERVER
          </span>

          <span className="server-status-message">
            <span className="server-status-dot" />
            {status === 'sleeping'
              ? (language === 'uz' ? 'Wake AI' : 'Wake AI')
              : status === 'waking'
              ? (language === 'uz' ? 'Waking...' : 'Waking...')
              : status === 'live'
              ? (language === 'uz' ? 'Live' : 'Live')
              : (language === 'uz' ? 'Error' : 'Error')}
          </span>
        </span>

        <span className="server-status-arrow">
          {status === 'sleeping'
            ? '→'
            : status === 'error'
            ? '↻'
            : ''}
        </span>
      </button>
    </>
  );
}
