# 🏗️ KẾ HOẠCH PHÁT TRIỂN WEBSITE LONG ANH

> Tài liệu này mô tả kế hoạch xây dựng website production cho KS Long Anh —
> với CMS admin, database thật và đa ngôn ngữ (VI / EN / ZH).

## 📂 Vai trò 2 repository

| Repo                          | Vai trò                                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- |
| **`LongAnhCompany`** (repo này) | **Codebase chính** — toàn bộ Next.js app, Prisma, admin panel, API… được code tại đây.                |
| `LongAnhCorp` (repo riêng)      | **Input / Reference** — chỉ đọc: prototype HTML, `CONTENT.md`, asset gốc, mockup admin. Dùng để đối chiếu với web sau khi build xong. **KHÔNG sửa đổi** file trong đó. |

Quy trình: đọc HTML prototype + CONTENT.md từ `LongAnhCorp` → seed dữ liệu &
dựng UI bên `LongAnhCompany`. Khi website chạy thật, so sánh visual với
prototype ở `LongAnhCorp` để đảm bảo đúng UI / nội dung.

---

## 1. Tech stack đã chọn

| Layer       | Công nghệ                                     |
| ----------- | --------------------------------------------- |
| Framework   | **Next.js 14 (App Router) + TypeScript**      |
| Styling     | TailwindCSS (kế thừa từ prototype)            |
| Database    | **PostgreSQL 15+**                            |
| ORM         | **Prisma**                                    |
| Auth        | NextAuth.js (credentials + JWT)               |
| i18n        | next-intl (3 locale: vi / en / zh)            |
| Storage     | S3 / Cloudinary (media, COA, MSDS)            |
| Email       | Resend hoặc SendGrid                          |
| Realtime    | Socket.io (live chat)                         |
| Editor      | Tiptap (rich text cho news / job description) |
| Hosting     | Vercel (FE) + Supabase / Railway (DB)         |
| Monitoring  | Sentry + Vercel Analytics                     |

**Quy ước i18n:** mỗi field đa ngôn ngữ được lưu thành 3 cột riêng
`*_vi`, `*_en`, `*_zh` để query đơn giản và đánh index dễ.

---

## 2. Cấu trúc thư mục dự kiến

```
LongAnhCompany/
├── prisma/
│   ├── schema.prisma          # schema chính (xem file kèm)
│   ├── migrations/
│   └── seed.ts                # seed từ CONTENT.md của LongAnhCorp
├── src/
│   ├── app/
│   │   ├── [locale]/          # public site (vi|en|zh)
│   │   │   ├── page.tsx               # /
│   │   │   ├── about/page.tsx
│   │   │   ├── products/page.tsx
│   │   │   ├── products/[slug]/page.tsx
│   │   │   ├── news/page.tsx
│   │   │   ├── news/[slug]/page.tsx
│   │   │   ├── career/page.tsx
│   │   │   ├── career/[slug]/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── admin/             # admin panel (auth-protected)
│   │   │   ├── login/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── pages/...
│   │   │   ├── products/...
│   │   │   ├── news/...
│   │   │   ├── jobs/...
│   │   │   ├── media/...
│   │   │   ├── menu/...
│   │   │   ├── seo/...
│   │   │   ├── i18n/...
│   │   │   ├── contacts/...
│   │   │   ├── livechat/...
│   │   │   ├── roles/...
│   │   │   └── settings/...
│   │   └── api/               # REST/Route handlers
│   │       ├── products/route.ts
│   │       ├── news/route.ts
│   │       ├── jobs/route.ts
│   │       ├── contact/route.ts
│   │       ├── job-applications/route.ts
│   │       └── admin/*
│   ├── components/
│   │   ├── public/ (Hero, ProductCard, Timeline, ...)
│   │   ├── admin/  (AdminShell, DataTable, FormFields, ...)
│   │   └── ui/     (Button, Input, Modal, ...)
│   ├── lib/
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── auth.ts            # NextAuth config
│   │   ├── i18n.ts
│   │   └── permissions.ts
│   └── middleware.ts          # locale + admin auth
├── public/                    # static assets (copy từ LongAnhCorp/assets)
├── messages/                  # next-intl JSON (vi.json, en.json, zh.json)
├── scripts/
│   └── import-content.ts      # parse CONTENT.md → JSON cho seed
├── docker/
│   ├── postgres-init.sql      # tạo extensions: pgcrypto, citext, unaccent
│   ├── nginx.conf             # (tuỳ chọn) reverse proxy nếu self-host
│   └── README.md
├── Dockerfile                 # multi-stage build cho production (Next.js standalone)
├── Dockerfile.dev             # image dev có hot-reload + Prisma CLI
├── docker-compose.yml         # dev: app + postgres + (redis tuỳ chọn)
├── docker-compose.prod.yml    # prod self-host: app + postgres + nginx (tuỳ chọn)
├── .dockerignore
├── .env.example               # template env vars
├── .env.docker                # env mặc định cho docker-compose
├── package.json
└── tsconfig.json
```

