import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';
import { ALL_180_ARTICLES } from './readingArticlesData.js';

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
      `,

      `
      CREATE TABLE IF NOT EXISTS user_saved_words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        telegram_id INTEGER NOT NULL,
        word TEXT,
        english_word TEXT,
        translation TEXT NOT NULL,
        level TEXT DEFAULT 'B1',
        source_feature TEXT NOT NULL DEFAULT 'manual',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      `,

      `
      CREATE INDEX IF NOT EXISTS idx_saved_words_tg
      ON user_saved_words(telegram_id);
      `,

      `
      CREATE TABLE IF NOT EXISTS reading_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        telegram_id INTEGER NOT NULL,
        level TEXT NOT NULL,
        score REAL NOT NULL,
        words_recalled INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      `,

      `
      CREATE TABLE IF NOT EXISTS reading_articles (
        id TEXT PRIMARY KEY,
        level TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        key_concepts TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      `,

      `
      CREATE INDEX IF NOT EXISTS idx_reading_articles_level
      ON reading_articles(level);
      `
    ],
    'write'
  );

  /*
   * Migrations for existing user_saved_words and words tables
   */
  try {
    await db.execute(`ALTER TABLE user_saved_words ADD COLUMN word TEXT`);
  } catch {}

  try {
    await db.execute(`ALTER TABLE user_saved_words ADD COLUMN english_word TEXT`);
  } catch {}

  try {
    await db.execute(`ALTER TABLE user_saved_words ADD COLUMN level TEXT DEFAULT 'B1'`);
  } catch {}

  try {
    await db.execute(`ALTER TABLE user_saved_words ADD COLUMN source_feature TEXT DEFAULT 'manual'`);
  } catch {}

  // Sync legacy and current column values
  try {
    await db.execute(`UPDATE user_saved_words SET english_word = word WHERE (english_word IS NULL OR english_word = '') AND word IS NOT NULL`);
  } catch {}
  try {
    await db.execute(`UPDATE user_saved_words SET word = english_word WHERE (word IS NULL OR word = '') AND english_word IS NOT NULL`);
  } catch {}
  try {
    await db.execute(`UPDATE user_saved_words SET level = 'B1' WHERE level IS NULL OR level = ''`);
  } catch {}

  try {
    await db.execute(`ALTER TABLE words ADD COLUMN usage TEXT`);
  } catch {}

  try {
    await db.execute(`ALTER TABLE words ADD COLUMN common_mistakes TEXT`);
  } catch {}

  try {
    await db.execute(`ALTER TABLE words ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP`);
  } catch {}

  try {
    await db.execute(`ALTER TABLE words ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP`);
  } catch {}

  // Seed retention reading articles if fewer than 180 articles are present
  try {
    const articleCountRes = await db.execute(`SELECT COUNT(*) as count FROM reading_articles`);
    const articleCount = Number((articleCountRes.rows[0] as any)?.count || 0);

    if (articleCount < 180) {
      console.log(`📚 [DB] Found ${articleCount} reading articles. Upserting complete set of 180 articles into Turso/SQLite database...`);
      // Clean up legacy test IDs if present
      await db.execute(`DELETE FROM reading_articles WHERE id IN ('a2-1', 'b1-1', 'b2-1')`);

      for (const art of ALL_180_ARTICLES) {
        await db.execute({
          sql: `INSERT OR REPLACE INTO reading_articles (id, level, title, content, key_concepts) VALUES (?, ?, ?, ?, ?)`,
          args: [art.id, art.level, art.title, art.content, art.key_concepts]
        });
      }
      console.log('✅ [DB] All 180 reading articles seeded successfully.');
    }
  } catch (seedErr) {
    console.error('⚠️ [DB] Error seeding reading articles:', seedErr);
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