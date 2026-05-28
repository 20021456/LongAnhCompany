# Triển khai bản production — Long Anh Corp

Theo Path B trong [`PLAN.md` §8](./PLAN.md): self-host bằng Docker Compose
trên một VPS Linux. Gồm 3 container chạy cạnh nhau — **nginx**, **app**
(Next.js standalone), **postgres** — và một container **certbot** tự gia hạn
SSL.

> **Đang dùng Dokploy?** → đọc [`DEPLOY-DOKPLOY.md`](./DEPLOY-DOKPLOY.md)
> thay file này. Dokploy lo Traefik / SSL / log / restart, đơn giản hơn nhiều.
>
> **Đang dùng Vercel + Supabase?** → push code lên Vercel + trỏ
> `DATABASE_URL` về Supabase, không cần file nào ở dưới.

---

## 0. Chuẩn bị

| Mục      | Yêu cầu                                                                                 |
| -------- | --------------------------------------------------------------------------------------- |
| VPS      | Ubuntu 22.04 LTS (đã kiểm chứng) hoặc 24.04 LTS. Tối thiểu 2 core / 4GB / 60GB SSD      |
| Domain   | Đã trỏ A record của bare domain (vd. `longanhcorp.com`) **và** `www.<domain>` về IP VPS |
| Email    | 1 địa chỉ để Let's Encrypt gửi cảnh báo sắp hết hạn                                     |
| Optional | Bucket S3 + IAM access key (nếu muốn upload thật, nếu không ảnh sẽ lưu inline data URL) |
| Optional | Resend API key (nếu muốn gửi email thông báo liên hệ + ứng tuyển)                       |

Cũng nên copy GitHub deploy key hoặc dùng HTTPS clone với personal token.

---

## 1. Bootstrap VPS (chạy 1 lần)

```sh
ssh root@<vps-ip>

# Clone repo về home directory
git clone https://github.com/20021456/longanhcompany.git /home/longanh/app
cd /home/longanh/app
git checkout main      # hoặc branch khác

# Cài Docker + swap + ufw + cron backup
sudo bash scripts/setup-vps.sh
```

Script `setup-vps.sh` làm gọn:

- Cài Docker engine + compose plugin từ repo chính thức
- Tạo swapfile 2GB (cứu RAM khi `next build` peak)
- Bật ufw, mở 22/80/443
- Cài cron entry: backup DB hằng ngày lúc 02:00

Idempotent — chạy lại không hại.

---

## 2. Cấu hình env

```sh
cd /home/longanh/app
cp .env.production.example .env.production
nano .env.production
```

Tối thiểu cần điền:

| Biến                                   | Ghi chú                                                   |
| -------------------------------------- | --------------------------------------------------------- |
| `SERVER_NAME`                          | `longanhcorp.com` (không kèm `https://`, không kèm slash) |
| `LETSENCRYPT_EMAIL`                    | email nhận cảnh báo cert                                  |
| `POSTGRES_PASSWORD`                    | mật khẩu mạnh, đồng bộ với `DATABASE_URL`                 |
| `DATABASE_URL`, `DIRECT_URL`           | thay password trùng với `POSTGRES_PASSWORD`               |
| `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL` | `https://<SERVER_NAME>`                                   |
| `NEXTAUTH_SECRET`                      | sinh bằng `openssl rand -base64 32`                       |

Các biến optional (S3, Resend, Sentry, Google Maps) bỏ trống ban đầu — site
vẫn chạy được, sau thêm cũng được, chỉ cần `docker compose restart app`.

---

## 3. Lần đầu khởi tạo SSL

```sh
bash scripts/init-certs.sh
```

Script tự:

1. Sinh cert giả 1-day self-signed để nginx khởi động được
2. Bật postgres + app + nginx
3. Đợi nginx trả lời trên :80
4. Xin cert thật từ Let's Encrypt qua webroot challenge (cho cả `<domain>` + `www.<domain>`)
5. Reload nginx
6. Bật vòng lặp renew tự động (kiểm tra mỗi 12 tiếng, reload nginx mỗi 6 tiếng)

Nếu DNS chưa trỏ về VPS thì certbot sẽ fail và in lý do — sửa DNS, đợi
propagation, chạy lại script.

> **Để tắt `www`** (chỉ phục vụ apex domain): `INCLUDE_WWW=0 bash scripts/init-certs.sh`.

---

## 4. Seed dữ liệu ban đầu

App đã tự chạy `prisma migrate deploy` lúc khởi động (xem `command:` trong
compose). Seed dữ liệu mẫu chạy thủ công một lần:

```sh
docker compose -f docker-compose.prod.yml exec app npm run prisma:seed
```

Sau seed có sẵn:

- Tài khoản admin `admin@longanhcorp.com` / `ChangeMe123!` — **đổi mật khẩu ngay sau khi login**
- 5 sản phẩm, 8 vị trí tuyển dụng, 12 bài tin tức, 4 chứng nhận, 61 ảnh mẫu

Mở `https://<domain>/admin/login` để vào CMS.

---

## 5. Kiểm tra sau deploy

```sh
# Tất cả container "Up (healthy)"
docker compose -f docker-compose.prod.yml ps

# Smoke test
curl -I https://<domain>/vi             # 200
curl -I https://<domain>/sitemap.xml    # 200
curl -I https://<domain>/admin/login    # 200
curl -I https://<domain>/robots.txt     # 200

# Logs nếu có lỗi
docker compose -f docker-compose.prod.yml logs --tail=80 app
docker compose -f docker-compose.prod.yml logs --tail=40 nginx
```

