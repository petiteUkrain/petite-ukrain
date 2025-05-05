const { PrismaClient } = require('./generated/prisma');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  const ads = JSON.parse(fs.readFileSync('../ads.json', 'utf8'));
  let importedCount = 0;

  for (const ad of ads) {
    try {
      // Парсимо price до числа
      const numericPrice = parseFloat(ad.price);

      // Перевіряємо, чи price є валідним числом
      if (isNaN(numericPrice)) {
        console.warn(`⚠️ Пропущено: некоректна ціна у записі ->`, ad.price);
        continue;
      }

      await prisma.ads.create({
        data: {
          title: ad.title,
          description: ad.description || null,
          price: numericPrice,
          image_url: ad.image || null,
          city: ad.location || null,
          district: null,
          category: null,
          condition: null,
          telegram_user_id: ad.tg_user_id || null,
          created_at: new Date(ad.date),
        },
      });

      importedCount++;
    } catch (e) {
      console.error(`❌ Помилка при обробці оголошення:`, ad.title, e.message);
    }
  }

  console.log(`✅ Імпорт завершено! Імпортовано ${importedCount} записів.`);
}

main()
  .catch((e) => {
    console.error('🚫 Загальна помилка:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
