import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { analyzeWordService } from '../services/analyzeService.js';
import { isLikelyValidTerm, normalizeTerm } from '../utils/validate.js';
import { incrementUserSearch } from '../services/telegramAuthService.js';
import { optionalAuth, type AuthenticatedRequest } from '../utils/auth.js';
import { db } from '../db/database.js';

export const analyzeRouter = Router();

// Secure rate limiter using Express's trusted req.ip (immune to X-Forwarded-For spoofing)
const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30, // Max 30 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many analysis requests. Please wait a moment and try again.'
  }
});

// Daily quota tracking for unauthenticated guests by client IP
const guestDailyQuota = new Map<string, { count: number; date: string }>();

function checkGuestQuota(ip: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  const record = guestDailyQuota.get(ip);

  if (!record || record.date !== today) {
    guestDailyQuota.set(ip, { count: 1, date: today });
    return true;
  }

  if (record.count >= 30) {
    return false; // Quota exceeded for guest
  }

  record.count += 1;
  return true;
}

// Clean up expired guest quota records daily
setInterval(() => {
  const today = new Date().toISOString().slice(0, 10);
  for (const [ip, record] of guestDailyQuota.entries()) {
    if (record.date !== today) {
      guestDailyQuota.delete(ip);
    }
  }
}, 3600 * 1000);

const bodySchema = z.object({
  word: z.string().min(1).max(80),
  targetLanguage: z.object({
    code: z.string().min(1).max(12),
    label: z.string().min(1).max(40)
  }),
  telegramId: z.number().optional()
});

analyzeRouter.post('/', analyzeLimiter, optionalAuth, async (req: AuthenticatedRequest, res) => {
  const clientBotSignal = req.headers['x-client-bot-signal'];
  if (clientBotSignal) {
    console.warn(`[Telemetry] Client reported bot signal: ${clientBotSignal} for IP ${req.ip}`);
  }

  const parsed = bodySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid request',
      details: parsed.error.issues
    });
  }

  const term = normalizeTerm(parsed.data.word);
  if (!isLikelyValidTerm(term)) {
    return res.status(400).json({
      error: 'Invalid word/term. Use letters, spaces, apostrophes, and hyphens (max 3 words).'
    });
  }

  // --- Quota Enforcement to Protect AI APIs from Resource Exhaustion ---
  const currentUser = req.user;
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

  if (!currentUser) {
    // Guest user: max 30 searches per day per IP
    const allowed = checkGuestQuota(clientIp);
    if (!allowed) {
      return res.status(429).json({
        error: 'Mehmonlar uchun kunlik 30 ta qidiruv limiti tugadi. Davom etish uchun bepul Telegram orqali kiring.',
        limitExceeded: true,
        isGuest: true
      });
    }
  } else {
    // Authenticated user quota verification
    try {
      const userRes = await db.execute({
        sql: 'SELECT search_count, is_premium FROM users WHERE telegram_id = ? LIMIT 1',
        args: [currentUser.telegram_id]
      });

      const userRow = userRes.rows[0] as any;
      const isPremium = currentUser.is_premium || Boolean(userRow?.is_premium);
      const searchCount = Number(userRow?.search_count || 0);
      const maxLimit = isPremium ? 400 : 100;

      if (!isPremium && searchCount >= maxLimit) {
        return res.status(429).json({
          error: `Kunlik ${maxLimit} ta bepul qidiruv limiti tugadi. Ertaga yangilanadi.`,
          limitExceeded: true,
          isPremium: false
        });
      }
    } catch (quotaErr) {
      console.warn('Quota check fallback:', quotaErr);
    }
  }

  try {
    const result = await analyzeWordService({
      word: term,
      targetLanguage: parsed.data.targetLanguage
    });

    // Ensure the "analysis.word" reflects normalized term
    result.analysis.word = term;

    // Increment user search count if logged in
    const activeTelegramId = currentUser?.telegram_id ?? parsed.data.telegramId;
    if (activeTelegramId) {
      try {
        await incrementUserSearch(activeTelegramId);
      } catch (countErr) {
        console.error('User qidiruv sonini oshirishda xatolik:', countErr);
      }
    }

    return res.json(result);
  } catch (err: any) {
    console.error('Analyze service error:', err);
    return res.status(500).json({
      error: 'Server error while analyzing the word. Please try again.'
    });
  }
});
