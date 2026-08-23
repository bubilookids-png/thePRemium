import React, { useId, useMemo } from 'react';
import type { SupportedLanguageCode, TargetLanguage } from '../types/vocab';

const LANGUAGES: TargetLanguage[] = [
  { code: 'es', label: 'Spanish' }, { code: 'fr', label: 'French' }, { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' }, { code: 'pt', label: 'Portuguese' }, { code: 'ru', label: 'Russian' },
  { code: 'tr', label: 'Turkish' }, { code: 'ar', label: 'Arabic' }, { code: 'hi', label: 'Hindi' },
  { code: 'zh-CN', label: 'Chinese (Simplified)' }, { code: 'ja', label: 'Japanese' }, { code: 'ko', label: 'Korean' },
  { code: 'vi', label: 'Vietnamese' }, { code: 'id', label: 'Indonesian' }, { code: 'uz', label: 'Uzbek' }
];

export function WordForm(props: {
  word: string;
  onWordChange: (v: string) => void;
  languageCode: SupportedLanguageCode;
  onLanguageChange: (code: SupportedLanguageCode, label: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  const wordId = useId();
  const langId = useId();
  const currentLabel = useMemo(() => LANGUAGES.find(l => l.code === props.languageCode)?.label ?? 'Spanish', [props.languageCode]);

  return (
    <form className="form-grid" onSubmit={(e) => { e.preventDefault(); props.onSubmit(); }} aria-label="Word analysis form">
      <div>
        <label htmlFor={wordId} className="field-label"><span>English word / term</span><span className="field-hint">1–3 words</span></label>
        <input
          id={wordId}
          value={props.word}
          onChange={(e) => props.onWordChange(e.target.value)}
          placeholder='Try “resilient” or “take off”'
          autoComplete="off"
          spellCheck={false}
          className="text-input"
          disabled={props.disabled}
        />
      </div>
      <div>
        <label htmlFor={langId} className="field-label"><span>Translate into</span><span className="field-hint">AI</span></label>
        <select
          id={langId}
          value={props.languageCode}
          onChange={(e) => {
            const code = e.target.value as SupportedLanguageCode;
            const label = LANGUAGES.find(l => l.code === code)?.label ?? currentLabel;
            props.onLanguageChange(code, label);
          }}
          className="select-input"
          disabled={props.disabled}
        >
          {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </div>
      <div className="form-submit">
        <button type="submit" disabled={props.disabled} className="primary-btn">
          {props.disabled ? 'Analyzing…' : 'Analyze word →'}
        </button>
      </div>
    </form>
  );
}
