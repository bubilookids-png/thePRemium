import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import { checkAuthSession } from '../services/telegramBotAuth.js';
import { getTopUsers } from '../services/telegramAuthService.js';

const router = Router();

// Strict rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts. Please try again later.',
  keyGenerator: (req) => {
    // Rate limit by IP address
    return (req.ip || req.socket.remoteAddress || 'unknown') as string;
  }
});

// Session endpoint: Generate new auth token (16 bytes = 128 bits of entropy)
router.get('/session', authLimiter, (_req: Request, res: Response) => {
  const token = 'auth_' + crypto.randomBytes(16).toString('hex');
  return res.json({ success: true, token });
});

// Check session endpoint with strict validation
router.get('/check-session/:token', authLimiter, (req: Request, res: Response) => {
  const { token } = req.params;

  // Validate token format: must start with 'auth_' and be exactly 80 chars (auth_ + 64 hex chars)
  if (!token || typeof token !== 'string' || !token.match(/^auth_[a-f0-9]{64}$/i)) {
    return res.status(400).json({ success: false, error: 'Invalid token format' });
  }

  const user = checkAuthSession(String(token));

  if (user) {
    return res.json({ success: true, authenticated: true, user });
  }

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