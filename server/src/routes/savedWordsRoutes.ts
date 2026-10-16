import express from 'express';
import { db } from '../db/database.js';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

const router = express.Router();

const saveWordSchema = z.object({
  telegram_id: z.number({ required_error: 'telegram_id is required' }),
  english_word: z.string().optional(),
  word: z.string().optional(),
  translation: z.string().min(1, 'translation cannot be empty'),
  level: z.string().optional().default('B1'),
  source_feature: z.string().default('analyzer')
}).refine(data => Boolean(data.english_word?.trim() || data.word?.trim()), {
  message: 'Word is required'
});

// GET /api/saved-words?telegram_id=12345
router.get('/', async (req, res) => {
  try {
    const telegramIdStr = req.query.telegram_id as string;
    if (!telegramIdStr) {
      return res.status(400).json({ error: 'telegram_id query parameter is required' });
    }

    const telegramId = Number(telegramIdStr);
    if (!Number.isFinite(telegramId) || isNaN(telegramId)) {
      return res.status(400).json({ error: 'Invalid telegram_id' });
    }

    const result = await db.execute({
      sql: `
        SELECT id, telegram_id, COALESCE(english_word, word) as english_word, translation, COALESCE(level, 'B1') as level, source_feature, created_at 
        FROM user_saved_words 
        WHERE telegram_id = ? 
        ORDER BY id DESC
      `,
      args: [telegramId]
    });

    const savedWords = result.rows.map((row: any) => ({
      id: Number(row.id),
      telegram_id: Number(row.telegram_id),
      english_word: String(row.english_word || row.word || ''),
      translation: String(row.translation || ''),
      level: String(row.level || 'B1'),
      source_feature: String(row.source_feature || 'manual'),
      created_at: String(row.created_at || '')
    }));

    res.json({
      success: true,
      count: savedWords.length,
      words: savedWords
    });
  } catch (error) {
    logger.error('Error fetching user saved words', { error });
    res.status(500).json({ error: 'Failed to fetch saved words' });
  }
});

// POST /api/saved-words
router.post('/', async (req, res) => {
  try {
    const data = saveWordSchema.parse(req.body);
    const cleanWord = (data.english_word || data.word || '').trim();
    const cleanTrans = data.translation.trim();
    const cleanLevel = (data.level || 'B1').trim() || 'B1';

    if (!cleanWord || !cleanTrans) {
      return res.status(400).json({ error: 'Word and translation cannot be empty' });
    }

    // Check if word already saved for this specific user
    const existing = await db.execute({
      sql: `SELECT id FROM user_saved_words WHERE telegram_id = ? AND LOWER(COALESCE(english_word, word)) = LOWER(?)`,
      args: [data.telegram_id, cleanWord]
    });

    if (existing.rows.length > 0) {
      // Update existing record
      await db.execute({
        sql: `UPDATE user_saved_words SET word = ?, english_word = ?, translation = ?, level = ?, source_feature = ?, created_at = CURRENT_TIMESTAMP WHERE telegram_id = ? AND LOWER(COALESCE(english_word, word)) = LOWER(?)`,
        args: [cleanWord, cleanWord, cleanTrans, cleanLevel, data.source_feature, data.telegram_id, cleanWord]
      });
      return res.json({ success: true, updated: true, message: 'Word translation updated in saved vocabulary' });
    }

    // Set both word and english_word and level for Turso schema compatibility
    const result = await db.execute({
      sql: `INSERT INTO user_saved_words (telegram_id, word, english_word, translation, level, source_feature) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [data.telegram_id, cleanWord, cleanWord, cleanTrans, cleanLevel, data.source_feature]
    });

    res.json({
      success: true,
      created: true,
      id: Number(result.lastInsertRowid)
    });
  } catch (error: any) {
    logger.error('Error saving word to user_saved_words', { error: error?.message || error });
    res.status(400).json({ error: error?.message || 'Failed to save word' });
  }
});

// DELETE /api/saved-words/:id?telegram_id=12345 or POST /api/saved-words/:id/delete
const handleDeleteWord = async (req: express.Request, res: express.Response) => {
  try {
    const wordId = Number(req.params.id || req.body?.id);
    const rawTelegramId = req.query.telegram_id ?? req.body?.telegram_id;

    if (!wordId || isNaN(wordId)) {
      return res.status(400).json({ error: 'Invalid or missing word id' });
    }

    if (rawTelegramId === undefined || rawTelegramId === null || rawTelegramId === '') {
      return res.status(400).json({ error: 'telegram_id is required for deletion' });
    }

    const telegramId = Number(rawTelegramId);
    if (!Number.isFinite(telegramId) || isNaN(telegramId)) {
      return res.status(400).json({ error: 'Invalid telegram_id' });
    }

    // Strict ownership enforcement: DELETE scoped strictly by both id AND telegram_id
    const result = await db.execute({
      sql: `DELETE FROM user_saved_words WHERE id = ? AND telegram_id = ?`,
      args: [wordId, telegramId]
    });

    if (!result.rowsAffected || result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Saved word not found or not owned by user' });
    }

    logger.info('Deleted saved word', { wordId, telegramId, rowsAffected: result.rowsAffected });

    res.json({
      success: true,
      deleted: true,
      id: wordId,
      message: 'Word deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting saved word', { error });
    res.status(500).json({ error: 'Failed to delete saved word' });
  }
};

router.delete('/:id', handleDeleteWord);
router.post('/:id/delete', handleDeleteWord);
router.post('/delete/:id', handleDeleteWord);

export const savedWordsRouter = router;
