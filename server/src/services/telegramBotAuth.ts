import { Bot, InlineKeyboard } from 'grammy';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('dictionary.db');
const db = new (Database as any)(dbPath);

// Sizning Telegram ID raqamingiz (Admin Guard)
const ADMIN_ID = 7462228079;

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
    await ctx.reply("Salom! Vacabbro'ga xush kelibsiz. Sayt orqali tizimga kiring.");
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

// Admin Menyu Klavishi
const adminKeyboard = new InlineKeyboard()
  .text('📊 Umumiy Statistika', 'admin_stats')
  .row()
  .text('🏆 Top 10 Foydalanuvchilar', 'admin_top')
  .row()
  .text('👥 So‘nggi kirganlar (5 ta)', 'admin_recent')
  .row()
  .text('🔄 Yangilash', 'admin_refresh');

// /admin buyrug'i (faqat sizga ishlaydi)
bot.command('admin', async (ctx) => {
  if (ctx.from?.id !== ADMIN_ID) {
    // Begonalarga hech narsa bildirmaymiz
    return;
  }

  await ctx.reply(
    "👑 *Vacabbro Boshqaruv Paneli*\nKerakli bo‘limni tanlang:",
    {
      parse_mode: 'Markdown',
      reply_markup: adminKeyboard
    }
  );
});

// Admin tugmalarini boshqarish
bot.callbackQuery('admin_stats', async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.answerCallbackQuery();

  const totalUsersRow = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  const totalSearchesRow = db.prepare('SELECT SUM(search_count) as total FROM users').get() as { total: number | null };

  const totalUsers = totalUsersRow?.count || 0;
  const totalSearches = totalSearchesRow?.total || 0;

  const text = `📊 *Umumiy Statistika:*\n\n` +
               `👥 Jami foydalanuvchilar: *${totalUsers}*\n` +
               `🔍 Jami qidiruvlar soni: *${totalSearches}*\n` +
               `⚡ O‘rtacha har bir userga: *${totalUsers > 0 ? (totalSearches / totalUsers).toFixed(1) : 0}* ta so‘z`;

  await ctx.editMessageText(text, {
    parse_mode: 'Markdown',
    reply_markup: adminKeyboard
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('admin_top', async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.answerCallbackQuery();

  const topUsers = db.prepare(`
    SELECT first_name, username, search_count 
    FROM users 
    ORDER BY search_count DESC 
    LIMIT 10
  `).all() as Array<{ first_name: string; username: string | null; search_count: number }>;

  let text = `🏆 *Top 10 Faol Foydalanuvchilar:*\n\n`;
  if (topUsers.length === 0) {
    text += "_Hozircha foydalanuvchilar yo‘q._";
  } else {
    topUsers.forEach((u, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
      const uname = u.username ? `(@${u.username})` : '';
      text += `${medal} *${u.first_name}* ${uname} — *${u.search_count || 0}* ta so‘z\n`;
    });
  }

  await ctx.editMessageText(text, {
    parse_mode: 'Markdown',
    reply_markup: adminKeyboard
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('admin_recent', async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.answerCallbackQuery();

  const recentUsers = db.prepare(`
    SELECT first_name, username, created_at 
    FROM users 
    ORDER BY id DESC 
    LIMIT 5
  `).all() as Array<{ first_name: string; username: string | null; created_at: string }>;

  let text = `👥 *So‘nggi 5 ta foydalanuvchi:*\n\n`;
  if (recentUsers.length === 0) {
    text += "_Hozircha foydalanuvchilar yo‘q._";
  } else {
    recentUsers.forEach((u, i) => {
      const uname = u.username ? `(@${u.username})` : '';
      text += `${i + 1}. *${u.first_name}* ${uname}\n`;
    });
  }

  await ctx.editMessageText(text, {
    parse_mode: 'Markdown',
    reply_markup: adminKeyboard
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('admin_refresh', async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.answerCallbackQuery();

  await ctx.editMessageText("👑 *Vacabbro Boshqaruv Paneli*\nMa'lumotlar yangilandi. Bo‘limni tanlang:", {
    parse_mode: 'Markdown',
    reply_markup: adminKeyboard
  });
  await ctx.answerCallbackQuery({ text: 'Yangilandi! ⚡' });
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