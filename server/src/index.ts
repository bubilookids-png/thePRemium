import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { analyzeRouter } from './routes/analyze.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT || 8787);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.set('trust proxy', 1);

app.use(helmet());
app.use(express.json({ limit: '64kb' }));

app.use(
  cors({
    origin: CLIENT_ORIGIN,
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

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`CORS allowed origin: ${CLIENT_ORIGIN}`);
});
