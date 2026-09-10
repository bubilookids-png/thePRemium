// src/components/WordBlitzModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { BLITZ_VOCAB, Pair } from '../data/blitzWords';

interface Tile {
  id: string;
  text: string;
  pairId: string;
  type: 'en' | 'uz';
}

export function WordBlitzModal({ onClose }: { onClose: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [displayTime, setDisplayTime] = useState(30);
  const [bonusTrigger, setBonusTrigger] = useState(0);
  
  // Chap (UZ) va o'ng (EN) ustunlar alohida
  const [uzTiles, setUzTiles] = useState<Tile[]>([]);
  const [enTiles, setEnTiles] = useState<Tile[]>([]);
  
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongIds, setWrongIds] = useState<string[]>([]);

  const timeRef = useRef(30);
  const audioCtxRef = useRef<AudioContext | null>(null);

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
    const shuffled = [...BLITZ_VOCAB].sort(() => 0.5 - Math.random()).slice(0, 5);
    const newEnTiles: Tile[] = [];
    const newUzTiles: Tile[] = [];

    shuffled.forEach((item, idx) => {
      newEnTiles.push({ id: `en-${idx}`, text: item.en, pairId: `${idx}`, type: 'en' });
      newUzTiles.push({ id: `uz-${idx}`, text: item.uz, pairId: `${idx}`, type: 'uz' });
    });

    // Har bir ustunni o'z ichida alohida aralashtiramiz
    setEnTiles(newEnTiles.sort(() => 0.5 - Math.random()));
    setUzTiles(newUzTiles.sort(() => 0.5 - Math.random()));
    setMatchedIds([]);
    setSelectedTile(null);
  }

  function startGame() {
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

    // Bir xil tildagilarni bosganda shunchaki tanlovni almashtiramiz
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

      // Barcha 5 juftlik topilsa
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
          className="h-[54px] sm:h-[60px] border border-emerald-500/10 bg-emerald-500/5 rounded-2xl opacity-0 pointer-events-none transition-all duration-300"
        />
      );
    }

    return (
      <button
        key={tile.id}
        type="button"
        onClick={() => handleTileClick(tile)}
        className={`group relative w-full h-[54px] sm:h-[60px] p-2.5 sm:p-3 rounded-2xl text-center text-xs sm:text-sm font-semibold transition-all duration-150 select-none border backdrop-blur-md flex items-center justify-center ${
          isWrong
            ? 'bg-red-500/20 border-red-500 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse'
            : isSelected
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-white/60 text-white scale-[0.98] shadow-[0_0_25px_rgba(168,85,247,0.7)] ring-2 ring-purple-400/50'
            : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-700/70 hover:border-purple-500/50 text-slate-200 hover:text-white hover:shadow-[0_0_18px_rgba(147,51,234,0.25)] active:scale-95'
        }`}
      >
        <span className="truncate px-1">
          {tile.text}
        </span>
      </button>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-purple-500/30 rounded-3xl p-5 sm:p-7 shadow-[0_0_80px_rgba(139,92,246,0.25)] text-slate-100 overflow-hidden ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-purple-500/20 via-pink-500/10 to-transparent blur-2xl pointer-events-none" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/80 hover:border-purple-400/50 hover:bg-slate-700 transition active:scale-95 shadow-lg"
          aria-label="Close"
        >
          ✕
        </button>

        {/* 1. START SCREEN */}
        {!isPlaying && displayTime === 30 && score === 0 && (
          <div className="text-center py-6 sm:py-8 relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              <span className="text-3xl animate-pulse">⚡</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 uppercase mb-2">
              Vocab Speed Blitz
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto mb-5 leading-relaxed">
              Chapdagi o‘zbekcha ma’noni o‘ngdagi inglizcha so‘z bilan tezkor bog‘lang!
            </p>

            <div className="inline-flex items-center gap-2 mb-8 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-purple-950/60 border border-purple-500/40 text-purple-300 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Har to‘g‘ri juftlikka +5s</span>
            </div>

            <div>
              <button
                type="button"
                onClick={startGame}
                className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-bold text-sm tracking-wider uppercase text-white shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.8)] transition-all duration-200 active:scale-95 border border-purple-300/30"
              >
                Boshlash
              </button>
            </div>
          </div>
        )}

        {/* 2. GAME OVER SCREEN */}
        {!isPlaying && displayTime === 0 && (
          <div className="text-center py-6 sm:py-8 relative z-10 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-pink-500/20 border border-amber-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              <span className="text-3xl">🏆</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-1">
              Vaqt tugadi!
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mb-6">Miyani daxshat charxladingiz</p>
            
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 max-w-xs mx-auto mb-8 shadow-inner">
              <span className="text-xs uppercase tracking-widest text-slate-400 block mb-1">Yakuniy Ball</span>
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-amber-300 font-mono tracking-tight">
                {score}
              </div>
            </div>

            <button
              type="button"
              onClick={startGame}
              className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(168,85,247,0.5)] transition active:scale-95 border border-purple-300/30"
            >
              Qaytadan O‘ynash
            </button>
          </div>
        )}

        {/* 3. ACTIVE GAMEPLAY */}
        {isPlaying && (
          <div className="relative z-10">
            {/* HUD Panel */}
            <div className="flex items-center justify-between gap-3 mb-4 p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-purple-500/20 shadow-inner">
              <div className="relative">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Qolgan Vaqt</span>
                <div className="flex items-center gap-2">
                  <div className={`text-xl sm:text-2xl font-mono font-bold tracking-tight ${displayTime <= 7 ? 'text-red-400 animate-pulse drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]' : 'text-purple-300'}`}>
                    00:{displayTime < 10 ? `0${displayTime}` : displayTime}
                  </div>
                  {bonusTrigger > 0 && (
                    <span 
                      key={bonusTrigger}
                      className="text-xs font-black font-mono text-emerald-400 animate-bounce drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    >
                      +5s
                    </span>
                  )}
                </div>
              </div>

              <div className="h-8 flex items-center">
                {combo > 1 ? (
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/30 border border-pink-500/50 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.4)] animate-bounce">
                    🔥 {combo}x COMBO
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    ⚡ Match pairs
                  </span>
                )}
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Ochko</span>
                <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                  {score}
                </div>
              </div>
            </div>

            {/* Ustun sarlavhalari */}
            <div className="grid grid-cols-2 gap-3 mb-2 px-1 text-center">
              <span className="text-[11px] font-mono font-bold tracking-wider text-sky-400/80 uppercase">
                O‘zbekcha
              </span>
              <span className="text-[11px] font-mono font-bold tracking-wider text-violet-400/80 uppercase">
                English
              </span>
            </div>

            {/* Tartiblangan 2 Ustun */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {/* Chap Ustun (UZ) */}
              <div className="space-y-2 sm:space-y-2.5">
                {uzTiles.map((tile) => renderTile(tile))}
              </div>

              {/* O'ng Ustun (EN) */}
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