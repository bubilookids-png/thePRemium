import React from 'react';
import { Database, Sparkles } from 'lucide-react';

interface SourceBadgeProps {
  type?: 'db' | 'ai';
  className?: string;
}

export function SourceBadge({ type, className = '' }: SourceBadgeProps) {
  if (type === 'db') {
    return (
      <span
        title="Retrieved from local SQLite database"
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 tracking-wider uppercase ${className}`}
      >
        <Database size={11} className="text-emerald-400" />
        DB
      </span>
    );
  }

  return (
    <span
      title="Generated dynamically via AI"
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 tracking-wider uppercase ${className}`}
    >
      <Sparkles size={11} className="text-purple-300" />
      AI
    </span>
  );
}