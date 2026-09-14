import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// database.ts fayli "server/src/db" ichida, shuning uchun 2 qadam tepaga chiqsak to'g'ri "server/dictionary.db" ga boradi
const dbPath = path.resolve(__dirname, '../../dictionary.db');

export const db = new Database(dbPath);

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      term TEXT UNIQUE NOT NULL,
      ipa TEXT,
      part_of_speech TEXT,
      cefr_level TEXT,
      definition_en TEXT NOT NULL,
      translation_uz TEXT,
      translation_ru TEXT,
      translation_es TEXT,
      synonyms TEXT,
      antonyms TEXT,
      collocations TEXT,
      examples TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_words_term ON words(term);
  `);
  console.log(`⚡ [DB] SQLite Dictionary Database connected at: ${dbPath}`);
}