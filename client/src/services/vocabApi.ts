import { apiFetch } from './apiClient';
import type { AnalyzeResponse, SupportedLanguageCode } from '../types/vocab';

export async function analyzeWord(params: {
  word: string;
  targetLanguageCode: SupportedLanguageCode;
  targetLanguageLabel: string;
}): Promise<AnalyzeResponse> {
  return apiFetch<AnalyzeResponse>('/api/analyze', {
    method: 'POST',
    body: JSON.stringify({
      word: params.word,
      targetLanguage: {
        code: params.targetLanguageCode,
        label: params.targetLanguageLabel
      }
    })
  });
}
