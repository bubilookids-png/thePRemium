// src/components/QuickTranslator.tsx
import React, { useState } from 'react';
import { Card } from './Card';
import { translateText } from '../services/translatorApi';

const LANGUAGES = [
  { code: 'uz', label: 'Uzbek' },
  { code: 'ru', label: 'Russian' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'tr', label: 'Turkish' },
  { code: 'ar', label: 'Arabic' },
];

export function QuickTranslator() {
  const [inputText, setInputText] = useState('');
  const [targetLang, setTargetLang] = useState('uz');
  const [result, setResult] = useState('');
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTranslate() {
    if (!inputText.trim()) return;
    setTranslating(true);
    setError(null);

    try {
      const translated = await translateText(inputText, targetLang);
      setResult(translated);
    } catch (err: any) {
      setError(err.message || 'Tarjima qilib bo‘lmadi');
    } finally {
      setTranslating(false);
    }
  }

  return (
    <Card 
      title="⚡ Quick Translator" 
      subtitle="Fast direct translation without detailed analysis"
      className="form-card"
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            className="flex-1 bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            placeholder="Type any word or sentence..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTranslate()}
          />

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                {lang.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleTranslate}
            disabled={translating || !inputText.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            {translating ? 'Translating...' : 'Translate'}
          </button>
        </div>

        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}

        {result && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-indigo-500/30">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              Result:
            </div>
            <div className="text-lg text-slate-100 font-medium">
              {result}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}