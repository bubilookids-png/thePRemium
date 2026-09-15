import { z } from 'zod';
import type { AnalyzeResponseDTO, TargetLanguageDTO } from '../types/dto.js';
import { groqChatJSON, hasGroqKey } from './groqClient.js';
import { mockAnalyze } from './mockService.js';
import { logger } from '../utils/logger.js';
import { db } from '../db/database.js';

interface WordDbRow {
  id: number;
  term: string;
  ipa: string | null;
  part_of_speech: string | null;
  cefr_level: string | null;
  definition_en: string | null;
  translation_uz: string | null;
  synonyms: string | null;
  antonyms: string | null;
  collocations: string | null;
  examples: string | null;
}

function safeJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

// Websterning eski 1913-yilgi xom matnlarini tekshirish filtri
function isOldWebsterGarbage(text: string | null | undefined): boolean {
  if (!text) return true;
  if (text.length > 250) return true; // Webster ta'riflari juda uzun doston bo'ladi
  if (/^\s*1\.\s+/i.test(text)) return true; // "1. A piece of..."
  if (text.includes('[Obs.]') || text.includes('Thackeray') || text.includes('Shak.')) return true;
  return false;
}

export async function analyzeWordService(params: {
  word: string;
  targetLanguage: TargetLanguageDTO;
}): Promise<AnalyzeResponseDTO> {
  const cleanWord = params.word.trim().toLowerCase();

  // 1. Bazadan qidiramiz
  let row: WordDbRow | undefined;
  try {
    row = db.prepare('SELECT * FROM words WHERE LOWER(term) = ?').get(cleanWord) as WordDbRow | undefined;
  } catch (err) {
    logger.warn('DB query error', { err });
  }

  const dbSyns = safeJsonArray(row?.synonyms);
  const dbAnts = safeJsonArray(row?.antonyms);
  const dbColls = safeJsonArray(row?.collocations);
  const dbExamp = safeJsonArray(row?.examples);

  // Bazadagi ma'lumot zamonaviy va to'liq ekanligini aniqlash:
  // - Ta'rif Websterning eski axlati bo'lmasligi kerak
  // - Tarjima bo'lishi shart
  // - Kamida bitta sinonim va 2 ta misol bo'lishi kerak
  const isFullyModernCached = Boolean(
    row &&
    row.definition_en &&
    !isOldWebsterGarbage(row.definition_en) &&
    row.translation_uz &&
    row.translation_uz.trim().length > 0 &&
    row.translation_uz !== 'Tarjima mavjud emas' &&
    dbSyns.length > 0 &&
    dbExamp.length >= 2
  );

  // AGAR BAZADA TAYYOR VA TOZA BO'LSA -> 100% DB QAYTARADI (0 ms)
  if (row && isFullyModernCached) {
    logger.info(`[DB FULL HIT] Word served completely from DB: ${cleanWord}`);
    return {
      source: 'local_database',
      sources: {
        definition: 'db',
        translation: 'db',
        synonyms: 'db',
        antonyms: 'db',
        collocations: 'db',
        examples: 'db',
        quiz: 'db'
      },
      analysis: {
        word: cleanWord,
        targetLanguage: params.targetLanguage,
        definition: row.definition_en!,
        translation: row.translation_uz!,
        cefrLevel: (row.cefr_level as any) || 'B1',
        partOfSpeech: row.part_of_speech || 'noun',
        synonyms: dbSyns,
        antonyms: dbAnts,
        collocations: dbColls,
        examples: dbExamp,
        usage: 'Regularly used in everyday modern English.',
        commonMistakes: [],
        pronunciation: { ipa: row.ipa || '' }
      },
      quiz: {
        title: 'Word Mastery Quiz',
        questions: [
          {
            id: 'q1',
            type: 'multiple_choice',
            prompt: `What is the meaning of "${cleanWord}"?`,
            options: [row.definition_en!.slice(0, 50), 'To construct quickly', 'A type of vehicle', 'A formal meeting'],
            correctOptionIndex: 0,
            explanation: row.definition_en!
          },
          {
            id: 'q2',
            type: 'fill_blank',
            prompt: `Pay attention to the term "_____" in this context.`,
            correctText: cleanWord,
            explanation: `"${cleanWord}" fits correctly here.`
          },
          {
            id: 'q3',
            type: 'select_synonym',
            prompt: `Select a synonym for "${cleanWord}":`,
            options: [dbSyns[0] || 'term', 'accelerate', 'expand', 'neglect'],
            correctOptionIndex: 0,
            explanation: `"${dbSyns[0]}" is closely related to "${cleanWord}".`
          }
        ]
      }
    };
  }

  // 2. AGAR YANGI SO'Z BO'LSA YOKI ESKI WEBSTER BO'LSA -> AI TO'LIQ GENERATSIYA QILADI
  if (!hasGroqKey()) {
    return mockAnalyze(params.word, params.targetLanguage);
  }

  logger.info(`[AI FULL GENERATION] Generating fresh modern study card for "${cleanWord}"`);

  const system = `
You are a modern English language tutor. 
Return ONLY clean, valid JSON matching the requested structure. 
No markdown ticks, no surrounding commentary.
Definitions must be concise, modern, and easy to learn (1-2 clear sentences, MAX 180 characters).
Translation must be accurate in the target language (e.g. Uzbek).
`.trim();

  const user = JSON.stringify({
    task: 'Analyze vocabulary word',
    word: cleanWord,
    targetLanguage: params.targetLanguage,
    schema: {
      definition: 'Short concise modern definition (max 180 chars)',
      translation: 'Direct accurate translation in target language',
      cefrLevel: 'A1|A2|B1|B2|C1|C2',
      partOfSpeech: 'noun|verb|adjective|adverb',
      synonyms: ['synonym1', 'synonym2', 'synonym3'],
      antonyms: ['antonym1', 'antonym2'],
      collocations: ['collocation 1', 'collocation 2'],
      examples: ['Clear natural example 1.', 'Clear natural example 2.'],
      usage: 'Practical usage guidance',
      commonMistakes: ['Common mistake to avoid'],
      pronunciation: { ipa: '/.../' },
      quiz: [
        {
          id: 'q1',
          type: 'multiple_choice',
          prompt: 'What does this word mean?',
          options: ['Correct definition snippet', 'Wrong option 1', 'Wrong option 2', 'Wrong option 3'],
          correctOptionIndex: 0,
          explanation: 'Brief explanation'
        },
        {
          id: 'q2',
          type: 'fill_blank',
          prompt: 'Sentence using _____ properly',
          correctText: cleanWord,
          explanation: 'Brief explanation'
        },
        {
          id: 'q3',
          type: 'select_synonym',
          prompt: 'Which word has a similar meaning?',
          options: ['Correct synonym', 'Wrong option 1', 'Wrong option 2', 'Wrong option 3'],
          correctOptionIndex: 0,
          explanation: 'Brief explanation'
        }
      ]
    }
  });

  try {
    const aiData = await groqChatJSON({ system, user, temperature: 0.2 });

    const modernDef = aiData.definition || 'A recognized term in the English language.';
    const modernTrans = aiData.translation || 'Tarjima kiritilmoqda';
    const modernSyns = Array.isArray(aiData.synonyms) ? aiData.synonyms : [];
    const modernAnts = Array.isArray(aiData.antonyms) ? aiData.antonyms : [];
    const modernColls = Array.isArray(aiData.collocations) ? aiData.collocations : [];
    const modernExamp = Array.isArray(aiData.examples) && aiData.examples.length >= 2 
      ? aiData.examples 
      : [`He used the word "${cleanWord}" correctly.`, `Can you explain what "${cleanWord}" means?`];

    // AI yaratgan toza ma'lumotni bazaga saqlaymiz (eski Webster axlatini ham yangisiga almashtiramiz)
    try {
      db.prepare(`
        INSERT INTO words (
          term, ipa, part_of_speech, cefr_level, definition_en,
          translation_uz, synonyms, antonyms, collocations, examples
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        aiData.pronunciation?.ipa || '',
        aiData.partOfSpeech || 'noun',
        aiData.cefrLevel || 'B1',
        modernDef,
        modernTrans,
        JSON.stringify(modernSyns),
        JSON.stringify(modernAnts),
        JSON.stringify(modernColls),
        JSON.stringify(modernExamp)
      );
      logger.info(`[DB SAVED] Successfully cached modern data for "${cleanWord}"`);
    } catch (saveErr) {
      logger.warn('Error caching word to SQLite', { saveErr });
    }

    // Birinchi marta foydalanuvchiga taqdim etish (AI nishoni bilan)
    const result: AnalyzeResponseDTO = {
      source: 'ai_engine',
      sources: {
        definition: 'ai',
        translation: 'ai',
        synonyms: 'ai',
        antonyms: 'ai',
        collocations: 'ai',
        examples: 'ai',
        quiz: 'ai'
      },
      analysis: {
        word: cleanWord,
        targetLanguage: params.targetLanguage,
        definition: modernDef,
        translation: modernTrans,
        cefrLevel: (aiData.cefrLevel || 'B1') as any,
        partOfSpeech: aiData.partOfSpeech || 'noun',
        synonyms: modernSyns,
        antonyms: modernAnts,
        collocations: modernColls,
        examples: modernExamp,
        usage: aiData.usage || 'Commonly used in everyday vocabulary.',
        commonMistakes: aiData.commonMistakes || [],
        pronunciation: { ipa: aiData.pronunciation?.ipa || '' }
      },
      quiz: {
        title: 'Word Mastery Quiz',
        questions: aiData.quiz || []
      }
    };

    return result;
  } catch (err) {
    logger.warn('AI failed, fallback to mock', { err });
    return mockAnalyze(params.word, params.targetLanguage);
  }
}