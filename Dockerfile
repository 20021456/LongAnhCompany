# Long Anh Corp — Production Dockerfile
# Multi-stage build for Next.js standalone output
# Final image ~150-200 MB

# ---------- Stage 1: install deps ----------
FROM node:20-alpine AS deps
WORKDIR /app

# libc6-compat needed for some native modules on Alpine
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci --no-audit --no-fund

# ---------- Stage 2: build ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma client + build Next.js standalone bundle
RUN npx prisma generate
RUN npm run build

# ---------- Stage 3: runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone output from Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Prisma client + CLI + migration engine — all needed at container start to
# run `prisma migrate deploy` before booting the server.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/engines ./node_modules/@prisma/engines
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs
EXPOSE 3000

# Run pending migrations on every boot, then start the Next.js server. Any
# orchestrator (Docker Compose, Dokploy, Kubernetes) gets a self-contained
# start — no separate migrate step in the deploy pipeline.
CMD ["sh", "-c", "node node_modules/prisma/build/index.js migrate deploy && node server.js"]
