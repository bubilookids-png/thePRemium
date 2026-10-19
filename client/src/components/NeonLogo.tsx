// client/src/components/NeonLogo.tsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface NeonLogoProps {
  className?: string;
  size?: number;
}

export function NeonLogo({ className = '', size = 26 }: NeonLogoProps) {
  const { theme } = useTheme();
  const isEditorial = theme === 'editorial-milk';

  const primaryGlow = isEditorial ? '#6D28D9' : '#84cc16';
  const accentGlow = isEditorial ? '#DB2777' : '#06b6d4';

  return (
    <div
      className={`neon-logo-wrapper relative inline-flex items-center justify-center select-none group cursor-pointer transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
      title="UniveBooster"
    >
      {/* Background radial neon glow */}
      <div
        className="absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${primaryGlow} 0%, ${accentGlow} 60%, transparent 80%)`,
        }}
      />

      {/* High-definition Vector Neon Stylized 'V' Logo */}
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 transition-all duration-300"
        style={{
          filter: `drop-shadow(0 0 2.5px ${primaryGlow}) drop-shadow(0 0 6px ${accentGlow})`,
        }}
      >
        <defs>
          <linearGradient id="neonVGrad" x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isEditorial ? '#DDD6FE' : '#ecfccb'} />
            <stop offset="60%" stopColor={isEditorial ? '#8B5CF6' : '#a3e635'} />
            <stop offset="100%" stopColor={isEditorial ? '#6D28D9' : '#84cc16'} />
          </linearGradient>

          <linearGradient id="neonSlashGrad" x1="18" y1="12" x2="24" y2="15" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* Left Arm of V */}
        <path
          d="M7.5 7.5 L16 24.5 L18 24.5 L11.5 7.5 Z"
          fill="url(#neonVGrad)"
        />

        {/* Right Arm of V (lower segment) */}
        <path
          d="M16 24.5 L20.2 16 L17.5 16 L15 22 Z"
          fill="url(#neonVGrad)"
        />

        {/* Right Arm of V (upper segment) */}
        <path
          d="M21.5 13 L24.5 7.5 L20.5 7.5 L19.2 10.5 Z"
          fill="url(#neonVGrad)"
        />

        {/* Intersecting Electric Cyan Ribbon/Beam across right arm */}
        <polygon
          points="17.2,12.2 24.8,15.8 23.8,17.2 16.2,13.6"
          fill="url(#neonSlashGrad)"
          style={{
            filter: 'drop-shadow(0 0 3px #06b6d4)',
          }}
        />

        {/* Central Core Glow Sparkle */}
        <circle
          cx="16"
          cy="24"
          r="1"
          fill="#ffffff"
          style={{ opacity: 0.8 }}
        />
      </svg>
    </div>
  );
}
