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
  const [comboFlash, setComboFlash] = useState(false);

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
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: 'p' + particleIdRef.current++,
        x,
        y
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 700);
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
      setComboFlash(true);
      setTimeout(() => setComboFlash(false), 300);
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
          className="h-[54px] sm:h-[60px] border border-lime-400/10 bg-lime-400/5 rounded-2xl opacity-0 pointer-events-none transition-all duration-500 scale-75 blur-sm"
        />
      );
    }

    return (
      <button
        key={tile.id}
        type="button"
        data-tile-id={tile.id}
        onClick={() => handleTileClick(tile)}
        className={`
          group relative w-full h-[54px] sm:h-[60px] p-2.5 sm:p-3 rounded-2xl text-center text-xs sm:text-sm font-semibold 
          transition-all duration-150 select-none border backdrop-blur-md flex items-center justify-center cursor-pointer 
          font-mono overflow-hidden active:scale-90
          ${
            isWrong
              ? 'bg-rose-500/20 border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-tile-wrong'
              : isSelected
              ? 'bg-lime-500/35 border-lime-400/70 text-lime-100 scale-[0.97] shadow-[0_0_30px_rgba(132,204,22,0.4)] ring-2 ring-lime-400/60 animate-tile-selected'
              : 'bg-slate-900/40 hover:bg-slate-800/70 border-lime-400/20 hover:border-lime-400/50 text-slate-200 hover:text-lime-300 hover:shadow-[0_0_20px_rgba(132,204,22,0.25)] hover:scale-105 transition-all duration-200'
          }
        `}
      >
        {!isMatched && (
          <>
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-lime-500/0 via-lime-500/10 to-cyan-500/0" />
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl bg-gradient-to-r from-lime-400/20 to-cyan-400/20" />
          </>
        )}
        <span className="truncate px-1 relative z-10">
          {tile.text}
        </span>
      </button>
    );
  }

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            filter: drop-shadow(0 0 8px rgba(132, 204, 22, 0.8));
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -150px) scale(0.3);
            filter: drop-shadow(0 0 0px rgba(132, 204, 22, 0));
          }
        }

        @keyframes tileWrong {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-8px);
          }
          75% {
            transform: translateX(8px);
          }
        }

        @keyframes tileSelected {
          0% {
            transform: scale(0.95) rotate(0deg);
          }
          50% {
            transform: scale(1.02) rotate(-2deg);
          }
          100% {
            transform: scale(0.97) rotate(0deg);
          }
        }

        @keyframes comboScaleUp {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes scorePopIn {
          0% {
            transform: scale(0.5) translateY(10px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(132, 204, 22, 0.2), inset 0 0 20px rgba(132, 204, 22, 0.05);
          }
          50% {
            box-shadow: 0 0 40px rgba(132, 204, 22, 0.4), inset 0 0 30px rgba(132, 204, 22, 0.1);
          }
        }

        @keyframes powerUpGlow {
          0%, 100% {
            box-shadow: 0 0 12px rgba(59, 130, 246, 0.4);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 24px rgba(59, 130, 246, 0.7);
            transform: scale(1.08);
          }
        }

        @keyframes timeWarning {
          0%, 100% {
            filter: drop-shadow(0 0 4px rgba(244, 63, 94, 0.6));
          }
          50% {
            filter: drop-shadow(0 0 12px rgba(244, 63, 94, 1));
          }
        }

        @keyframes startButtonHover {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes iconBounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-6px) scale(1.1);
          }
        }

        @keyframes topGlowPulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-tile-wrong {
          animation: tileWrong 0.4s ease-in-out;
        }

        .animate-tile-selected {
          animation: tileSelected 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-combo-scale {
          animation: comboScaleUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-modal-slide {
          animation: modalSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-glow-pulse {
          animation: glowPulse 2.5s ease-in-out infinite;
        }

        .animate-powerup-glow {
          animation: powerUpGlow 1.5s ease-in-out infinite;
        }

        .animate-time-warning {
          animation: timeWarning 0.6s ease-in-out infinite;
        }

        .animate-button-hover {
          animation: startButtonHover 0.8s ease-in-out infinite;
        }

        .animate-icon-bounce {
          animation: iconBounce 2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
        }

        .animate-glow-pulse-top {
          animation: topGlowPulse 3s ease-in-out infinite;
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-xl bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-950/95 border border-lime-400/25 rounded-3xl p-5 sm:p-7 shadow-[0_20px_80px_rgba(0,0,0,0.9)] text-slate-100 overflow-hidden backdrop-blur-xl animate-modal-slide"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-32 bg-gradient-to-b from-lime-500/20 via-blue-500/15 to-transparent blur-3xl pointer-events-none animate-glow-pulse-top" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-lime-500/5 rounded-full blur-3xl pointer-events-none" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-slate-900/80 text-slate-400 hover:text-lime-300 border border-lime-400/30 hover:bg-lime-500/20 transition-all duration-300 active:scale-90 shadow-lg cursor-pointer font-mono font-bold"
            aria-label="Close"
          >
            ✕
          </button>

          {!isPlaying && displayTime === 30 && score === 0 && (
            <div className="text-center py-8 sm:py-10 relative z-10 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-600/40 to-lime-400/20 border border-lime-400/40 flex items-center justify-center shadow-[0_0_40px_rgba(132,204,22,0.25)] animate-icon-bounce">
                <span className="text-3xl animate-spin">⚡</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-wider text-lime-300 font-mono uppercase mb-2 drop-shadow-[0_0_20px_rgba(132,204,22,0.3)]">
                Vocab Blitz
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto mb-6 leading-relaxed font-mono">
                Chapdagi uzbekcha manoni ongdagi inglizcha soz bilan tezkor boglang!
              </p>

              <div className="flex items-center justify-center gap-2 p-2 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-lime-400/25 max-w-sm mx-auto mb-8 shadow-lg">
                <button
                  type="button"
                  onClick={() => setMode('preset')}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-mono text-xs font-bold transition-all duration-300 cursor-pointer ${
                    mode === 'preset'
                      ? 'bg-gradient-to-r from-lime-500/40 to-cyan-500/30 text-lime-300 border border-lime-400/60 shadow-[0_0_15px_rgba(132,204,22,0.3)]'
                      : 'text-slate-400 hover:text-lime-300 border border-transparent hover:bg-slate-800/40'
                  }`}
                >
                  Global Baza
                </button>

                <button
                  type="button"
                  onClick={() => setMode('custom')}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-mono text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                    mode === 'custom'
                      ? 'bg-gradient-to-r from-lime-500/40 to-cyan-500/30 text-lime-300 border border-lime-400/60 shadow-[0_0_15px_rgba(132,204,22,0.3)]'
                      : 'text-slate-400 hover:text-lime-300 border border-transparent hover:bg-slate-800/40'
                  }`}
                >
                  <span>Mening</span>
                  <span className="text-[9px] px-2 py-1 rounded-full bg-slate-950/80 text-lime-400 border border-lime-400/40 font-black">
                    {userWordsCount}
                  </span>
                </button>
              </div>

              <div className="inline-flex items-center gap-2 mb-10 px-4 py-2 rounded-full text-xs font-mono font-bold bg-slate-900/60 backdrop-blur-md border border-lime-400/30 text-lime-300 shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse" />
                <span>Har togri juftlikka +5s qoshiladi</span>
              </div>

              <button
                type="button"
                onClick={startGame}
                className="relative w-full sm:w-auto px-16 py-4 rounded-2xl bg-gradient-to-r from-lime-400 via-lime-300 to-cyan-400 hover:shadow-[0_0_50px_rgba(132,204,22,0.6)] text-slate-950 font-black text-sm tracking-widest uppercase transition-all duration-300 active:scale-95 cursor-pointer font-mono overflow-hidden group animate-button-hover"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-lime-300 to-cyan-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                <span className="relative z-10">Boshlash</span>
              </button>
            </div>
          )}

          {!isPlaying && displayTime === 0 && (
            <div className="text-center py-8 sm:py-10 relative z-10 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-600/40 to-lime-400/20 border border-lime-400/40 flex items-center justify-center shadow-[0_0_40px_rgba(132,204,22,0.2)]">
                <span className="text-3xl animate-bounce">🎯</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-lime-300 font-mono uppercase tracking-wider mb-2 drop-shadow-[0_0_15px_rgba(132,204,22,0.2)]">
                Vaqt tugadi!
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-8 font-mono tracking-wide">
                Rejim: {mode === 'preset' ? 'Global Baza' : 'Mening Sozlarim'}
              </p>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950/60 backdrop-blur-md border border-lime-400/30 max-w-xs mx-auto mb-8 shadow-lg animate-glow-pulse">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-mono block mb-2">Yakuniy Ball</span>
                <div className="text-5xl sm:text-6xl font-black text-lime-300 font-mono tracking-tight animate-scorePopIn">
                  {score}
                </div>
              </div>

              {scoreHistory.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-lime-400/20 max-w-sm mx-auto mb-8 shadow-lg">
                  <span className="text-xs uppercase tracking-widest text-slate-400 font-mono block mb-4 font-bold">Otgan Balllar</span>
                  <div className="space-y-2">
                    {scoreHistory.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm font-mono p-2 rounded-lg bg-slate-950/50 hover:bg-slate-900/70 transition-colors">
                        <span className="text-slate-400">Game {idx + 1}</span>
                        <span className={`font-bold text-lg ${s > score ? 'text-lime-400 drop-shadow-[0_0_8px_rgba(132,204,22,0.6)]' : s === score ? 'text-lime-300' : 'text-slate-500'}`}>
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
                className="relative w-full sm:w-auto px-14 py-4 rounded-2xl bg-gradient-to-r from-lime-400 via-lime-300 to-cyan-400 hover:shadow-[0_0_40px_rgba(132,204,22,0.5)] text-slate-950 font-black text-sm tracking-widest uppercase transition-all duration-300 active:scale-95 cursor-pointer font-mono overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-lime-300 to-cyan-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                <span className="relative z-10">Qaytadan Oynash</span>
              </button>
            </div>
          )}

          {isPlaying && (
            <div className="relative z-10 space-y-4 sm:space-y-5">
              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {/* Time */}
                <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-lime-400/25 shadow-lg">
                  <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider block font-bold font-mono mb-1">
                    Qolgan Vaqt
                  </span>
                  <div className={`text-lg sm:text-2xl font-mono font-black tracking-tight transition-all duration-300 ${displayTime <= 7 ? 'text-rose-400 animate-time-warning drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]' : 'text-lime-300'}`}>
                    00:{displayTime < 10 ? '0' + displayTime : displayTime}
                  </div>
                </div>

                {/* Combo / PowerUp */}
                <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-lime-400/25 shadow-lg flex items-center justify-center">
                  {activePowerUp ? (
                    <div className={`text-center animate-powerup-glow ${activePowerUp.type === 'freeze' ? 'text-blue-300' : 'text-yellow-300'}`}>
                      <span className="text-[10px] font-mono font-bold block mb-0.5">
                        {activePowerUp.type === 'freeze' ? '❄️ FREEZE' : '⭐ 2X'}
                      </span>
                      <span className="text-xs font-black font-mono">
                        {activePowerUp.type === 'freeze' ? '+3s' : '2x PTS'}
                      </span>
                    </div>
                  ) : combo > 1 ? (
                    <div className="text-center">
                      <span className="text-[10px] font-mono text-slate-400 block mb-0.5 uppercase tracking-widest">Combo</span>
                      <span className={`text-xl sm:text-2xl font-black text-lime-300 drop-shadow-[0_0_12px_rgba(132,204,22,0.6)] ${comboFlash ? 'animate-combo-scale' : ''}`}>
                        {combo}x
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500 text-center uppercase tracking-widest">Match Pairs</span>
                  )}
                </div>

                {/* Score */}
                <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950/60 backdrop-blur-md border border-lime-400/30 shadow-lg">
                  <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider block font-bold font-mono mb-1">
                    Ochko
                  </span>
                  <div className="text-lg sm:text-2xl font-mono font-black text-lime-400 drop-shadow-[0_0_8px_rgba(132,204,22,0.4)]">
                    {score}
                  </div>
                </div>
              </div>

              {/* Column Headers */}
              <div className="grid grid-cols-2 gap-3 px-1 text-center mb-1">
                <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                  🇺🇿 Uzbekcha
                </span>
                <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-lime-400 uppercase">
                  🇬🇧 English
                </span>
              </div>

              {/* Tiles Grid */}
              <div className="relative grid grid-cols-2 gap-2.5 sm:gap-3 p-1">
                <div className="space-y-2 sm:space-y-2.5">
                  {uzTiles.map((tile) => renderTile(tile))}
                </div>

                <div className="space-y-2 sm:space-y-2.5">
                  {enTiles.map((tile) => renderTile(tile))}
                </div>

                {/* Particles */}
                {particles.map((p) => (
                  <div
                    key={p.id}
                    className="fixed pointer-events-none text-2xl font-bold text-lime-400 font-mono"
                    style={{
                      left: p.x.toString() + 'px',
                      top: p.y.toString() + 'px',
                      animation: 'floatUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                    }}
                  >
                    +✦
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}