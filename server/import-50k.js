import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.resolve('dictionary.db');
const db = new Database(dbPath);

console.log('🚀 Lug‘at ma’lumotlarini bazaga yozish boshlandi...');

const dictionary = [
  // Uy-ro'zg'or va mebellar
  { en: 'sofa', uz: 'divan' },
  { en: 'chair', uz: 'stul, o‘rindiq' },
  { en: 'table', uz: 'stol' },
  { en: 'bed', uz: 'karavot, yotoq' },
  { en: 'desk', uz: 'yozuv stoli' },
  { en: 'door', uz: 'eshik' },
  { en: 'window', uz: 'deraza' },
  { en: 'room', uz: 'xona' },
  { en: 'kitchen', uz: 'oshxona' },
  { en: 'house', uz: 'uy' },
  { en: 'apartment', uz: 'kvartira' },
  { en: 'mirror', uz: 'ko‘zgu, oyna' },
  { en: 'carpet', uz: 'gilam' },
  { en: 'lamp', uz: 'chiroq' },
  { en: 'curtain', uz: 'parda' },
  { en: 'cushion', uz: 'yostiqcha' },

  // Texnologiya va ish
  { en: 'computer', uz: 'kompyuter' },
  { en: 'laptop', uz: 'noutbuk' },
  { en: 'phone', uz: 'telefon' },
  { en: 'screen', uz: 'ekran' },
  { en: 'keyboard', uz: 'klaviatura' },
  { en: 'mouse', uz: 'sichqoncha' },
  { en: 'code', uz: 'kod' },
  { en: 'program', uz: 'dastur' },
  { en: 'internet', uz: 'internet' },
  { en: 'network', uz: 'tarmoq' },
  { en: 'data', uz: 'ma’lumotlar' },
  { en: 'system', uz: 'tizim' },
  { en: 'device', uz: 'qurilma' },
  { en: 'memory', uz: 'xotira' },
  { en: 'file', uz: 'fayl' },
  { en: 'folder', uz: 'papka' },
  { en: 'software', uz: 'dasturiy ta’minot' },

  // Kundalik faoliyat va fe'llar
  { en: 'achieve', uz: 'erishmoq' },
  { en: 'accept', uz: 'qabul qilmoq' },
  { en: 'build', uz: 'qurmoq, yaratmoq' },
  { en: 'create', uz: 'yaratmoq, vujudga keltirmoq' },
  { en: 'develop', uz: 'rivojlantirmoq' },
  { en: 'improve', uz: 'yaxshilamoq' },
  { en: 'learn', uz: 'o‘rganmoq' },
  { en: 'study', uz: 'o‘qimoq, tadqiq qilmoq' },
  { en: 'remember', uz: 'eslab qolmoq' },
  { en: 'understand', uz: 'tushunmoq' },
  { en: 'explain', uz: 'tushuntirmoq' },
  { en: 'change', uz: 'o‘zgartirmoq' },
  { en: 'decide', uz: 'qaror qilmoq' },
  { en: 'describe', uz: 'tasvirlamoq' },
  { en: 'protect', uz: 'himoya qilmoq' },
  { en: 'support', uz: 'qo‘llab-quvvatlamoq' },
  { en: 'discover', uz: 'kashf qilmoq' },
  { en: 'provide', uz: 'ta’minlamoq' },
  { en: 'reduce', uz: 'kamaytirmoq' },
  { en: 'increase', uz: 'oshirmoq' },

  // Sifatlar (Adjectives)
  { en: 'important', uz: 'muhim' },
  { en: 'difficult', uz: 'qiyin' },
  { en: 'easy', uz: 'oson' },
  { en: 'useful', uz: 'foydali' },
  { en: 'necessary', uz: 'zarur, kerakli' },
  { en: 'popular', uz: 'mashhur' },
  { en: 'modern', uz: 'zamonaviy' },
  { en: 'traditional', uz: 'an’anaviy' },
  { en: 'smart', uz: 'aqlli' },
  { en: 'strong', uz: 'kuchli' },
  { en: 'effective', uz: 'samarali' },
  { en: 'comfortable', uz: 'qulay' },
  { en: 'confident', uz: 'ishonchli' },
  { en: 'creative', uz: 'ijodkor' },
  { en: 'curious', uz: 'qiziquvchan' },
  { en: 'dangerous', uz: 'xavfli' },

  // Jamiyat, ta'lim va hayot
  { en: 'education', uz: 'ta’lim' },
  { en: 'knowledge', uz: 'bilim' },
  { en: 'experience', uz: 'tajriba' },
  { en: 'skill', uz: 'mahorat, ko‘nikma' },
  { en: 'opportunity', uz: 'imkoniyat' },
  { en: 'success', uz: 'muvaffaqiyat' },
  { en: 'challenge', uz: 'sinov, qiyinchilik' },
  { en: 'goal', uz: 'maqsad' },
  { en: 'society', uz: 'jamiyat' },
  { en: 'future', uz: 'kelajak' },
  { en: 'history', uz: 'tarix' },
  { en: 'language', uz: 'til' },
  { en: 'culture', uz: 'madaniyat' },
  { en: 'community', uz: 'jamoa' },
  { en: 'environment', uz: 'atrof-muhit' },
  { en: 'decision', uz: 'qaror' },
  { en: 'relationship', uz: 'munosabat' },
  { en: 'solution', uz: 'yechim' },
  { en: 'problem', uz: 'muammo' },
  { en: 'benefit', uz: 'foyda' },
  { en: 'effort', uz: 'harakat, g‘ayrat' }
];

const updateExisting = db.prepare(`
  UPDATE words 
  SET translation_uz = ? 
  WHERE LOWER(term) = ?
`);

const insertNew = db.prepare(`
  INSERT INTO words (term, translation_uz, definition_en)
  VALUES (?, ?, '')
`);

const checkWord = db.prepare('SELECT id FROM words WHERE LOWER(term) = ?');

const insertAll = db.transaction((items) => {
  let count = 0;
  for (const item of items) {
    const term = item.en.toLowerCase().trim();
    const trans = item.uz.trim();
    
    const existing = checkWord.get(term);
    if (existing) {
      updateExisting.run(trans, term);
    } else {
      insertNew.run(term, trans);
    }
    count++;
  }
  return count;
});

try {
  const total = insertAll(dictionary);
  console.log(`🎉 TAYYOR! Jami ${total} ta so‘z muvaffaqiyatli bazaga yozildi!`);
} catch (err) {
  console.error('❌ Xato:', err);
} finally {
  db.close();
}