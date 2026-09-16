import https from 'https';
import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.resolve('dictionary.db');
const db = new Database(dbPath);

// 20 000+ so'zni qamrab oluvchi rasmiy va ochiq manbalar
const SOURCES = [
  // 1. Google 20,000 ta eng ko'p ishlatiladigan so'zlar
  'https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt',
  // 2. IELTS / Academic Word List (AWL)
  'https://raw.githubusercontent.com/martians/academic-word-list/master/academic-word-list.txt',
  // 3. Oxford 3000/5000 va qo'shimcha so'zlar
  'https://raw.githubusercontent.com/raun/Scrabble/master/words.txt'
];

// Ommabop zamonaviy slanglar
const SLANGS = [
  { term: 'ghost', trans: 'aloqani to‘satdan uzmoq (yozishmay qo‘ymoq)', def: 'To suddenly stop all communication with someone without explanation.' },
  { term: 'cringe', trans: 'uyatli, xijolatli holat', def: 'Causing feelings of acute embarrassment or awkwardness.' },
  { term: 'sus', trans: 'shubhali (suspicious)', def: 'Short for suspicious; giving a feeling of distrust.' },
  { term: 'flex', trans: 'maqtanish, ko‘z-ko‘z qilish', def: 'To boast, show off, or display wealth or achievements.' },
  { term: 'cap', trans: 'yolg‘on, bema’ni gap', def: 'A lie or falsehood (often used as "no cap" meaning no lie).' },
  { term: 'bet', trans: 'kelishdik, albatta, gap yo‘q', def: 'An expression of agreement or approval.' },
  { term: 'slay', trans: 'qoyillatmoq, ajoyib bajarmoq', def: 'To do something exceptionally well or look amazing.' },
  { term: 'vibes', trans: 'kayfiyat, atmosfera', def: 'The emotional mood or atmosphere of a place or person.' },
  { term: 'goat', trans: 'tarixdagi eng zo‘ri (Greatest Of All Time)', def: 'Acronym for Greatest Of All Time; the absolute best.' },
  { term: 'lowkey', trans: 'ich-ichidan, sezdirmasdan', def: 'To a moderate or quiet degree; secretly or subtly.' },
  { term: 'highkey', trans: 'ochiqchasiga, hammaga bildirib', def: 'Openly, clearly, or strongly without hiding it.' },
  { term: 'rizz', trans: 'maftunkorlik, jalb qilish qobiliyati', def: 'Charm or attractiveness, especially in romantic appeal.' },
  { term: 'delulu', trans: 'xomxayol, o‘zini aldash', def: 'Delusional; holding unrealistic or fanciful beliefs.' },
  { term: 'simp', trans: 'birovning ketidan haddan ortiq yuguruvchi', def: 'Someone who shows excessive sympathy or attention toward someone.' },
  { term: 'sigma', trans: 'mustaqil, o‘z qoidasi bilan yashovchi', def: 'A popular, successful, but highly independent individual.' }
];

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

const checkWord = db.prepare('SELECT id FROM words WHERE LOWER(term) = ?');
const insertWord = db.prepare(`
  INSERT INTO words (term, definition_en, translation_uz, cefr_level)
  VALUES (?, ?, ?, ?)
`);

async function main() {
  console.log('🚀 20 000+ so‘zlar, IELTS va zamonaviy slanglar yuklab olinmoqda...');

  const wordSet = new Set();

  for (const src of SOURCES) {
    try {
      const txt = await downloadText(src);
      const lines = txt.split(/\r?\n/);
      for (const line of lines) {
        const clean = line.trim().toLowerCase();
        // Faqat haqiqiy inglizcha so'zlar (kamida 2 harf, maxsus belgilarsiz)
        if (clean.length >= 2 && /^[a-z]+$/.test(clean)) {
          wordSet.add(clean);
        }
      }
      console.log(`✅ Manba yuklandi: ${src.split('/').pop()} | Jami yig‘ilgan: ${wordSet.size}`);
    } catch (e) {
      console.warn('⚠️ Manbada xatolik, keyingisiga o‘tildi:', e.message);
    }
  }

  console.log('⚡ SQLite bazasiga yozish boshlandi...');
  let inserted = 0;

  const insertTx = db.transaction(() => {
    // 1. Slanglar
    for (const s of SLANGS) {
      if (!checkWord.get(s.term)) {
        insertWord.run(s.term, s.def, s.trans, 'Slang');
        inserted++;
      }
    }

    // 2. IELTS, akademik va barcha ommabop so'zlar
    for (const w of wordSet) {
      if (!checkWord.get(w)) {
        insertWord.run(w, '', '', 'B2');
        inserted++;
      }
    }
  });

  insertTx();

  const totalInDb = db.prepare('SELECT COUNT(*) as cnt FROM words').get();

  console.log(`🎉 TAYYOR!`);
  console.log(`➕ Yangi qo‘shilgan so‘zlar: ${inserted} ta`);
  console.log(`📚 Bazadagi jami so‘zlar soni: ${totalInDb.cnt} ta`);

  db.close();
}

main();