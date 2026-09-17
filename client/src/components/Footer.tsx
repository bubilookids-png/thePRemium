// src/components/Footer.tsx
import React from 'react';

export function Footer() {
  return (
    <footer className="w-full py-8 px-4 text-center border-t border-[#F8E7C9]/10 bg-[#02130e]/90 mt-16 select-none">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#F8E7C9]/60">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
          <span className="text-[#F8E7C9] font-bold">VACABBRO</span>
          <span>· Precision Vocabulary Engine</span>
        </div>
        
        <div className="flex items-center gap-6 text-[11px]">
          <span className="hover:text-[#F8E7C9] transition cursor-default">Instant Turso Cloud</span>
          <span className="hover:text-[#F8E7C9] transition cursor-default">Active Recall</span>
          <span className="text-[#F8E7C9]/40">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}