### Tóm tắt vai trò các file Docker

| File                       | Dùng khi nào                                                                |
| -------------------------- | --------------------------------------------------------------------------- |
| `Dockerfile`               | Build production image (multi-stage: deps → build → runtime, Next.js standalone output) |
| `Dockerfile.dev`           | Image dev (hot-reload, mount source, Prisma CLI sẵn) — chỉ dùng nội bộ      |
| `docker-compose.yml`       | **Dev local**: 1 lệnh `docker compose up` là có app + Postgres + (Redis) chạy ngay, không cần cài Postgres trên máy |
| `docker-compose.prod.yml`  | Khi cần self-host trên VPS (không dùng Vercel). Gồm app + Postgres + Nginx + volume cho media |
| `docker/postgres-init.sql` | Chạy lần đầu khi Postgres container khởi tạo: tạo extension `pgcrypto`, `citext`, `unaccent` (full-text search Tiếng Việt) |
| `docker/nginx.conf`        | Reverse proxy + SSL termination cho prod self-host                          |
| `.dockerignore`            | Bỏ `node_modules`, `.next`, `.git`, `.env*` khỏi build context              |
| `.env.docker`              | Env mặc định cho compose (DATABASE_URL trỏ tới service `postgres:5432`)     |

> **Lưu ý hosting:** plan mặc định deploy lên **Vercel + Supabase** (không
> cần Docker prod). Docker files vẫn được giữ để: (1) chạy dev offline
> dễ dàng, (2) phương án self-host backup nếu sau này khách hàng muốn
> chạy trên VPS riêng.

---

## 3. Phase plan (chi tiết)

### Phase 1 — Setup (3–5 ngày)

- [ ] `npx create-next-app@latest` + TypeScript + Tailwind + ESLint
- [ ] Cài dependencies: `prisma`, `@prisma/client`, `next-auth`, `next-intl`,
      `zod`, `react-hook-form`, `@tiptap/react`, `socket.io`, `bcryptjs`
- [ ] **Docker dev env**: `Dockerfile.dev`, `docker-compose.yml` với services
      `app` + `postgres` (+ optional `redis`); `docker/postgres-init.sql` bật
      extension `pgcrypto`, `citext`, `unaccent`
- [ ] Khởi tạo Prisma + `DATABASE_URL` trỏ tới container postgres
- [ ] Migration đầu tiên: `users`, `roles`, `languages`, `settings`
- [ ] Setup `middleware.ts` cho locale routing
- [ ] Cấu hình ESLint, Prettier, Husky pre-commit
- [ ] `Dockerfile` production (multi-stage, Next.js `output: "standalone"`)
- [ ] `.dockerignore` + `.env.docker`
- [ ] Copy `LongAnhCorp/assets/` → `public/`

### Phase 2 — Public site (5–7 ngày)

> **Reference:** lấy markup & style từ `LongAnhCorp/*.html` (index, about,
> products, product, news, article, career, job, contact).

- [ ] Convert layout chung: Header / Footer / LanguageSwitcher
- [ ] Trang `/` (home) — Hero, Stats, Products carousel, About, Certs, Export
      map, Contact form
