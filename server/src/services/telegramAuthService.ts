import crypto from 'crypto';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('dictionary.db');
const db = new Database(dbPath);

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

  // Telegram qoidasi: ma'lumotlar alifbo tartibida 'key=value\n' qilib yig'iladi
  const checkString = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${(rest as any)[key]}`)
    .join('\n');

  // Bot tokeni yordamida maxfiy kalit yaratiladi (SHA256)
  const secretKey = crypto.createHash('sha256').update(botToken).digest();

  // HMAC-SHA256 orqali hash hisoblanadi
  const hmac = crypto
    .createHmac('sha256', secretKey)
    .update(checkString)
    .digest('hex');

  // Hisoblangan hash Telegram bergan hash bilan teng bo'lishi shart
  return hmac === hash;
}

// 2. Foydalanuvchini SQLite bazasiga saqlash yoki yangilash
export function saveOrUpdateUser(user: TelegramUserData) {
  const stmt = db.prepare(`
    INSERT INTO users (telegram_id, first_name, last_name, username, photo_url, last_active)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(telegram_id) DO UPDATE SET
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      username = excluded.username,
      photo_url = excluded.photo_url,
      last_active = CURRENT_TIMESTAMP
  `);

  stmt.run(
    user.id,
    user.first_name || '',
    user.last_name || null,
    user.username || null,
    user.photo_url || null
  );

  // Saqlangan userni bazadan qaytarib olamiz
  return db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(user.id);
}

// 3. User so'z qidirganda uning qidiruv hisoblagichini +1 qilish
export function incrementUserSearch(telegramId: number) {
  const stmt = db.prepare(`
    UPDATE users 
    SET search_count = search_count + 1, last_active = CURRENT_TIMESTAMP
    WHERE telegram_id = ?
  `);
  stmt.run(telegramId);
}

// 4. Eng aktiv foydalanuvchilar (Leaderboard)
export function getTopUsers(limit = 10) {
  return db
    .prepare('SELECT telegram_id, first_name, username, photo_url, search_count FROM users ORDER BY search_count DESC LIMIT ?')
    .all(limit);
}