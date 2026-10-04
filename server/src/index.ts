import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { analyzeRouter } from './routes/analyze.js';
import authRoutes from './routes/authRoutes.js';
import { readingRouter } from './routes/readingRoutes.js';

import { logger } from './utils/logger.js';
import { initDatabase } from './db/database.js';

import { startTelegramBot } from './services/telegramBotAuth.js';

dotenv.config();

const app = express();

const PORT = Number(
  process.env.PORT || 8787
);

const CLIENT_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174', // Fallback for Vite dev server when 5173 is in use

  // Current production frontend
  'https://univebooster.vercel.app',

  // Previous frontend
  'https://vacabbro.vercel.app',

  // Vercel preview
  'https://vacabbro-emub4pfr9-meonly24.vercel.app'
];

/*
 * ============================================================
 * BASIC APP CONFIG
 * ============================================================
 */

app.set('trust proxy', 1);

app.use(
  express.json({
    limit: '64kb'
  })
);

/*
 * ============================================================
 * SECURITY HEADERS (Helmet)
 * ============================================================
 */

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.telegram.org'],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    xssFilter: true,
    frameguard: { action: 'deny' }
  })
);

/*
 * ============================================================
 * CORS
 * ============================================================
 */

app.use(
  cors({
    origin: (origin, callback) => {

      /*
       * Allow requests without an Origin header.
       * This is useful for Postman, server-side requests,
       * and some mobile clients.
       */
      if (
        !origin ||
        CLIENT_ORIGINS.includes(origin)
      ) {
        callback(null, true);
        return;
      }

      callback(
        new Error('Not allowed by CORS')
      );
    },

    methods: [
      'POST',
      'GET',
      'OPTIONS'
    ],

    allowedHeaders: [
      'Content-Type'
    ],

    credentials: true,
    maxAge: 86400 // 24 hours
  })
);

/*
 * ============================================================
 * RATE LIMIT (Global)
 * ============================================================
 */

app.use(
  rateLimit({
    windowMs: 60_000, // 1 minute

    limit: 100, // 100 requests per minute per IP

    standardHeaders: 'draft-7',

    legacyHeaders: false,

    message: 'Too many requests from this IP, please try again later.',

    keyGenerator: (req) => {
      // Use X-Forwarded-For header if behind proxy
      return (req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || 'unknown') as string;
    }
  })
);

/*
 * ============================================================
 * HEALTH CHECK
 * ============================================================
 */

app.get(
  '/api/health',
  (_req, res) => {
    res.json({
      ok: true
    });
  }
);

/*
 * ============================================================
 * API ROUTES
 * ============================================================
 */

app.use(
  '/api/analyze',
  analyzeRouter
);

app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/api/reading',
  readingRouter
);

/*
 * ============================================================
 * 404
 * ============================================================
 */

app.use(
  (_req, res) => {
    res.status(404).json({
      error: 'Not found'
    });
  }
);

/*
 * ============================================================
 * ERROR HANDLER
 * ============================================================
 */

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error:', {
    message: err.message,
    code: err.code
  });

  // Never expose internal error details in production
  const isDev = process.env.NODE_ENV === 'development';
  const message = isDev ? err.message : 'Internal server error';

  res.status(err.status || 500).json({
    error: message
  });
});

/*
 * ============================================================
 * SERVER STARTUP
 * ============================================================
 *
 * IMPORTANT:
 *
 * Database initialization happens BEFORE the server starts
 * accepting requests.
 *
 * This guarantees that:
 *
 *   Turso connection
 *        ↓
 *   table/migrations
 *        ↓
 *   server
 *
 * are initialized in the correct order.
 * ============================================================
 */

async function startServer() {

  try {

    /*
     * Initialize database first.
     *
     * This also runs the new migrations for:
     * - usage
     * - common_mistakes
     * - created_at
     * - updated_at
     */
    await initDatabase();

    logger.info(
      '✅ Database initialized successfully.'
    );

  } catch (err) {

    logger.error(
      '❌ Database initialization failed.',
      {
        error:
          err instanceof Error
            ? err.message
            : String(err)
      }
    );

    /*
     * Do NOT start the API if the database
     * could not initialize correctly.
     *
     * Otherwise /api/analyze could start receiving
     * requests while the database is unavailable.
     */
    process.exit(1);
  }

  /*
   * ==========================================================
   * START HTTP SERVER
   * ==========================================================
   */

  app.listen(
    PORT,
    '0.0.0.0',
    async () => {

      logger.info(
        `🚀 Server running on port ${PORT}`
      );

      logger.info(
        `🌐 CORS allowed origins: ${CLIENT_ORIGINS.join(', ')}`
      );

      /*
       * ========================================================
       * TELEGRAM BOT
       * ========================================================
       */

      try {

        await startTelegramBot();

        logger.info(
          '🤖 Telegram bot started successfully.'
        );

      } catch (err) {

        logger.error(
          '❌ Telegram bot start error.',
          {
            error:
              err instanceof Error
                ? err.message
                : String(err)
          }
        );
      }
    }
  );
}

/*
 * ============================================================
 * BOOT
 * ============================================================
 */

startServer();