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
    <div className="ai-loading-container">
      {/* The Moving Border Beam */}
      <div className="ai-loader-border-beam" />
      
      {/* The Neural Core */}
      <div className="neural-core">
        <div className="core-inner" />
        <div className="core-ring" />
        <div className="core-ring" style={{ animationDuration: '6s', animationDirection: 'reverse', inset: '-25px', opacity: 0.5 }} />
      </div>

      {/* Text Section */}
      <div className="status-text-container">
        <h2 className="ai-pro-title">
          Analyzing <span className="ai-pro-word">"{word}"</span>
        </h2>
        
        <div className="flex items-center justify-center gap-3">
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-purple-500" />
          <p className="active-status animate-pulse">
            {logs[logIndex]}
          </p>
          <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-purple-500" />
        </div>

        {/* Small Progress Dots */}
        <div className="flex gap-2 mt-8 justify-center">
          {logs.map((_, i) => (
            <div 
              key={i}
              className={`h-1 rounded-full transition-all duration-700 ${
                i <= logIndex ? 'w-8 bg-purple-500 shadow-[0_0_10px_#a855f7]' : 'w-2 bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Atmospheric Background Noise (Subtle) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
           style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
    </div>
  );
};