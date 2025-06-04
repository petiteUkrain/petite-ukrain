require('dotenv').config(); // to read .env
const TelegramBot = require('node-telegram-bot-api');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient(); // connecting to DB
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

console.log('Бот запущено!');

const userStates = {}; // actions state

// /list – show 5 recent ads
bot.onText(/\/list/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const ads = await prisma.ad.findMany({
      orderBy: { id: 'desc' },
      take: 5,
    });

    if (ads.length === 0) {
      return bot.sendMessage(chatId, 'Наразі немає оголошень');
    }

    ads.forEach((ad) => {
      bot.sendMessage(chatId, `📢 ${ad.title}\n💰 ${ad.price}\n📝 ${ad.description}`);
    });
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Сталася помилка при завантаженні оголошень');
  }
});

// /new — adding new ad
bot.onText(/\/new/, (msg) => {
  const chatId = msg.chat.id;
  userStates[chatId] = { step: 'title', ad: {} };
  bot.sendMessage(chatId, 'Введи заголовок оголошення:');
});

// proceeding ads
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const user = userStates[chatId];

  if (!user || msg.text.startsWith('/')) return;

  if (user.step === 'title') {
    user.ad.title = msg.text;
    user.step = 'price';
    return bot.sendMessage(chatId, 'Введи ціну:');
  }

  if (user.step === 'price') {
    user.ad.price = msg.text;
    user.step = 'description';
    return bot.sendMessage(chatId, 'Введи опис:');
  }

  if (user.step === 'description') {
    user.ad.description = msg.text;

    try {
      await prisma.ad.create({
        data: {
          title: user.ad.title,
          price: user.ad.price,
          description: user.ad.description,
        },
      });
      bot.sendMessage(chatId, 'Оголошення збережено!');
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, 'Помилка при збереженні оголошення.');
    }

    delete userStates[chatId];
  }
});

// /help – commands list
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, `
🛠 Команди бота:
  /list – Показати останні оголошення
  /new – Додати нове оголошення
  /help – Допомога
  `);
});

// on Ctrl + C => gentle closing DB connection
process.on('SIGINT', async () => {
  console.log('\n Завершення... Закриваю Prisma...');
  await prisma.$disconnect();
  process.exit();
});