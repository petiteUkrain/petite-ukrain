require('dotenv').config(); // loading environment variables from .env

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const path = require("path");

const app = express();
app.use(express.json()); // middleware to parse JSON from request bodies
const prisma = new PrismaClient();
const PORT = 3000;
const HOST = '0.0.0.0';

// Switch: use DB or RAM based on .env
const USE_DB = process.env.USE_DB === 'true';
console.log(`USE_DB: ${USE_DB}`);

// temporary store in RAM
const ads = []; 

// Serve static frontend files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Serve images from the /images folder
app.use("/images", express.static(path.join(__dirname, "..", "images")));

// Serve index.html manually for the root URL
//app.get("/", (req, res) => {
//  res.sendFile(path.join(__dirname, "public", "index.html")); //res.sendFile(path.join(__dirname, "..", "public", "index.html"));
//});

// GET all ads
app.get("/api/ads", async (req, res) => {
  if (USE_DB) {
    const dbAds = await prisma.ad.findMany();
    res.json(dbAds);
  } else {
    res.json(ads);
  }
});


// POST: add ad - old version
//app.post("/api/ads", (req, res) => {
//  ads.push(req.body);
//  res.json({ message: "Ad added!", ad: req.body });
//});


// ✅ POST create ad (match your frontend)
app.post("/api/create-ad", async (req, res) => {
  try {
    if (USE_DB) {
      const ad = await prisma.ad.create({
        data: {
          title: req.body.title,
          description: req.body.description,
          price: Number(req.body.price),
          image_url: req.body.image_url,
          city: req.body.city,
        },
      });
      res.json(ad);
    } else {
      const ad = {
        ...req.body,
        created_at: new Date().toISOString(), // for the frontend render
      };
      ads.push(ad);
      res.json(ad);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



// Start server
app.listen(PORT, HOST, () => { 
  console.log(`Server is running at http://${HOST}:${PORT}`);
});