# Long Anh Corp — Production Dockerfile
# Multi-stage build for Next.js standalone output
# Final image ~200-250 MB
#
# Sử dụng node:20-slim (Debian) thay vì alpine vì Prisma engine detection
# trên Alpine hay fail ("Prisma failed to detect libssl version") → load
# nhầm engine cần libssl 1.1 → crash. Debian slim chỉ to hơn ~30MB nhưng
# zero-config: openssl 3 sẵn có, libc glibc native.

# ---------- Stage 1: install deps ----------
FROM node:20-slim AS deps
WORKDIR /app

# openssl + ca-certificates cần cho Prisma engine + HTTPS outbound
RUN apt-get update && apt-get install -y --no-install-recommends \
  openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci --no-audit --no-fund

# ---------- Stage 2: build ----------
FROM node:20-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma client + build Next.js standalone bundle
RUN npx prisma generate
RUN npm run build

# Bundle seed.ts thành self-contained JS — runner image không có tsx/src/.
# External các native/Prisma deps để dùng version đã install ở runner.
RUN npx esbuild prisma/seed.ts --bundle --platform=node --format=cjs \
  --external:@prisma/client --external:bcryptjs --external:image-size \
  --outfile=prisma/seed.cjs

# ---------- Stage 3: runtime ----------
FROM node:20-slim AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

# Standalone output from Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Prisma client + CLI + migration engine — all needed at container start to
# run `prisma migrate deploy` before booting the server. Copy whole @prisma
# scope (client, engines, debug, get-platform, fetch-engine...) — cherry
# picking individual folders misses transitive deps like @prisma/debug.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# next/image optimizer cần sharp lúc runtime. Next.js standalone đôi khi
# không trace đủ sharp binary → copy explicit.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/sharp ./node_modules/sharp
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@img ./node_modules/@img

# Seed deps — bundled seed.cjs runs `node prisma/seed.cjs` để populate DB
# lần đầu. External từ esbuild → cần copy thực vào runner.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/image-size ./node_modules/image-size

USER nextjs
EXPOSE 3000

# Run pending migrations on every boot, then start the Next.js server. Any
# orchestrator (Docker Compose, Dokploy, Kubernetes) gets a self-contained
# start — no separate migrate step in the deploy pipeline.
CMD ["sh", "-c", "node node_modules/prisma/build/index.js migrate deploy && node server.js"]
