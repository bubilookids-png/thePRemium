import { Router, Request, Response } from 'express';
import { verifyTelegramAuth, saveOrUpdateUser, getTopUsers } from '../services/telegramAuthService.js';

const router = Router();

// Telegram Login orqali kirganda tekshirib bazaga saqlash
router.post('/telegram', (req: Request, res: Response) => {
  try {
    const telegramData = req.body;

    if (!telegramData || !telegramData.hash || !telegramData.id) {
      return res.status(400).json({ success: false, message: "Ma'lumotlar to'liq emas!" });
    }

    // 1. Haqiqiyligini tekshiramiz
    const isValid = verifyTelegramAuth(telegramData);
    if (!isValid) {
      return res.status(401).json({ success: false, message: "Telegram tekshiruvi muvaffaqiyatsiz bo'ldi! Soxta ma'lumot." });
    }

    // 2. Bazaga yozamiz
    const user = saveOrUpdateUser(telegramData);

    return res.json({
      success: true,
      message: 'Muvaffaqiyatli kirildi!',
      user
    });
  } catch (error: any) {
    console.error('Auth error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Eng aktiv foydalanuvchilar ro'yxati (Leaderboard)
router.get('/leaderboard', (_req: Request, res: Response) => {
  try {
    const leaders = getTopUsers(10);
    return res.json({ success: true, leaders });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;