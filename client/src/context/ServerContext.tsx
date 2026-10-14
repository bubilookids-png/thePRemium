// client/src/context/ServerContext.tsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export type ServerState = 'sleeping' | 'waking' | 'live' | 'error';

interface ServerContextValue {
  status: ServerState;
  message: string;
  wakeServer: () => Promise<void>;
  checkServer: () => Promise<boolean>;
}

const API_BASE =
  import.meta.env.VITE_API_BASE?.toString().trim() ||
  'http://localhost:8787';

const ServerContext = createContext<ServerContextValue | undefined>(undefined);

export function ServerProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<ServerState>('sleeping');
  const [message, setMessage] = useState('Server is sleeping');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function checkServer(): Promise<boolean> {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 6000);

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
        setStatus('live');
        setMessage('Ready to analyze words');
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      clearTimeout(timeout);
    }
  }

  // Initial passive health check on app load
  useEffect(() => {
    checkServer().then((alive) => {
      if (!alive) {
        setStatus('sleeping');
        setMessage('Server is sleeping');
      }
    });

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, []);

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
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      attempts += 1;
      const alive = await checkServer();

      if (alive) {
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = null;
        setStatus('live');
        setMessage('Ready to analyze words');
        return;
      }

      if (attempts >= 30) {
        if (pollRef.current) clearInterval(pollRef.current);
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
    <ServerContext.Provider value={{ status, message, wakeServer, checkServer }}>
      {children}
    </ServerContext.Provider>
  );
}

export function useServerStatus() {
  const ctx = useContext(ServerContext);
  if (!ctx) {
    throw new Error('useServerStatus must be used within a ServerProvider');
  }
  return ctx;
}
