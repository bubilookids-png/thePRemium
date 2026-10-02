import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import { pendingSessions } from '../services/telegramBotAuth.js';
import { getTopUsers } from '../services/telegramAuthService.js';

const router = Router();

const checkSessionLimiter = rateLimit({
  windowMs: 60 * 1000, 
  limit: 60, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests.' },
  skip: (req) => req.method === 'GET',
  keyGenerator: (req) => (req.ip || req.socket.remoteAddress || 'unknown') as string
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 10, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many authentication attempts.' },
  keyGenerator: (req) => (req.ip || req.socket.remoteAddress || 'unknown') as string
});

// Session endpoint
router.get('/session', authLimiter, (_req: Request, res: Response) => {
  const token = 'auth_' + crypto.randomBytes(32).toString('hex');
  
  // 🔥 BEVOSITA BAZAGA YOZAMIZ (Hech qanday funksiya orqali emas!)
  pendingSessions.set(token, { user: null, createdAt: Date.now() });
  
  console.log(`🔑 New auth session token generated and saved: ${token}`);
  return res.json({ success: true, token });
});

// Check session endpoint
router.get('/check-session/:token', checkSessionLimiter, (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token || typeof token !== 'string' || !token.match(/^auth_[a-f0-9]{64}$/i)) {
    return res.status(400).json({ success: false, authenticated: false, error: 'Invalid token format' });
  }

  // 🔥 BEVOSITA BAZADAN O'QIYMIZ
  const session = pendingSessions.get(String(token));
  
  if (session && session.user) {
    console.log(`✅ Front-end recognized the session! Logged in user: ${session.user.telegram_id}`);
    
    // Foydalanuvchi tasdiqlangach, xavfsizlik uchun tokenni o'chirib yuborish (optional)
    // pendingSessions.delete(String(token)); 
    
    return res.json({ success: true, authenticated: true, user: session.user });
  }

  return res.json({ success: true, authenticated: false });
});

router.get('/leaderboard', rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
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