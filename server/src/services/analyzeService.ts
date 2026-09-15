import { z } from 'zod';
import type { AnalyzeResponseDTO, TargetLanguageDTO } from '../types/dto.js';
import { groqChatJSON, hasGroqKey } from './groqClient.js';
import { mockAnalyze } from './mockService.js';
import { logger } from '../utils/logger.js';
import { db } from '../db/database.js';

const responseSchema = z.object({
  source: z.enum(['local_database', 'ai_engine']).optional(),
  sources: z
    .object({
      definition: z.enum(['db', 'ai']).optional(),
      translation: z.enum(['db', 'ai']).optional(),
      synonyms: z.enum(['db', 'ai']).optional(),
      antonyms: z.enum(['db', 'ai']).optional(),
      collocations: z.enum(['db', 'ai']).optional(),
      examples: z.enum(['db', 'ai']).optional(),
      quiz: z.enum(['db', 'ai']).optional()
    })
    .optional(),
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
    examples: z.array(z.string()).min(2).max(4),
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
    questions: z
      .array(
        z.object({
          id: z.string().min(1),
          type: z.enum(['multiple_choice', 'fill_blank', 'select_synonym', 'select_antonym']),
          prompt: z.string().min(1),
          options: z.array(z.string()).optional(),
          correctOptionIndex: z.number().int().nonnegative().optional(),
          correctText: z.string().optional(),
          explanation: z.string().min(1)
        })
      )
      .min(3)
      .max(6)
  })
});

interface WordDbRow {
  id: number;
  term: string;
  ipa: string | null;
  part_of_speech: string | null;
  cefr_level: string | null;
  definition_en: string;
  translation_uz: string | null;
  translation_ru: string | null;
  translation_es: string | null;
  synonyms: string | null;
  antonyms: string | null;
  collocations: string | null;
  examples: string | null;
}

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

function setCached(word: string, lang: TargetLanguageDTO, value: AnalyzeResponseDTO): void {
  cache.set(cacheKey(word, lang), { at: Date.now(), value });
}

function safeJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map((item) => String(item)) : [];
  } catch {
    return [];
  }
}