- [ ] Trang `/about` — Story, Timeline, Values, Capabilities, Warehouse, CTA
- [ ] Trang `/products` — Categories tiles
- [ ] Trang `/products/[slug]` — Variants picker, Applications, Packaging, COA
- [ ] Trang `/career` + `/career/[slug]` — Job listing + detail + apply form
- [ ] Trang `/news` + `/news/[slug]`
- [ ] Trang `/contact` — form + map embed
- [ ] Page transitions, mobile menu, scroll behavior

### Phase 3 — Database & Seed (2–3 ngày)

- [ ] Hoàn tất full schema (xem `prisma/schema.prisma`)
- [ ] Viết parser đọc `LongAnhCorp/CONTENT.md` → JSON
- [ ] Tạo seed script điền:
      `settings`, `translations`, `products`, `product_variants`,
      `timeline_events`, `core_values`, `certifications`, `stats`, `jobs`
- [ ] Seed 1 user admin mặc định
- [ ] Tạo 5 sản phẩm P-01 → P-05 với variants đầy đủ
- [ ] Seed 8 jobs mặc định

### Phase 4 — Public API & data wiring (3–4 ngày)

- [ ] `GET /api/products?lang=&category=` + `/api/products/[slug]`
- [ ] `GET /api/news` + `/api/news/[slug]`
- [ ] `GET /api/jobs` + `/api/jobs/[slug]`
- [ ] `POST /api/contact` (validate + lưu DB + gửi email sales)
- [ ] `POST /api/job-applications` (upload CV → S3, lưu DB)
- [ ] `GET /api/pages/[key]` (lấy sections của page)
- [ ] Thay tất cả mock data trong UI bằng fetch DB qua Server Components
- [ ] ISR / revalidate khi admin sửa nội dung

### Phase 5 — Admin Auth + Shell (3 ngày)

- [ ] `/admin/login` với NextAuth (credentials provider, bcrypt password)
- [ ] Middleware bảo vệ `/admin/*`
- [ ] Convert `LongAnhCorp/admin/admin-shell.jsx` sang App Router layout
- [ ] Role-based menu (super_admin / editor / sales / viewer)
- [ ] Audit log middleware

### Phase 6 — Admin CRUD (10–15 ngày, mỗi module 1–2 ngày)

> **Reference:** mockup HTML có sẵn ở `LongAnhCorp/admin/*.html`.

1. **Dashboard** — thống kê leads, products, articles, jobs, chart
2. **Pages** — sửa từng section của trang chủ / about / products / career…
3. **Products** — list/create/edit + variants table + applications + media
   gallery + COA upload
4. **News** — list + rich-text editor (Tiptap) + categories + cover image
5. **Jobs** — CRUD + tab xem `job_applications`
6. **Media library** — upload, search, folder, alt text 3 lang
7. **Menu** — drag-and-drop header/footer menu
8. **SEO** — site-wide meta, sitemap auto, robots editor
9. **i18n** — bảng translations, import/export JSON
10. **Contacts (CRM)** — kanban status, gán nhân viên sales, notes
11. **Live chat** — phòng chat, gán agent, lịch sử
12. **Roles & users** — phân quyền
13. **Settings** — brand, contact, social, hotline…

### Phase 7 — SEO, performance, test (3–5 ngày)

- [ ] sitemap.xml động, robots.txt, hreflang tags
- [ ] JSON-LD: Organization, Product, JobPosting, BreadcrumbList
- [ ] Open Graph + Twitter cards động
- [ ] next/image cho toàn bộ ảnh
- [ ] ISR cho public pages, on-demand revalidate khi admin save
- [ ] Lighthouse target ≥ 90 (Performance / SEO / Accessibility)
- [ ] Playwright e2e: contact form, apply job, admin login, edit product
- [ ] Unit test các helpers (Vitest)
- [ ] So sánh visual với prototype ở `LongAnhCorp` — checklist từng trang

### Phase 8 — Deploy & monitor (2–3 ngày)

- [ ] **Path A — Vercel + Supabase (mặc định):**
      Vercel project + custom domain + SSL, Supabase/Railway Postgres,
      connection pooling, không cần Docker prod.
