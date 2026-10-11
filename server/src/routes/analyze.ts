import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { analyzeWordService } from '../services/analyzeService.js';
import { isLikelyValidTerm, normalizeTerm } from '../utils/validate.js';
import { incrementUserSearch } from '../services/telegramAuthService.js';

export const analyzeRouter = Router();

const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many analysis requests. Please wait a moment and try again.'
  },
  keyGenerator: (req) => (req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || 'unknown') as string
});

const bodySchema = z.object({
  word: z.string().min(1).max(80),
  targetLanguage: z.object({
    code: z.string().min(1).max(12),
    label: z.string().min(1).max(40)
  }),
  telegramId: z.number().optional()
});

analyzeRouter.post('/', analyzeLimiter, async (req, res) => {
  const clientBotSignal = req.headers['x-client-bot-signal'];
  if (clientBotSignal) {
    console.warn(`[Telemetry] Client reported bot signal: ${clientBotSignal} for IP ${req.ip}`);
  }

  console.log('REQUEST BODY:', req.body);

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

  try {
    const result = await analyzeWordService({
      word: term,
      targetLanguage: parsed.data.targetLanguage
    });

    // Ensure the "analysis.word" reflects normalized term (consistency)
    result.analysis.word = term;

    // Agar foydalanuvchi login qilgan bo'lsa, qidiruv sonini +1 qilamiz
    if (parsed.data.telegramId) {
      try {
        incrementUserSearch(parsed.data.telegramId);
      } catch (countErr) {
        console.error("User qidiruv sonini oshirishda xatolik:", countErr);
      }
    }

    console.log('⚡ SERVERDAN CHIQAYOTGAN SOURCE:', result.source, result.sources);

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Server error while analyzing the word. Please try again.'
    });
  }
});