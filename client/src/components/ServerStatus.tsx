import React, { useEffect, useRef, useState } from 'react';

type ServerState = 'sleeping' | 'waking' | 'live' | 'error';

const API_BASE =
  import.meta.env.VITE_API_BASE?.toString().trim() ||
  'http://localhost:8787';

export function ServerStatus() {
  const [status, setStatus] = useState<ServerState>('sleeping');
  const [message, setMessage] = useState('Server is sleeping');
  const [isHovered, setIsHovered] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, []);

  async function checkServer() {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000);

    try {
      const response = await fetch(`${API_BASE}/api/health`, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error('Server unavailable');
      }

      const data = await response.json();

      if (data?.ok === true) {
        return true;
      }

      return false;
    } catch {
      return false;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function wakeServer() {
    if (status === 'waking' || status === 'live') {
      return;
    }

    setStatus('waking');
    setMessage('Waking AI server...');

    const started = await checkServer();

    if (started) {
      setStatus('live');
      setMessage('Ready to analyze words');
      return;
    }

    let attempts = 0;

    pollRef.current = setInterval(async () => {
      attempts += 1;

      const alive = await checkServer();

      if (alive) {
        if (pollRef.current) {
          clearInterval(pollRef.current);
        }

        pollRef.current = null;
        setStatus('live');
        setMessage('Ready to analyze words');
        return;
      }

      if (attempts >= 30) {
        if (pollRef.current) {
          clearInterval(pollRef.current);
        }

        pollRef.current = null;
        setStatus('error');
        setMessage('Could not wake the server');
      } else {
        setMessage(
          attempts % 2 === 0
            ? 'Connecting to AI...'
            : 'Waking AI server...'
        );
      }
    }, 3000);
  }

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

        @keyframes serverSparkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }

        @keyframes serverGlow {
          0%, 100% {
            box-shadow: 0 0 8px rgba(132, 204, 22, 0.3), inset 0 0 8px rgba(132, 204, 22, 0.1);
            border-color: rgba(132, 204, 22, 0.3);
          }
          50% {
            box-shadow: 0 0 16px rgba(132, 204, 22, 0.5), inset 0 0 12px rgba(132, 204, 22, 0.2);
            border-color: rgba(132, 204, 22, 0.5);
          }
        }

        @keyframes dotPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.3);
          }
        }

        @keyframes dotBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes arrowPulse {
          0%, 100% {
            opacity: 0.6;
            transform: translateX(0);
          }
          50% {
            opacity: 1;
            transform: translateX(3px);
          }
        }

        @keyframes arrowSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes liveGlow {
          0%, 100% {
            box-shadow: 0 0 12px rgba(34, 197, 94, 0.4), inset 0 0 12px rgba(34, 197, 94, 0.15);
            border-color: rgba(34, 197, 94, 0.5);
          }
          50% {
            box-shadow: 0 0 24px rgba(34, 197, 94, 0.6), inset 0 0 16px rgba(34, 197, 94, 0.25);
            border-color: rgba(34, 197, 94, 0.7);
          }
        }

        @keyframes errorShake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-3px);
          }
          75% {
            transform: translateX(3px);
          }
        }

        @keyframes textFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
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
          animation: serverGlow 2s ease-in-out infinite;
        }

        .server-status-live {
          color: rgba(34, 197, 94, 0.9);
          animation: liveGlow 2.5s ease-in-out infinite;
        }

        .server-status-error {
          color: rgba(244, 63, 94, 0.8);
          animation: errorShake 0.4s ease-in-out;
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
          animation: serverSparkle 1.5s ease-in-out infinite;
        }

        .server-status-sleeping .server-spark {
          animation: serverSparkle 2s ease-in-out infinite;
        }

        .server-status-live .server-spark {
          animation: serverSparkle 1.2s ease-in-out infinite;
          color: rgba(34, 197, 94, 1);
          text-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
        }

        .server-status-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
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
          animation: textFade 0.5s ease-in;
        }

        .server-status-dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: currentColor;
          animation: dotPulse 1.5s ease-in-out infinite;
        }

        .server-status-sleeping .server-status-dot {
          opacity: 0.5;
        }

        .server-status-waking .server-status-dot {
          animation: dotBounce 0.8s ease-in-out infinite;
          background: rgba(59, 130, 246, 0.9);
        }

        .server-status-live .server-status-dot {
          animation: dotPulse 1s ease-in-out infinite;
          background: rgba(34, 197, 94, 1);
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
        }

        .server-status-error .server-status-dot {
          animation: dotPulse 0.6s ease-in-out infinite;
          background: rgba(244, 63, 94, 0.9);
        }

        .server-status-arrow {
          display: inline-block;
          font-size: 11px;
          transition: all 0.3s ease;
          opacity: 0.7;
        }

        .server-status-sleeping .server-status-arrow {
          animation: arrowPulse 1.5s ease-in-out infinite;
        }

        .server-status-error .server-status-arrow {
          animation: arrowSpin 1.5s linear infinite;
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
        type="button"
        className={`server-status server-status-${status}`}
        onClick={wakeServer}
        disabled={status === 'waking' || status === 'live'}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`AI server status: ${status}`}
        title={
          status === 'sleeping'
            ? 'Click to wake AI server'
            : status === 'waking'
            ? 'Waking up AI server...'
            : status === 'live'
            ? 'AI server is live and ready'
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
              ? 'Wake AI'
              : status === 'waking'
              ? 'Waking...'
              : status === 'live'
              ? 'Live'
              : 'Error'}
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