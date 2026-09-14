// server/src/services/vocabService.ts
import { db } from '../db/database';
import { generateQuizWithAI, generateFullAnalysisWithAI } from './groqClient';

export async function analyzeWordHybrid(term: string, langCode: string) {
  const cleanTerm = term.trim().toLowerCase();

  // 1. Avval 300 000 talik bazamizdan tezkor tekshiramiz
  const row: any = db.prepare('SELECT * FROM words WHERE term = ?').get(cleanTerm);

  if (row) {
    // Bazadan topildi!
    const quickQuiz = await generateQuizWithAI(row.term, row.definition_en);

    return {
      source: 'local_database',
      analysis: {
        term: row.term,
        ipa: row.ipa,
        partOfSpeech: row.part_of_speech,
        cefr: row.cefr_level,
        definition: row.definition_en,
        translation: row[`translation_${langCode}`] || row.definition_en,
        synonyms: JSON.parse(row.synonyms || '[]'),
        antonyms: JSON.parse(row.antonyms || '[]'),
        collocations: JSON.parse(row.collocations || '[]'),
        examples: JSON.parse(row.examples || '[]'),
      },
      quiz: quickQuiz,
    };
  }

  // 2. Agar bazada yo'q bo'lsa (yangi so'z yoki sleng) - AI ishlaydi
  const aiResult = await generateFullAnalysisWithAI(cleanTerm, langCode);

  // 3. AI topgan so'zni darhol bazaga saqlaymiz (kelasi safar bazadan chiqadi)
  try {
    db.prepare(`
      INSERT OR IGNORE INTO words (
        term, ipa, part_of_speech, cefr_level, definition_en,
        translation_uz, synonyms, antonyms, collocations, examples
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      cleanTerm,
      aiResult.analysis.ipa,
      aiResult.analysis.partOfSpeech,
      aiResult.analysis.cefr,
      aiResult.analysis.definition,
      aiResult.analysis.translation,
      JSON.stringify(aiResult.analysis.synonyms || []),
      JSON.stringify(aiResult.analysis.antonyms || []),
      JSON.stringify(aiResult.analysis.collocations || []),
      JSON.stringify(aiResult.analysis.examples || [])
    );
  } catch (err) {
    console.error('Bazaga saqlashda xato:', err);
  }

  return {
    source: 'ai_engine',
    ...aiResult,
  };
}