import { Bot, InlineKeyboard } from 'grammy';
import { db } from '../db/database';

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

    const savedUser = userRes.rows[0];
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
    return;
  }

  await ctx.reply(
    "👑 *Vacabbro Boshqaruv Paneli*\nKerakli bo‘limni tanlang:",
    {
      parse_mode: 'Markdown',
      reply_markup: adminKeyboard,
    }
  );
});

// Admin tugmalarini boshqarish
bot.callbackQuery('admin_stats', async (ctx) => {
  if (ctx.from?.id !== ADMIN_ID) return ctx.answerCallbackQuery();

  const totalUsersRes = await db.execute('SELECT COUNT(*) as count FROM users');
  const totalSearchesRes = await db.execute('SELECT SUM(search_count) as total FROM users');

  const totalUsers = Number(totalUsersRes.rows[0]?.count) || 0;
  const totalSearches = Number(totalSearchesRes.rows[0]?.total) || 0;

  const text = `📊 *Umumiy Statistika:*\n\n` +
               `👥 Jami foydalanuvchilar: *${totalUsers}*\n` +
               `🔍 Jami qidiruvlar soni: *${totalSearches}*\n` +
               `⚡ O‘rtacha har bir userga: *${totalUsers > 0 ? (totalSearches / totalUsers).toFixed(1) : 0}* ta so‘z`;

  await ctx.editMessageText(text, {
    parse_mode: 'Markdown',
    reply_markup: adminKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('admin_top', async (ctx) => {
  if (ctx.from?.id !== ADMIN_ID) return ctx.answerCallbackQuery();

  const topUsersRes = await db.execute(`
    SELECT first_name, username, search_count 
    FROM users 
    ORDER BY search_count DESC 
    LIMIT 10
  `);

  const topUsers = topUsersRes.rows;

  let text = `🏆 *Top 10 Faol Foydalanuvchilar:*\n\n`;
  if (topUsers.length === 0) {
    text += "_Hozircha foydalanuvchilar yo‘q._";
  } else {
    topUsers.forEach((u: any, i: number) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
      const uname = u.username ? `(@${u.username})` : '';
      text += `${medal} *${u.first_name}* ${uname} — *${u.search_count || 0}* ta so‘z\n`;
    });
  }

  await ctx.editMessageText(text, {
    parse_mode: 'Markdown',
    reply_markup: adminKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('admin_recent', async (ctx) => {
  if (ctx.from?.id !== ADMIN_ID) return ctx.answerCallbackQuery();

  const recentUsersRes = await db.execute(`
    SELECT first_name, username, created_at 
    FROM users 
    ORDER BY id DESC 
    LIMIT 5
  `);

  const recentUsers = recentUsersRes.rows;

  let text = `👥 *So‘nggi 5 ta foydalanuvchi:*\n\n`;
  if (recentUsers.length === 0) {
    text += "_Hozircha foydalanuvchilar yo‘q._";
  } else {
    recentUsers.forEach((u: any, i: number) => {
      const uname = u.username ? `(@${u.username})` : '';
      text += `${i + 1}. *${u.first_name}* ${uname}\n`;
    });
  }

  await ctx.editMessageText(text, {
    parse_mode: 'Markdown',
    reply_markup: adminKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('admin_refresh', async (ctx) => {
  if (ctx.from?.id !== ADMIN_ID) return ctx.answerCallbackQuery();

  await ctx.editMessageText("👑 *Vacabbro Boshqaruv Paneli*\nMa'lumotlar yangilandi. Bo‘limni tanlang:", {
    parse_mode: 'Markdown',
    reply_markup: adminKeyboard,
  });
  await ctx.answerCallbackQuery({ text: 'Yangilandi! ⚡' });
});

export function startTelegramBot() {
  if (!botToken) return;
  bot.start({
    onStart: (info) => {
      console.log(`🤖 Telegram Bot ishga tushdi: @${info.username}`);
    },
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