export async function analyzeWordService(params: {
  word: string;
  targetLanguage: TargetLanguageDTO;
}): Promise<AnalyzeResponseDTO> {
  const cleanWord = params.word.trim().toLowerCase();

  // 1. Kesh tekshiruvi
  const cached = getCached(cleanWord, params.targetLanguage);
  if (cached) return cached;

  // 2. Bazadan qidirish
  let row: WordDbRow | undefined;
  try {
    row = db.prepare('SELECT * FROM words WHERE LOWER(term) = ?').get(cleanWord) as WordDbRow | undefined;
  } catch (err) {
    logger.warn('DB query error', { err });
  }

  // 3. Agar so'z toza holatda bazada mavjud bo'lsa (DB HIT)
  const isEnriched = Boolean(
    row &&
    row.definition_en &&
    row.synonyms &&
    row.synonyms !== '[]' &&
    row.translation_uz
  );

  if (row && isEnriched) {
    logger.info(`[DB FULL HIT] Returning clean cached word: ${cleanWord}`);

    const syns = safeJsonArray(row.synonyms);
    const ants = safeJsonArray(row.antonyms);
    const colls = safeJsonArray(row.collocations);
    const examp = safeJsonArray(row.examples);

    const result: AnalyzeResponseDTO = {
      source: 'local_database',
      sources: {
        definition: 'db',
        synonyms: 'db',
        antonyms: 'db',
        collocations: 'db',
        examples: 'db',
        translation: row.translation_uz ? 'db' : 'ai',
        quiz: 'db'
      },
      analysis: {
        word: cleanWord,
        targetLanguage: params.targetLanguage,
        definition: row.definition_en,
        translation: row.translation_uz || 'Tarjima mavjud emas',
        cefrLevel: (row.cefr_level as any) || 'B2',
        partOfSpeech: row.part_of_speech || 'noun',
        synonyms: syns.length ? syns : ['abandon', 'leave'],
        antonyms: ants,
        collocations: colls,
        examples: examp.length >= 2 ? examp : [
          `You should understand the context of "${cleanWord}".`,
          `They frequently use "${cleanWord}" in modern English.`
        ],
        usage: 'Regularly used in spoken and written English.',
        commonMistakes: [],
        pronunciation: { ipa: row.ipa || '' }
      },
      quiz: {
        title: 'Quick Check Quiz',
        questions: [
          {
            id: 'q1',
            type: 'multiple_choice',
            prompt: `What is the primary meaning of "${cleanWord}"?`,
            options: [
              row.definition_en.slice(0, 45),
              'To make something stronger',
              'To build quickly',
              'To celebrate with friends'
            ],
            correctOptionIndex: 0,
            explanation: `"${cleanWord}" means: ${row.definition_en.slice(0, 70)}`
          },
          {
            id: 'q2',
            type: 'fill_blank',
            prompt: `Always remember to use "_____" in the right context.`,
            correctText: cleanWord,
            explanation: `"${cleanWord}" correctly fits this sentence.`
          },
          {
            id: 'q3',
            type: 'select_synonym',
            prompt: `Which word is a synonym for "${cleanWord}"?`,
            options: syns[0] ? [syns[0], 'create', 'increase', 'admire'] : ['give up', 'build', 'strengthen', 'praise'],
            correctOptionIndex: 0,
            explanation: 'Correct synonym selected from database records.'
          }
        ]
      }
    };

    setCached(cleanWord, params.targetLanguage, result);
    return result;
  }

  // 4. Agar bazada yo'q bo'lsa yoki eski Webster xom matni bo'lsa, AI orqali to'ldirish
  if (!hasGroqKey()) {
    const mock = mockAnalyze(params.word, params.targetLanguage);
    setCached(params.word, params.targetLanguage, mock);
    return mock;
  }

  logger.info(`[AI ENRICHING] Generating clean modern data for "${cleanWord}"`);

  const system = `
You are an expert English language tutor. 
Return ONLY clean, valid JSON matching the schema. No markdown ticks, no commentary.
Definition must be modern, concise, learner-friendly (1-2 sentences).
Translation must be an accurate target language equivalent.
Examples must have between 2 and 4 natural sentences.
Quiz must contain 3 questions.
`.trim();

  const user = JSON.stringify({
    task: 'Analyze word',
    word: cleanWord,
    targetLanguage: params.targetLanguage,
    outputShape: {
      analysis: {
        word: cleanWord,
        targetLanguage: params.targetLanguage,
        definition: 'Short concise modern definition',
        translation: 'Accurate target translation',
        cefrLevel: 'A1|A2|B1|B2|C1|C2',
        partOfSpeech: 'verb|noun|adjective|adverb',
        synonyms: ['synonym1', 'synonym2', 'synonym3'],
        antonyms: ['antonym1', 'antonym2'],
        collocations: ['collocation1', 'collocation2'],
        examples: ['Natural sentence 1.', 'Natural sentence 2.'],
        usage: '1-2 practical usage notes',
        commonMistakes: ['1-2 common mistakes'],
        pronunciation: { ipa: '/.../' }
      },
      quiz: {
        title: 'Word Mastery Quiz',
        questions: [
          {
            id: 'q1',
            type: 'multiple_choice',
            prompt: 'Question prompt',
            options: ['Opt 1', 'Opt 2', 'Opt 3', 'Opt 4'],
            correctOptionIndex: 0,
            explanation: 'Why it is correct'
          },
          {
            id: 'q2',
            type: 'fill_blank',
            prompt: 'Sentence with _____ blank',
            correctText: cleanWord,
            explanation: 'Why it is correct'
          },
          {
            id: 'q3',
            type: 'select_synonym',
            prompt: 'Select synonym',
            options: ['Opt 1', 'Opt 2', 'Opt 3', 'Opt 4'],
            correctOptionIndex: 0,
            explanation: 'Why it is correct'
          }
        ]
      }
    }
  });

  try {
    const json = await groqChatJSON({ system, user, temperature: 0.2 });
    const parsed = responseSchema.parse(json);

    // AI generatsiya qilgan toza ma'lumotni SQLite bazaga saqlash
    try {
      db.prepare(`
        INSERT INTO words (
          term, ipa, part_of_speech, cefr_level, definition_en, 
          translation_uz, synonyms, antonyms, collocations, examples
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(term) DO UPDATE SET
          definition_en = excluded.definition_en,
          translation_uz = excluded.translation_uz,
          ipa = excluded.ipa,
          part_of_speech = excluded.part_of_speech,
          cefr_level = excluded.cefr_level,
          synonyms = excluded.synonyms,
          antonyms = excluded.antonyms,
          collocations = excluded.collocations,
          examples = excluded.examples
      `).run(
        cleanWord,
        parsed.analysis.pronunciation?.ipa || '',
        parsed.analysis.partOfSpeech,
        parsed.analysis.cefrLevel,
        parsed.analysis.definition,
        params.targetLanguage.code === 'uz' ? parsed.analysis.translation : (row?.translation_uz || ''),
        JSON.stringify(parsed.analysis.synonyms || []),
        JSON.stringify(parsed.analysis.antonyms || []),
        JSON.stringify(parsed.analysis.collocations || []),
        JSON.stringify(parsed.analysis.examples || [])
      );
    } catch (saveErr) {
      logger.warn('Failed to save enriched word to SQLite', { saveErr });
    }

    const finalResult: AnalyzeResponseDTO = {
      analysis: parsed.analysis,
      quiz: parsed.quiz,
      source: 'ai_engine',
      sources: {
        definition: 'ai',
        synonyms: 'ai',
        antonyms: 'ai',
        collocations: 'ai',
        examples: 'ai',
        translation: 'ai',
        quiz: 'ai'
      }
    };

    setCached(cleanWord, params.targetLanguage, finalResult);
    return finalResult;
  } catch (err: any) {
    logger.warn('AI failed, fallback to mock', { err: err?.message });
    const mock = mockAnalyze(params.word, params.targetLanguage);
    setCached(params.word, params.targetLanguage, mock);
    return mock;
  }
}