import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../dictionary.db');

const tursoUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const url = tursoUrl || `file:${dbPath}`;

export const db = createClient({
  url,
  authToken
});

export async function initDatabase() {
  await db.batch(
    [
      `
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
        examples TEXT,

        usage TEXT,
        common_mistakes TEXT,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      `,

      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        telegram_id INTEGER UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT,
        username TEXT,
        photo_url TEXT,
        search_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_active DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      `,

      `
      CREATE INDEX IF NOT EXISTS idx_words_term
      ON words(term);
      `,

      `
      CREATE INDEX IF NOT EXISTS idx_users_tg
      ON users(telegram_id);
      `
    ],
    'write'
  );

  /*
   * Existing databases created before the new columns existed
   * need these migrations.
   */

  try {
    await db.execute(`
      ALTER TABLE words ADD COLUMN usage TEXT
    `);
  } catch {
    // Column already exists
  }

  try {
    await db.execute(`
      ALTER TABLE words ADD COLUMN common_mistakes TEXT
    `);
  } catch {
    // Column already exists
  }

  try {
    await db.execute(`
      ALTER TABLE words ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    `);
  } catch {
    // Column already exists
  }

  try {
    await db.execute(`
      ALTER TABLE words ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    `);
  } catch {
    // Column already exists
  }

  console.log(
    `⚡ [DB] Connected successfully to: ${
      tursoUrl ? 'Turso Cloud' : `LOCAL SQLite (${dbPath})`
    }`
  );

  if (!tursoUrl) {
    console.warn(
      '⚠️ [DB WARNING] TURSO_DATABASE_URL is not configured. Using local dictionary.db instead of Turso.'
    );
  }
}