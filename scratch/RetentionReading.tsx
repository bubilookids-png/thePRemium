import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../client/src/services/apiClient';
import { translateText } from '../client/src/services/translatorApi';

// --- Types ---
type Level = 'A2' | 'B1' | 'B2';
type Phase = 'selection' | 'setup' | 'reading' | 'recall' | 'evaluation' | 'review';

interface TextData {
  id: string;
  level: Level;
  title: string;
  content: string;
  keyConcepts: string[];
}

// --- Sample Data ---
const TEXT_DATA: Record<Level, TextData[]> = {
  A2: [
    {
      id: 'a2-1',
      level: 'A2',
      title: 'The Tallest Mammals',
      content: 'Giraffes are the tallest mammals on Earth. They live in Africa. A giraffe has a very long neck, but it has only seven bones in its neck. This is the same number of bones as a human has. Giraffes eat leaves from high trees. Their favorite food is the acacia tree. A giraffe has a long, blue tongue to help it pull leaves from branches. They do not drink a lot of water because they get water from the leaves they eat.',
      keyConcepts: ['giraffes', 'tallest', 'africa', 'long neck', 'seven bones', 'leaves', 'acacia', 'blue tongue', 'water']
    }
  ],
  B1: [
    {
      id: 'b1-1',
      level: 'B1',
      title: 'The Dawn of Computing',
      content: 'Early computing began long before modern electronic devices existed. One of the first mechanical computers was the Analytical Engine, designed by Charles Babbage in the 1830s. It used punch cards for input and could perform complex mathematical calculations. Ada Lovelace is often considered the first computer programmer because she wrote an algorithm for this machine. The transition to electronic computers happened during World War II with machines like ENIAC. These massive computers used vacuum tubes, generated an enormous amount of heat, and filled entire rooms, yet they were less powerful than a simple modern smartphone.',
      keyConcepts: ['early computing', 'analytical engine', 'charles babbage', 'punch cards', 'ada lovelace', 'programmer', 'eniac', 'world war ii', 'vacuum tubes', 'smartphone']
    }
  ],
  B2: [
    {
      id: 'b2-1',
      level: 'B2',
      title: 'Quantum Entanglement',
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
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [extensions, setExtensions] = useState(0);
  
  // Recall & Eval State
  const [recallText, setRecallText] = useState('');
  const [score, setScore] = useState(0);
  const [matchedConcepts, setMatchedConcepts] = useState<string[]>([]);
  const [missedConcepts, setMissedConcepts] = useState<string[]>([]);
  
  // Interaction State
  const [showTooltip, setShowTooltip] = useState<{ word: string; x: number; y: number } | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [wordSaved, setWordSaved] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    return () => stopTimer();
  }, []);

  const startTimer = (seconds: number) => {
    stopTimer();
    setTimeLeft(seconds);
    setInitialTime(seconds);
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
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Auto-transition when reading timer hits 0
  useEffect(() => {
    if (phase === 'reading' && timeLeft === 0 && initialTime > 0) {
      handleReadyToRecall();
    }
  }, [timeLeft, phase, initialTime]);

  // Auto-submit when recall timer hits 0
  useEffect(() => {
    if (phase === 'recall' && timeLeft === 0 && initialTime > 0) {
      handleSubmitRecall();
    }
  }, [timeLeft, phase, initialTime]);

  // Phase Handlers
  const handleSelectLevel = async (selectedLevel: Level) => {
    setLevel(selectedLevel);
    // Ideally fetch from API here, fallback to local
    try {
      const res = await fetch(`/api/reading/articles?level=${selectedLevel}`);
      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          const randomText = data.articles[Math.floor(Math.random() * data.articles.length)];
          setCurrentText(randomText);
          setPhase('setup');
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch from API, using fallback data');
    }
    
    // Fallback
    const texts = TEXT_DATA[selectedLevel];
    const text = texts[Math.floor(Math.random() * texts.length)];
    setCurrentText(text);
    setPhase('setup');
  };

  const handleStartReading = () => {
    setPhase('reading');
    setExtensions(0);
    setInitialTime(180); // 3 minutes
    startTimer(180);
  };

  const handleExtendReading = () => {
    if (extensions < 1) { // 1 extension max (+2 mins as requested)
      setExtensions((e) => e + 1);
      setTimeLeft((prev) => prev + 120);
      setInitialTime((prev) => prev + 120);
      if (timeLeft === 0) startTimer(120);
    }
  };

  const handleReadyToRecall = () => {
    stopTimer();
    setPhase('recall');
    setExtensions(0);
    setRecallText('');
    setInitialTime(240); // 4 mins for recall
    startTimer(240);
  };

  const handleSubmitRecall = async () => {
    stopTimer();
    setIsEvaluating(true);
    await evaluateRecall(recallText);
    setIsEvaluating(false);
  };

  const evaluateRecall = async (text: string) => {
    if (!currentText) return;

    const lowerText = text.toLowerCase();
    const matched: string[] = [];
    const missed: string[] = [];

    currentText.keyConcepts.forEach((concept) => {
      // Improved matching: check if concept or its main words exist
      const conceptWords = concept.toLowerCase().split(' ').filter(w => w.length > 2);
      const isMatched = conceptWords.length > 0 
        ? conceptWords.some(w => lowerText.includes(w)) || lowerText.includes(concept.toLowerCase())
        : lowerText.includes(concept.toLowerCase());

      if (isMatched) {
        matched.push(concept);
      } else {
        missed.push(concept);
      }
    });

    const calculatedScore = Math.round((matched.length / currentText.keyConcepts.length) * 100);
    setScore(calculatedScore);
    setMatchedConcepts(matched);
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

  // Word Interaction
  const handleWordClick = async (word: string, e: React.MouseEvent) => {
    const cleanWord = word.replace(/[.,!?;:"()]/g, '').toLowerCase();
    if (!cleanWord) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    // Intelligent positioning
    const x = Math.min(rect.left + window.scrollX, window.innerWidth - 260);
    const y = rect.bottom + window.scrollY + 8;
    
    setShowTooltip({ word: cleanWord, x, y });
    setTranslation(null);
    setTranslating(true);
    setWordSaved(false);

    try {
      const translationResult = await translateText(cleanWord, 'uz');
      if (translationResult) {
        setTranslation(translationResult);
      } else {
        setTranslation('Translation unavailable');
      }
    } catch (err) {
      console.error(err);
      setTranslation('Error translating');
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

  // Progress Bar Helper
  const getProgressWidth = () => {
    if (initialTime === 0) return '0%';
    return `${((initialTime - timeLeft) / initialTime) * 100}%`;
  };

  // View Renders
  if (phase === 'selection') {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 fade-in">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400">
            Retention Reading 2.0
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Train your memory and reading comprehension. Select a difficulty level to begin your session.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 'A2', title: 'Beginner', desc: '70-100 words. Simple structures, factual everyday topics.', challenge: 'Low' },
            { id: 'B1', title: 'Intermediate', desc: '130-170 words. Intermediate syntax, history, nature facts.', challenge: 'Medium' },
            { id: 'B2', title: 'Advanced', desc: '200-260 words. Academic, dense syntax, complex phenomena.', challenge: 'High' }
          ].map(lvl => (
            <div 
              key={lvl.id}
              onClick={() => handleSelectLevel(lvl.id as Level)}
              className="group relative bg-slate-900/60 border border-lime-400/20 rounded-2xl p-6 cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-lime-400/60 hover:shadow-[0_0_30px_rgba(132,204,22,0.15)]"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-6xl font-black text-lime-400">{lvl.id}</span>
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-lime-500/10 text-lime-300 border border-lime-400/30 rounded-full text-xs font-bold tracking-wider">
                    {lvl.id} Level
                  </span>
                  <span className={`text-xs font-mono ${lvl.challenge === 'High' ? 'text-amber-400' : lvl.challenge === 'Medium' ? 'text-blue-400' : 'text-emerald-400'}`}>
                    {lvl.challenge} Challenge
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-lime-300 transition-colors">{lvl.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed flex-grow">{lvl.desc}</p>
                <div className="mt-6 flex items-center text-lime-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                  Select Level &rarr;
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (phase === 'setup' && currentText) {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-8 fade-in mt-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lime-400 to-cyan-400 p-[2px] shadow-[0_0_30px_rgba(132,204,22,0.3)]">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <span className="text-2xl font-black text-lime-400">{level}</span>
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-100">{currentText.title}</h2>
          <p className="text-slate-400 text-lg">
            You will have <strong className="text-lime-300">3 minutes</strong> to read this text.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-lime-400/20 rounded-2xl p-6 w-full text-center space-y-4">
          <h3 className="text-lime-300 font-bold uppercase tracking-widest text-sm">Instructions</h3>
          <p className="text-slate-300 leading-relaxed">
            Read carefully and try to understand the core concepts. 
            Once the time is up, the text will disappear, and you will need to reconstruct 
            the information from memory.
          </p>
          <div className="pt-4">
            <button
              onClick={handleStartReading}
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-950 font-extrabold text-lg shadow-[0_0_20px_rgba(132,204,22,0.3)] hover:shadow-[0_0_30px_rgba(132,204,22,0.5)] transition-all hover:scale-105"
            >
              Start Reading Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'reading' && currentText) {
    const isWarning = timeLeft <= 30;
    
    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 fade-in relative" onClick={() => showTooltip && setShowTooltip(null)}>
        {/* Header / Timer */}
        <div className="sticky top-4 z-40 bg-slate-900/90 backdrop-blur-md border border-lime-400/30 p-4 rounded-2xl shadow-lg flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-lime-400/80 font-bold uppercase tracking-wider">{currentText.level} Reading</span>
            <h2 className="text-sm font-semibold text-slate-200 truncate max-w-[200px] sm:max-w-xs">{currentText.title}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {extensions < 1 && timeLeft < 60 && (
              <button 
                onClick={handleExtendReading} 
                className="px-3 py-1.5 bg-slate-800/80 text-lime-300 text-xs font-bold rounded-lg border border-lime-400/30 hover:bg-slate-700 transition"
              >
                +2 Min
              </button>
            )}
            <div className={`flex flex-col items-end ${isWarning ? 'animate-pulse' : ''}`}>
              <div className={`text-2xl font-mono font-black ${isWarning ? 'text-red-400' : 'text-lime-400'}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
          
          {/* Progress Bar overlaying the bottom of the header */}
          <div className="absolute bottom-0 left-0 h-1 bg-slate-800 w-full rounded-b-2xl overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 linear ${isWarning ? 'bg-red-500' : 'bg-lime-400'}`} 
              style={{ width: getProgressWidth() }}
            />
          </div>
        </div>

        {/* Article */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-10 min-h-[50vh] shadow-inner mt-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mb-8 leading-tight">{currentText.title}</h1>
          
          <div className="text-lg sm:text-xl leading-loose sm:leading-[2.2] text-slate-300">
            {currentText.content.split(/\s+/).map((word, i) => (
              <span
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  handleWordClick(word, e);
                }}
                className="mr-1.5 cursor-pointer hover:bg-lime-500/20 hover:text-lime-300 rounded px-1 transition-colors inline-block"
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleReadyToRecall}
            className="group px-8 py-4 rounded-xl bg-slate-800 border border-lime-400/50 text-lime-300 font-bold hover:bg-lime-400 hover:text-slate-950 transition-all shadow-lg flex items-center gap-3"
          >
            I'm Ready to Recall 
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </button>
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <div
            className="absolute z-50 bg-slate-950/95 backdrop-blur-sm border border-lime-400/50 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col gap-3 min-w-[220px] max-w-[280px] fade-in"
            style={{ top: showTooltip.y, left: showTooltip.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-bold text-lime-300 text-lg truncate pr-2">{showTooltip.word}</span>
              <button 
                onClick={() => playAudio(showTooltip.word)} 
                className="text-slate-400 hover:text-cyan-300 bg-slate-900 p-1.5 rounded-full transition-colors"
                title="Pronounce"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m7.072 0a5 5 0 01-7.072 0M4.464 4.464A5 5 0 003.393 11.527l-.392.392a1 1 0 001.414 1.414l.392.392a1 1 0 001.414-1.414l.392-.392A5 5 0 0111.527 3.393l.392-.392a1 1 0 00-1.414-1.414l-.392-.392z" /></svg>
              </button>
            </div>
            <div className="text-slate-200 text-sm py-1 font-medium">
              {translating ? <span className="animate-pulse text-slate-400">Translating...</span> : translation}
            </div>
            <button
              onClick={saveWord}
              disabled={wordSaved || !translation || translating}
              className={`w-full text-xs font-bold py-2 px-3 rounded-xl transition-all ${wordSaved ? 'bg-lime-500/20 text-lime-400 border border-lime-400/30' : 'bg-slate-800 text-cyan-300 hover:bg-slate-700 border border-transparent'}`}
            >
              {wordSaved ? '✓ Saved to Vocab' : '+ Save Word'}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (phase === 'recall') {
    const wordCount = recallText.trim() === '' ? 0 : recallText.trim().split(/\s+/).length;
    const isWarning = timeLeft <= 30;

    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 fade-in h-[80vh]">
        <div className="flex justify-between items-center bg-slate-900/80 p-4 rounded-2xl border border-lime-400/30 shadow-lg">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-lime-500/10 flex items-center justify-center border border-lime-400/30">
               <svg className="w-5 h-5 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
             </div>
             <div>
               <h2 className="text-xl font-bold text-slate-100">Recall Phase</h2>
               <p className="text-xs text-slate-400 font-mono">Reconstruct the facts</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right">
                <div className={`text-2xl font-mono font-black ${isWarning ? 'text-red-400 animate-pulse' : 'text-lime-400'}`}>
                  {formatTime(timeLeft)}
                </div>
             </div>
          </div>
        </div>

        <div className="relative flex-1 flex flex-col group">
          <textarea
            ref={textareaRef}
            value={recallText}
            onChange={(e) => setRecallText(e.target.value)}
            disabled={isEvaluating}
            className="w-full flex-1 bg-slate-900/60 border border-lime-400/20 rounded-2xl p-6 md:p-8 text-lg text-slate-200 leading-relaxed resize-none focus:outline-none focus:border-lime-400/60 focus:bg-slate-900/90 shadow-inner transition-all placeholder-slate-600/50"
            placeholder="Type everything you remember from the text here..."
            autoFocus
          />
          <div className="absolute bottom-4 right-6 text-xs font-mono text-slate-500 bg-slate-950/50 px-3 py-1 rounded-full backdrop-blur-sm">
            {wordCount} words
          </div>
        </div>

        <button
          onClick={handleSubmitRecall}
          disabled={isEvaluating}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-950 font-extrabold text-lg shadow-[0_0_20px_rgba(132,204,22,0.3)] hover:shadow-[0_0_30px_rgba(132,204,22,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
        >
          {isEvaluating ? (
             <><span className="animate-spin text-xl">⟳</span> Evaluating your memory...</>
          ) : (
             <>Submit Recall &rarr;</>
          )}
        </button>
      </div>
    );
  }

  if (phase === 'evaluation') {
    const isGood = score >= 70;
    const isOk = score >= 40 && score < 70;
    
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col gap-6">
            <div className={`p-8 rounded-3xl border flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden ${
              isGood ? 'bg-lime-500/10 border-lime-400/40' : 
              isOk ? 'bg-amber-500/10 border-amber-400/40' : 
              'bg-red-500/10 border-red-400/40'
            }`}>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Retention Score</h2>
              <div className={`text-7xl font-black mb-4 ${
                isGood ? 'text-lime-400' : isOk ? 'text-amber-400' : 'text-red-400'
              }`}>
                {score}%
              </div>
              <p className="text-sm text-slate-300 font-medium">
                {isGood ? 'Excellent memory! You captured the core ideas.' : 
                 isOk ? 'Good effort, but missed some key details.' : 
                 'You missed a lot of information. Try to focus more next time.'}
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setPhase('selection')}
                className="w-full py-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold hover:bg-slate-700 transition shadow-sm"
              >
                Next Article
              </button>
              <button
                onClick={handleSelectLevel.bind(null, level!)}
                className="w-full py-4 rounded-xl bg-lime-500/10 border border-lime-400/30 text-lime-400 font-bold hover:bg-lime-500/20 transition shadow-sm"
              >
                Try Again
              </button>
            </div>
          </div>
          
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-slate-900/60 border border-lime-400/20 rounded-3xl p-6 md:p-8 flex-1">
               <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                 <span className="w-8 h-8 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-sm">✓</span>
                 Remembered Concepts
               </h3>
               {matchedConcepts.length > 0 ? (
                 <div className="flex flex-wrap gap-2.5">
                   {matchedConcepts.map((concept, i) => (
                     <span key={i} className="px-4 py-2 bg-lime-500/10 text-lime-300 border border-lime-400/30 rounded-xl text-sm font-medium fade-in" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}>
                       {concept}
                     </span>
                   ))}
                 </div>
               ) : (
                 <p className="text-slate-500 italic">No key concepts matched.</p>
               )}
            </div>

            <div className="bg-slate-900/60 border border-red-400/20 rounded-3xl p-6 md:p-8 flex-1">
               <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                 <span className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-sm">✗</span>
                 Missed Information
               </h3>
               {missedConcepts.length > 0 ? (
                 <div className="flex flex-wrap gap-2.5">
                   {missedConcepts.map((concept, i) => (
                     <span key={i} className="px-4 py-2 bg-red-500/10 text-red-300 border border-red-400/30 rounded-xl text-sm font-medium fade-in" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}>
                       {concept}
                     </span>
                   ))}
                 </div>
               ) : (
                 <p className="text-lime-400/80 italic">Perfect! You remembered all key concepts.</p>
               )}
            </div>
            
            <button
              onClick={() => setPhase('review')}
              className="w-full mt-2 py-4 text-slate-400 hover:text-lime-300 font-bold transition flex justify-center items-center gap-2"
            >
              Review Original Text &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'review' && currentText) {
    const words = currentText.content.split(' ');
    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 fade-in relative" onClick={() => showTooltip && setShowTooltip(null)}>
        <div className="flex justify-between items-center bg-slate-900/90 backdrop-blur-md border border-lime-400/30 p-4 rounded-2xl shadow-lg sticky top-4 z-40">
           <div>
             <h2 className="text-lg font-bold text-lime-300">Original Text Review</h2>
             <p className="text-xs text-slate-400">{currentText.title}</p>
           </div>
           <button 
             onClick={() => setPhase('evaluation')} 
             className="px-4 py-2 bg-slate-800 text-slate-200 text-sm font-bold rounded-lg border border-slate-700 hover:bg-slate-700 transition"
           >
             Back to Results
           </button>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-inner mt-2">
          <div className="text-lg sm:text-xl leading-loose sm:leading-[2.2] text-slate-300">
            {words.map((word, i) => (
              <span
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  handleWordClick(word, e);
                }}
                className="mr-1.5 cursor-pointer hover:bg-lime-500/20 hover:text-lime-300 rounded px-1 transition-colors inline-block"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
        
        {/* Same Tooltip as Reading phase */}
        {showTooltip && (
          <div
            className="absolute z-50 bg-slate-950/95 backdrop-blur-sm border border-lime-400/50 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col gap-3 min-w-[220px] max-w-[280px] fade-in"
            style={{ top: showTooltip.y, left: showTooltip.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-bold text-lime-300 text-lg truncate pr-2">{showTooltip.word}</span>
              <button 
                onClick={() => playAudio(showTooltip.word)} 
                className="text-slate-400 hover:text-cyan-300 bg-slate-900 p-1.5 rounded-full transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m7.072 0a5 5 0 01-7.072 0M4.464 4.464A5 5 0 003.393 11.527l-.392.392a1 1 0 001.414 1.414l.392.392a1 1 0 001.414-1.414l.392-.392A5 5 0 0111.527 3.393l.392-.392a1 1 0 00-1.414-1.414l-.392-.392z" /></svg>
              </button>
            </div>
            <div className="text-slate-200 text-sm py-1 font-medium">
              {translating ? <span className="animate-pulse text-slate-400">Translating...</span> : translation}
            </div>
            <button
              onClick={saveWord}
              disabled={wordSaved || !translation || translating}
              className={`w-full text-xs font-bold py-2 px-3 rounded-xl transition-all ${wordSaved ? 'bg-lime-500/20 text-lime-400 border border-lime-400/30' : 'bg-slate-800 text-cyan-300 hover:bg-slate-700 border border-transparent'}`}
            >
              {wordSaved ? '✓ Saved' : '+ Save Word'}
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
