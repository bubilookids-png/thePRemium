import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { analyzeRouter } from './routes/analyze.js';
import authRoutes from './routes/authRoutes.js';
import { logger } from './utils/logger.js';
import { initDatabase } from './db/database.js';
import { startTelegramBot } from './services/telegramBotAuth.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8787);

const CLIENT_ORIGINS = [
  'http://localhost:5173',
  'https://vacabbro.vercel.app',
  'https://vacabbro-h8oj4gy7t-meonly24.vercel.app'
];

app.set('trust proxy', 1);
app.use(express.json({ limit: '64kb' }));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || CLIENT_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
  })
);

app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 60,
    standardHeaders: 'draft-7',
    legacyHeaders: false
  })
);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/analyze', analyzeRouter);
app.use('/api/auth', authRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Xavfsiz ishga tushirish (Server qulab tushmasligi uchun)
async function startServer() {
  try {
    await initDatabase();
    logger.info('Database initialized successfully.');
  } catch (err: any) {
    logger.error(`Database initialization error: ${err.message}`);
  }

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`CORS allowed origins: ${CLIENT_ORIGINS.join(', ')}`);
    
    try {
      startTelegramBot();
    } catch (err: any) {
      logger.error(`Telegram bot start error: ${err.message}`);
    }
  });
}

startServer();