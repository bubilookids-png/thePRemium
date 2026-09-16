import https from 'https';
import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.resolve('dictionary.db');
const db = new Database(dbPath);

// Qatorma-qator so'z va sinonimlar (WordNet / Moby Thesaurus)
const DATA_URL = 'https://raw.githubusercontent.com/words/moby/master/words.txt';

function downloadText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(downloadText(res.headers.location));
      }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  try {
    console.log('⏳ Haqiqiy Thesaurus bazasi yuklanmoqda...');
    const rawText = await downloadText(DATA_URL);
    console.log('📦 Yuklandi! Bazaga sinonimlar yozilmoqda...');

    const updateStmt = db.prepare(`
      UPDATE words
      SET synonyms = ?
      WHERE LOWER(term) = ? AND (synonyms IS NULL OR synonyms = '[]' OR synonyms = '')
    `);

    let updatedCount = 0;
    const lines = rawText.split(/\r?\n/);

    const fillTx = db.transaction(() => {
      for (const line of lines) {
        if (!line.includes(',')) continue;
        
        // Moby format: birinchi so'z bosh so'z, qolgani sinonimlar
        const parts = line.split(',').map(s => s.trim().toLowerCase());
        const term = parts[0];
        const synonyms = parts.slice(1, 6); // Eng yaqin 5 ta sinonim

        if (term && synonyms.length > 0) {
          const res = updateStmt.run(JSON.stringify(synonyms), term);
          if (res.changes > 0) {
            updatedCount += res.changes;
          }
        }
      }
    });

    fillTx();

    console.log(`🎉 TAYYOR! Jami ${updatedCount} ta so‘zning bo‘sh sinonimlari to‘liq to‘ldirildi!`);
  } catch (err) {
    console.error('❌ Xatolik:', err.message);
  } finally {
    db.close();
  }
}

run();