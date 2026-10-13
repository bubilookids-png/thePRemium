import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@libsql/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;
const tursoUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
const localDbPath = path.resolve(__dirname, '../../dictionary.db');

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY is missing in server/.env');
  process.exit(1);
}

if (!tursoUrl || !authToken) {
  console.error('❌ TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is missing in server/.env');
  process.exit(1);
}

const rawArticles = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'raw_new_articles.json'), 'utf8')
);

console.log(`🚀 Loaded ${rawArticles.length} raw articles to process.`);

async function getConceptsForBatch(batch) {
  const prompt = `You are an expert English language educator designing a reading recall & retention testing system.
For each article below, extract 8 to 12 core factual key concepts/memory points (short phrases or keywords, e.g. "checks address", "weighs parcel", "sender pays", "van to another office") that a reader should remember when reconstructing what they read. Do not include markdown inside strings. Keep them clean and lowercase where appropriate.

Return ONLY a valid JSON object matching this schema:
{
  "results": [
    {
      "id": "A2-01",
      "key_concepts": ["parcel travels", "worker checks address", "weighs parcel", "sender pays", "van to another office", "driver plans journey", "signature required", "leave a card"]
    }
  ]
}

Articles to process:
${JSON.stringify(batch.map(a => ({ id: a.id, level: a.level, title: a.title, text: a.text })), null, 2)}
`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1
          }
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini HTTP error ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const rawText = data.candidates[0].content.parts[0].text;
      const parsed = JSON.parse(rawText);
      if (parsed.results && Array.isArray(parsed.results)) {
        return parsed.results;
      }
      throw new Error('Unexpected JSON structure: ' + rawText.slice(0, 100));
    } catch (err) {
      console.warn(`⚠️ Attempt ${attempt} failed for batch: ${err.message}. Retrying...`);
      if (attempt === 3) throw err;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

async function run() {
  const BATCH_SIZE = 10;
  const conceptMap = new Map();

  console.log(`🧠 Generating key concepts for ${rawArticles.length} articles using Gemini...`);

  for (let i = 0; i < rawArticles.length; i += BATCH_SIZE) {
    const batch = rawArticles.slice(i, i + BATCH_SIZE);
    const batchIds = batch.map(a => a.id).join(', ');
    console.log(`⏳ Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(rawArticles.length / BATCH_SIZE)}: [${batchIds}]`);

    const results = await getConceptsForBatch(batch);
    for (const r of results) {
      conceptMap.set(r.id, r.key_concepts);
    }

    // Small delay between batches to respect rate limits
    await new Promise(r => setTimeout(r, 800));
  }

  console.log(`✅ Extracted key concepts for ${conceptMap.size} articles.`);

  // Combine raw articles with generated key concepts
  const enrichedArticles = rawArticles.map(a => {
    const concepts = conceptMap.get(a.id) || [];
    if (concepts.length === 0) {
      console.warn(`⚠️ Warning: No concepts found for ${a.id}!`);
    }
    return {
      id: a.id,
      level: a.level,
      title: a.title,
      content: a.text,
      key_concepts: JSON.stringify(concepts)
    };
  });

  // Save enriched JSON locally for verification and persistence
  fs.writeFileSync(
    path.resolve(__dirname, 'all_120_enriched_articles.json'),
    JSON.stringify(enrichedArticles, null, 2),
    'utf8'
  );
  console.log('💾 Saved all_120_enriched_articles.json locally.');

  // ==========================================
  // 1. UPLOAD DIRECTLY TO TURSO CLOUD DATABASE
  // ==========================================
  console.log(`\n☁️ Connecting to TURSO CLOUD DATABASE: ${tursoUrl}`);
  const tursoClient = createClient({
    url: tursoUrl,
    authToken: authToken
  });

  // Ensure table exists in Turso
  await tursoClient.execute(`
    CREATE TABLE IF NOT EXISTS reading_articles (
      id TEXT PRIMARY KEY,
      level TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      key_concepts TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await tursoClient.execute(`
    CREATE INDEX IF NOT EXISTS idx_reading_articles_level
    ON reading_articles(level);
  `);

  console.log('📤 Inserting 120 articles into Turso Cloud database...');
  let insertedCount = 0;
  for (const art of enrichedArticles) {
    await tursoClient.execute({
      sql: `INSERT OR REPLACE INTO reading_articles (id, level, title, content, key_concepts) VALUES (?, ?, ?, ?, ?)`,
      args: [art.id, art.level, art.title, art.content, art.key_concepts]
    });
    insertedCount++;
    if (insertedCount % 20 === 0) {
      console.log(`   Uploaded ${insertedCount}/${enrichedArticles.length} articles to Turso...`);
    }
  }

  console.log(`🎉 Successfully uploaded all ${insertedCount} articles to TURSO CLOUD!`);

  // Verify in Turso
  const tursoStats = await tursoClient.execute(`
    SELECT level, COUNT(*) as count 
    FROM reading_articles 
    GROUP BY level 
    ORDER BY level ASC
  `);
  console.log('\n📊 TURSO CLOUD VERIFICATION STATS:');
  console.table(tursoStats.rows);

  const totalInTurso = await tursoClient.execute(`SELECT COUNT(*) as total FROM reading_articles`);
  console.log(`🔥 Total articles in Turso reading_articles: ${totalInTurso.rows[0].total}`);

  // ==========================================
  // 2. ALSO MIRROR TO LOCAL SQLite (dictionary.db)
  // ==========================================
  try {
    console.log(`\n💾 Mirroring into local dictionary.db (${localDbPath})...`);
    const localClient = createClient({ url: `file:${localDbPath}` });
    await localClient.execute(`
      CREATE TABLE IF NOT EXISTS reading_articles (
        id TEXT PRIMARY KEY,
        level TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        key_concepts TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    for (const art of enrichedArticles) {
      await localClient.execute({
        sql: `INSERT OR REPLACE INTO reading_articles (id, level, title, content, key_concepts) VALUES (?, ?, ?, ?, ?)`,
        args: [art.id, art.level, art.title, art.content, art.key_concepts]
      });
    }
    console.log('✅ Local SQLite mirrored successfully.');
  } catch (localErr) {
    console.warn('⚠️ Local SQLite mirror notice:', localErr.message);
  }

  console.log('\n✨ ALL TASKS COMPLETED SUCCESSFULLY!');
}

run().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
