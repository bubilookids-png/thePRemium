import React, { useState, useEffect, useMemo, useRef } from 'react';
import { apiFetch } from '../services/apiClient';
import { useMotionEntrance } from '../utils/motion';

export interface SavedWord {
  id: number;
  telegram_id: number;
  english_word: string;
  translation: string;
  source_feature: string;
  created_at: string;
}

interface MySavedWordsProps {
  currentUser?: { id: number; first_name?: string } | null;
  onBack?: () => void;
  onAnalyzeWord?: (word: string) => void;
  onOpenLogin?: () => void;
}

export function MySavedWords({
  currentUser,
  onBack,
  onAnalyzeWord,
  onOpenLogin
}: MySavedWordsProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [words, setWords] = useState<SavedWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'analyzer' | 'reading' | 'other'>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteNotification, setDeleteNotification] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    fetchSavedWords();
  }, [currentUser?.id]);

  const fetchSavedWords = async () => {
    if (!currentUser?.id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch<{ success: boolean; words: SavedWord[] }>(
        `/api/saved-words?telegram_id=${currentUser.id}`
      );
      if (res.words) {
        setWords(res.words);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load saved vocabulary from Turso.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!currentUser?.id) {
      alert("So'zni o'chirish uchun avval tizimga kiring!");
      return;
    }

    const wordToDelete = words.find((w) => w.id === id);
    const previousWords = [...words];

    // Optimistically update the UI immediately
    setWords((prev) => prev.filter((w) => w.id !== id));
    setDeletingId(id);

    try {
      // Primary attempt: DELETE request
      try {
        await apiFetch(`/api/saved-words/${id}?telegram_id=${currentUser.id}`, {
          method: 'DELETE',
          body: JSON.stringify({ telegram_id: currentUser.id })
        });
      } catch (primaryErr) {
        // Fallback attempt: POST route in case DELETE method is intercepted or restricted
        console.warn('DELETE request failed, attempting fallback POST delete route...', primaryErr);
        await apiFetch(`/api/saved-words/${id}/delete`, {
          method: 'POST',
          body: JSON.stringify({ telegram_id: currentUser.id })
        });
      }

      setDeleteNotification(
        wordToDelete ? `"${wordToDelete.english_word}" o'chirildi.` : "So'z muvaffaqiyatli o'chirildi."
      );
      setTimeout(() => setDeleteNotification(null), 3000);
    } catch (err: any) {
      console.error('Failed to delete word:', err);
      // Rollback optimistic deletion
      setWords(previousWords);
      alert(err?.message || "So'zni o'chirishda xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = (word: SavedWord) => {
    navigator.clipboard.writeText(`${word.english_word} — ${word.translation}`);
    setCopiedId(word.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSpeak = (word: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    setSpeakingWord(word);
    utterance.onend = () => setSpeakingWord(null);
    utterance.onerror = () => setSpeakingWord(null);
    window.speechSynthesis.speak(utterance);
  };

  const filteredWords = useMemo(() => {
    return words.filter((item) => {
      const matchesSearch =
        item.english_word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.translation.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (sourceFilter === 'all') return true;
      if (sourceFilter === 'analyzer') return item.source_feature === 'analyzer';
      if (sourceFilter === 'reading') return item.source_feature.includes('reading');
      return item.source_feature !== 'analyzer' && !item.source_feature.includes('reading');
    });
  }, [words, searchQuery, sourceFilter]);

  useMotionEntrance(pageRef, Boolean(currentUser?.id));
  useMotionEntrance(cardsRef, filteredWords.length, '.saved-word-item');
  useMotionEntrance(statusRef, loading ? 'loading' : error ? 'error' : filteredWords.length ? 'results' : 'empty');

  const sourceBadge = (source: string) => {
    if (source === 'analyzer') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-400/20">
          ANALYZER
        </span>
      );
    }
    if (source.includes('reading')) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-lime-500/10 text-lime-400 border border-lime-400/20">
          RETENTION READING
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-400/20">
        SAVED WORD
      </span>
    );
  };

  // If user is not logged in
  if (!currentUser?.id) {
    return (
      <div ref={pageRef} className="w-full max-w-4xl mx-auto px-4 py-8 font-mono select-none">
        <div className="bg-slate-950/85 border border-lime-400/20 rounded-3xl p-8 sm:p-12 text-center backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-lime-400/20 to-cyan-400/20 border border-lime-400/30 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(163,230,53,0.2)]">
            🔒
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2">
            Cloud Vocabulary Sync
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
            Please log in with Telegram to access your personalized <strong>My Saved Words</strong> database synced in real-time across your devices.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {onOpenLogin && (
              <button
                onClick={onOpenLogin}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(163,230,53,0.4)] transition cursor-pointer"
              >
                Telegram orqali kirish
              </button>
            )}
            {onBack && (
              <button
                onClick={onBack}
                className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-semibold text-xs hover:bg-slate-800 transition cursor-pointer"
              >
                Bosh sahifaga qaytish
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 font-mono select-none text-slate-100">
      {/* Top Banner & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-lime-400/15">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-900/80 border border-lime-400/20 text-lime-400 hover:bg-lime-400/10 transition cursor-pointer"
              title="Return"
            >
              ←
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <span className="text-[11px] font-bold tracking-widest text-lime-400 uppercase">
                Turso Cloud Database
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              My Saved Words ({words.length})
            </h1>
          </div>
        </div>

        {/* Global Stats Counter */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-lime-400/20 text-right">
            <span className="text-[10px] text-slate-400 block">USER VAULT</span>
            <span className="text-xs font-bold text-lime-300">
              ID: {currentUser.id}
            </span>
          </div>
          <button
            onClick={fetchSavedWords}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-300 hover:text-lime-300 hover:border-lime-400/40 transition cursor-pointer disabled:opacity-50"
            title="Refresh database"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Filter and Search HUD */}
      <div className="bg-slate-950/80 border border-lime-400/15 rounded-2xl p-4 mb-6 backdrop-blur-md shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved words or translations..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/70 border border-lime-400/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/30 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(
            [
              { key: 'all', label: 'All Words' },
              { key: 'analyzer', label: 'Analyzer' },
              { key: 'reading', label: 'Reading' },
              { key: 'other', label: 'Other' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSourceFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                sourceFilter === tab.key
                  ? 'bg-lime-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(163,230,53,0.3)]'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Delete Feedback Toast */}
      {deleteNotification && (
        <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>🗑️</span>
            <span>{deleteNotification}</span>
          </span>
          <button
            type="button"
            onClick={() => setDeleteNotification(null)}
            className="text-rose-400/70 hover:text-rose-200 text-xs cursor-pointer ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading & Error States */}
      {loading && (
        <div ref={statusRef} className="p-12 text-center text-slate-400 font-mono text-xs">
          ⚡ Connecting to Turso Cloud and querying user vocabulary...
        </div>
      )}

      {error && (
        <div ref={statusRef} className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center mb-6">
          ⚠️ {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredWords.length === 0 && (
        <div ref={statusRef} className="bg-slate-950/60 border border-slate-800 rounded-3xl p-10 text-center text-slate-400">
          <div className="text-3xl mb-3">📖</div>
          <h3 className="text-base font-bold text-slate-200 mb-1">
            {searchQuery ? 'No matching saved words' : 'Your saved vocabulary is empty'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {searchQuery
              ? 'Try adjusting your search query or filter settings.'
              : 'Save words instantly while analyzing in the main dictionary or during Retention Reading sessions.'}
          </p>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-lime-400/30 text-lime-400 text-xs hover:bg-lime-400/10 transition cursor-pointer"
            >
              + Search and Analyze a Word
            </button>
          )}
        </div>
      )}

      {/* Saved Words Grid */}
      {!loading && filteredWords.length > 0 && (
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredWords.map((item) => (
            <div
              key={item.id}
              className="saved-word-item group relative bg-slate-950/80 hover:bg-slate-900/90 border border-lime-400/15 hover:border-lime-400/40 rounded-2xl p-4 transition-[background-color,border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-[0_0_20px_rgba(163,230,53,0.1)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-lime-300 transition-colors">
                      {item.english_word}
                    </h3>
                    <button
                      onClick={() => handleSpeak(item.english_word)}
                      className={`p-1 rounded text-slate-400 hover:text-cyan-400 transition cursor-pointer ${
                        speakingWord === item.english_word ? 'text-cyan-300 animate-pulse' : ''
                      }`}
                      title="Pronounce word"
                    >
                      🔊
                    </button>
                  </div>
                  {sourceBadge(item.source_feature)}
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-3">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    TRANSLATION (UZ)
                  </span>
                  <p className="text-sm font-semibold text-lime-300 mt-0.5">
                    {item.translation}
                  </p>
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div className="pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500">
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Turso Sync'}
                </span>

                <div className="flex items-center gap-1.5">
                  {onAnalyzeWord && (
                    <button
                      onClick={() => onAnalyzeWord(item.english_word)}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-lime-300 hover:border-lime-400/40 text-[11px] transition cursor-pointer"
                      title="Analyze this word"
                    >
                      Inspect ✦
                    </button>
                  )}
                  <button
                    onClick={() => handleCopy(item)}
                    className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40 transition cursor-pointer"
                    title="Copy word"
                  >
                    {copiedId === item.id ? '✓' : '📋'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    disabled={deletingId === item.id}
                    className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/10 active:scale-95 transition cursor-pointer disabled:opacity-50"
                    title="O'chirish (Delete)"
                    aria-label={`Delete ${item.english_word}`}
                  >
                    {deletingId === item.id ? (
                      <span className="inline-block animate-spin text-[10px] leading-none">⌛</span>
                    ) : (
                      <span className="text-[12px] leading-none">🗑️</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default MySavedWords;
