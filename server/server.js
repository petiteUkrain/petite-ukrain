require('dotenv').config(); // loading environment variables from .env

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const path = require("path");

const app = express();
app.use(express.json()); // middleware to parse JSON from request bodies
const prisma = new PrismaClient();
const PORT = 3000;

const adsRoutes = require("./routes/ads");

// Serve static frontend files from the public directory
app.use(express.static(path.join(__dirname, "../public")));

// Use ads API routes under the /api path
app.use("/api", adsRoutes);

// Serve index.html manually for the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

// Serve images from the /images folder
app.use("/images", express.static(path.join(__dirname, "..", "images")));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
