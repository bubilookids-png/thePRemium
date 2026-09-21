import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../dictionary.db');

const url = process.env.TURSO_DATABASE_URL || `file:${dbPath}`;
const authToken = process.env.TURSO_AUTH_TOKEN;

export const db = createClient({
  url,
  authToken,
});

export async function initDatabase() {
  await db.batch([
    `CREATE TABLE IF NOT EXISTS words (
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
    );`,
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telegram_id INTEGER UNIQUE NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT,
      username TEXT,
      photo_url TEXT,
      search_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_active DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE INDEX IF NOT EXISTS idx_words_term ON words(term);`,
    `CREATE INDEX IF NOT EXISTS idx_users_tg ON users(telegram_id);`,
    `CREATE TABLE IF NOT EXISTS reading_mocks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL
    );`
  ], 'write');

  console.log(`⚡ [DB] Connected successfully to: ${url.startsWith('libsql') ? 'Turso Cloud' : dbPath}`);
}