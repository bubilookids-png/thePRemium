import React from 'react';
import { Database, Sparkles } from 'lucide-react';

interface SourceBadgeProps {
  type?: 'db' | 'ai' | string;
  className?: string;
}

export function SourceBadge({ type, className = '' }: SourceBadgeProps) {
  const normalized = (type || '').toLowerCase().trim();
  const isDb = normalized === 'db' || normalized === 'local_database';

  if (isDb) {
    return (
      <span
        title="Retrieved from local SQLite database"
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 tracking-wider ${className}`}
      >
        <Database size={12} className="text-emerald-400" />
        DB
      </span>
    );
  }

  return (
    <span
      title="Generated dynamically via AI"
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 tracking-wider ${className}`}
    >
      <Sparkles size={12} className="text-purple-300" />
      AI
    </span>
  );
}