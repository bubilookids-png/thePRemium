// server/src/services/vocabService.ts
import { db } from '../db/database.js';
import { generateQuizWithAI, generateFullAnalysisWithAI } from './groqClient.js';

export async function analyzeWordHybrid(term: string, langCode: string) {
  const cleanTerm = term.trim().toLowerCase();

  // 1. Bazadan tezkor qidiruv
  const queryResult = await db.execute({
    sql: 'SELECT * FROM words WHERE term = ? LIMIT 1',
    args: [cleanTerm]
  });

  const row: any = queryResult.rows[0];

  if (row) {
    // Bazadan topildi!
    const quickQuiz = await generateQuizWithAI(String(row.term), String(row.definition_en));

    return {
      source: 'local_database',
      analysis: {
        term: row.term,
        ipa: row.ipa,
        partOfSpeech: row.part_of_speech,
        cefr: row.cefr_level,
        definition: row.definition_en,
        translation: row[`translation_${langCode}`] || row.definition_en,
        synonyms: typeof row.synonyms === 'string' ? JSON.parse(row.synonyms || '[]') : (row.synonyms || []),
        antonyms: typeof row.antonyms === 'string' ? JSON.parse(row.antonyms || '[]') : (row.antonyms || []),
        collocations: typeof row.collocations === 'string' ? JSON.parse(row.collocations || '[]') : (row.collocations || []),
        examples: typeof row.examples === 'string' ? JSON.parse(row.examples || '[]') : (row.examples || []),
        usage: row.how_its_used || 'Regularly used in everyday modern English.',
        commonMistakes: typeof row.common_mistakes === 'string' ? JSON.parse(row.common_mistakes || '[]') : [],
      },
      quiz: quickQuiz,
    };
  }

  // 2. Agar bazada bo'lmasa - AI orqali tahlil
  const aiResult = await generateFullAnalysisWithAI(cleanTerm, langCode);

  // 3. Yangi so'zni Turso bazasiga avtomatik kesh qilish (how_its_used va common_mistakes bilan birga)
  try {
    await db.execute({
      sql: `
        INSERT OR IGNORE INTO words (
          term, ipa, part_of_speech, cefr_level, definition_en,
          translation_uz, synonyms, antonyms, collocations, examples,
          how_its_used, common_mistakes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        cleanTerm,
        aiResult.analysis.ipa || null,
        aiResult.analysis.partOfSpeech || 'general',
        aiResult.analysis.cefr || 'B1',
        aiResult.analysis.definition || '',
        aiResult.analysis.translation || '',
        JSON.stringify(aiResult.analysis.synonyms || []),
        JSON.stringify(aiResult.analysis.antonyms || []),
        JSON.stringify(aiResult.analysis.collocations || []),
        JSON.stringify(aiResult.analysis.examples || []),
        aiResult.analysis.usage || '',
        JSON.stringify(aiResult.analysis.commonMistakes || [])
      ]
    });
  } catch (err) {
    console.error('Turso bazasiga kesh saqlashda xatolik:', err);
  }

  return {
    source: 'ai_engine',
    ...aiResult,
  };
}