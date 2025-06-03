const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const adsPath = path.join(__dirname, '../ads.json');
  const adsData = JSON.parse(fs.readFileSync(adsPath, 'utf-8'));

  for (const ad of adsData) {
    await prisma.ad.create({
      data: {
        title: ad.title,
        description: ad.description,
        price: parseFloat(ad.price), // конвертація в число
        image_url: ad.image,
        city: ad.location,
        created_at: new Date(ad.date), // конвертація в Date
		district: null,
        category: null,
        condition: null,
        is_active: true,
        telegram_user_id: null
      }
    });
  }

  console.log('Ads imported successfully!');
}

main()
  .catch(e => {
    console.error('Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
