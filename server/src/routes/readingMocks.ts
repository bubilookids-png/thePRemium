import { Router } from 'express';
import { db } from '../db/database.js';
import { logger } from '../utils/logger.js';

export const readingMocksRouter = Router();

readingMocksRouter.get('/', async (_req, res) => {
  try {
    const result = await db.execute('SELECT * FROM reading_mocks');
    // Map content back to JSON
    const mocks = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      content: JSON.parse(row.content as string)
    }));

    res.json(mocks);
  } catch (err: any) {
    logger.error(`Failed to fetch reading mocks: ${err.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
