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
      `,

      `
      CREATE TABLE IF NOT EXISTS user_saved_words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        telegram_id INTEGER NOT NULL,
        english_word TEXT NOT NULL,
        translation TEXT NOT NULL,
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
    await db.execute(`ALTER TABLE user_saved_words ADD COLUMN english_word TEXT`);
  } catch {}

  try {
    await db.execute(`ALTER TABLE user_saved_words ADD COLUMN source_feature TEXT DEFAULT 'manual'`);
  } catch {}

  // If old table had 'word' column, populate english_word where null
  try {
    await db.execute(`UPDATE user_saved_words SET english_word = word WHERE english_word IS NULL AND word IS NOT NULL`);
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

  // Seed default reading articles if table is empty
  try {
    const articleCountRes = await db.execute(`SELECT COUNT(*) as count FROM reading_articles`);
    const articleCount = Number((articleCountRes.rows[0] as any)?.count || 0);

    if (articleCount === 0) {
      console.log('📚 [DB] Seeding default reading articles into Turso/SQLite database...');
      const seedArticles = [
        {
          id: 'a2-1',
          level: 'A2',
          title: 'The Tallest Mammals',
          content: 'Giraffes are the tallest mammals on Earth. They live in Africa. A giraffe has a very long neck, but it has only seven bones in its neck. This is the same number of bones as a human has. Giraffes eat leaves from high trees. Their favorite food is the acacia tree. A giraffe has a long, blue tongue to help it pull leaves from branches. They do not drink a lot of water because they get water from the leaves they eat.',
          key_concepts: JSON.stringify(['giraffes', 'tallest', 'africa', 'long neck', 'seven bones', 'leaves', 'acacia', 'blue tongue', 'water'])
        },
        {
          id: 'b1-1',
          level: 'B1',
          title: 'The Dawn of Computing',
          content: 'Early computing began long before modern electronic devices existed. One of the first mechanical computers was the Analytical Engine, designed by Charles Babbage in the 1830s. It used punch cards for input and could perform complex mathematical calculations. Ada Lovelace is often considered the first computer programmer because she wrote an algorithm for this machine. The transition to electronic computers happened during World War II with machines like ENIAC. These massive computers used vacuum tubes, generated an enormous amount of heat, and filled entire rooms, yet they were less powerful than a simple modern smartphone.',
          key_concepts: JSON.stringify(['early computing', 'analytical engine', 'charles babbage', 'punch cards', 'ada lovelace', 'programmer', 'eniac', 'world war ii', 'vacuum tubes', 'smartphone'])
        },
        {
          id: 'b2-1',
          level: 'B2',
          title: 'Quantum Entanglement',
          content: 'Quantum entanglement is a complex physical phenomenon that occurs when pairs or groups of particles interact in ways such that the quantum state of each particle cannot be described independently of the state of the others, even when the particles are separated by a large distance. Instead, a quantum state must be described for the system as a whole. Measurements of physical properties such as position, momentum, spin, and polarization performed on entangled particles are found to be perfectly correlated. For example, if one particle is observed to have a spin pointing upward, the spin of its entangled partner will immediately be observed pointing downward, regardless of the distance separating them. This phenomenon puzzled Albert Einstein, who famously referred to it as "spooky action at a distance." Today, entanglement is a primary focus of quantum information theory and is crucial for developing quantum cryptography and quantum computing.',
          key_concepts: JSON.stringify(['quantum entanglement', 'physical phenomenon', 'particles', 'quantum state', 'correlated', 'momentum', 'spin', 'polarization', 'albert einstein', 'spooky action', 'quantum cryptography', 'quantum computing'])
        }
      ];

      for (const art of seedArticles) {
        await db.execute({
          sql: `INSERT OR REPLACE INTO reading_articles (id, level, title, content, key_concepts) VALUES (?, ?, ?, ?, ?)`,
          args: [art.id, art.level, art.title, art.content, art.key_concepts]
        });
      }
      console.log('✅ [DB] Reading articles seeded successfully.');
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