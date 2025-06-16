# petiteUkrain – Classified Ads Demo

This project is a simple **full-stack ads platform** built with:
- **Node.js + Express**
- **Prisma + PostgreSQL** (or in-memory fallback)
- **Docker + docker-compose**

It demonstrates:
✅ Serving a static frontend  
✅ REST API for ads  
✅ Switchable storage: **real DB or in-memory RAM**  
✅ Containerized deployment for DevOps practice

## Run locally (with real DB)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` in `server/`:
   ```env
   USE_DB=true
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/petiteukrain
   ```

3. Apply Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

4. Start the server:
   ```bash
   node server.js
   ```

5. Open:
   ```
   http://localhost:3000
   ```

## Run with Docker (RAM mode)

By default, the Docker setup uses **RAM fallback** for demonstration only.

```bash
docker compose down -v --remove-orphans
docker compose build --no-cache
docker compose up --build -d

Open:

http://localhost:3000

Add ads, test search & filters.

## Switch Docker to real DB
To test with real PostgreSQL inside Docker:

Change USE_DB=false to USE_DB=true in docker-compose.yml.

## Features
- Add an ad
- Search by keyword
- Filter by city
- Runs in RAM for quick demos or with DB for production

## Project structure

/public       # Frontend static files (HTML, CSS, JS)
/server.js    # Main backend server
/routes/      # (Optional) Custom API routes
/prisma/      # Prisma schema & migrations
/Dockerfile   # Multi-stage build
/docker-compose.yml

## Note
 
This is an MVP for demonstration only.
No authentication yet.
In-memory ads vanish on server restart in RAM mode.