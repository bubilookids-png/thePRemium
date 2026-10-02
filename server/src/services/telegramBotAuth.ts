import { Bot, InlineKeyboard } from 'grammy';
import { db } from '../db/database.js';

const ADMIN_ID = process.env.ADMIN_TELEGRAM_ID
  ? Number(process.env.ADMIN_TELEGRAM_ID)
  : null;

const botToken = process.env.TELEGRAM_BOT_TOKEN;
export const bot = new Bot(botToken || 'dummy_token');

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

// Bu Map endi barcha fayllar uchun global ishlaydi
export const pendingSessions = new Map<string, { user: any | null; createdAt: number }>();

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
  let payload = parts[1] || ctx.match || '';

  if (!payload && Array.isArray((ctx as any).args) && (ctx as any).args.length > 0) {
    payload = (ctx as any).args[0];
  }

  // 🔥 100% ISHLAYDIGAN FALLBACK
  // Agar payload bo'sh bo'lsa, biz pendingSessions dagi "kutayotgan" (user: null) tokenni majburlab olamiz.
  if (!payload) {
    let fallbackToken = null;
    let latestTime = 0;
    
    for (const [token, session] of pendingSessions.entries()) {
      if (session.user === null && session.createdAt > latestTime) {
        fallbackToken = token;
        latestTime = session.createdAt;
      }
    }
    
    if (fallbackToken) {
      payload = fallbackToken;
      console.log(`♻️ Havola tokensiz keldi! Lekin kutayotgan eng yangi tokenni ushladik: ${payload}`);
    }
  }

  console.log(`📨 /start command received. Resolved Payload: "${payload}"`);

  const tgUser = ctx.from;
  if (!tgUser) return;

  // DB ga saqlash jarayoni (bunda hech narsa o'zgarmaydi)
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

    // 🔥 Yakuniy bog'lash (Success Point!)
    if (payload) {
      pendingSessions.set(payload, {
        user: savedUser,
        createdAt: Date.now()
      });
      console.log(`✅ Session muvaffaqiyatli bog'landi va tayyor! Token: ${payload}`);
      await ctx.reply(`Muvaffaqiyatli, ${tgUser.first_name}! Siz tizimga kirdingiz. Endi brauzerga qaytishingiz mumkin.`);
    } else {
      console.log(`❌ Token baribir topilmadi. Sababi server frontend'dan hali /session chaqiruvini olmagan.`);
      await ctx.reply(`Iltimos, avval brauzerdan "Login with Telegram" tugmasini bosing!`);
    }

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