// server/src/scripts/seedWords.ts
import { db, initDatabase } from '../db/database';
import https from 'https';

initDatabase();

const DICT_URL = 'https://raw.githubusercontent.com/matthewreagan/WebstersEnglishDictionary/master/dictionary_compact.json';

const INSERT_WORD = db.prepare(`
  INSERT OR IGNORE INTO words (
    term, ipa, part_of_speech, cefr_level, definition_en,
    translation_uz, translation_ru, synonyms, antonyms, collocations, examples
  ) VALUES (
    @term, @ipa, @part_of_speech, @cefr_level, @definition_en,
    @translation_uz, @translation_ru, @synonyms, @antonyms, @collocations, @examples
  )
`);

async function fetchDictionaryData(url: string): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function runSeed() {
  console.log('⬇️  Lug\'at ma\'lumotlari yuklab olinmoqda...');
  try {
    const rawData = await fetchDictionaryData(DICT_URL);
    const entries = Object.entries(rawData);
    console.log(`📦 Jami so'zlar soni: ${entries.length}. Bazaga yozish boshlandi...`);

    const insertBatch = db.transaction((items: [string, string][]) => {
      for (const [word, def] of items) {
        INSERT_WORD.run({
          term: word.trim().toLowerCase(),
          ipa: null,
          part_of_speech: 'general',
          cefr_level: 'B2',
          definition_en: def.trim(),
          translation_uz: null,
          translation_ru: null,
          synonyms: JSON.stringify([]),
          antonyms: JSON.stringify([]),
          collocations: JSON.stringify([]),
          examples: JSON.stringify([])
        });
      }
    });

    console.time('⚡ Bazaga yozish vaqti');
    insertBatch(entries);
    console.timeEnd('⚡ Bazaga yozish vaqti');

    const count: any = db.prepare('SELECT COUNT(*) as count FROM words').get();
    console.log(`✅ Muvaffaqiyatli yakunlandi! Bazadagi so'zlar: ${count.count} ta.`);
  } catch (err) {
    console.error('❌ Xatolik yuz berdi:', err);
  }
}

runSeed();