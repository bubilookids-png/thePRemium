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
    `CREATE TABLE IF NOT EXISTS reading_tests (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      level TEXT NOT NULL,
      is_free INTEGER NOT NULL,
      duration_minutes INTEGER NOT NULL,
      is_real_exam INTEGER NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS reading_passages (
      id INTEGER,
      test_id TEXT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      PRIMARY KEY (test_id, id),
      FOREIGN KEY (test_id) REFERENCES reading_tests(id)
    );`,
    `CREATE TABLE IF NOT EXISTS reading_questions (
      id TEXT PRIMARY KEY,
      test_id TEXT,
      passage_id INTEGER,
      type TEXT NOT NULL,
      prompt TEXT NOT NULL,
      options TEXT,
      correct_answer TEXT NOT NULL,
      FOREIGN KEY (test_id) REFERENCES reading_tests(id)
    );`,
    `CREATE INDEX IF NOT EXISTS idx_words_term ON words(term);`,
    `CREATE INDEX IF NOT EXISTS idx_users_tg ON users(telegram_id);`
  ], 'write');

  // Har xil mavzulardagi real va unique passage'larga ega mock testlarni bazaga kiritish
  try {
    const res = await db.execute('SELECT COUNT(*) as count FROM reading_tests');
    const count = Number((res.rows[0] as any).count);

    if (count === 0) {
      console.log('⚡ [DB] Har xil mavzulardagi 3 ta passageli mock testlar bazaga kiritilmoqda...');
      
      const statements: any[] = [];

      // Test 1: Texnologiya va Tabiat
      const test1Id = 'reading-mock-1';
      statements.push({
        sql: 'INSERT OR IGNORE INTO reading_tests (id, title, level, is_free, duration_minutes, is_real_exam) VALUES (?, ?, ?, ?, ?, ?)',
        args: [test1Id, 'Academic Reading Mock Test 1 — Ecosystems & Tech', 'Academic', 1, 60, 1]
      });

      // Test 1 - Passage 1
      statements.push({
        sql: 'INSERT OR IGNORE INTO reading_passages (id, test_id, title, content) VALUES (?, ?, ?, ?)',
        args: [1, test1Id, 'Passage 1: Urbanization and Local Wildlife', 'Urban expansion has drastically altered natural habitats across the globe. As concrete structures replace woodlands and wetlands, local wildlife species face unprecedented survival challenges. While some adaptable species thrive in human-dominated environments, many sensitive species experience severe population declines.\n\nConservationists argue that urban planning must incorporate ecological corridors—green pathways that allow animals to move safely between fragmented habitats. Without these interventions, genetic isolation can lead to long-term species vulnerability. Recent studies in European cities indicate that even modest green roofs can significantly boost urban biodiversity by offering nesting sites for migratory birds and essential foraging grounds for pollinators.']
      });
      statements.push({
        sql: 'INSERT OR IGNORE INTO reading_questions (id, test_id, passage_id, type, prompt, options, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
        args: [`${test1Id}-p1-q1`, test1Id, 1, 'fill_blank', 'Complete the sentence: Urban structures frequently replace natural habitats like woodlands and ________.', null, 'wetlands']
      });

      // Test 1 - Passage 2
      statements.push({
        sql: 'INSERT OR IGNORE INTO reading_passages (id, test_id, title, content) VALUES (?, ?, ?, ?)',
        args: [2, test1Id, 'Passage 2: The Evolution of Renewable Energy', 'The transition from fossil fuels to renewable energy sources represents one of the most critical technological shifts of the twenty-first century. Solar photovoltaic systems and wind turbines have seen exponential growth, driven by dramatic cost reductions and improvements in manufacturing efficiency.\n\nHoverver, intermittency remains a major engineering hurdle. Because wind and solar generation fluctuate depending on weather conditions, grid operators rely heavily on advanced battery storage solutions and pumped-storage hydroelectricity to ensure stable, round-the-clock power supplies.']
      });
      statements.push({
        sql: 'INSERT OR IGNORE INTO reading_questions (id, test_id, passage_id, type, prompt, options, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
        args: [`${test1Id}-p2-q1`, test1Id, 2, 'fill_blank', 'Complete the sentence: Solar and wind generation fluctuate depending on weather ________.', null, 'conditions']
      });

      // Test 1 - Passage 3
      statements.push({
        sql: 'INSERT OR IGNORE INTO reading_passages (id, test_id, title, content) VALUES (?, ?, ?, ?)',
        args: [3, test1Id, 'Passage 3: Bilingualism and Brain Plasticity', 'For decades, traditional educational theories suggested that learning two languages simultaneously might confuse young children. Modern neuropsychological research has comprehensively dismantled this hypothesis, demonstrating instead that bilingualism confers profound mental advantages.\n\nIndividuals who actively manage two or more languages exhibit superior executive function—the brains command system for tasks requiring attention control, working memory, and cognitive flexibility. Neuroimaging studies show increased gray matter density in the prefrontal cortex of bilingual individuals.']
      });
      statements.push({
        sql: 'INSERT OR IGNORE INTO reading_questions (id, test_id, passage_id, type, prompt, options, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
        args: [`${test1Id}-p3-q1`, test1Id, 3, 'fill_blank', 'Complete the sentence: Bilingual individuals show increased gray matter density in the ________ cortex.', null, 'prefrontal']
      });


      // Test 2: Tarix va Sun'iy Intellekt
      const test2Id = 'reading-mock-2';
      statements.push({
        sql: 'INSERT OR IGNORE INTO reading_tests (id, title, level, is_free, duration_minutes, is_real_exam) VALUES (?, ?, ?, ?, ?, ?)',
        args: [test2Id, 'Academic Reading Mock Test 2 — History & AI', 'Academic', 1, 60, 1]
      });

      // Test 2 - Passage 1
      statements.push({
        sql: 'INSERT OR IGNORE INTO reading_passages (id, test_id, title, content) VALUES (?, ?, ?, ?)',
        args: [1, test2Id, 'Passage 1: The Historical Origins of the Silk Road', 'The Silk Road was not a single paved highway but an intricate network of trade routes connecting East Asia with the Mediterranean world. Established officially during the Han Dynasty in China around 130 BCE, this vast network facilitated the exchange of silk, spices, and precious metals, as well as the cross-cultural transmission of ideas and scientific innovations.\n\nOasis towns along the Taklamakan Desert served as vital provisioning stations for merchants traveling with camel caravans. The circulation of paper-making techniques and gunpowder westward transformed European civilization.']
      });
      statements.push({
        sql: 'INSERT OR IGNORE INTO reading_questions (id, test_id, passage_id, type, prompt, options, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
        args: [`${test2Id}-p1-q1`, test2Id, 1, 'fill_blank', 'Complete the sentence: The Silk Road was officially established during the ________ Dynasty in China.', null, 'Han']
      });

      // Test 2 - Passage 2
      statements.push({
        sql: 'INSERT OR IGNORE INTO reading_passages (id, test_id, title, content) VALUES (?, ?, ?, ?)',
        args: [2, test2Id, 'Passage 2: Artificial Intelligence in Modern Medicine', 'Artificial intelligence algorithms are transforming medical diagnostics, offering unprecedented precision in detecting pathologies within medical imaging data. Machine learning models trained on vast archives of radiological scans can identify early-stage anomalies, such as micro-calcifications in mammograms, often surpassing human accuracy under fatigue.\n\nDespite these triumphs, integration into clinical workflows faces ethical and regulatory bottlenecks regarding data privacy and algorithmic bias.']
      });
      statements.push({
        sql: 'INSERT OR IGNORE INTO reading_questions (id, test_id, passage_id, type, prompt, options, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
        args: [`${test2Id}-p2-q1`, test2Id, 2, 'fill_blank', 'Complete the sentence: AI algorithms offer unprecedented precision in detecting pathologies within medical ________ data.', null, 'imaging']
      });

      // Test 2 - Passage 3
      statements.push({
        sql: 'INSERT OR IGNORE INTO reading_passages (id, test_id, title, content) VALUES (?, ?, ?, ?)',
        args: [3, test2Id, 'Passage 3: Marine Ecosystems and Coral Reefs', 'Coral reefs support approximately twenty-five percent of all marine life despite covering less than one percent of the ocean floor. However, rising ocean temperatures driven by global climate change have triggered devastating mass coral bleaching events worldwide.\n\nWhen water temperatures remain abnormally elevated for extended periods, corals expel the symbiotic algae living within their tissues, losing their vibrant colors and vital nutrient source. Unless global carbon emissions are curtailed, marine biologists warn of functional collapse.']
      });
      statements.push({
        sql: 'INSERT OR IGNORE INTO reading_questions (id, test_id, passage_id, type, prompt, options, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
        args: [`${test2Id}-p3-q1`, test2Id, 3, 'fill_blank', 'Complete the sentence: Coral reefs support roughly ________ percent of all marine life.', null, 'twenty-five']
      });

      await db.batch(statements, 'write');
      console.log('⚡ [DB] Har xil matnga ega mock testlar bazaga muvaffaqiyatli qo\'shildi!');
    }
  } catch (err) {
    console.error('Seed error:', err);
  }

  console.log(`⚡ [DB] Connected successfully to: ${url.startsWith('libsql') ? 'Turso Cloud' : dbPath}`);
}