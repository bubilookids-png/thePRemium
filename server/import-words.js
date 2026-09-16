import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

// Bazangiz joylashgan manzil
const dbPath = path.resolve('dictionary.db');
const jsonPath = path.resolve('import-data.json');

if (!fs.existsSync(jsonPath)) {
  console.error('❌ Xato: import-data.json fayli topilmadi!');
  process.exit(1);
}

const db = new Database(dbPath);

console.log('🚀 Lug‘at ma’lumotlarini import qilish boshlandi...');

const rawData = fs.readFileSync(jsonPath, 'utf-8');
const words = JSON.parse(rawData);

const insertOrUpdate = db.prepare(`
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
`);

// Tranzaksiya orqali minglab so'zlarni 1 soniyada yozish
const importAll = db.transaction((list) => {
  let count = 0;
  for (const item of list) {
    insertOrUpdate.run(
      item.term.trim().toLowerCase(),
      item.ipa || '',
      item.part_of_speech || 'noun',
      item.cefr_level || 'B1',
      item.definition_en || '',
      item.translation_uz || '',
      JSON.stringify(item.synonyms || []),
      JSON.stringify(item.antonyms || []),
      JSON.stringify(item.collocations || []),
      JSON.stringify(item.examples || [])
    );
    count++;
  }
  return count;
});

try {
  const total = importAll(words);
  console.log(`✅ Muvaffaqiyatli yakunlandi! Jami ${total} ta so‘z bazaga yozildi.`);
} catch (err) {
  console.error('❌ Importda xatolik yuz berdi:', err);
} finally {
  db.close();
}