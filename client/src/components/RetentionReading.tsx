import React, { useState, useEffect, useRef } from 'react';
import { Card } from './Card';
import { apiFetch } from '../services/apiClient';

// --- Types ---
type Level = 'A2' | 'B1' | 'B2';
type Phase = 'selection' | 'reading' | 'recall' | 'evaluation' | 'review';

interface TextData {
  id: string;
  level: Level;
  content: string;
  keyConcepts: string[];
}

// --- Sample Data ---
const TEXT_DATA: Record<Level, TextData[]> = {
  A2: [
    {
      id: 'a2-1',
      level: 'A2',
      content: 'Giraffes are the tallest mammals on Earth. They live in Africa. A giraffe has a very long neck, but it has only seven bones in its neck. This is the same number of bones as a human has. Giraffes eat leaves from high trees. Their favorite food is the acacia tree. A giraffe has a long, blue tongue to help it pull leaves from branches. They do not drink a lot of water because they get water from the leaves they eat.',
      keyConcepts: ['giraffes', 'tallest mammals', 'africa', 'long neck', 'seven bones', 'leaves', 'acacia', 'blue tongue', 'water']
    }
  ],
  B1: [
    {
      id: 'b1-1',
      level: 'B1',
      content: 'Early computing began long before modern electronic devices existed. One of the first mechanical computers was the Analytical Engine, designed by Charles Babbage in the 1830s. It used punch cards for input and could perform complex mathematical calculations. Ada Lovelace is often considered the first computer programmer because she wrote an algorithm for this machine. The transition to electronic computers happened during World War II with machines like ENIAC. These massive computers used vacuum tubes, generated an enormous amount of heat, and filled entire rooms, yet they were less powerful than a simple modern smartphone.',
      keyConcepts: ['early computing', 'analytical engine', 'charles babbage', 'punch cards', 'ada lovelace', 'programmer', 'eniac', 'world war ii', 'vacuum tubes', 'smartphone']
    }
  ],
  B2: [
    {
      id: 'b2-1',
      level: 'B2',
      content: 'Quantum entanglement is a complex physical phenomenon that occurs when pairs or groups of particles interact in ways such that the quantum state of each particle cannot be described independently of the state of the others, even when the particles are separated by a large distance. Instead, a quantum state must be described for the system as a whole. Measurements of physical properties such as position, momentum, spin, and polarization performed on entangled particles are found to be perfectly correlated. For example, if one particle is observed to have a spin pointing upward, the spin of its entangled partner will immediately be observed pointing downward, regardless of the distance separating them. This phenomenon puzzled Albert Einstein, who famously referred to it as "spooky action at a distance." Today, entanglement is a primary focus of quantum information theory and is crucial for developing quantum cryptography and quantum computing.',
      keyConcepts: ['quantum entanglement', 'physical phenomenon', 'particles', 'quantum state', 'correlated', 'momentum', 'spin', 'polarization', 'albert einstein', 'spooky action', 'quantum cryptography', 'quantum computing']
    }
  ]
};

interface RetentionReadingProps {
  currentUser?: { id: number; is_premium?: boolean } | null;
}

