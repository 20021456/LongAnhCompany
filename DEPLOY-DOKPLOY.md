# Triển khai bằng **Dokploy** — Long Anh Corp

Hướng dẫn này dành cho người dùng Dokploy (PaaS self-hosted, Traefik auto-SSL).
Đơn giản hơn nhiều so với [`DEPLOY.md`](./DEPLOY.md) (manual Docker Compose):
Dokploy lo Docker, reverse proxy, Let's Encrypt, env vars, logs, monitoring.

> Nếu không dùng Dokploy mà tự setup mọi thứ → đọc `DEPLOY.md`.

---

## 0. Chuẩn bị

| Mục       | Yêu cầu                                                            |
| --------- | ------------------------------------------------------------------ |
| VPS       | Ubuntu 22.04 / 24.04, tối thiểu 2 core / 4GB / 60GB                |
| Domain    | A record của `<domain>` (và `www.<domain>` nếu muốn) trỏ về IP VPS |
| Tài khoản | Email Let's Encrypt sẽ dùng để cảnh báo cert                       |

App đã được chuẩn bị sẵn để chạy với Dokploy:

- `Dockerfile` (multi-stage, Next.js standalone) — Dokploy sẽ build trực tiếp
- CMD tự chạy `prisma migrate deploy` trước khi start → không cần pre-deploy hook
- `.env.production.example` liệt kê đầy đủ env cần điền

---

## 1. Cài Dokploy lên VPS (nếu chưa có)

SSH vào VPS bằng `root` rồi:

```sh
curl -sSL https://dokploy.com/install.sh | sh
```

Installer tự lo: Docker engine + Docker Swarm init + Traefik + Dokploy dashboard.

Sau khi xong, mở `http://<vps-ip>:3000` → tạo tài khoản admin đầu tiên.

> Đổi port nếu cần qua biến môi trường lúc cài. Mặc định 3000 — đảm bảo
> firewall (ufw) mở port này hoặc dùng SSH tunnel để truy cập an toàn:
> `ssh -L 3000:localhost:3000 root@<vps-ip>`.

---

## 2. Tạo Project + Postgres

Trong Dokploy dashboard:

1. **Projects → Create Project** → đặt tên `long-anh`.
2. Trong project mới: **Create Service → Database → PostgreSQL**.
   - **Name:** `longanh-db`
   - **Image:** `postgres:16-alpine`
   - **Database name:** `longanh`
   - **Username:** `longanh`
   - **Password:** sinh mật khẩu mạnh (ghi lại)
   - **External port:** để trống (không expose ra ngoài)
3. Bấm **Deploy** → đợi container chạy.
4. Vào tab **General → Internal Host** → copy hostname (vd. `longanh-db-xxxxx`).
   Đây là hostname app dùng để kết nối.

> Tuỳ chọn: bật **Backups** → schedule daily, retention 30 ngày. Dokploy lo nén
>
> - lưu vào volume (hoặc upload S3 nếu cấu hình).

---

## 3. Tạo Application từ GitHub repo

Trong cùng project, **Create Service → Application**.

### Tab "General"

| Trường          | Giá trị                                                               |
| --------------- | --------------------------------------------------------------------- |
| **Name**        | `longanh-web`                                                         |
| **Source type** | `Github` (hoặc `Git` với HTTPS + token nếu repo private)              |
| **Repository**  | `20021456/longanhcompany`                                             |
| **Branch**      | `main` (hoặc `claude/plan-website-database-54Z84` nếu deploy bản dev) |
| **Build path**  | `/`                                                                   |

### Tab "Build"

| Trường              | Giá trị        |
| ------------------- | -------------- |
| **Build type**      | `Dockerfile`   |
| **Dockerfile path** | `./Dockerfile` |
| **Docker context**  | `/`            |

### Tab "Environment"

Mở `.env.production.example` ở repo → copy paste toàn bộ vào ô env Dokploy, sửa:

- `SERVER_NAME` → domain thật
- `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` → trùng với DB ở bước 2
- `DATABASE_URL`, `DIRECT_URL` → đổi `postgres` thành **hostname** copy ở §2.4
  ```
  postgresql://longanh:<password>@longanh-db-xxxxx:5432/longanh?schema=public
  ```
- `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL` → `https://<domain>`
- `NEXTAUTH_SECRET` → sinh bằng `openssl rand -base64 32`
- Optional (`RESEND_API_KEY`, `S3_*`, `GOOGLE_MAPS_KEY`...) → để trống lúc đầu, điền sau

### Tab "Domains"

- **Add Domain** → nhập `<domain>` (apex)
- **Port** = `3000`
- **HTTPS** = `On`
- **Certificate provider** = `Let's Encrypt`
- **Email** = LETSENCRYPT_EMAIL của bạn

Bấm **Add** rồi lặp lại cho `www.<domain>` nếu muốn.

### Tab "Advanced"

- **Restart policy:** `always`
- **Healthcheck path:** `/api/health` (nếu muốn Dokploy giám sát)

### Deploy

Bấm **Deploy** → Dokploy clone repo, build Dockerfile, start container.

Build lần đầu mất ~3-5 phút trên gói Linux 4 (2 core / 4GB). Theo dõi log
trong tab **Deployments**. Khi xong, Traefik tự issue cert + route.

---

## 4. Seed dữ liệu mẫu (chạy 1 lần)

Sau khi container chạy, mở tab **Terminal** của service `longanh-web`:

```sh
npm run prisma:seed
```

Kết quả: 5 sản phẩm, 8 vị trí tuyển dụng, 12 bài tin tức, 4 chứng nhận, 61 ảnh
mẫu, **tài khoản admin `admin@longanhcorp.com` / `ChangeMe123!`**.

→ Vào `https://<domain>/admin/login` và **đổi mật khẩu ngay**.