- [ ] **Path B — Self-host bằng Docker (backup option):**
      `docker compose -f docker-compose.prod.yml up -d` trên VPS (Nginx +
      Postgres + app container), Let's Encrypt SSL.
- [ ] S3 bucket + Cloudfront (hoặc Cloudinary)
- [ ] Migrate seed lên production
- [ ] Sentry, Vercel Analytics, GA4
- [ ] Backup DB hằng ngày, retention 30 ngày
- [ ] Tài liệu vận hành: README, .env.example, deployment guide

**Tổng:** ~6–9 tuần với 1 dev full-time.

---

## 4. Tóm tắt database (31 bảng)

Phân nhóm:

| Nhóm                | Bảng                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------- |
| Hệ thống / Auth     | `users`, `roles`, `settings`, `audit_logs`                                                |
| i18n                | `languages`, `translations`                                                                |
| Sản phẩm            | `product_categories`, `products`, `product_variants`, `product_applications`, `product_packagings`, `product_specs` |
| CMS pages           | `pages`, `page_sections`, `timeline_events`, `certifications`, `core_values`, `stats`     |
| Tin tức             | `news_categories`, `articles`                                                              |
| Tuyển dụng          | `departments`, `jobs`, `job_applications`                                                  |
| Lead / CRM          | `contacts`, `contact_notes`                                                                |
| Media               | `media`, `media_folders`                                                                   |
| Menu                | `menus`, `menu_items`                                                                      |
| Live chat           | `chat_sessions`, `chat_messages`                                                           |

Chi tiết schema xem `prisma/schema.prisma`.

### Thứ tự migration đề xuất

1. **Đợt 1 (cốt lõi):** languages, users, roles, settings, translations, media, media_folders
2. **Đợt 2 (content):** pages, page_sections, product_categories, products, product_variants, product_applications, product_packagings, product_specs
3. **Đợt 3 (phụ trợ):** timeline_events, certifications, core_values, stats, news_categories, articles, departments, jobs
4. **Đợt 4 (giao dịch):** contacts, contact_notes, job_applications, audit_logs
5. **Đợt 5 (mở rộng):** menus, menu_items, chat_sessions, chat_messages

---

## 5. Biến môi trường cần chuẩn bị (`.env`)

```
DATABASE_URL="postgresql://user:pass@host:5432/longanh"
DIRECT_URL="postgresql://user:pass@host:5432/longanh"        # cho Prisma migrate
NEXTAUTH_URL="https://longanhcorp.com"
NEXTAUTH_SECRET="<random 32 bytes>"
S3_BUCKET=""
S3_REGION=""
S3_ACCESS_KEY_ID=""
S3_SECRET_ACCESS_KEY=""
RESEND_API_KEY=""
SALES_EMAIL="info@longanhcorp.com"
HR_EMAIL="hr@longanhcorp.com"
GOOGLE_MAPS_KEY=""
SENTRY_DSN=""
```

---

## 6. Roles & Permissions ban đầu

| Role        | Quyền                                                                                |
| ----------- | ------------------------------------------------------------------------------------ |
| super_admin | Toàn quyền + quản lý roles & users                                                   |
| editor      | CRUD pages, products, news, jobs, media, menu, i18n (không sửa users)                |
| sales       | Xem contacts (leads), reply, đổi status, gán cho người khác; xem-only sản phẩm        |
| hr          | CRUD jobs, xem job_applications                                                       |
| viewer      | Read-only toàn bộ admin                                                              |

---

## 7. Bước tiếp theo

Sau khi bạn duyệt plan này, các bước hành động tiếp theo sẽ là:

1. **Phase 1** — scaffold Next.js project (commit init vào `LongAnhCompany`)
2. Chạy migration Đợt 1 + 2 (đủ để cắm dữ liệu sản phẩm)
3. Convert `LongAnhCorp/index.html` → React component lấy data từ DB
4. Lặp tương tự cho các page còn lại

Mọi thay đổi tiếp theo nên đi qua PR vào nhánh
`claude/plan-website-database-54Z84` trước khi merge `main`.
