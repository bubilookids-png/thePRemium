import React, { useEffect, useRef, useState } from 'react';

type ServerState = 'sleeping' | 'waking' | 'live' | 'error';

const API_BASE =
  import.meta.env.VITE_API_BASE?.toString().trim() ||
  'http://localhost:8787';

export function ServerStatus() {
  const [status, setStatus] = useState<ServerState>('sleeping');
  const [message, setMessage] = useState('Server is sleeping');
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
    <button
      type="button"
      className={`server-status server-status-${status}`}
      onClick={wakeServer}
      disabled={status === 'waking' || status === 'live'}
      aria-label={`AI server status: ${status}`}
    >
      <span className="server-status-icon">
        {status === 'waking' ? (
          <span className="server-spinner" />
        ) : (
          <span className="server-spark">✦</span>
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
            : 'Try again'}
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
  );
}