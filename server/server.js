const express = require("express");
const { PrismaClient } = require("@prisma/client");
const path = require("path");

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

// фронтенд
app.use(express.static(path.join(__dirname, "../public")));

// Віддаємо index.html вручну при запиті на "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

// show images from images folder
app.use("/images", express.static(path.join(__dirname, "..", "images")));


// API для отримання оголошень
app.get("/api/ads", async (req, res) => {
  try {
    const ads = await prisma.ads.findMany({
      orderBy: { created_at: "desc" },
    });
    res.json(ads);
  } catch (error) {
    console.error("❌ Помилка при отриманні оголошень:", error);
    res.status(500).json({ error: "Не вдалося отримати оголошення" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущено на http://localhost:${PORT}`);
});
