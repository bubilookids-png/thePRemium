// src/components/WordBlitzModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { BLITZ_VOCAB } from '../data/blitzWords';

interface Tile {
  id: string;
  text: string;
  pairId: string;
  type: 'en' | 'uz';
}

type Mode = 'preset' | 'custom';

export function WordBlitzModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<Mode>('preset');
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [displayTime, setDisplayTime] = useState(30);
  const [bonusTrigger, setBonusTrigger] = useState(0);

  // Chap (UZ) va o'ng (EN) ustunlar
  const [uzTiles, setUzTiles] = useState<Tile[]>([]);
  const [enTiles, setEnTiles] = useState<Tile[]>([]);

  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongIds, setWrongIds] = useState<string[]>([]);

  const timeRef = useRef(30);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Foydalanuvchining shaxsiy so'zlarini olish
  function getUserWords(): { en: string; uz: string }[] {
    try {
      const raw = localStorage.getItem('vacabbro_history');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  const userWordsCount = getUserWords().length;

  function playFx(freq: number, type: OscillatorType = 'sine', duration: number = 0.15) {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  function spawnRound() {
    let sourcePool = BLITZ_VOCAB;

    if (mode === 'custom') {
      const customWords = getUserWords();
      if (customWords.length >= 5) {
        sourcePool = customWords;
      }
    }

    const shuffled = [...sourcePool].sort(() => 0.5 - Math.random()).slice(0, 5);
    const newEnTiles: Tile[] = [];
    const newUzTiles: Tile[] = [];

    shuffled.forEach((item, idx) => {
      newEnTiles.push({ id: `en-${idx}`, text: item.en, pairId: `${idx}`, type: 'en' });
      newUzTiles.push({ id: `uz-${idx}`, text: item.uz, pairId: `${idx}`, type: 'uz' });
    });

    setEnTiles(newEnTiles.sort(() => 0.5 - Math.random()));
    setUzTiles(newUzTiles.sort(() => 0.5 - Math.random()));
    setMatchedIds([]);
    setSelectedTile(null);
  }

  function startGame() {
    if (mode === 'custom' && userWordsCount < 5) {
      alert("Siz qidirgan so'zlar soni 5 tadan kam. Avval bir nechta so'zni tahlil qiling yoki umumiy bazani tanlang.");
      return;
    }

    timeRef.current = 30;
    setDisplayTime(30);
    setIsPlaying(true);
    setScore(0);
    setCombo(0);
    setBonusTrigger(0);
    spawnRound();
  }

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      if (timeRef.current <= 1) {
        timeRef.current = 0;
        setDisplayTime(0);
        setIsPlaying(false);
        playFx(180, 'sawtooth', 0.5);
        clearInterval(timer);
      } else {
        timeRef.current -= 1;
        setDisplayTime(timeRef.current);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  function handleTileClick(tile: Tile) {
    if (matchedIds.includes(tile.id) || !isPlaying) return;

    if (!selectedTile) {
      setSelectedTile(tile);
      playFx(466.16, 'triangle', 0.08);
      return;
    }

    if (selectedTile.id === tile.id) {
      setSelectedTile(null);
      return;
    }

    if (selectedTile.type === tile.type) {
      setSelectedTile(tile);
      playFx(466.16, 'triangle', 0.08);
      return;
    }

    // TO'G'RI JUFTLIK
    if (selectedTile.pairId === tile.pairId && selectedTile.type !== tile.type) {
      playFx(659.25, 'sine', 0.1);
      setTimeout(() => playFx(987.77, 'sine', 0.18), 70);

      timeRef.current += 5;
      setDisplayTime(timeRef.current);
      setBonusTrigger((prev) => prev + 1);

      const nextMatched = [...matchedIds, selectedTile.id, tile.id];
      setMatchedIds(nextMatched);
      setScore((s) => s + 10 + combo * 5);
      setCombo((c) => c + 1);
      setSelectedTile(null);

      if (nextMatched.length === 10) {
        timeRef.current += 5;
        setDisplayTime(timeRef.current);
        setTimeout(() => spawnRound(), 250);
      }
    } else {
      // XATO JAVOB
      playFx(130, 'sawtooth', 0.25);
      setCombo(0);
      setWrongIds([selectedTile.id, tile.id]);
      setTimeout(() => setWrongIds([]), 380);
      setSelectedTile(null);
    }
  }

  function renderTile(tile: Tile) {
    const isMatched = matchedIds.includes(tile.id);
    const isSelected = selectedTile?.id === tile.id;
    const isWrong = wrongIds.includes(tile.id);

    if (isMatched) {
      return (
        <div 
          key={tile.id} 
          className="h-[54px] sm:h-[60px] border border-[#10b981]/10 bg-[#10b981]/5 rounded-2xl opacity-0 pointer-events-none transition-all duration-300"
        />
      );
    }

    return (
      <button
        key={tile.id}
        type="button"
        onClick={() => handleTileClick(tile)}
        className={`group relative w-full h-[54px] sm:h-[60px] p-2.5 sm:p-3 rounded-2xl text-center text-xs sm:text-sm font-semibold transition-all duration-150 select-none border backdrop-blur-md flex items-center justify-center cursor-pointer ${
          isWrong
            ? 'bg-rose-500/20 border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse'
            : isSelected
            ? 'bg-[#064E3B] border-[#F8E7C9] text-[#F8E7C9] scale-[0.98] shadow-[0_0_25px_rgba(248,231,201,0.3)] ring-2 ring-[#10b981]/50'
            : 'bg-[#062b21]/40 hover:bg-[#064E3B]/50 border-[#F8E7C9]/15 hover:border-[#F8E7C9]/40 text-[#F8E7C9]/80 hover:text-[#F8E7C9] hover:shadow-[0_0_18px_rgba(16,185,129,0.2)] active:scale-95'
        }`}
      >
        <span className="truncate px-1 font-mono">
          {tile.text}
        </span>
      </button>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl bg-gradient-to-b from-[#02130e]/95 via-[#021812]/95 to-[#010b08]/95 border border-[#F8E7C9]/20 rounded-3xl p-5 sm:p-7 shadow-[0_10px_60px_rgba(0,0,0,0.8)] text-[#F8E7C9] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#10b981]/15 via-[#064E3B]/10 to-transparent blur-2xl pointer-events-none" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-[#062b21]/70 text-[#F8E7C9]/60 hover:text-[#F8E7C9] border border-[#F8E7C9]/15 hover:bg-[#064E3B] transition active:scale-95 shadow-lg cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>

        {/* 1. START SCREEN */}
        {!isPlaying && displayTime === 30 && score === 0 && (
          <div className="text-center py-6 sm:py-8 relative z-10 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#064E3B]/60 border border-[#F8E7C9]/25 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.25)]">
              <span className="text-3xl animate-pulse text-[#F8E7C9]">⚡</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-wider text-[#F8E7C9] font-mono uppercase mb-2">
              Vocab Speed Blitz
            </h2>
            <p className="text-xs sm:text-sm text-[#F8E7C9]/70 max-w-xs mx-auto mb-5 leading-relaxed">
              Chapdagi o‘zbekcha ma’noni o‘ngdagi inglizcha so‘z bilan tezkor bog‘lang!
            </p>

            {/* 🔥 REJIM TANLASH (PRESET VS CUSTOM) */}
            <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-[#062b21]/60 border border-[#F8E7C9]/15 max-w-sm mx-auto mb-6">
              <button
                type="button"
                onClick={() => setMode('preset')}
                className={`flex-1 py-2 px-3 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'preset'
                    ? 'bg-[#064E3B] text-[#F8E7C9] border border-[#F8E7C9]/30 shadow-md'
                    : 'text-[#F8E7C9]/60 hover:text-[#F8E7C9]'
                }`}
              >
                🌐 Global Baza
              </button>

              <button
                type="button"
                onClick={() => setMode('custom')}
                className={`flex-1 py-2 px-3 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'custom'
                    ? 'bg-[#064E3B] text-[#F8E7C9] border border-[#F8E7C9]/30 shadow-md'
                    : 'text-[#F8E7C9]/60 hover:text-[#F8E7C9]'
                }`}
              >
                <span>👤 Mening So‘zlarim</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-[#10b981]">
                  {userWordsCount}
                </span>
              </button>
            </div>

            <div className="inline-flex items-center gap-2 mb-8 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-[#062b21]/80 border border-[#F8E7C9]/20 text-[#F8E7C9] shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
              <span>Har to‘g‘ri juftlikka +5s qo‘shiladi</span>
            </div>

            <div>
              <button
                type="button"
                onClick={startGame}
                className="w-full sm:w-auto px-12 py-3.5 rounded-2xl bg-[#F8E7C9] hover:bg-[#ebd7b5] text-[#02130e] font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(248,231,201,0.25)] hover:shadow-[0_0_40px_rgba(248,231,201,0.4)] transition-all duration-200 active:scale-95 border border-[#F8E7C9]/40 cursor-pointer font-mono"
              >
                Boshlash
              </button>
            </div>
          </div>
        )}

        {/* 2. GAME OVER SCREEN */}
        {!isPlaying && displayTime === 0 && (
          <div className="text-center py-6 sm:py-8 relative z-10 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#064E3B]/60 border border-[#F8E7C9]/30 flex items-center justify-center shadow-[0_0_30px_rgba(248,231,201,0.2)]">
              <span className="text-3xl">🏆</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#F8E7C9] font-mono uppercase tracking-wider mb-1">
              Vaqt tugadi!
            </h2>
            <p className="text-xs sm:text-sm text-[#F8E7C9]/60 mb-6 font-mono">
              Rejim: {mode === 'preset' ? 'Global Baza' : 'Mening So‘zlarim'}
            </p>
            
            <div className="p-4 rounded-2xl bg-[#062b21]/50 border border-[#F8E7C9]/15 max-w-xs mx-auto mb-8 shadow-inner">
              <span className="text-xs uppercase tracking-widest text-[#F8E7C9]/60 font-mono block mb-1">Yakuniy Ball</span>
              <div className="text-4xl sm:text-5xl font-black text-[#F8E7C9] font-mono tracking-tight">
                {score}
              </div>
            </div>

            <button
              type="button"
              onClick={startGame}
              className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-[#F8E7C9] hover:bg-[#ebd7b5] text-[#02130e] font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(248,231,201,0.25)] transition active:scale-95 cursor-pointer font-mono"
            >
              Qaytadan O‘ynash
            </button>
          </div>
        )}

        {/* 3. ACTIVE GAMEPLAY */}
        {isPlaying && (
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-3 mb-4 p-3 sm:p-4 rounded-2xl bg-[#062b21]/50 border border-[#F8E7C9]/15 shadow-inner">
              <div className="relative">
                <span className="text-[10px] text-[#F8E7C9]/60 uppercase tracking-wider block font-semibold font-mono">
                  {mode === 'preset' ? 'Global' : 'My Vocab'} · Qolgan Vaqt
                </span>
                <div className="flex items-center gap-2">
                  <div className={`text-xl sm:text-2xl font-mono font-bold tracking-tight ${displayTime <= 7 ? 'text-rose-400 animate-pulse drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'text-[#F8E7C9]'}`}>
                    00:{displayTime < 10 ? `0${displayTime}` : displayTime}
                  </div>
                  {bonusTrigger > 0 && (
                    <span 
                      key={bonusTrigger}
                      className="text-xs font-black font-mono text-[#10b981] animate-bounce drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                    >
                      +5s
                    </span>
                  )}
                </div>
              </div>

              <div className="h-8 flex items-center">
                {combo > 1 ? (
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-bounce font-mono">
                    🔥 {combo}x COMBO
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-[#F8E7C9]/50 uppercase tracking-wider">
                    ⚡ Match pairs
                  </span>
                )}
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#F8E7C9]/60 uppercase tracking-wider block font-semibold font-mono">Ochko</span>
                <div className="text-xl sm:text-2xl font-mono font-bold text-[#10b981]">
                  {score}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-2 px-1 text-center">
              <span className="text-[11px] font-mono font-bold tracking-wider text-[#F8E7C9]/70 uppercase">
                O‘zbekcha
              </span>
              <span className="text-[11px] font-mono font-bold tracking-wider text-[#10b981] uppercase">
                English
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <div className="space-y-2 sm:space-y-2.5">
                {uzTiles.map((tile) => renderTile(tile))}
              </div>

              <div className="space-y-2 sm:space-y-2.5">
                {enTiles.map((tile) => renderTile(tile))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}