import { z } from 'zod';
import type { AnalyzeResponseDTO, TargetLanguageDTO } from '../types/dto.js';
import { groqChatJSON, hasGroqKey } from './groqClient.js';
import { mockAnalyze } from './mockService.js';
import { logger } from '../utils/logger.js';
import { db } from '../db/database.js';

const responseSchema = z.object({
  source: z.enum(['local_database', 'ai_engine']).optional(),
  sources: z.object({
    definition: z.enum(['db', 'ai']).optional(),
    translation: z.enum(['db', 'ai']).optional(),
    synonyms: z.enum(['db', 'ai']).optional(),
    antonyms: z.enum(['db', 'ai']).optional(),
    collocations: z.enum(['db', 'ai']).optional(),
    examples: z.enum(['db', 'ai']).optional(),
    quiz: z.enum(['db', 'ai']).optional()
  }).optional(),
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
const cache = new Map<CacheKey, any>();
const CACHE_TTL_MS = 10 * 60 * 1000;

function cacheKey(word: string, lang: TargetLanguageDTO): string {
  return `${word.toLowerCase()}::${lang.code}`;
}

function getCached(word: string, lang: TargetLanguageDTO): any | null {
  const key = cacheKey(word, lang);
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.value;
}

function setCached(word: string, lang: TargetLanguageDTO, value: any) {
  cache.set(cacheKey(word, lang), { at: Date.now(), value });
}

export async function analyzeWordService(params: {
  word: string;
  targetLanguage: TargetLanguageDTO;
}): Promise<any> {
  const cleanWord = params.word.trim().toLowerCase();

  // 1. Kesh tekshiruvi
  const cached = getCached(cleanWord, params.targetLanguage);
  if (cached) return cached;

  // 2. Bazadan qidirish
  let row: any = null;
  try {
    row = db.prepare('SELECT * FROM words WHERE term = ?').get(cleanWord);
  } catch (err) {
    logger.warn('DB query error', { err });
  }

  // Agar so'z oldin AI tomonidan chiroyli qilib keshlab qo'yilgan bo'lsa (o'zbekchasi bor bo'lsa)
  if (row && row.translation_uz && row.translation_uz.length < 150) {
    logger.info(`[DB FULL HIT] Returning clean cached word: ${cleanWord}`);
    const result = {
      source: 'local_database',
      sources: {
        definition: 'db',
        synonyms: 'db',
        antonyms: 'db',
        collocations: 'db',
        examples: 'db',
        translation: 'db',
        quiz: 'db'
      },
      analysis: {
        word: cleanWord,
        targetLanguage: params.targetLanguage,
        definition: row.definition_en,
        translation: row.translation_uz,
        cefrLevel: (row.cefr_level as any) || 'B2',
        partOfSpeech: row.part_of_speech || 'verb',
        synonyms: JSON.parse(row.synonyms || '[]'),
        antonyms: JSON.parse(row.antonyms || '[]'),
        collocations: JSON.parse(row.collocations || '[]'),
        examples: JSON.parse(row.examples || '[]'),
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
            prompt: `What is the closest meaning of "${cleanWord}"?`,
            options: [row.definition_en.slice(0, 40), 'To make something stronger', 'To build quickly', 'To celebrate'],
            correctOptionIndex: 0,
            explanation: `"${cleanWord}" means: ${row.definition_en.slice(0, 60)}`
          },
          {
            id: 'q2',
            type: 'fill_blank',
            prompt: `She decided to _____ her old habits and start fresh.`,
            correctText: cleanWord,
            explanation: `"${cleanWord}" correctly fits this context.`
          },
          {
            id: 'q3',
            type: 'select_synonym',
            prompt: `Which word is a synonym for "${cleanWord}"?`,
            options: JSON.parse(row.synonyms || '["give up", "leave"]')[0] ? [JSON.parse(row.synonyms)[0], 'create', 'increase', 'admire'] : ['leave', 'hold', 'continue', 'catch'],
            correctOptionIndex: 0,
            explanation: 'Correct synonym.'
          }
        ]
      }
    };
    setCached(cleanWord, params.targetLanguage, result);
    return result;
  }

  // 3. Agar bazada yo'q bo'lsa yoki Webster'ning xom eskirgan matni bo'lsa:
  // AI ga toza, zamonaviy tahlil va aniq o'zbekcha tarjima qildirib, bazaga yozamiz
  if (!hasGroqKey()) {
    const mock = mockAnalyze(params.word, params.targetLanguage);
    setCached(params.word, params.targetLanguage, mock);
    return mock;
  }

  logger.info(`[AI ENRICHING] Generating clean modern data for "${cleanWord}"`);

  const system = `
You are an expert English language tutor. 
Return ONLY clean, valid JSON. No markdown ticks, no extra text.
Definition must be modern, concise, learner-friendly (1-2 sentences).
Translation must be accurate and short in the target language.
Pronunciation must ALWAYS be an object: "pronunciation": { "ipa": "/.../" }.
Quiz must have 3-4 questions.
`.trim();

  const user = JSON.stringify({
    task: 'Analyze word',
    word: cleanWord,
    targetLanguage: params.targetLanguage,
    outputShape: {
      analysis: {
        word: cleanWord,
        targetLanguage: params.targetLanguage,
        definition: 'Short concise definition',
        translation: 'Accurate target language translation (e.g. Tashlab ketmoq, tark etmoq for abandon in Uzbek)',
        cefrLevel: 'A1|A2|B1|B2|C1|C2',
        partOfSpeech: 'verb|noun|adjective|etc',
        synonyms: ['3-5 synonyms'],
        antonyms: ['2-4 antonyms'],
        collocations: ['3-5 common collocations'],
        examples: ['2-3 natural short example sentences'],
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

    // AI toza ma'lumot berdi, endi buni bazaga UPDATE / INSERT qilamiz
    // Shunda keyingi safar bu so'z 0 millisekundda toza DB bo'lib chiqadi!
    try {
      db.prepare(`
        INSERT INTO words (term, ipa, part_of_speech, cefr_level, definition_en, translation_uz, synonyms, antonyms, collocations, examples)
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
        params.targetLanguage.code === 'uz' ? parsed.analysis.translation : '',
        JSON.stringify(parsed.analysis.synonyms),
        JSON.stringify(parsed.analysis.antonyms),
        JSON.stringify(parsed.analysis.collocations),
        JSON.stringify(parsed.analysis.examples)
      );
    } catch (saveErr) {
      logger.warn('Failed to update clean word in db', { saveErr });
    }

    const finalResult = {
      source: row ? 'local_database' : 'ai_engine',
      sources: {
        definition: row ? 'db' : 'ai',
        synonyms: row ? 'db' : 'ai',
        antonyms: row ? 'db' : 'ai',
        collocations: row ? 'db' : 'ai',
        examples: row ? 'db' : 'ai',
        translation: 'ai',
        quiz: 'ai'
      },
      ...parsed
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