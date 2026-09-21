import { db, initDatabase } from '../db/database.js';
import { logger } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';

async function seedMocks() {
  await initDatabase();

  try {
    const mocksModule = await import('./readingMocksData.js');
    const mocks = mocksModule.readingMocks;

    for (const mock of mocks) {
      await db.execute({
        sql: `INSERT INTO reading_mocks (id, title, content)
              VALUES (?, ?, ?)
              ON CONFLICT(id) DO UPDATE SET title=excluded.title, content=excluded.content`,
        args: [mock.id, mock.title, JSON.stringify(mock)]
      });
      logger.info(`Seeded mock: ${mock.title}`);
    }

    logger.info('Reading mocks seeded successfully!');
  } catch (error: any) {
    logger.error('Failed to seed reading mocks:', error.message);
  }
}

seedMocks();
