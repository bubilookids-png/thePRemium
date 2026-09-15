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

export async function analyzeWordService(params: {
  word: string;
  targetLanguage: TargetLanguageDTO;
}): Promise<AnalyzeResponseDTO> {
  const cleanWord = params.word.trim().toLowerCase();

  // 1. Bazadan qidirish
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

  // Bazada nimalar borligini tekshiramiz
  const hasDef = Boolean(row?.definition_en && row.definition_en.trim().length > 10);
  const hasTrans = Boolean(row?.translation_uz && row.translation_uz.trim().length > 0 && row.translation_uz !== 'Tarjima mavjud emas');
  const hasSyns = dbSyns.length > 0;
  const hasExamp = dbExamp.length >= 2;

  // Agar HAMMA narsa bazada to'liq bo'lsa -> 100% DB qaytaradi
  if (row && hasDef && hasTrans && hasSyns && hasExamp) {
    logger.info(`[DB FULL HIT] Word fully available in DB: ${cleanWord}`);
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
        usage: 'Regularly used in spoken and written English.',
        commonMistakes: [],
        pronunciation: { ipa: row.ipa || '' }
      },
      quiz: {
        title: 'Word Check Quiz',
        questions: [
          {
            id: 'q1',
            type: 'multiple_choice',
            prompt: `What is the meaning of "${cleanWord}"?`,
            options: [row.definition_en!.slice(0, 50), 'To move rapidly', 'To build something', 'To create quietly'],
            correctOptionIndex: 0,
            explanation: row.definition_en!
          },
          {
            id: 'q2',
            type: 'fill_blank',
            prompt: `Remember the word "_____" in everyday speech.`,
            correctText: cleanWord,
            explanation: `"${cleanWord}" completes the sentence.`
          },
          {
            id: 'q3',
            type: 'select_synonym',
            prompt: `Synonym for "${cleanWord}":`,
            options: [dbSyns[0] || 'term', 'construct', 'fly', 'run'],
            correctOptionIndex: 0,
            explanation: 'Correct synonym.'
          }
        ]
      }
    };
  }

  // 2. Agar bitta bo'lsa ham detali kam bo'lsa -> AI ga murojaat qilib to'ldiramiz
  if (!hasGroqKey()) {
    return mockAnalyze(params.word, params.targetLanguage);
  }

  logger.info(`[HYBRID / AI ENRICH] Completing missing details for "${cleanWord}"`);

  const system = `You are an English teacher. Return clean JSON only. No markdown ticks.`;
  const user = JSON.stringify({
    word: cleanWord,
    targetLanguage: params.targetLanguage,
    needed: {
      definition: !hasDef,
      translation: !hasTrans,
      synonyms: !hasSyns,
      examples: !hasExamp
    },
    schema: {
      definition: 'Concise modern learner-friendly definition',
      translation: 'Target language translation (e.g., Uzbek: divan for sofa)',
      cefrLevel: 'A1|A2|B1|B2|C1|C2',
      partOfSpeech: 'verb|noun|adjective|adverb',
      synonyms: ['word1', 'word2'],
      antonyms: ['word1'],
      collocations: ['phrase 1', 'phrase 2'],
      examples: ['Example sentence 1.', 'Example sentence 2.'],
      usage: 'Brief usage tip',
      commonMistakes: ['Mistake to avoid'],
      pronunciation: { ipa: '/.../' },
      quiz: [
        {
          id: 'q1',
          type: 'multiple_choice',
          prompt: 'Question',
          options: ['Correct', 'Wrong 1', 'Wrong 2', 'Wrong 3'],
          correctOptionIndex: 0,
          explanation: 'Why'
        },
        {
          id: 'q2',
          type: 'fill_blank',
          prompt: 'Sentence with _____',
          correctText: cleanWord,
          explanation: 'Why'
        },
        {
          id: 'q3',
          type: 'select_synonym',
          prompt: 'Synonym question',
          options: ['Synonym', 'Wrong 1', 'Wrong 2', 'Wrong 3'],
          correctOptionIndex: 0,
          explanation: 'Why'
        }
      ]
    }
  });

  try {
    const aiData = await groqChatJSON({ system, user, temperature: 0.2 });

    // AI va DB ni gibrid qilib birlashtiramiz:
    const finalDef = hasDef ? row!.definition_en! : aiData.definition;
    const finalTrans = hasTrans ? row!.translation_uz! : aiData.translation;
    const finalSyns = hasSyns ? dbSyns : (aiData.synonyms || []);
    const finalAnts = dbAnts.length ? dbAnts : (aiData.antonyms || []);
    const finalColls = dbColls.length ? dbColls : (aiData.collocations || []);
    const finalExamp = hasExamp ? dbExamp : (aiData.examples || []);

    // Yetishmayotgan hamma narsani bazaga saqlab qo'yamiz (keyingi safar to'liq DB bo'lishi uchun)
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
        row?.ipa || aiData.pronunciation?.ipa || '',
        row?.part_of_speech || aiData.partOfSpeech || 'noun',
        row?.cefr_level || aiData.cefrLevel || 'B1',
        finalDef,
        finalTrans,
        JSON.stringify(finalSyns),
        JSON.stringify(finalAnts),
        JSON.stringify(finalColls),
        JSON.stringify(finalExamp)
      );
    } catch (dbErr) {
      logger.warn('Error saving enriched details to SQLite', { dbErr });
    }

    // Har bitta qismning kelib chiqishini aniq belgilaymiz:
    const result: AnalyzeResponseDTO = {
      source: (hasDef && hasTrans) ? 'local_database' : 'ai_engine',
      sources: {
        definition: hasDef ? 'db' : 'ai',
        translation: hasTrans ? 'db' : 'ai',
        synonyms: hasSyns ? 'db' : 'ai',
        antonyms: dbAnts.length ? 'db' : 'ai',
        collocations: dbColls.length ? 'db' : 'ai',
        examples: hasExamp ? 'db' : 'ai',
        quiz: 'ai'
      },
      analysis: {
        word: cleanWord,
        targetLanguage: params.targetLanguage,
        definition: finalDef,
        translation: finalTrans,
        cefrLevel: (row?.cefr_level || aiData.cefrLevel || 'B1') as any,
        partOfSpeech: row?.part_of_speech || aiData.partOfSpeech || 'noun',
        synonyms: finalSyns,
        antonyms: finalAnts,
        collocations: finalColls,
        examples: finalExamp,
        usage: aiData.usage || 'Commonly used in daily vocabulary.',
        commonMistakes: aiData.commonMistakes || [],
        pronunciation: { ipa: row?.ipa || aiData.pronunciation?.ipa || '' }
      },
      quiz: {
        title: 'Vocabulary Quiz',
        questions: aiData.quiz || []
      }
    };

    return result;
  } catch (err) {
    logger.warn('AI failed, fallback to mock', { err });
    return mockAnalyze(params.word, params.targetLanguage);
  }
}