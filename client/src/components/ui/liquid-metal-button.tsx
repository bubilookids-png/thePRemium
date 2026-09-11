// src/components/ui/liquid-metal-button.tsx
import React from 'react';

interface LiquidMetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export function LiquidMetalButton({
  label,
  disabled,
  className = '',
  ...props
}: LiquidMetalButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`relative group overflow-hidden rounded-full p-[1px] font-mono text-xs font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${className}`}
    >
      {/* 360 daraja aylanuvchi Liquid Glow effekti */}
      <span
        className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]"
        style={{
          background:
            'conic-gradient(from 0deg, #a855f7 0deg, #38bdf8 120deg, #ec4899 240deg, #a855f7 360deg)',
        }}
      />

      {/* Tugma asosiy korpusi */}
      <span className="relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-950/90 group-hover:bg-slate-950/70 text-white transition-colors duration-200">
        <span className="tracking-wider uppercase">{label}</span>
        <span className="text-purple-400 group-hover:translate-x-1 transition-transform duration-200">
          ✦
        </span>
      </span>
    </button>
  );
}