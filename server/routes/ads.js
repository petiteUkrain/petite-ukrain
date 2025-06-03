const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Debug: Check available Prisma models
console.log(Object.keys(prisma)); // Should contain 'ad'

// --- GET: Fetch all ads ---
router.get("/ads", async (req, res) => {
  try {
    const ads = await prisma.ad.findMany({
      orderBy: { created_at: "desc" },
    });
    res.json(ads);
  } catch (error) {
    console.error("Error fetching ads:", error);
    res.status(500).json({ error: "Failed to fetch ads" });
  }
});

// --- POST: Create a new ad ---
router.post("/create-ad", async (req, res) => {
  const { title, description, price, city, image_url } = req.body;

  // Validate required fields
  if (!title || !description || !city || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await prisma.ad.create({
      data: {
        title,
        description,
        price: Number(price),
        city,
        image_url: image_url || "", // Use empty string if no image provided
      },
    });
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Database insert error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
