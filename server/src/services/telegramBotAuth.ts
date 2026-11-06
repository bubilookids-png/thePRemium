import { Bot } from 'grammy';
import { db } from '../db/database.js';

const ADMIN_ID = process.env.ADMIN_TELEGRAM_ID
  ? Number(process.env.ADMIN_TELEGRAM_ID)
  : null;

const botToken = process.env.TELEGRAM_BOT_TOKEN;
export const bot = new Bot(botToken || 'dummy_token');

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

// In-memory map for one-time pending login sessions
export const pendingSessions = new Map<string, { user: any | null; createdAt: number }>();

// Periodic cleanup of expired pending sessions (prevents memory leak)
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of pendingSessions.entries()) {
    if (now - session.createdAt > SESSION_TIMEOUT) {
      pendingSessions.delete(token);
    }
  }
}, 60 * 1000);

bot.command('start', async (ctx) => {
  const text = ctx.message?.text || '';
  const parts = text.split(' ');
  let payload = (parts[1] || ctx.match || '').trim();

  if (!payload && Array.isArray((ctx as any).args) && (ctx as any).args.length > 0) {
    payload = String((ctx as any).args[0]).trim();
  }

  const tgUser = ctx.from;
  if (!tgUser) return;

  // Strict Token Validation - Prevents Session Hijacking
  const isValidSessionToken = Boolean(
    payload &&
    payload.startsWith('auth_') &&
    payload.match(/^auth_[a-f0-9]{64}$/i) &&
    pendingSessions.has(payload)
  );

  // If user opened bot without a valid session token, NEVER bind randomly!
  if (!isValidSessionToken) {
    await ctx.reply(
      `👋 Assalomu alaykum, ${tgUser.first_name || 'foydalanuvchi'}!\n\n` +
      `🌐 UniveBooster saytiga hisobingizni xavfsiz ulash uchun:\n` +
      `1. https://univebooster.vercel.app saytiga kiring\n` +
      `2. "Sync via Telegram" tugmasini bosing\n` +
      `3. Botga keladigan shaxsiy xavfsiz havola orqali kiring.`
    );
    return;
  }

  console.log(`📨 /start command received with verified auth token: "${payload}" for user: ${tgUser.id}`);

  // Fetch user profile photo safely
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
    console.error('Error getting photo:', e);
  }

  try {
    const isAdminUser = ADMIN_ID !== null && tgUser.id === ADMIN_ID;

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
        tgUser.id,
        tgUser.first_name || '',
        tgUser.last_name || null,
        tgUser.username || null,
        photoUrl,
      ],
    });

    const userRes = await db.execute({
      sql: 'SELECT * FROM users WHERE telegram_id = ? LIMIT 1',
      args: [tgUser.id],
    });

    const savedUser = userRes.rows?.[0];
    if (!savedUser) {
      await ctx.reply('Xatolik yuz berdi. Qaytadan urinib ko‘ring.');
      return;
    }

    // Bind authenticated user to this specific verified token
    pendingSessions.set(payload, {
      user: {
        ...savedUser,
        is_admin: isAdminUser
      },
      createdAt: Date.now()
    });

    console.log(`✅ Session muvaffaqiyatli bog'landi! User: ${tgUser.id}, Token: ${payload}`);
    await ctx.reply(`✅ Muvaffaqiyatli, ${tgUser.first_name}! Hisobingiz saytga ulandi. Endi brauzerga qaytishingiz mumkin.`);
  } catch (dbErr) {
    console.error('DB error:', dbErr);
    await ctx.reply('Xatolik yuz berdi. Qaytadan urinib ko‘ring.');
  }
});

bot.catch((err) => {
  console.error(`Bot error:`, err.error);
});

let botStarted = false;

export async function startTelegramBot() {
  if (!botToken || botStarted) return;
  botStarted = true;
  try {
    await bot.start({
      onStart: (info) => {
        console.log(`✅ Telegram Bot started successfully: @${info.username}`);
      },
    });
  } catch (err: any) {
    console.error('❌ Bot start error:', err.message || err);
    botStarted = false;
  }
}
