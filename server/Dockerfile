# Stage 1: builder
FROM node:20 AS builder

WORKDIR /app

# caching dependecies
COPY server/package*.json ./
RUN apt-get update && apt-get install -y openssl
RUN npm install

# copying code and Prisma schema
COPY server/. .

COPY public ./public

RUN npx prisma generate

# Stage 2: final
FROM node:20 AS final

WORKDIR /app

# copying all from builder
COPY --from=builder /app ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY --from=builder /app/public ./public

ENV NODE_ENV=production
CMD ["node", "server.js"]