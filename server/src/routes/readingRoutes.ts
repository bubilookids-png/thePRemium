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

export const readingRouter = router;
