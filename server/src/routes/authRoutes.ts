import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import { checkAuthSession } from '../services/telegramBotAuth.js';
import { getTopUsers } from '../services/telegramAuthService.js';

const router = Router();

// Relaxed rate limiting for check-session (polling endpoint)
const checkSessionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 60, // 60 requests per minute (1 per second is fine for polling)
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' },
  skip: (req) => req.method === 'GET',
  keyGenerator: (req) => {
    return (req.ip || req.socket.remoteAddress || 'unknown') as string;
  }
});

// Strict rate limiting for authentication endpoints (get session)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many authentication attempts. Please try again later.' },
  keyGenerator: (req) => {
    return (req.ip || req.socket.remoteAddress || 'unknown') as string;
  }
});

// Session endpoint: Generate new auth token (32 bytes = 256 bits of entropy)
router.get('/session', authLimiter, (_req: Request, res: Response) => {
  const token = 'auth_' + crypto.randomBytes(32).toString('hex');
  return res.json({ success: true, token });
});

// Check session endpoint with strict validation
router.get('/check-session/:token', checkSessionLimiter, (req: Request, res: Response) => {
  const { token } = req.params;

  // Validate token format: must start with 'auth_' and be exactly 80 chars (auth_ + 64 hex chars)
  if (!token || typeof token !== 'string' || !token.match(/^auth_[a-f0-9]{64}$/i)) {
    console.log(`❌ Invalid token format: ${token}`);
    return res.status(400).json({ success: false, authenticated: false, error: 'Invalid token format' });
  }

  console.log(`🔍 Checking session for token: ${token}`);
  const user = checkAuthSession(String(token));

  if (user) {
    console.log(`✅ Session found! User: ${user.telegram_id}`);
    return res.json({ success: true, authenticated: true, user });
  }

  console.log(`⚠️ No session found for token: ${token}`);
  return res.json({ success: true, authenticated: false });
});

// Leaderboard (public endpoint, but rate limited)
router.get('/leaderboard', rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 30, // 30 requests per minute
  standardHeaders: true,
  legacyHeaders: false
}), (_req: Request, res: Response) => {
  try {
    const leaders = getTopUsers(10);
    return res.json({ success: true, leaders });
  } catch (error: any) {
    console.error('Leaderboard error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;