import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import { pendingSessions } from '../services/telegramBotAuth.js';
import { getTopUsers } from '../services/telegramAuthService.js';
import { generateAuthToken, requireAuth, type AuthenticatedRequest } from '../utils/auth.js';

const router = Router();

const checkSessionLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 90,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many status check requests. Please slow down.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many authentication attempts. Please try again later.' }
});

// GET /api/auth/session - Generate a cryptographically secure random session token
router.get('/session', authLimiter, (_req: Request, res: Response) => {
  const token = 'auth_' + crypto.randomBytes(32).toString('hex');
  pendingSessions.set(token, { user: null, createdAt: Date.now() });

  return res.json({ success: true, token });
});

// GET /api/auth/check-session/:token - Verify login and issue cryptographically signed JWT
router.get('/check-session/:token', checkSessionLimiter, (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token || typeof token !== 'string' || !token.match(/^auth_[a-f0-9]{64}$/i)) {
    return res.status(400).json({ success: false, authenticated: false, error: 'Invalid token format' });
  }

  const session = pendingSessions.get(String(token));

  if (session && session.user) {
    const rawUser = session.user;
    const adminTelegramId = process.env.ADMIN_TELEGRAM_ID
      ? Number(process.env.ADMIN_TELEGRAM_ID)
      : 7462228079;

    const isAdmin = Number(rawUser.telegram_id) === adminTelegramId || Boolean(rawUser.is_admin);
    const isPremium = isAdmin || Boolean(rawUser.is_premium);

    const userPayload = {
      telegram_id: Number(rawUser.telegram_id),
      first_name: String(rawUser.first_name || 'User'),
      username: rawUser.username ? String(rawUser.username) : null,
      is_admin: isAdmin,
      is_premium: isPremium
    };

    // Issue signed JWT token
    const authToken = generateAuthToken(userPayload);

    // Multi-device & redirect grace period: allow 60 seconds before hard deletion
    // so both tab polling and Telegram redirect links can successfully authenticate
    if (!session.consumedAt) {
      session.consumedAt = Date.now();
    } else if (Date.now() - session.consumedAt > 60000) {
      pendingSessions.delete(String(token));
      return res.json({ success: true, authenticated: false, error: 'Session expired' });
    }

    console.log(`✅ Front-end authenticated! User: ${userPayload.telegram_id}, Admin: ${isAdmin}, Premium: ${isPremium}`);

    return res.json({
      success: true,
      authenticated: true,
      authToken,
      user: {
        id: userPayload.telegram_id,
        first_name: userPayload.first_name,
        last_name: rawUser.last_name || null,
        username: userPayload.username,
        photo_url: rawUser.photo_url || null,
        is_admin: userPayload.is_admin,
        is_premium: userPayload.is_premium
      }
    });
  }

  return res.json({ success: true, authenticated: false });
});

// GET /api/auth/me - Verify current session token on client startup
router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    user: req.user
  });
});

// GET /api/auth/leaderboard
router.get('/leaderboard', rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false
}), async (_req: Request, res: Response) => {
  try {
    const leaders = await getTopUsers(10);
    return res.json({ success: true, leaders });
  } catch (error: any) {
    console.error('Leaderboard error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
