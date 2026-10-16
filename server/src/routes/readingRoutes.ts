import express from 'express';
import { db } from '../db/database.js';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

const router = express.Router();

import { ALL_180_ARTICLES } from '../db/readingArticlesData.js';

const articlesCache = new Map<string, any[]>();

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
    const cleanLevel = (data.level || 'B1').trim() || 'B1';
    const sourceFeature = data.source_feature || (data.level ? `reading_${data.level}` : 'retention_reading');

    await db.execute({
      sql: `INSERT INTO user_saved_words (telegram_id, word, english_word, translation, level, source_feature) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [data.telegram_id, englishWord, englishWord, data.translation.trim(), cleanLevel, sourceFeature]
    });
    res.json({ success: true });
  } catch (error) {
    logger.error('Error saving word', { error });
    res.status(400).json({ error: 'Failed to save word' });
  }
});

router.get('/articles', async (req, res) => {
  try {
    const rawLevel = req.query.level as string;
    if (!rawLevel) {
      return res.status(400).json({ error: 'Level is required' });
    }

    const level = rawLevel.trim().toUpperCase();

    // Fast in-memory cache hit (sub-millisecond response)
    if (articlesCache.has(level)) {
      return res.json({ articles: articlesCache.get(level) });
    }

    // Use indexed level query
    const result = await db.execute({
      sql: `SELECT id, level, title, content, key_concepts FROM reading_articles WHERE level = ? ORDER BY id ASC`,
      args: [level]
    });

    let articles: any[] = [];
    if (result.rows.length > 0) {
      articles = result.rows.map((r: any) => ({
        id: r.id,
        level: r.level,
        title: r.title,
        content: r.content,
        keyConcepts: typeof r.key_concepts === 'string' ? JSON.parse(r.key_concepts || '[]') : r.key_concepts || []
      }));
    } else {
      // Fallback from static source if table is warming up
      articles = ALL_180_ARTICLES
        .filter(a => a.level.toUpperCase() === level)
        .map(a => ({
          id: a.id,
          level: a.level,
          title: a.title,
          content: a.content,
          keyConcepts: typeof a.key_concepts === 'string' ? JSON.parse(a.key_concepts) : a.key_concepts
        }));
    }

    articlesCache.set(level, articles);
    res.json({ articles });
  } catch (error) {
    logger.error('Error fetching articles', { error });
    // Safe fallback from in-memory articles data if DB times out
    const level = (req.query.level as string || '').trim().toUpperCase();
    const fallbackArticles = ALL_180_ARTICLES
      .filter(a => a.level.toUpperCase() === level)
      .map(a => ({
        id: a.id,
        level: a.level,
        title: a.title,
        content: a.content,
        keyConcepts: typeof a.key_concepts === 'string' ? JSON.parse(a.key_concepts) : a.key_concepts
      }));

    if (fallbackArticles.length > 0) {
      articlesCache.set(level, fallbackArticles);
      return res.json({ articles: fallbackArticles });
    }

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

