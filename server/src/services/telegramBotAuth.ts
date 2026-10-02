import { Bot, InlineKeyboard } from 'grammy';
import { db } from '../db/database.js';

// SECURITY: Get admin ID from environment variable, not hardcoded
const ADMIN_ID = process.env.ADMIN_TELEGRAM_ID
  ? Number(process.env.ADMIN_TELEGRAM_ID)
  : null;

if (!ADMIN_ID) {
  console.warn('ADMIN_TELEGRAM_ID not set in environment. Admin commands disabled.');
}

const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) {
  console.warn('TELEGRAM_BOT_TOKEN not found in environment!');
}

export const bot = new Bot(botToken || 'dummy_token');

// SECURITY: Session timeout to prevent token reuse
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const pendingSessions = new Map<string, { user: any; createdAt: number }>();

// Clean up expired sessions every minute
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of pendingSessions.entries()) {
    if (now - session.createdAt > SESSION_TIMEOUT) {
      pendingSessions.delete(token);
    }
  }
}, 60 * 1000);

// /start auth_xxx command handler
bot.command('start', async (ctx) => {
  const payload = ctx.match;

  if (!payload || !payload.startsWith('auth_')) {
    await ctx.reply('Hello! Welcome to Vacabbro. Please log in from the website.');
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

    const savedUser = userRes.rows[0];
    // SECURITY: Store session with timestamp
    pendingSessions.set(payload, {
      user: savedUser,
      createdAt: Date.now()
    });

    await ctx.reply(`Success, ${tgUser.first_name}! You have been logged in. You can return to the browser.`);
  } catch (dbErr) {
    console.error('DB error:', dbErr);
    await ctx.reply('Error occurred. Please try again.');
  }
});

// Admin Menu Keyboard (only shown if ADMIN_ID is set)
const adminKeyboard = new InlineKeyboard()
  .text('Stats', 'admin_stats')
  .row()
  .text('Top 10 Users', 'admin_top')
  .row()
  .text('Recent Users (5)', 'admin_recent')
  .row()
  .text('Refresh', 'admin_refresh');

// /admin command (only for admin)
bot.command('admin', async (ctx) => {
  if (!ADMIN_ID || ctx.from?.id !== ADMIN_ID) {
    await ctx.reply('Sorry, this command is for administrators only.');
    return;
  }

  await ctx.reply(
    'Vacabbro Admin Panel\nSelect an option:',
    {
      parse_mode: 'Markdown',
      reply_markup: adminKeyboard,
    }
  );
});

// Admin buttons handler
bot.callbackQuery('admin_stats', async (ctx) => {
  if (ctx.from?.id !== ADMIN_ID) {
    await ctx.answerCallbackQuery();
    return;
  }

  const totalUsersRes = await db.execute('SELECT COUNT(*) as count FROM users');
  const totalSearchesRes = await db.execute('SELECT SUM(search_count) as total FROM users');

  const totalUsers = Number(totalUsersRes.rows[0]?.count) || 0;
  const totalSearches = Number(totalSearchesRes.rows[0]?.total) || 0;

  const text = `Stats:\n\n` +
               `Total users: ${totalUsers}\n` +
               `Total searches: ${totalSearches}\n` +
               `Average per user: ${totalUsers > 0 ? (totalSearches / totalUsers).toFixed(1) : 0}`;

  await ctx.editMessageText(text, {
    parse_mode: 'Markdown',
    reply_markup: adminKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('admin_top', async (ctx) => {
  if (ctx.from?.id !== ADMIN_ID) {
    await ctx.answerCallbackQuery();
    return;
  }

  const topUsersRes = await db.execute(`
    SELECT first_name, username, search_count
    FROM users
    ORDER BY search_count DESC
    LIMIT 10
  `);

  const topUsers = topUsersRes.rows;

  let text = `Top 10 Active Users:\n\n`;
  if (topUsers.length === 0) {
    text += 'No users yet.';
  } else {
    topUsers.forEach((u: any, i: number) => {
      const medal = i === 0 ? '1st' : i === 1 ? '2nd' : i === 2 ? '3rd' : `${i + 1}th`;
      const uname = u.username ? `(@${u.username})` : '';
      text += `${medal} ${u.first_name} ${uname} - ${u.search_count || 0} words\n`;
    });
  }

  await ctx.editMessageText(text, {
    parse_mode: 'Markdown',
    reply_markup: adminKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('admin_recent', async (ctx) => {
  if (ctx.from?.id !== ADMIN_ID) {
    await ctx.answerCallbackQuery();
    return;
  }

  const recentUsersRes = await db.execute(`
    SELECT first_name, username, created_at
    FROM users
    ORDER BY id DESC
    LIMIT 5
  `);

  const recentUsers = recentUsersRes.rows;

  let text = `Recent 5 Users:\n\n`;
  if (recentUsers.length === 0) {
    text += 'No users yet.';
  } else {
    recentUsers.forEach((u: any, i: number) => {
      const uname = u.username ? `(@${u.username})` : '';
      text += `${i + 1}. ${u.first_name} ${uname}\n`;
    });
  }

  await ctx.editMessageText(text, {
    parse_mode: 'Markdown',
    reply_markup: adminKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('admin_refresh', async (ctx) => {
  if (ctx.from?.id !== ADMIN_ID) {
    await ctx.answerCallbackQuery();
    return;
  }

  await ctx.editMessageText('Vacabbro Admin Panel\nData refreshed. Select an option:', {
    parse_mode: 'Markdown',
    reply_markup: adminKeyboard,
  });
  await ctx.answerCallbackQuery({ text: 'Refreshed!' });
});

// Error handler
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Bot error (Update ID: ${ctx.update.update_id}):`, err.error);
});

let botStarted = false;

export function startTelegramBot() {
  if (!botToken || botStarted) return;

  botStarted = true;

  bot.start({
    onStart: (info) => {
      console.log(`Telegram Bot started: @${info.username}`);
    },
  }).catch((err) => {
    console.error('Bot start error:', err.message);
    botStarted = false;
  });
}

export function checkAuthSession(token: string) {
  if (!pendingSessions.has(token)) {
    return null;
  }

  const session = pendingSessions.get(token);
  if (!session) return null;

  // SECURITY: Check if session has expired
  const now = Date.now();
  if (now - session.createdAt > SESSION_TIMEOUT) {
    pendingSessions.delete(token);
    return null;
  }

  return session.user;
}
