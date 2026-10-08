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
  word: z.string(),
  translation: z.string(),
  level: z.string()
});

router.post('/save-word', async (req, res) => {
  try {
    const data = saveWordSchema.parse(req.body);
    await db.execute({
      sql: `INSERT INTO user_saved_words (telegram_id, word, translation, level) VALUES (?, ?, ?, ?)`,
      args: [data.telegram_id, data.word, data.translation, data.level]
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
      sql: `SELECT id, level, title, content, key_concepts FROM reading_articles WHERE level = ?`,
      args: [level]
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

    if (result.rows.length > 0 && result.rows[0].translation_uz) {
      return res.json({ translation: result.rows[0].translation_uz });
    }
    
    return res.json({ translation: null });
  } catch (error) {
    logger.error('Error translating word', { error });
    res.status(500).json({ error: 'Failed to translate word' });
  }
});

export const readingRouter = router;
