# Long Anh Corp — Website

Production website cho **Công ty TNHH KS Long Anh** — bột đá Canxi Cacbonat
& đá tự nhiên Việt Nam. CMS đa ngôn ngữ (VI / EN / ZH) tự host được hoặc
deploy Vercel.

> 📘 Xem [`PLAN.md`](./PLAN.md) — kế hoạch 8 phase
> 🗺️ Xem [`ARCHITECTURE.md`](./ARCHITECTURE.md) — sơ đồ Page ↔ API ↔ DB
> 🧬 Xem [`prisma/schema.prisma`](./prisma/schema.prisma) — schema 31 bảng

## Tech stack

Next.js 14 · TypeScript · Tailwind · Prisma · PostgreSQL 16 · NextAuth ·
next-intl · Tiptap · Socket.io · Resend · S3

## 🚀 Quick start (Docker — khuyên dùng)

```bash
git clone https://github.com/20021456/LongAnhCompany.git
cd LongAnhCompany
docker compose up
```

Sau ~30s đầu (build image + chạy migration), app chạy ở
http://localhost:3000. Postgres ở `localhost:5432`
(`longanh / longanh / longanh`).

## 🔧 Quick start (bare metal)

```bash
# 1. Cài deps
npm install

# 2. Setup env
cp .env.example .env.local
# Sửa DATABASE_URL trỏ tới Postgres của bạn

# 3. Migrate + generate Prisma client
npx prisma migrate dev
npx prisma generate

# 4. Seed dữ liệu mặc định (tạo super_admin)
npm run prisma:seed

# 5. Run dev server
npm run dev
```

## 📜 Scripts thường dùng

| Lệnh                     | Mô tả                                        |
| ------------------------ | -------------------------------------------- |
| `npm run dev`            | Dev server với hot-reload (port 3000)        |
| `npm run build`          | Build production (Next.js standalone output) |
| `npm start`              | Chạy bản build production                    |
| `npm run lint`           | ESLint check                                 |
| `npm run format`         | Prettier format toàn bộ                      |
| `npm run typecheck`      | Type-check không emit                        |
| `npm run prisma:migrate` | Tạo + apply migration mới                    |
| `npm run prisma:studio`  | Mở Prisma Studio (GUI cho DB) ở port 5555    |
| `npm run prisma:seed`    | Seed dữ liệu mặc định                        |
| `npm run docker:dev`     | Alias cho `docker compose up`                |

## 🗂️ Cấu trúc thư mục

```
LongAnhCompany/
├── prisma/
│   ├── schema.prisma          # 31 bảng (xem ARCHITECTURE.md)
│   ├── migrations/
│   └── seed.ts                # seed languages, roles, admin, settings
├── src/
│   ├── app/
│   │   ├── [locale]/          # public site (vi|en|zh)
│   │   ├── admin/             # admin panel (Phase 5+)
│   │   └── api/               # REST handlers
│   ├── components/            # (Phase 2)
│   ├── lib/
│   │   ├── db.ts              # Prisma singleton
│   │   ├── auth.ts            # NextAuth config
│   │   ├── permissions.ts     # Role permissions
│   │   ├── utils.ts
│   │   └── i18n/              # next-intl config + routing
│   ├── types/                 # ambient TS declarations
│   └── middleware.ts          # locale + admin auth
├── messages/                  # next-intl strings (vi/en/zh.json)
├── scripts/
│   └── import-content.ts      # parse CONTENT.md → JSON (Phase 3)
├── docker/                    # init SQL + nginx.conf
├── Dockerfile                 # production multi-stage
├── Dockerfile.dev             # dev hot-reload
├── docker-compose.yml         # dev: app + postgres
└── docker-compose.prod.yml    # self-host prod
```

## 🌐 Đa ngôn ngữ

- Default locale: `vi` (Tiếng Việt)
- Routing: `/vi/...`, `/en/...`, `/zh/...`
- DB lưu i18n theo column-per-locale (`*_vi`, `*_en`, `*_zh`)
- UI strings ngắn lưu trong `messages/{vi,en,zh}.json` (next-intl)

## 🔐 Admin mặc định (sau khi seed)

- URL: http://localhost:3000/admin/login
- Email: `admin@longanhcorp.com`
- Password: `ChangeMe123!` — **đổi ngay sau lần đăng nhập đầu tiên**

## 📦 Repos liên quan

- **LongAnhCompany** (repo này) — codebase production
- **[LongAnhCorp](https://github.com/20021456/LongAnhCorp)** — input
  reference: HTML prototype, asset, `CONTENT.md`. Không sửa.

## 🚢 Deploy

### Path A — Vercel + Supabase (mặc định)

1. Push branch → Vercel auto-deploy
2. DATABASE_URL trỏ tới Supabase / Railway Postgres
3. Env vars set trong Vercel dashboard

### Path B — Self-host bằng Docker

```bash
# Trên VPS
cp .env.example .env.production
# Điền PRODUCTION secrets

docker compose -f docker-compose.prod.yml up -d
```

## License

Proprietary © 2026 Long Anh Mineral Co., Ltd
