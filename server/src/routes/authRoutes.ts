import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { checkAuthSession } from '../services/telegramBotAuth.js';
import { getTopUsers } from '../services/telegramAuthService.js';

const router = Router();

// Frontend uchun yangi login tokeni berish
router.get('/session', (_req: Request, res: Response) => {
  const token = 'auth_' + crypto.randomBytes(8).toString('hex');
  return res.json({ success: true, token });
});

// Frontend sessiya tasdiqlanganini tekshirishi (Polling)
router.get('/check-session/:token', (req: Request, res: Response) => {
  const { token } = req.params;
  const user = checkAuthSession(String(token));

  if (user) {
    return res.json({ success: true, authenticated: true, user });
  }

  return res.json({ success: true, authenticated: false });
});

// Leaderboard
router.get('/leaderboard', (_req: Request, res: Response) => {
  try {
    const leaders = getTopUsers(10);
    return res.json({ success: true, leaders });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;