export function RetentionReading({ currentUser }: RetentionReadingProps) {
  const [phase, setPhase] = useState<Phase>('selection');
  const [level, setLevel] = useState<Level | null>(null);
  const [currentText, setCurrentText] = useState<TextData | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [extensions, setExtensions] = useState(0);
  const [recallText, setRecallText] = useState('');
  const [score, setScore] = useState(0);
  const [missedConcepts, setMissedConcepts] = useState<string[]>([]);
  const [showTooltip, setShowTooltip] = useState<{ word: string; x: number; y: number } | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [wordSaved, setWordSaved] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => stopTimer();
  }, []);

  const startTimer = (seconds: number) => {
    stopTimer();
    setTimeLeft(seconds);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- Phase 1: Selection & Reading ---
  const handleSelectLevel = (selectedLevel: Level) => {
    const texts = TEXT_DATA[selectedLevel];
    const text = texts[Math.floor(Math.random() * texts.length)];
    setLevel(selectedLevel);
    setCurrentText(text);
    setPhase('reading');
    setExtensions(0);
    startTimer(180); // 3 minutes
  };

  const handleExtendReading = () => {
    if (extensions < 2) {
      setExtensions((e) => e + 1);
      setTimeLeft((prev) => prev + 60);
      if (timeLeft === 0) startTimer(60); // Resume timer if it was 0
    }
  };

  const handleReadyToRecall = () => {
    setPhase('recall');
    setExtensions(0);
    setRecallText('');
    startTimer(240); // 4 minutes
  };

  // --- Phase 2: Recall ---
  const handleExtendRecall = () => {
    if (extensions < 1) {
      setExtensions((e) => e + 1);
      setTimeLeft((prev) => prev + 60);
      if (timeLeft === 0) startTimer(60);
    }
  };

  const handleSubmitRecall = async () => {
    stopTimer();
    evaluateRecall(recallText);
  };

  // Auto-submit when recall timer hits 0
  useEffect(() => {
    if (phase === 'recall' && timeLeft === 0) {
      if (timerRef.current) {
         clearInterval(timerRef.current);
         timerRef.current = null;
      }
      evaluateRecall(recallText);
    }
  }, [timeLeft, phase, recallText]);

  // --- Phase 3: Evaluation ---
  const evaluateRecall = async (text: string) => {
    if (!currentText) return;

    const lowerText = text.toLowerCase();
    let matchedCount = 0;
    const missed: string[] = [];

    currentText.keyConcepts.forEach((concept) => {
      // Basic stemming/matching: Check if all words in concept appear in text
      const conceptWords = concept.toLowerCase().split(' ');
      const allMatched = conceptWords.every((w) => lowerText.includes(w));
      if (allMatched) {
        matchedCount++;
      } else {
        missed.push(concept);
      }
    });

    const calculatedScore = Math.round((matchedCount / currentText.keyConcepts.length) * 100);
    setScore(calculatedScore);
    setMissedConcepts(missed);
    setPhase('evaluation');

    if (currentUser?.id) {
      try {
        await apiFetch('/api/reading/session', {
          method: 'POST',
          body: JSON.stringify({
            telegram_id: currentUser.id,
            level: currentText.level,
            score: calculatedScore,
            words_recalled: text.split(/\s+/).filter((w) => w.length > 0).length
          })
        });
      } catch (err) {
        console.error('Failed to save session', err);
      }
    }
  };

  // --- Phase 4: Review ---
  const handleReview = () => {
    setPhase('review');
  };

  const handleWordClick = async (word: string, e: React.MouseEvent) => {
    const cleanWord = word.replace(/[.,!?;:"()]/g, '').toLowerCase();
    if (!cleanWord) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setShowTooltip({ word: cleanWord, x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
    setTranslation(null);
    setTranslating(true);
    setWordSaved(false);

    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${cleanWord}&langpair=en|uz`);
      const data = await res.json();
      if (data.responseData?.translatedText) {
        setTranslation(data.responseData.translatedText);
      }
    } catch (err) {
      console.error(err);
      setTranslation('Error');
    } finally {
      setTranslating(false);
    }
  };

  const playAudio = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const saveWord = async () => {
    if (!showTooltip || !translation || !currentUser?.id) return;
    try {
      await apiFetch('/api/reading/save-word', {
        method: 'POST',
        body: JSON.stringify({
          telegram_id: currentUser.id,
          word: showTooltip.word,
          translation,
          level: currentText?.level || 'A2'
        })
      });
      setWordSaved(true);
    } catch (err) {
      console.error(err);
    }
  };

  const closeTooltip = () => setShowTooltip(null);

  // --- Renderers ---
  if (phase === 'selection') {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 fade-in">
        <h2 className="text-2xl font-bold text-lime-300">Retention Reading Module</h2>
        <p className="text-slate-400">Select a difficulty level to begin your reading and recall session.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="A2 Beginner" className="cursor-pointer hover:border-lime-400/50" onClick={() => handleSelectLevel('A2')}>
            <p className="text-sm text-slate-300">70–100 words. Simple structures, factual everyday topics.</p>
          </Card>
          <Card title="B1 Intermediate" className="cursor-pointer hover:border-lime-400/50" onClick={() => handleSelectLevel('B1')}>
            <p className="text-sm text-slate-300">130–170 words. Intermediate syntax, history, nature facts.</p>
          </Card>
          <Card title="B2 Advanced" className="cursor-pointer hover:border-lime-400/50" onClick={() => handleSelectLevel('B2')}>
            <p className="text-sm text-slate-300">200–260 words. Academic, dense syntax, complex phenomena.</p>
          </Card>
        </div>
      </div>
    );
  }

  if (phase === 'reading') {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 fade-in">
        <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-lime-400/20">
          <div>
            <h2 className="text-xl font-bold text-lime-300">Level {currentText?.level} Reading</h2>
            <p className="text-xs text-slate-400 font-mono mt-1">Read carefully. You will need to recall facts later.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`text-2xl font-mono font-bold ${timeLeft < 30 ? 'text-red-400 animate-pulse' : 'text-lime-400'}`}>
              {formatTime(timeLeft)}
            </div>
            {timeLeft === 0 && extensions < 2 && (
              <button onClick={handleExtendReading} className="px-3 py-1 bg-slate-800 text-lime-300 rounded border border-lime-400/30 hover:bg-slate-700">
                +1 Min
              </button>
            )}
          </div>
        </div>
        <Card className="p-6 bg-slate-900 border-lime-400/10">
          <p className="text-lg leading-relaxed text-slate-200">{currentText?.content}</p>
        </Card>
        <button
          onClick={handleReadyToRecall}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-950 font-bold hover:shadow-[0_0_20px_rgba(132,204,22,0.4)] transition"
        >
          Ready to Recall →
        </button>
      </div>
    );
  }

  if (phase === 'recall') {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 fade-in h-full">
        <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-lime-400/20">
          <div>
            <h2 className="text-xl font-bold text-lime-300">Active Recall Phase</h2>
            <p className="text-xs text-slate-400 font-mono mt-1">Type as many facts as you can remember.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`text-2xl font-mono font-bold ${timeLeft < 30 ? 'text-red-400 animate-pulse' : 'text-lime-400'}`}>
              {formatTime(timeLeft)}
            </div>
            {extensions < 1 && (
              <button onClick={handleExtendRecall} className="px-3 py-1 bg-slate-800 text-lime-300 rounded border border-lime-400/30 hover:bg-slate-700">
                +1 Min
              </button>
            )}
          </div>
        </div>
        <textarea
          value={recallText}
          onChange={(e) => setRecallText(e.target.value)}
          className="w-full flex-1 min-h-[400px] bg-slate-900/60 border border-lime-400/30 rounded-xl p-6 text-lime-100 font-mono resize-none focus:outline-none focus:border-lime-400/60 focus:shadow-[0_0_15px_rgba(132,204,22,0.2)] placeholder-slate-600 shadow-inner"
          placeholder="Start typing your recall here..."
          autoFocus
        />
        <button
          onClick={handleSubmitRecall}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-950 font-bold hover:shadow-[0_0_20px_rgba(132,204,22,0.4)] transition"
        >
          Submit Memory Check
        </button>
      </div>
    );
  }

  if (phase === 'evaluation') {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 fade-in">
        <Card className="text-center p-8 bg-slate-900/80 border-lime-400/30">
          <h2 className="text-2xl font-bold text-lime-300 mb-2">Evaluation Complete</h2>
          <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400 my-6">
            {score}%
          </div>
          <p className="text-slate-400 font-mono">Retention Score</p>
        </Card>

        {missedConcepts.length > 0 && (
          <Card title="What You Missed" className="border-red-400/30">
            <div className="flex flex-wrap gap-2 mt-4">
              {missedConcepts.map((concept, i) => (
                <span key={i} className="px-3 py-1 bg-red-500/10 text-red-300 border border-red-400/30 rounded-md text-sm">
                  {concept}
                </span>
              ))}
            </div>
          </Card>
        )}

        <button
          onClick={handleReview}
          className="w-full py-4 rounded-xl bg-slate-800 border border-lime-400/50 text-lime-300 font-bold hover:bg-slate-700 transition"
        >
          Review Original Text
        </button>
      </div>
    );
  }

  if (phase === 'review') {
    const words = currentText?.content.split(' ') || [];
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 fade-in relative" onClick={() => showTooltip && closeTooltip()}>
        <div className="flex justify-between items-center">
           <h2 className="text-2xl font-bold text-lime-300">Interactive Review</h2>
           <button onClick={() => setPhase('selection')} className="text-sm text-slate-400 hover:text-lime-300">Return to Levels</button>
        </div>
        <Card className="p-6 bg-slate-900 border-lime-400/20 text-lg leading-relaxed text-slate-200">
          {words.map((word, i) => (
            <span
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                handleWordClick(word, e);
              }}
              className="mr-1 cursor-pointer hover:bg-lime-500/20 hover:text-lime-300 rounded px-0.5 transition-colors"
            >
              {word}
            </span>
          ))}
        </Card>

        {showTooltip && (
          <div
            className="absolute z-50 bg-slate-950 border border-lime-400/40 rounded-xl p-4 shadow-2xl flex flex-col gap-3 min-w-[200px]"
            style={{ top: showTooltip.y + 10, left: Math.min(showTooltip.x, window.innerWidth - 220) }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-lime-300 text-lg">{showTooltip.word}</span>
              <button onClick={() => playAudio(showTooltip.word)} className="text-slate-400 hover:text-cyan-300 transition">
                🔊
              </button>
            </div>
            <div className="text-slate-200">
              {translating ? <span className="animate-pulse">Translating...</span> : translation}
            </div>
            <button
              onClick={saveWord}
              disabled={wordSaved || !translation}
              className={`text-xs py-1.5 px-3 rounded-md transition ${wordSaved ? 'bg-lime-500/20 text-lime-300 border border-lime-400/30' : 'bg-slate-800 text-cyan-300 hover:bg-slate-700'}`}
            >
              {wordSaved ? '✓ Saved' : '+ Save to My Vocab'}
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
