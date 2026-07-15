#!/bin/sh
# First-time Let's Encrypt issuance for the production stack.
#
# Chicken-and-egg: nginx needs a cert to start (the :443 block references
# /etc/letsencrypt/live/.../fullchain.pem), but certbot needs nginx on :80
# to serve the ACME challenge. So:
#
#   1. Generate a 1-day self-signed dummy cert at the real path,
#   2. Start nginx + app + postgres,
#   3. Wipe the dummy and ask certbot for a real cert via webroot,
#   4. Reload nginx to pick up the real cert,
#   5. Start the long-running certbot renewal loop.
#
# Re-run safely after DNS changes. Renewal afterwards is automatic.
#
# Required env (loaded from .env.production via docker compose):
#   SERVER_NAME=longanhcorp.com
#   LETSENCRYPT_EMAIL=ops@example.com

set -eu

cd "$(dirname "$0")/.."

COMPOSE="docker compose -f docker-compose.prod.yml --env-file .env.production"

# Sanity-check env.
. .env.production
: "${SERVER_NAME:?SERVER_NAME is required in .env.production}"
: "${LETSENCRYPT_EMAIL:?LETSENCRYPT_EMAIL is required in .env.production}"

# Toggle the second domain by editing this line (or unset INCLUDE_WWW=0).
INCLUDE_WWW="${INCLUDE_WWW:-1}"
CERT_DOMAINS="-d $SERVER_NAME"
if [ "$INCLUDE_WWW" = "1" ]; then
  CERT_DOMAINS="$CERT_DOMAINS -d www.$SERVER_NAME"
fi

echo "==> 1/5 · Tạo cert tạm self-signed cho $SERVER_NAME"
$COMPOSE run --rm --entrypoint sh certbot -c "
  mkdir -p /etc/letsencrypt/live/$SERVER_NAME &&
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout /etc/letsencrypt/live/$SERVER_NAME/privkey.pem \
    -out /etc/letsencrypt/live/$SERVER_NAME/fullchain.pem \
    -subj /CN=$SERVER_NAME
"

echo "==> 2/5 · Khởi động postgres + app + nginx"
$COMPOSE up -d postgres app nginx

echo "    Đợi nginx phản hồi trên :80 ..."
i=0
until $COMPOSE exec -T nginx wget -qO- --tries=1 --timeout=2 http://localhost/.well-known/acme-challenge/ >/dev/null 2>&1; do
  i=$((i + 1))
  if [ $i -gt 30 ]; then
    echo "    ✗ nginx không sẵn sàng sau 60s — kiểm tra 'docker compose logs nginx'"
    exit 1
  fi
  sleep 2
done

echo "==> 3/5 · Xoá cert tạm, xin cert thật từ Let's Encrypt"
$COMPOSE run --rm --entrypoint sh certbot -c "
  rm -rf /etc/letsencrypt/live/$SERVER_NAME /etc/letsencrypt/archive/$SERVER_NAME /etc/letsencrypt/renewal/$SERVER_NAME.conf &&
  certbot certonly --webroot -w /var/www/certbot \
    --email '$LETSENCRYPT_EMAIL' --agree-tos --no-eff-email \
    $CERT_DOMAINS
"

echo "==> 4/5 · Reload nginx để dùng cert thật"
$COMPOSE exec nginx nginx -s reload

echo "==> 5/5 · Khởi động vòng lặp renew tự động"
$COMPOSE up -d certbot

echo
echo "✓ HTTPS đã sẵn sàng tại https://$SERVER_NAME"
if [ "$INCLUDE_WWW" = "1" ]; then
  echo "  (kèm https://www.$SERVER_NAME)"
fi
echo "  Cert sẽ tự renew mỗi 12 tiếng; nginx tự reload mỗi 6 tiếng."
