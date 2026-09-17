import { db, initDatabase } from '../db/database.js';
import https from 'https';

initDatabase();

const DICT_URL = 'https://raw.githubusercontent.com/matthewreagan/WebstersEnglishDictionary/master/dictionary_compact.json';

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

    console.time('⚡ Bazaga yozish vaqti');
    
    // Batch orqali tezkor yozish (Turso/LibSQL uchun moslashtirildi)
    const statements: any[] = [];
    for (const [word, def] of entries) {
      statements.push({
        sql: `INSERT OR IGNORE INTO words (
          term, ipa, part_of_speech, cefr_level, definition_en,
          translation_uz, translation_ru, synonyms, antonyms, collocations, examples
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          word.trim().toLowerCase(),
          null,
          'general',
          'B2',
          def.trim(),
          null,
          null,
          JSON.stringify([]),
          JSON.stringify([]),
          JSON.stringify([]),
          JSON.stringify([])
        ]
      });

      // Har 500 tilda bir batch ni yuborib turamiz (xotira yetishmovchiligi oldi olinadi)
      if (statements.length >= 500) {
        await db.batch(statements, 'write');
        statements.length = 0;
      }
    }

    // Qolganlari
    if (statements.length > 0) {
      await db.batch(statements, 'write');
    }

    console.timeEnd('⚡ Bazaga yozish vaqti');

    const countRes = await db.execute('SELECT COUNT(*) as count FROM words');
    const count = Number((countRes.rows[0] as any).count);
    console.log(`✅ Muvaffaqiyatli yakunlandi! Bazadagi so'zlar: ${count} ta.`);
  } catch (err) {
    console.error('❌ Xatolik yuz berdi:', err);
  }
}

runSeed();