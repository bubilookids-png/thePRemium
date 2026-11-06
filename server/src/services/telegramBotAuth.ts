import crypto from 'crypto';
import { Bot } from 'grammy';
import { db } from '../db/database.js';

const ADMIN_ID = process.env.ADMIN_TELEGRAM_ID
  ? Number(process.env.ADMIN_TELEGRAM_ID)
  : null;

const botToken = process.env.TELEGRAM_BOT_TOKEN;
export const bot = new Bot(botToken || 'dummy_token');

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

// In-memory map for one-time pending login sessions
export const pendingSessions = new Map<string, { user: any | null; createdAt: number; consumedAt?: number }>();

// Periodic cleanup of expired pending sessions (prevents memory leak)
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of pendingSessions.entries()) {
    if (now - session.createdAt > SESSION_TIMEOUT || (session.consumedAt && now - session.consumedAt > 60000)) {
      pendingSessions.delete(token);
    }
  }
}, 60 * 1000);

async function handleUserAuth(ctx: any) {
  const text = ctx.message?.text || '';
  const parts = text.split(' ');
  let payload = (parts[1] || ctx.match || '').trim();

  if (!payload && Array.isArray((ctx as any).args) && (ctx as any).args.length > 0) {
    payload = String((ctx as any).args[0]).trim();
  }

  const tgUser = ctx.from;
  if (!tgUser) return;

  // Strict check if incoming payload matches an existing waiting web session
  const isWebSessionToken = Boolean(
    payload &&
    payload.startsWith('auth_') &&
    payload.match(/^auth_[a-f0-9]{64}$/i) &&
    pendingSessions.has(payload)
  );

  // If payload is valid from web session, bind to it.
  // If user started bot without payload (e.g. typed /start manually), generate a fresh
  // cryptographically secure 256-bit token for this specific Telegram user.
  // This is 100% immune to session hijacking because the token is delivered only to this user's private chat!
  const finalToken = isWebSessionToken
    ? payload
    : ('auth_' + crypto.randomBytes(32).toString('hex'));

  console.log(`📨 Auth request received from user: ${tgUser.id} (${tgUser.first_name}), isWebSession: ${isWebSessionToken}`);

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

    // Bind authenticated user to token
    pendingSessions.set(finalToken, {
      user: {
        ...savedUser,
        is_admin: isAdminUser
      },
      createdAt: Date.now()
    });

    console.log(`✅ Session muvaffaqiyatli bog'landi! User: ${tgUser.id}, Token: ${finalToken}`);

    // Send direct one-click login button to the user's private Telegram chat
    await ctx.reply(
      `🎉 Assalomu alaykum, ${tgUser.first_name || 'foydalanuvchi'}!\n\n` +
      `✅ Hisobingiz muvaffaqiyatli tayyorlandi!\n` +
      `UniveBooster platformasiga 1 ta bosishda kirish uchun quyidagi tugmani bosing:`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 Saytga kirish (UniveBooster)',
                url: `https://univebooster.vercel.app/?auth_token=${finalToken}`
              }
            ]
          ]
        }
      }
    );
  } catch (dbErr) {
    console.error('DB error:', dbErr);
    await ctx.reply('Xatolik yuz berdi. Qaytadan urinib ko‘ring.');
  }
}

bot.command(['start', 'login'], handleUserAuth);

bot.on('message:text', async (ctx, next) => {
  const text = (ctx.message?.text || '').toLowerCase().trim();
  if (text === 'login' || text === 'kirish' || text === 'saytga kirish') {
    return handleUserAuth(ctx);
  }
  return next();
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
      onStart: async (info) => {
        console.log(`✅ Telegram Bot started successfully: @${info.username}`);
        try {
          await bot.api.setMyCommands([
            { command: 'start', description: 'Saytga kirish tugmasini olish' },
            { command: 'login', description: 'Saytga kirish havolasi' }
          ]);
        } catch (e) {
          console.warn('Failed to set bot commands:', e);
        }
      },
    });
  } catch (err: any) {
    console.error('❌ Bot start error:', err.message || err);
    botStarted = false;
  }
}
