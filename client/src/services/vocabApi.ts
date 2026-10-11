import { apiFetch } from './apiClient';
import type { AnalyzeResponse, SupportedLanguageCode } from '../types/vocab';
import { detectBot } from './botDetection';

export async function analyzeWord(params: {
  word: string;
  targetLanguageCode: SupportedLanguageCode;
  targetLanguageLabel: string;
}): Promise<AnalyzeResponse> {
  const customHeaders: Record<string, string> = {};

  // Non-blocking client-side bot detection telemetry signal
  try {
    const botCheck = await detectBot();
    if (botCheck.bot) {
      customHeaders['x-client-bot-signal'] = String(botCheck.botKind || 'bot');
    }
  } catch {
    // Fail-open: telemetry errors should never hinder vocabulary analysis
  }

  return apiFetch<AnalyzeResponse>('/api/analyze', {
    method: 'POST',
    headers: customHeaders,
    body: JSON.stringify({
      word: params.word,
      targetLanguage: {
        code: params.targetLanguageCode,
        label: params.targetLanguageLabel
      }
    })
  });
}
