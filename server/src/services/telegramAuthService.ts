import crypto from 'crypto';
import { db } from '../db/database';

export interface TelegramUserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

// 1. Telegram ma'lumotlarini rasmiy kriptografik tekshirish
export function verifyTelegramAuth(data: TelegramUserData): boolean {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    throw new Error('TELEGRAM_BOT_TOKEN .env faylida topilmadi!');
  }

  const { hash, ...rest } = data;

  const checkString = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${(rest as any)[key]}`)
    .join('\n');

  const secretKey = crypto.createHash('sha256').update(botToken).digest();

  const hmac = crypto
    .createHmac('sha256', secretKey)
    .update(checkString)
    .digest('hex');

  return hmac === hash;
}

// 2. Foydalanuvchini Turso bazasiga saqlash yoki yangilash
export async function saveOrUpdateUser(user: TelegramUserData) {
  await db.execute({
    sql: `
      INSERT INTO users (telegram_id, first_name, last_name, username, photo_url, last_active)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(telegram_id) DO UPDATE SET
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        username = excluded.username,
        photo_url = excluded.photo_url,
        last_active = CURRENT_TIMESTAMP
    `,
    args: [
      user.id,
      user.first_name || '',
      user.last_name || null,
      user.username || null,
      user.photo_url || null,
    ],
  });

  const res = await db.execute({
    sql: 'SELECT * FROM users WHERE telegram_id = ? LIMIT 1',
    args: [user.id],
  });

  return res.rows[0];
}

// 3. User so'z qidirganda uning qidiruv hisoblagichini +1 qilish
export async function incrementUserSearch(telegramId: number) {
  await db.execute({
    sql: `
      UPDATE users 
      SET search_count = search_count + 1, last_active = CURRENT_TIMESTAMP
      WHERE telegram_id = ?
    `,
    args: [telegramId],
  });
}

// 4. Eng aktiv foydalanuvchilar (Leaderboard)
export async function getTopUsers(limit = 10) {
  const res = await db.execute({
    sql: 'SELECT telegram_id, first_name, username, photo_url, search_count FROM users ORDER BY search_count DESC LIMIT ?',
    args: [limit],
  });
  return res.rows;
}