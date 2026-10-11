import express from 'express';
import { db } from '../db/database.js';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

const router = express.Router();

const saveSessionSchema = z.object({
  telegram_id: z.number(),
  level: z.string(),
  score: z.number(),
  words_recalled: z.number()
});

router.post('/session', async (req, res) => {
  try {
    const data = saveSessionSchema.parse(req.body);
    await db.execute({
      sql: `INSERT INTO reading_sessions (telegram_id, level, score, words_recalled) VALUES (?, ?, ?, ?)`,
      args: [data.telegram_id, data.level, data.score, data.words_recalled]
    });
    res.json({ success: true });
  } catch (error) {
    logger.error('Error saving reading session', { error });
    res.status(400).json({ error: 'Failed to save session' });
  }
});

const saveWordSchema = z.object({
  telegram_id: z.number(),
  word: z.string().optional(),
  english_word: z.string().optional(),
  translation: z.string(),
  source_feature: z.string().optional(),
  level: z.string().optional()
});

router.post('/save-word', async (req, res) => {
  try {
    const data = saveWordSchema.parse(req.body);
    const englishWord = (data.english_word || data.word || '').trim();
    if (!englishWord) {
      return res.status(400).json({ error: 'Word is required' });
    }
    const sourceFeature = data.source_feature || (data.level ? `reading_${data.level}` : 'retention_reading');

    await db.execute({
      sql: `INSERT INTO user_saved_words (telegram_id, english_word, translation, source_feature) VALUES (?, ?, ?, ?)`,
      args: [data.telegram_id, englishWord, data.translation.trim(), sourceFeature]
    });
    res.json({ success: true });
  } catch (error) {
    logger.error('Error saving word', { error });
    res.status(400).json({ error: 'Failed to save word' });
  }
});

router.get('/articles', async (req, res) => {
  try {
    const level = req.query.level as string;
    if (!level) {
      return res.status(400).json({ error: 'Level is required' });
    }

    const result = await db.execute({
      sql: `SELECT id, level, title, content, key_concepts FROM reading_articles WHERE UPPER(level) = UPPER(?) ORDER BY id ASC`,
      args: [level.trim()]
    });

    const articles = result.rows.map((r: any) => ({
      id: r.id,
      level: r.level,
      title: r.title,
      content: r.content,
      // Handle key_concepts stored as JSON string
      keyConcepts: JSON.parse(r.key_concepts || '[]')
    }));

    res.json({ articles });
  } catch (error) {
    logger.error('Error fetching articles', { error });
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

router.get('/translate', async (req, res) => {
  try {
    const word = req.query.word as string;
    if (!word) {
      return res.status(400).json({ error: 'Word is required' });
    }
    const cleanWord = word.trim().toLowerCase();

    const result = await db.execute({
      sql: `SELECT translation_uz FROM words WHERE term = ?`,
      args: [cleanWord]
    });

    const firstRow = result.rows[0] as any;
    if (firstRow && firstRow.translation_uz) {
      return res.json({ translation: firstRow.translation_uz });
    }
    
    return res.json({ translation: null });
  } catch (error) {
    logger.error('Error translating word', { error });
    res.status(500).json({ error: 'Failed to translate word' });
  }
});

export const readingRouter = router;

