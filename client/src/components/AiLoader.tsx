// src/components/AiLoader.tsx
import React, { useState, useEffect } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export const AiLoader = ({ word, onCancel }: { word: string; onCancel?: () => void }) => {
  const [phase, setPhase] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [particleId, setParticleId] = useState(0);

  const messages = [
    "Reading linguistic DNA...",
    "Unlocking lexical secrets...",
    "Synthesizing meanings & nuances...",
    "Preparing your knowledge card..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((prev) => (prev < messages.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Generate particles
  useEffect(() => {
    const particleInterval = setInterval(() => {
      const newParticle: Particle = {
        id: particleId,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1
      };
      setParticles(prev => [...prev.slice(-20), newParticle]);
      setParticleId(prev => prev + 1);
    }, 100);
    return () => clearInterval(particleInterval);
  }, [particleId]);

  // Animate particles
  useEffect(() => {
    const animationFrame = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.05
          }))
          .filter(p => p.life > 0)
      );
    }, 30);
    return () => clearInterval(animationFrame);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950/90 border border-lime-400/15 p-10 sm:p-16 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
      {/* Particle field */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute w-1 h-1 rounded-full bg-lime-400"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: p.life,
              boxShadow: '0 0 4px rgba(132, 204, 22, 0.6)'
            }}
          />
        ))}
      </div>

      {/* Glow elements */}
      <div className="absolute top-4 left-6 w-2 h-2 bg-lime-400 rounded-full animate-ping opacity-75" style={{ animationDuration: '3s' }} />
      <div className="absolute bottom-6 right-8 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping opacity-60" style={{ animationDuration: '2s' }} />
      <div className="absolute top-1/2 right-4 w-24 h-24 bg-lime-500/10 rounded-full blur-2xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-4 left-8 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />

      {/* Floating Minimalist Ring Animation */}
      <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
        {/* Expanding Ring Wave */}
        <div className="absolute inset-0 rounded-full border border-lime-400/30 animate-ping" style={{ animationDuration: '3s' }} />

        {/* Smooth Orbiting Dot */}
        <div className="absolute inset-0 rounded-full border border-lime-400/15 animate-spin" style={{ animationDuration: '4s' }}>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-lime-400 rounded-full shadow-[0_0_10px_rgba(132,204,22,0.6)]" />
        </div>

        {/* Center Logo/Icon */}
        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-900/80 to-blue-800/80 border border-lime-400/30 shadow-lg flex items-center justify-center text-base font-bold text-lime-300">
          U
        </div>
      </div>

      {/* Word & Status */}
      <div className="relative z-10 space-y-3">
        <h2 className="text-2xl sm:text-3xl font-light text-slate-100 tracking-tight">
          Analyzing <span className="font-semibold text-lime-400">"{word}"</span>
        </h2>

        {/* Message */}
        <div className="h-6 flex items-center justify-center">
          <p className="text-sm font-light text-slate-400 transition-all duration-500 transform">
            {messages[phase]}
          </p>
        </div>

        {/* Progress */}
        <div className="w-48 h-1 bg-slate-800/60 rounded-full mx-auto mt-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-lime-400 to-cyan-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${((phase + 1) / messages.length) * 100}%` }}
          />
        </div>

        {/* Cancel Button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-6 px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600 rounded-lg transition-all duration-200"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};