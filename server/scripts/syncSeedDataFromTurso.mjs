import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@libsql/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const tursoUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !authToken) {
  console.error('Missing TURSO credentials in server/.env');
  process.exit(1);
}

const client = createClient({ url: tursoUrl, authToken });

async function sync() {
  console.log('Fetching all 180 articles from Turso...');
  const res = await client.execute(`
    SELECT id, level, title, content, key_concepts 
    FROM reading_articles 
    ORDER BY level ASC, id ASC
  `);

  console.log(`Retrieved ${res.rows.length} articles from Turso.`);
  if (res.rows.length < 180) {
    throw new Error(`Expected at least 180 articles, got ${res.rows.length}`);
  }

  const articles = res.rows.map(r => ({
    id: String(r.id),
    level: String(r.level),
    title: String(r.title),
    content: String(r.content),
    key_concepts: String(r.key_concepts)
  }));

  const fileContent = `export interface SeedArticle {
  id: string;
  level: 'A2' | 'B1' | 'B2';
  title: string;
  content: string;
  key_concepts: string;
}

export const ALL_180_ARTICLES: SeedArticle[] = ${JSON.stringify(articles, null, 2)} as unknown as SeedArticle[];

// Backwards compatibility alias
export const ALL_60_ARTICLES = ALL_180_ARTICLES;
`;

  const targetPath = path.resolve(__dirname, '../src/db/readingArticlesData.ts');
  fs.writeFileSync(targetPath, fileContent, 'utf8');
  console.log(`Successfully updated ${targetPath} with ${articles.length} articles!`);
}

sync().catch(err => {
  console.error('Error syncing:', err);
  process.exit(1);
});
