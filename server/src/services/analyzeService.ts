import { z } from 'zod';

import type {
  AnalyzeResponseDTO,
  TargetLanguageDTO
} from '../types/dto.js';

import {
  groqChatJSON,
  hasGroqKey
} from './groqClient.js';

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
  translation_ru: string | null;
  translation_es: string | null;

  synonyms: string | null;
  antonyms: string | null;
  collocations: string | null;
  examples: string | null;

  usage: string | null;
  common_mistakes: string | null;
}

function safeJsonArray(
  raw: string | null | undefined
): string[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed.map(String)
      : [];
  } catch {
    return [];
  }
}

function isOldWebsterGarbage(
  text: string | null | undefined
): boolean {
  if (!text) return true;

  if (text.length > 250) return true;

  if (/^\s*\*1.*?\s+/i.test(text)) {
    return true;
  }

  if (
    text.includes('[Obs.]') ||
    text.includes('Thackeray') ||
    text.includes('Shak.')
  ) {
    return true;
  }

  return false;
}

function safeJsonString(
  value: unknown
): string {
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }

  return JSON.stringify([]);
}

export async function analyzeWordService(
  params: {
    word: string;
    targetLanguage: TargetLanguageDTO;
  }
): Promise<AnalyzeResponseDTO> {

  const cleanWord = params.word
    .trim()
    .toLowerCase();

  /*
   * ============================================================
   * 1. SEARCH TURSO / DATABASE FIRST
   * ============================================================
   */

  let row: WordDbRow | undefined;

  try {
    const res = await db.execute({
      sql: `
        SELECT *
        FROM words
        WHERE LOWER(term) = ?
        LIMIT 1
      `,
      args: [cleanWord]
    });

    if (res.rows.length > 0) {
      row = res.rows[0] as unknown as WordDbRow;

      logger.info(
        `[DB FOUND] "${cleanWord}" exists in database.`
      );
    } else {
      logger.info(
        `[DB MISS] "${cleanWord}" not found.`
      );
    }

  } catch (err) {
    logger.warn(
      `[DB READ ERROR] Failed to read "${cleanWord}"`,
      {
        error:
          err instanceof Error
            ? err.message
            : String(err)
      }
    );
  }

  const dbSyns = safeJsonArray(row?.synonyms);
  const dbAnts = safeJsonArray(row?.antonyms);
  const dbColls = safeJsonArray(row?.collocations);
  const dbExamp = safeJsonArray(row?.examples);

  const dbCommonMistakes =
    safeJsonArray(row?.common_mistakes);

  const isFullyModernCached =
    Boolean(
      row &&
      row.definition_en &&
      !isOldWebsterGarbage(
        row.definition_en
      ) &&
      row.translation_uz &&
      row.translation_uz.trim().length > 0 &&
      row.translation_uz !==
        'Tarjima mavjud emas' &&
      dbSyns.length > 0 &&
      dbExamp.length >= 2
    );

  /*
   * ============================================================
   * 2. FULL DATABASE HIT
   * ============================================================
   */

  if (
    row &&
    isFullyModernCached
  ) {
    logger.info(
      `[DB FULL HIT] Serving "${cleanWord}" directly from database.`
    );

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

        targetLanguage:
          params.targetLanguage,

        definition:
          row.definition_en!,

        translation:
          row.translation_uz!,

        cefrLevel:
          (row.cefr_level as any) ||
          'B1',

        partOfSpeech:
          row.part_of_speech ||
          'noun',

        synonyms: dbSyns,

        antonyms: dbAnts,

        collocations: dbColls,

        examples: dbExamp,

        usage:
          row.usage ||
          'Regularly used in everyday modern English.',

        commonMistakes:
          dbCommonMistakes,

        pronunciation: {
          ipa: row.ipa || ''
        }
      },

      quiz: {
        title: 'Word Mastery Quiz',

        questions: [
          {
            id: 'q1',

            type: 'multiple_choice',

            prompt:
              `What is the meaning of "${cleanWord}"?`,

            options: [
              row.definition_en!.slice(
                0,
                50
              ),
              'To construct quickly',
              'A type of vehicle',
              'A formal meeting'
            ],

            correctOptionIndex: 0,

            explanation:
              row.definition_en!
          },

          {
            id: 'q2',

            type: 'fill_blank',

            prompt:
              `Pay attention to the term "_____" in this context.`,

            correctText:
              cleanWord,

            explanation:
              `"${cleanWord}" fits correctly here.`
          },

          {
            id: 'q3',

            type: 'select_synonym',

            prompt:
              `Select a synonym for "${cleanWord}":`,

            options: [
              dbSyns[0] || 'term',
              'accelerate',
              'expand',
              'neglect'
            ],

            correctOptionIndex: 0,

            explanation:
              `"${dbSyns[0] || 'term'}" is closely related to "${cleanWord}".`
          }
        ]
      }
    };
  }

  /*
   * ============================================================
   * 3. DATABASE MISS / OLD DATA → AI
   * ============================================================
   */

  if (!hasGroqKey()) {
    logger.warn(
      `[AI SKIPPED] No AI provider available for "${cleanWord}".`
    );

    return mockAnalyze(
      params.word,
      params.targetLanguage
    );
  }

  logger.info(
    `[AI GENERATION] Generating fresh data for "${cleanWord}".`
  );

  const system = `
You are a modern English language tutor.

Return ONLY clean, valid JSON.

No markdown.
No commentary.

Definitions must be concise, modern, and easy to learn.
Translation must be accurate in the requested target language.

Generate useful practical information.

The response MUST contain:
- definition
- translation
- cefrLevel
- partOfSpeech
- synonyms
- antonyms
- collocations
- examples
- usage
- commonMistakes
- pronunciation
- quiz
`.trim();

  const user = JSON.stringify({
    task: 'Analyze vocabulary word',

    word: cleanWord,

    targetLanguage:
      params.targetLanguage,

    schema: {
      definition:
        'Short concise modern definition (max 180 chars)',

      translation:
        'Direct accurate translation in target language',

      cefrLevel:
        'A1|A2|B1|B2|C1|C2',

      partOfSpeech:
        'noun|verb|adjective|adverb',

      synonyms: [
        'synonym1',
        'synonym2',
        'synonym3'
      ],

      antonyms: [
        'antonym1',
        'antonym2'
      ],

      collocations: [
        'collocation 1',
        'collocation 2'
      ],

      examples: [
        'Clear natural example 1.',
        'Clear natural example 2.'
      ],

      usage:
        'Explain how this word is naturally used in English.',

      commonMistakes: [
        'Common mistake to avoid.'
      ],

      pronunciation: {
        ipa: '/.../'
      },

      quiz: [
        {
          id: 'q1',

          type: 'multiple_choice',

          prompt:
            'What does this word mean?',

          options: [
            'Correct definition',
            'Wrong option 1',
            'Wrong option 2',
            'Wrong option 3'
          ],

          correctOptionIndex: 0,

          explanation:
            'Brief explanation'
        },

        {
          id: 'q2',

          type: 'fill_blank',

          prompt:
            'Sentence using _____ properly',

          correctText:
            cleanWord,

          explanation:
            'Brief explanation'
        },

        {
          id: 'q3',

          type: 'select_synonym',

          prompt:
            'Which word has a similar meaning?',

          options: [
            'Correct synonym',
            'Wrong option 1',
            'Wrong option 2',
            'Wrong option 3'
          ],

          correctOptionIndex: 0,

          explanation:
            'Brief explanation'
        }
      ]
    }
  });

  try {

    /*
     * ==========================================================
     * AI CALL
     * ==========================================================
     */

    const aiData =
      await groqChatJSON({
        system,
        user,
        temperature: 0.2
      });

    const modernDef =
      aiData.definition ||
      'A recognized term in the English language.';

    const modernTrans =
      aiData.translation ||
      'Tarjima mavjud emas';

    const modernSyns =
      Array.isArray(aiData.synonyms)
        ? aiData.synonyms.map(String)
        : [];

    const modernAnts =
      Array.isArray(aiData.antonyms)
        ? aiData.antonyms.map(String)
        : [];

    const modernColls =
      Array.isArray(aiData.collocations)
        ? aiData.collocations.map(String)
        : [];

    const modernExamp =
      Array.isArray(aiData.examples) &&
      aiData.examples.length >= 2
        ? aiData.examples.map(String)
        : [
            `He used the word "${cleanWord}" correctly.`,
            `Can you explain what "${cleanWord}" means?`
          ];

    const modernCommonMistakes =
      Array.isArray(aiData.commonMistakes)
        ? aiData.commonMistakes.map(String)
        : [];

    const modernUsage =
      typeof aiData.usage === 'string'
        ? aiData.usage
        : 'Commonly used in everyday English.';

    /*
     * ==========================================================
     * 4. SAVE EVERYTHING TO DATABASE
     * ==========================================================
     */

    try {

      await db.execute({
        sql: `
          INSERT INTO words (
            term,
            ipa,
            part_of_speech,
            cefr_level,
            definition_en,

            translation_uz,
            translation_ru,
            translation_es,

            synonyms,
            antonyms,
            collocations,
            examples,

            usage,
            common_mistakes
          )

          VALUES (
            ?,
            ?,
            ?,
            ?,
            ?,

            ?,
            ?,
            ?,

            ?,
            ?,
            ?,
            ?,

            ?,
            ?
          )

          ON CONFLICT(term)
          DO UPDATE SET

            ipa =
              excluded.ipa,

            part_of_speech =
              excluded.part_of_speech,

            cefr_level =
              excluded.cefr_level,

            definition_en =
              excluded.definition_en,

            translation_uz =
              CASE
                WHEN excluded.translation_uz IS NOT NULL
                AND excluded.translation_uz != ''
                THEN excluded.translation_uz
                ELSE words.translation_uz
              END,

            synonyms =
              excluded.synonyms,

            antonyms =
              excluded.antonyms,

            collocations =
              excluded.collocations,

            examples =
              excluded.examples,

            usage =
              excluded.usage,

            common_mistakes =
              excluded.common_mistakes
        `,

        args: [

          cleanWord,

          aiData.pronunciation?.ipa ||
            '',

          aiData.partOfSpeech ||
            'noun',

          aiData.cefrLevel ||
            'B1',

          modernDef,

          params.targetLanguage.code === 'uz'
            ? modernTrans
            : null,

          params.targetLanguage.code === 'ru'
            ? modernTrans
            : null,

          params.targetLanguage.code === 'es'
            ? modernTrans
            : null,

          safeJsonString(
            modernSyns
          ),

          safeJsonString(
            modernAnts
          ),

          safeJsonString(
            modernColls
          ),

          safeJsonString(
            modernExamp
          ),

          modernUsage,

          safeJsonString(
            modernCommonMistakes
          )
        ]
      });

      logger.info(
        `[DB SAVED SUCCESSFULLY] "${cleanWord}" was written to database.`
      );

    } catch (saveErr) {

      logger.error(
        `[DB SAVE FAILED] Could not save "${cleanWord}"`,
        {
          error:
            saveErr instanceof Error
              ? saveErr.message
              : String(saveErr)
        }
      );
    }

    /*
     * ==========================================================
     * 5. RETURN AI RESULT TO USER
     * ==========================================================
     */

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

        targetLanguage:
          params.targetLanguage,

        definition:
          modernDef,

        translation:
          modernTrans,

        cefrLevel:
          (aiData.cefrLevel ||
            'B1') as any,

        partOfSpeech:
          aiData.partOfSpeech ||
          'noun',

        synonyms:
          modernSyns,

        antonyms:
          modernAnts,

        collocations:
          modernColls,

        examples:
          modernExamp,

        usage:
          modernUsage,

        commonMistakes:
          modernCommonMistakes,

        pronunciation: {
          ipa:
            aiData.pronunciation?.ipa ||
            ''
        }
      },

      quiz: {
        title:
          'Word Mastery Quiz',

        questions:
          aiData.quiz || []
      }
    };

    return result;

  } catch (err) {

    logger.warn(
      `[AI FAILED] Falling back to mock for "${cleanWord}"`,
      {
        error:
          err instanceof Error
            ? err.message
            : String(err)
      }
    );

    return mockAnalyze(
      params.word,
      params.targetLanguage
    );
  }
}