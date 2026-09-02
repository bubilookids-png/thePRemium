import { z } from 'zod';
import type { AnalyzeResponseDTO, TargetLanguageDTO } from '../types/dto.js';
import { groqChatJSON, hasGroqKey } from './groqClient.js';
import { mockAnalyze } from './mockService.js';
import { logger } from '../utils/logger.js';

const responseSchema: z.ZodType<AnalyzeResponseDTO, z.ZodTypeDef, unknown> = z.object({
  analysis: z.object({
    word: z.string().min(1),
    targetLanguage: z.object({
      code: z.string().min(1),
      label: z.string().min(1)
    }),
    definition: z.string().min(1),
    translation: z.string().min(1),
    cefrLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Unknown']),
    partOfSpeech: z.string().min(1),
    synonyms: z.array(z.string()).default([]),
    antonyms: z.array(z.string()).default([]),
    collocations: z.array(z.string()).default([]),
    examples: z.array(z.string()).min(2).max(3),
    usage: z.string().min(1),
    commonMistakes: z.array(z.string()).default([]),
    pronunciation: z
      .object({
        ipa: z.string().optional()
      })
      .optional()
  }),
  quiz: z.object({
    title: z.string().min(1),
    questions: z.array(
      z.object({
        id: z.string().min(1),
        type: z.enum(['multiple_choice', 'fill_blank', 'select_synonym', 'select_antonym']),
        prompt: z.string().min(1),
        options: z.array(z.string()).optional(),
        correctOptionIndex: z.number().int().nonnegative().optional(),
        correctText: z.string().optional(),
        explanation: z.string().min(1)
      })
    ).min(3).max(6)
  })
});

type CacheKey = string;
const cache = new Map<CacheKey, { at: number; value: AnalyzeResponseDTO }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

function cacheKey(word: string, lang: TargetLanguageDTO): string {
  return `${word.toLowerCase()}::${lang.code}`;
}

function getCached(word: string, lang: TargetLanguageDTO): AnalyzeResponseDTO | null {
  const key = cacheKey(word, lang);
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.value;
}

function setCached(word: string, lang: TargetLanguageDTO, value: AnalyzeResponseDTO) {
  cache.set(cacheKey(word, lang), { at: Date.now(), value });
}

export async function analyzeWordService(params: {
  word: string;
  targetLanguage: TargetLanguageDTO;
}): Promise<AnalyzeResponseDTO> {
  const cached = getCached(params.word, params.targetLanguage);
  if (cached) return cached;

  // If no key, return mock (explicitly real behavior; not pretending).
  if (!hasGroqKey()) {
    const mock = mockAnalyze(params.word, params.targetLanguage);
    setCached(params.word, params.targetLanguage, mock);
    return mock;
  }

  const system = `
You are an expert English lexicography tutor for learners (teenagers to older adults).
Return ONLY valid JSON (no markdown, no extra text). The JSON must match the required shape.

Goals:
- Give a clear learner-friendly English definition.
- Provide an accurate translation into the target language.
- Estimate CEFR level (A1-C2) or "Unknown" if unsure.
- Provide part of speech.
- Provide multiple synonyms (3-7).
- Provide antonyms when appropriate (0-5).
- Provide common collocations (3-8).
- Provide 2-3 natural example sentences.
- Provide a short "usage" explanation.
- Provide 2-5 common mistakes/usage notes if relevant.
- IMPORTANT: pronunciation MUST ALWAYS be an object.
- Use exactly this format: "pronunciation": { "ipa": "/teɪk/" }
- NEVER return pronunciation as a plain string.
- If IPA is unavailable, use: "pronunciation": { "ipa": "" }
- Generate a short quiz (3-6 questions) with mixed types:
  - multiple_choice
  - select_synonym
  - select_antonym (only if meaningful)
  - fill_blank
Each question must include:
- id (string)
- prompt (string)
- explanation (string)
- For option-based: options (array), correctOptionIndex (number)
- For fill_blank: correctText (string)

Important:
- Examples must be natural and not overly academic.
- Avoid unsafe content.
- Do not include personal data.
`.trim();

  const user = JSON.stringify({
    task: 'Analyze English vocabulary word and create quiz',
    word: params.word,
    targetLanguage: params.targetLanguage,
    outputShape: {
      analysis: {
        word: 'string',
        targetLanguage: { code: 'string', label: 'string' },
        definition: 'string',
        translation: 'string',
        cefrLevel: 'A1|A2|B1|B2|C1|C2|Unknown',
        partOfSpeech: 'string',
        synonyms: ['string'],
        antonyms: ['string'],
        collocations: ['string'],
        examples: ['string (2-3)'],
        usage: 'string',
        commonMistakes: ['string'],
        pronunciation: { ipa: 'string optional' }
      },
      quiz: {
        title: 'string',
        questions: [
          {
            id: 'string',
            type: 'multiple_choice|select_synonym|select_antonym|fill_blank',
            prompt: 'string',
            options: ['string optional'],
            correctOptionIndex: 'number optional',
            correctText: 'string optional',
            explanation: 'string'
          }
        ]
      }
    }
  });

  try {
    const json = await groqChatJSON({ system, user, temperature: 0.25 });
    const parsed = responseSchema.parse(json);

    // If the model created a select_antonym without good antonyms, that’s still okay;
    // but ensure question consistency (options exist for option questions).
    for (const q of parsed.quiz.questions) {
      if (q.type !== 'fill_blank' && (!q.options || q.options.length < 2 || typeof q.correctOptionIndex !== 'number')) {
        throw new Error('Invalid quiz question returned by AI.');
      } else if (q.type === 'fill_blank' && !q.correctText) {
        throw new Error('Invalid fill_blank question returned by AI.');
      }
    }

    setCached(params.word, params.targetLanguage, parsed);
    return parsed;
  } catch (err: any) {
    logger.warn('AI analyze failed, falling back to mock', { message: err?.message });
    const mock = mockAnalyze(params.word, params.targetLanguage);
    setCached(params.word, params.targetLanguage, mock);
    return mock;
  }
}
