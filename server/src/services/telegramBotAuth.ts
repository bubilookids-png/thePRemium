import { Bot } from 'grammy';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('dictionary.db');
const db = new (Database as any)(dbPath);

const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) {
  console.warn('⚠️ TELEGRAM_BOT_TOKEN .env faylida topilmadi!');
}

export const bot = new Bot(botToken || 'dummy_token');

// Sessiyalarni xotirada saqlash
const pendingSessions = new Map<string, any>();

// /start auth_xxx buyrug'ini ushlash
bot.command('start', async (ctx) => {
  const payload = ctx.match;

  if (!payload || !payload.startsWith('auth_')) {
    await ctx.reply("Salom! Vacabbro'ga xush kelibsiz.");
    return;
  }

  const tgUser = ctx.from;
  if (!tgUser) return;

  let photoUrl: string | null = null;
  try {
    const photos = await ctx.getUserProfilePhotos({ limit: 1 });
    const firstPhoto = photos.photos?.[0]?.[0];
    if (firstPhoto) {
      const file = await ctx.api.getFile(firstPhoto.file_id);
      if (file.file_path) {
        photoUrl = `https://api.telegram.org/file/bot${botToken}/${file.file_path}`;
      }
    }
  } catch (e) {
    console.error('Foto olishda xatolik:', e);
  }

  try {
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
      tgUser.id,
      tgUser.first_name || '',
      tgUser.last_name || null,
      tgUser.username || null,
      photoUrl
    );

    const savedUser = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(tgUser.id);
    pendingSessions.set(payload, savedUser);

    await ctx.reply(`✅ Tabriklaymiz, ${tgUser.first_name}! Saytga muvaffaqiyatli kirdingiz. Brauzerga qaytishingiz mumkin.`);
  } catch (dbErr) {
    console.error('DB xatosi:', dbErr);
  }
});

export function startTelegramBot() {
  if (!botToken) return;
  bot.start({
    onStart: (info) => {
      console.log(`🤖 Telegram Bot ishga tushdi: @${info.username}`);
    }
  }).catch((err) => {
    console.error('Bot ishga tushishda xato:', err.message);
  });
}

export function checkAuthSession(token: string) {
  if (pendingSessions.has(token)) {
    const user = pendingSessions.get(token);
    pendingSessions.delete(token);
    return user;
  }
  return null;
}