---

## 6. Vận hành hằng ngày

### Triển khai phiên bản mới

```sh
cd /home/longanh/app
git pull
docker compose -f docker-compose.prod.yml up -d --build app
# migrate deploy chạy tự động ở entrypoint của app
```

Nginx + postgres không restart trừ khi cấu hình thay đổi.

### Backup

Cron đã được setup-vps.sh cài, chạy mỗi 02:00 sáng:

```
/var/backups/longanh/longanh-<ngày>_<giờ>.sql.gz
```

Retention 30 ngày (đổi bằng `RETENTION_DAYS=60 scripts/backup-db.sh` nếu cần).

**Restore:**

```sh
gunzip -c /var/backups/longanh/longanh-2026-05-23_0200.sql.gz | \
  docker compose -f docker-compose.prod.yml exec -T postgres \
  psql -U longanh -d longanh
```

### Theo dõi cert

Renewal tự chạy mỗi 12h trong container `certbot`. Kiểm tra log:

```sh
docker compose -f docker-compose.prod.yml logs certbot --tail=40
```

Cert đếm còn bao ngày:

```sh
docker compose -f docker-compose.prod.yml exec nginx \
  openssl x509 -enddate -noout \
  -in /etc/letsencrypt/live/$SERVER_NAME/fullchain.pem
```

### Backup off-site (khuyến nghị)

Copy file `.sql.gz` qua nơi khác — rclone tới S3 / Google Drive / một VPS
khác. Ví dụ cronjob:

```sh
0 3 * * * rclone copy /var/backups/longanh remote:longanh-backups --max-age 24h
```

---

## 7. Tích hợp tuỳ chọn (làm khi cần)

### S3 cho ảnh

1. Tạo bucket + IAM user có quyền `s3:PutObject` trên bucket
2. Cấu hình bucket policy cho phép `s3:GetObject` công khai (hoặc dùng CloudFront)
3. Điền `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` vào `.env.production`
4. `docker compose -f docker-compose.prod.yml restart app`
5. Upload từ admin → ảnh giờ lưu vào S3 thay vì base64 trong DB

### Email thông báo (Resend)

1. Đăng ký Resend, lấy API key, verify domain gửi
2. Điền `RESEND_API_KEY`, `EMAIL_FROM`, `SALES_EMAIL`, `HR_EMAIL`
3. `docker compose -f docker-compose.prod.yml restart app`
4. Test bằng form liên hệ — email sales nhận được trong vài giây

### Google Analytics / Tag Manager

1. Mở `/admin/seo`
2. Điền GA Measurement ID (`G-XXXXXX`) và/hoặc GTM ID (`GTM-XXXXXX`)
3. Lưu — script tự inject (xem `SiteAnalytics.tsx`)

### Sentry (error reporting)

SDK chưa được cài sẵn (để giảm bundle size khi chưa dùng). Cách thêm:

```sh
docker compose -f docker-compose.prod.yml exec app sh -c 'npx @sentry/wizard@latest -i nextjs -s --signup'
```

Theo wizard, rồi commit files mới và rebuild.

Hoặc tự cài thủ công: `npm i @sentry/nextjs`, tạo `sentry.client.config.ts` + `sentry.server.config.ts` đọc DSN từ `NEXT_PUBLIC_SENTRY_DSN` (env đã có sẵn slot).

### Live chat

Đặt `ENABLE_LIVE_CHAT=true` rồi restart app — widget hiện trên mọi trang công khai, agent trả lời tại `/admin/livechat`.

---

## 8. Khắc phục sự cố nhanh

| Triệu chứng                                               | Nguyên nhân thường gặp                | Cách xử                                                          |
| --------------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------- |
| `502 Bad Gateway`                                         | container app chưa lên hoặc đã crash  | `docker compose logs app` — thường lỗi env hoặc migration        |
| Cert giả 1-day (cảnh báo NET::ERR_CERT_AUTHORITY_INVALID) | init-certs.sh chưa xin được cert thật | Kiểm tra DNS đã trỏ đúng + chạy lại `bash scripts/init-certs.sh` |
| `relation "..." does not exist`                           | migration chưa chạy                   | `docker compose exec app npx prisma migrate deploy`              |
| Admin trống dữ liệu                                       | chưa seed                             | `docker compose exec app npm run prisma:seed`                    |
| Upload ảnh từ admin trả về error                          | thiếu env S3 hoặc thiếu quyền upload  | Kiểm tra `S3_*` hoặc bỏ trống để fallback inline                 |
| `next build` OOM                                          | RAM tier quá thấp                     | Tăng swap, hoặc build trên CI và rsync `.next/standalone`        |
| Login admin lỗi `CSRF token mismatch`                     | `NEXTAUTH_URL` không khớp domain      | Sửa env, restart app                                             |

Logs đầy đủ:

```sh
docker compose -f docker-compose.prod.yml logs -f
```

---

## 9. Khi cần migrate sang DB managed (Supabase / Railway / RDS)

1. Tạo Postgres mới ở provider
2. Restore dump mới nhất (`gunzip + psql`)
3. Đổi `DATABASE_URL` + `DIRECT_URL` trong `.env.production` về connection string mới
4. Bỏ service `postgres` khỏi `docker-compose.prod.yml` (hoặc tạo `docker-compose.prod-managed.yml`)
5. `docker compose -f docker-compose.prod.yml up -d --build app`
6. Tắt cron backup local (DB managed có backup riêng) hoặc đổi target

Code app không đổi dòng nào — Prisma vẫn dùng `DATABASE_URL`.
