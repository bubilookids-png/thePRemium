// src/components/AiLoader.tsx
import React, { useState, useEffect } from 'react';

export const AiLoader = ({ word }: { word: string }) => {
  const [logIndex, setLogIndex] = useState(0);
  
  const logs = [
    "Initializing neural pathways...",
    "Scanning linguistic databases...",
    "Extracting semantic relations...",
    "Generating contextual examples...",
    "Finalizing knowledge card..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLogIndex((prev) => (prev < logs.length - 1 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#02130e]/95 border border-[#F8E7C9]/20 p-8 sm:p-12 text-center shadow-[0_0_50px_rgba(6,78,59,0.3)] backdrop-blur-xl">
      {/* Moving Border Glow Beam */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none border border-[#10b981]/40 animate-pulse" />
      
      {/* Cyber Matrix Neural Core */}
      <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute w-14 h-14 rounded-full bg-[#10b981]/20 blur-md animate-ping" />
        <div className="absolute inset-0 rounded-full border border-[#10b981]/30 animate-spin" style={{ animationDuration: '8s' }} />
        <div className="absolute rounded-full border border-[#F8E7C9]/30 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse', inset: '-10px' }} />
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-[#064E3B] to-[#10b981] border border-[#F8E7C9]/40 shadow-[0_0_25px_#10b981] flex items-center justify-center text-xs font-mono font-bold text-[#F8E7C9]">
          V
        </div>
      </div>

      {/* Text Section */}
      <div className="relative z-10">
        <h2 className="text-xl sm:text-2xl font-bold text-[#F8E7C9] mb-3 font-mono tracking-tight">
          Analyzing <span className="text-[#10b981]">"{word}"</span>
        </h2>
        
        <div className="flex items-center justify-center gap-3">
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#10b981]" />
          <p className="text-xs sm:text-sm font-mono text-[#F8E7C9]/80 animate-pulse tracking-wide">
            {logs[logIndex]}
          </p>
          <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#10b981]" />
        </div>

        {/* Progress Bars */}
        <div className="flex gap-2 mt-8 justify-center">
          {logs.map((_, i) => (
            <div 
              key={i}
              className={`h-1.5 rounded-full transition-all duration-700 ${
                i <= logIndex ? 'w-8 bg-[#10b981] shadow-[0_0_12px_#10b981]' : 'w-2 bg-[#062b21] border border-[#F8E7C9]/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Atmospheric Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
           style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
    </div>
  );
};