---

## 5. Kiểm tra sau deploy

| Check                      | Cách                                                        |
| -------------------------- | ----------------------------------------------------------- |
| HTTPS valid                | `curl -I https://<domain>/vi` → 200                         |
| Cert thật từ Let's Encrypt | Mở trong Chrome → click khóa → "Issued by: Let's Encrypt"   |
| sitemap.xml                | `curl https://<domain>/sitemap.xml \| head` → có `<urlset>` |
| Admin                      | `https://<domain>/admin/login` → 200                        |
| App logs sạch              | Tab **Logs** trong Dokploy — không có `Error` đỏ            |
| Migrations đã chạy         | `psql ...` hoặc terminal: `npx prisma migrate status`       |

---

## 6. Vận hành hằng ngày

### Triển khai phiên bản mới

Mặc định Dokploy có 2 cách:

- **Tự động**: bật **Auto Deploy** ở tab Deployments → mỗi push lên branch là tự build + deploy
- **Thủ công**: bấm **Deploy** trên dashboard hoặc qua webhook URL Dokploy cấp

Migrations chạy tự động ở CMD nên không cần thao tác thêm.

### Backup DB

Nếu đã bật **Backups** ở §2:

- File backup nằm trong volume nội bộ của container postgres
- Restore: tab **Backups → Restore** chọn file

Nếu chưa bật, có thể chạy thủ công từ host:

```sh
docker exec $(docker ps -qf name=longanh-db) \
  pg_dump -U longanh longanh | gzip > backup-$(date +%F).sql.gz
```

Hoặc dùng `scripts/backup-db.sh` trong repo (cần đổi `COMPOSE_FILE` env hoặc
container name vì Dokploy có pattern naming khác).

### Theo dõi

- **Logs**: tab Logs trong Dokploy, có search + filter
- **Metrics**: tab Monitoring (CPU/RAM/Network) per container
- **Cert expiry**: Traefik tự renew; Dokploy hiện trạng thái ở tab Domains

### Update env

Sửa env trong tab **Environment** → bấm **Save** → Dokploy tự restart app
(không cần rebuild).

---

## 7. Tích hợp tuỳ chọn (sau khi site đã live)

### S3 cho upload ảnh

Điền `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` vào
tab Environment → Save → app restart. Upload từ `/admin/media` giờ vào S3
thay vì base64 trong DB.

### Resend (email thông báo)

Điền `RESEND_API_KEY`, `EMAIL_FROM`, `SALES_EMAIL`, `HR_EMAIL` → Save. Test
bằng form `/contact`.

### Google Analytics / GTM

Mở `/admin/seo`, điền GA Measurement ID và/hoặc GTM ID → Lưu. Script tự
inject (xem `SiteAnalytics.tsx`). Không cần restart.

### Live chat widget

`ENABLE_LIVE_CHAT=true` ở Environment → Save → widget hiện trên mọi trang
công khai, agent trả lời tại `/admin/livechat`.

### Sentry

Cài qua wizard trong terminal Dokploy:

```sh
npx @sentry/wizard@latest -i nextjs -s --signup
```

Commit kết quả lên repo + push → Dokploy auto-deploy.

---

## 8. Khắc phục sự cố nhanh

| Triệu chứng                                                   | Cách xử                                                                                                                                 |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Build fail `Cannot find module 'lightningcss-linux-x64-musl'` | Dokploy build trên Alpine — đã được Dockerfile xử (`libc6-compat`). Nếu vẫn lỗi: rebuild với "no cache".                                |
| App start nhưng `Can't reach database server`                 | Sai hostname trong `DATABASE_URL`. Vào tab DB service → General → Internal Host, copy đúng.                                             |
| `relation "..." does not exist`                               | Migration chưa chạy. Vào terminal app: `node node_modules/prisma/build/index.js migrate deploy`.                                        |
| Cert giả / `NET::ERR_CERT_AUTHORITY_INVALID`                  | DNS chưa propagate hoặc cert chưa issue. Tab Domains → kiểm tra status, đợi 1-2 phút, refresh.                                          |
| Admin trống dữ liệu                                           | Chưa seed. Terminal: `npm run prisma:seed`.                                                                                             |
| Upload ảnh trả lỗi 401                                        | App đang chạy nhưng session chưa login. Đăng nhập trước rồi thử lại.                                                                    |
| Memory cao bất thường                                         | Build Next ngốn RAM peak. Setup-vps.sh không chạy → swap không có. Dokploy installer thường tự tạo swap. Kiểm tra: `free -h` trên host. |

Logs đầy đủ — tab **Logs** trong Dokploy, hoặc trên host:

```sh
docker logs $(docker ps -qf name=longanh-web) --tail=200 -f
```

---

## 9. So sánh nhanh với manual Docker Compose

|                             | Dokploy                      | Manual (`DEPLOY.md`)                       |
| --------------------------- | ---------------------------- | ------------------------------------------ |
| Setup time                  | ~10 phút                     | ~30 phút                                   |
| SSL                         | Traefik tự lo                | Certbot + script init                      |
| Update workflow             | Bấm Deploy / auto webhook    | `git pull && docker compose up -d --build` |
| Logs / metrics UI           | Có sẵn                       | Phải tự cài (Grafana, Loki...)             |
| Backup                      | Có nút (nếu bật)             | Cron + script                              |
| RAM overhead Dokploy itself | ~150-200MB                   | 0                                          |
| Khi cần custom nginx rules  | Phải override Traefik labels | Sửa thẳng `nginx.conf`                     |

→ Dokploy hợp khi: muốn deploy nhanh + ưu tiên UX dashboard.
→ Manual hợp khi: cần kiểm soát chi tiết nginx / cron / monitoring tự xây.
