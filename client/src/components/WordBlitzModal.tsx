// src/components/WordBlitzModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { BLITZ_VOCAB } from '../data/blitzWords';

interface Tile {
  id: string;
  text: string;
  pairId: string;
  type: 'en' | 'uz';
}

interface Particle {
  id: string;
  x: number;
  y: number;
}

interface PowerUp {
  type: 'freeze' | 'doublePoints';
  activatedAt: number;
}

type Mode = 'preset' | 'custom';

export function WordBlitzModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<Mode>('preset');
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [displayTime, setDisplayTime] = useState(30);
  const [bonusTrigger, setBonusTrigger] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [activePowerUp, setActivePowerUp] = useState<PowerUp | null>(null);
  const [doublePointsActive, setDoublePointsActive] = useState(false);

  const [uzTiles, setUzTiles] = useState<Tile[]>([]);
  const [enTiles, setEnTiles] = useState<Tile[]>([]);

  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongIds, setWrongIds] = useState<string[]>([]);

  const timeRef = useRef(30);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const powerUpTimerRef = useRef<NodeJS.Timeout | null>(null);
  const particleIdRef = useRef(0);

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

  function spawnPowerUp() {
    const types: Array<'freeze' | 'doublePoints'> = ['freeze', 'doublePoints'];
    const type = types[Math.floor(Math.random() * types.length)];
    const powerUp: PowerUp = { type, activatedAt: Date.now() };
    setActivePowerUp(powerUp);

    if (type === 'freeze') {
      timeRef.current += 3;
      setDisplayTime(timeRef.current);
      playFx(880, 'sine', 0.2);
    } else if (type === 'doublePoints') {
      setDoublePointsActive(true);
      playFx(1174.66, 'sine', 0.2);
      if (powerUpTimerRef.current) clearTimeout(powerUpTimerRef.current);
      powerUpTimerRef.current = setTimeout(() => {
        setDoublePointsActive(false);
        setActivePowerUp(null);
      }, 5000);
    }
  }

  function spawnParticles(x: number, y: number) {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 6; i++) {
      newParticles.push({
        id: 'p' + particleIdRef.current++,
        x,
        y
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 600);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!isPlaying) return;
    const key = parseInt(e.key, 10);
    if (isNaN(key) || key < 1 || key > 5) return;
    const allTiles = [...uzTiles, ...enTiles];
    const unmatched = allTiles.filter((t) => !matchedIds.includes(t.id));
    if (key <= unmatched.length) {
      handleTileClick(unmatched[key - 1]);
    }
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
      newEnTiles.push({ id: 'en-' + idx, text: item.en, pairId: String(idx), type: 'en' });
      newUzTiles.push({ id: 'uz-' + idx, text: item.uz, pairId: String(idx), type: 'uz' });
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
    setActivePowerUp(null);
    setDoublePointsActive(false);
    setParticles([]);
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
        setScoreHistory((prev) => [score, ...prev].slice(0, 5));
        clearInterval(timer);
      } else {
        timeRef.current -= 1;
        setDisplayTime(timeRef.current);
        if (Math.random() < 0.15 && timeRef.current > 5) {
          spawnPowerUp();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, score]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, uzTiles, enTiles, matchedIds, selectedTile]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = '@keyframes floatUp{0%{opacity:1;transform:translate(-50%,-50%)scale(1)}100%{opacity:0;transform:translate(-50%,-150px)scale(0.5)}}';
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

    if (selectedTile.pairId === tile.pairId && selectedTile.type !== tile.type) {
      playFx(659.25, 'sine', 0.1);
      setTimeout(() => playFx(987.77, 'sine', 0.18), 70);

      const rect = document.querySelector('[data-tile-id="' + tile.id + '"]')?.getBoundingClientRect();
      if (rect) {
        spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }

      timeRef.current += 5;
      setDisplayTime(timeRef.current);
      setBonusTrigger((prev) => prev + 1);

      const basePoints = 10 + combo * 5;
      const points = doublePointsActive ? basePoints * 2 : basePoints;

      const nextMatched = [...matchedIds, selectedTile.id, tile.id];
      setMatchedIds(nextMatched);
      setScore((s) => s + points);
      setCombo((c) => c + 1);
      setSelectedTile(null);

      if (nextMatched.length === 10) {
        timeRef.current += 5;
        setDisplayTime(timeRef.current);
        setTimeout(() => spawnRound(), 250);
      }
    } else {
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
          className="h-[54px] sm:h-[60px] border border-lime-400/10 bg-lime-400/5 rounded-2xl opacity-0 pointer-events-none transition-all duration-300"
        />
      );
    }

    return (
      <button
        key={tile.id}
        type="button"
        data-tile-id={tile.id}
        onClick={() => handleTileClick(tile)}
        className={isWrong ? 'group relative w-full h-[54px] sm:h-[60px] p-2.5 sm:p-3 rounded-2xl text-center text-xs sm:text-sm font-semibold transition-all duration-150 select-none border backdrop-blur-md flex items-center justify-center cursor-pointer bg-rose-500/20 border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse' : isSelected ? 'group relative w-full h-[54px] sm:h-[60px] p-2.5 sm:p-3 rounded-2xl text-center text-xs sm:text-sm font-semibold transition-all duration-150 select-none border backdrop-blur-md flex items-center justify-center cursor-pointer bg-lime-500/30 border-lime-400/60 text-lime-200 scale-[0.98] shadow-[0_0_25px_rgba(132,204,22,0.3)] ring-2 ring-lime-400/50' : 'group relative w-full h-[54px] sm:h-[60px] p-2.5 sm:p-3 rounded-2xl text-center text-xs sm:text-sm font-semibold transition-all duration-150 select-none border backdrop-blur-md flex items-center justify-center cursor-pointer bg-slate-900/50 hover:bg-slate-800/60 border-lime-400/20 hover:border-lime-400/40 text-slate-200 hover:text-lime-300 hover:shadow-[0_0_18px_rgba(132,204,22,0.2)] active:scale-95'}
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
        className="relative w-full max-w-xl bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-950/95 border border-lime-400/25 rounded-3xl p-5 sm:p-7 shadow-[0_10px_60px_rgba(0,0,0,0.8)] text-slate-100 overflow-hidden backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-lime-500/15 via-blue-500/10 to-transparent blur-2xl pointer-events-none" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-slate-900/70 text-slate-400 hover:text-lime-300 border border-lime-400/20 hover:bg-lime-500/15 transition active:scale-95 shadow-lg cursor-pointer"
          aria-label="Close"
        >
          X
        </button>

        {!isPlaying && displayTime === 30 && score === 0 && (
          <div className="text-center py-6 sm:py-8 relative z-10 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-900/60 border border-lime-400/30 flex items-center justify-center shadow-[0_0_30px_rgba(132,204,22,0.25)]">
              <span className="text-3xl animate-pulse text-lime-300">*</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-wider text-lime-300 font-mono uppercase mb-2">
              Vocab Speed Blitz
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto mb-5 leading-relaxed">
              Chapdagi uzbekcha manoni ongdagi inglizcha soz bilan tezkor boglang!
            </p>

            <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-lime-400/20 max-w-sm mx-auto mb-6">
              <button
                type="button"
                onClick={() => setMode('preset')}
                className={mode === 'preset' ? 'flex-1 py-2 px-3 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer bg-lime-500/30 text-lime-300 border border-lime-400/40 shadow-md' : 'flex-1 py-2 px-3 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer text-slate-400 hover:text-lime-300'}
              >
                Global Baza
              </button>

              <button
                type="button"
                onClick={() => setMode('custom')}
                className={mode === 'custom' ? 'flex-1 py-2 px-3 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 bg-lime-500/30 text-lime-300 border border-lime-400/40 shadow-md' : 'flex-1 py-2 px-3 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-slate-400 hover:text-lime-300'}
              >
                <span>Mening Sozlarim</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/60 text-lime-400">
                  {userWordsCount}
                </span>
              </button>
            </div>

            <div className="inline-flex items-center gap-2 mb-8 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-slate-900/60 backdrop-blur-md border border-lime-400/20 text-slate-100 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
              <span>Har togri juftlikka +5s qoshiladi</span>
            </div>

            <div>
              <button
                type="button"
                onClick={startGame}
                className="w-full sm:w-auto px-12 py-3.5 rounded-2xl bg-gradient-to-r from-lime-400 to-cyan-400 hover:shadow-[0_0_40px_rgba(132,204,22,0.5)] text-slate-950 font-bold text-sm tracking-wider uppercase transition-all duration-200 active:scale-95 cursor-pointer font-mono"
              >
                Boshlash
              </button>
            </div>
          </div>
        )}

        {!isPlaying && displayTime === 0 && (
          <div className="text-center py-6 sm:py-8 relative z-10 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-900/60 border border-lime-400/30 flex items-center justify-center shadow-[0_0_30px_rgba(132,204,22,0.2)]">
              <span className="text-3xl">*</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-lime-300 font-mono uppercase tracking-wider mb-1">
              Vaqt tugadi!
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mb-6 font-mono">
              Rejim: {mode === 'preset' ? 'Global Baza' : 'Mening Sozlarim'}
            </p>

            <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-lime-400/25 max-w-xs mx-auto mb-6 shadow-inner">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-mono block mb-1">Yakuniy Ball</span>
              <div className="text-4xl sm:text-5xl font-black text-lime-300 font-mono tracking-tight">
                {score}
              </div>
            </div>

            {scoreHistory.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-lime-400/15 max-w-sm mx-auto mb-6">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-mono block mb-3">Otgan Balllar</span>
                <div className="space-y-2">
                  {scoreHistory.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm font-mono">
                      <span className="text-slate-400">Game {idx + 1}</span>
                      <span className={s > score ? 'font-bold text-lime-400' : s === score ? 'font-bold text-lime-300' : 'font-bold text-slate-400'}>
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={startGame}
              className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-gradient-to-r from-lime-400 to-cyan-400 hover:shadow-[0_0_30px_rgba(132,204,22,0.5)] text-slate-950 font-bold text-sm tracking-wider uppercase transition active:scale-95 cursor-pointer font-mono"
            >
              Qaytadan Oynash
            </button>
          </div>
        )}

        {isPlaying && (
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-3 mb-4 p-3 sm:p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-lime-400/25 shadow-inner">
              <div className="relative">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold font-mono">
                  {mode === 'preset' ? 'Global' : 'My Vocab'} . Qolgan Vaqt
                </span>
                <div className="flex items-center gap-2">
                  <div className={displayTime <= 7 ? 'text-xl sm:text-2xl font-mono font-bold tracking-tight text-rose-400 animate-pulse drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'text-xl sm:text-2xl font-mono font-bold tracking-tight text-slate-100'}>
                    00:{displayTime < 10 ? '0' + displayTime : displayTime}
                  </div>
                  {bonusTrigger > 0 && (
                    <span
                      key={bonusTrigger}
                      className="text-xs font-black font-mono text-lime-400 animate-bounce drop-shadow-[0_0_8px_rgba(132,204,22,0.8)]"
                    >
                      +5s
                    </span>
                  )}
                </div>
              </div>

              <div className="h-8 flex items-center gap-2">
                {activePowerUp && (
                  <span className="text-xs font-extrabold px-2 py-1 rounded-full border text-white animate-bounce font-mono bg-blue-600/40 border-lime-400/60">
                    {activePowerUp.type === 'freeze' ? 'FREEZE +3s' : '2x POINTS'}
                  </span>
                )}
                {combo > 1 ? (
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-lime-500/25 border border-lime-400/50 text-lime-300 shadow-[0_0_15px_rgba(132,204,22,0.3)] animate-bounce font-mono">
                    COMBO {combo}x
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Match pairs
                  </span>
                )}
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold font-mono">Ochko</span>
                <div className="text-xl sm:text-2xl font-mono font-bold text-lime-400">
                  {score}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-2 px-1 text-center">
              <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                Uzbekcha
              </span>
              <span className="text-[11px] font-mono font-bold tracking-wider text-lime-400 uppercase">
                English
              </span>
            </div>

            <div className="relative grid grid-cols-2 gap-2.5 sm:gap-3">
              <div className="space-y-2 sm:space-y-2.5">
                {uzTiles.map((tile) => renderTile(tile))}
              </div>

              <div className="space-y-2 sm:space-y-2.5">
                {enTiles.map((tile) => renderTile(tile))}
              </div>

              {particles.map((p) => (
                <div
                  key={p.id}
                  className="fixed pointer-events-none text-2xl font-bold"
                  style={{
                    left: p.x.toString() + 'px',
                    top: p.y.toString() + 'px',
                    animation: 'floatUp 0.6s ease-out forwards'
                  }}
                >
                  *
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
