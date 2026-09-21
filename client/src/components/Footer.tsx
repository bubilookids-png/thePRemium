// src/components/Footer.tsx
import React from 'react';

interface FooterProps {
  onOpenLegal?: () => void;
  onOpenCookie?: () => void;
}

export function Footer({ onOpenLegal, onOpenCookie }: FooterProps) {
  return (
    <footer className="w-full bg-[#02130e]/95 border-t border-[#F8E7C9]/15 text-[#F8E7C9] py-10 px-6 mt-auto font-mono select-none">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left text-xs">
        
        {/* 1-ustun: Product */}
        <div>
          <h4 className="font-bold uppercase tracking-wider text-[#10b981] mb-3">
            Product
          </h4>
          <ul className="space-y-2 text-[#F8E7C9]/70">
            <li>
              <a href="#" className="hover:text-[#F8E7C9] transition">Upgrade VIP</a>
            </li>
            <li>
              <a href="#" className="hover:text-[#F8E7C9] transition">Group Plans</a>
            </li>
            <li>
              <a href="#" className="hover:text-[#F8E7C9] transition">Word Blitz</a>
            </li>
          </ul>
        </div>

        
        {/* 3-ustun: More & Legal & Cookie */}
        <div>
          <h4 className="font-bold uppercase tracking-wider text-[#10b981] mb-3">
            More
          </h4>
          <ul className="space-y-2 text-[#F8E7C9]/70">
            <li>
              <button 
                type="button" 
                onClick={onOpenLegal} 
                className="hover:text-[#F8E7C9] transition text-left cursor-pointer"
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <button 
                type="button" 
                onClick={onOpenLegal} 
                className="hover:text-[#F8E7C9] transition text-left cursor-pointer"
              >
                Terms of Service
              </button>
            </li>
            <li>
              <button 
                type="button" 
                onClick={onOpenCookie} 
                className="hover:text-[#F8E7C9] transition text-left cursor-pointer"
              >
                Cookie Settings
              </button>
            </li>
          </ul>
        </div>

        
      </div>
      {/* Asl pastki qism (Hech narsa o'chmadi, hammasi saqlandi) */}
      <div className="max-w-5xl mx-auto pt-6 border-t border-[#F8E7C9]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F8E7C9]/60">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
          <span className="text-[#F8E7C9] font-bold">UNIVEBOOSTER</span>
          <span>· Precision Vocabulary Engine</span>
        </div>
        
        <div className="flex items-center flex-wrap justify-center gap-4 sm:gap-6 text-[11px]">
          <span className="hover:text-[#F8E7C9] transition cursor-default">Instant Turso Cloud</span>
          <span className="hover:text-[#F8E7C9] transition cursor-default">Active Recall</span>
          <span className="text-[#F8E7C9]/40">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}