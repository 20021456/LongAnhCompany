#!/bin/sh
# Daily PostgreSQL backup for the self-host stack.
#
# Streams pg_dump out of the running postgres container, gzips it, and
# prunes anything older than the retention window. Designed to be cron-
# safe (no interactive output on success).
#
# Install as a daily cron job:
#   sudo crontab -e
#   0 2 * * * /home/longanh/app/scripts/backup-db.sh >> /var/log/longanh-backup.log 2>&1
#
# Restore:
#   gunzip -c /var/backups/longanh/longanh-2026-05-23.sql.gz | \
#     docker compose -f docker-compose.prod.yml exec -T postgres \
#     psql -U longanh -d longanh

set -eu

cd "$(dirname "$0")/.."

# Tweakables — overridable via env.
BACKUP_DIR="${BACKUP_DIR:-/var/backups/longanh}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"

. .env.production
: "${POSTGRES_USER:?POSTGRES_USER missing in .env.production}"
: "${POSTGRES_DB:?POSTGRES_DB missing in .env.production}"

mkdir -p "$BACKUP_DIR"

STAMP=$(date +%Y-%m-%d_%H%M)
OUT="$BACKUP_DIR/longanh-$STAMP.sql.gz"

# pg_dump → gzip in one pipe; -T (no-tty) so cron doesn't see a pseudo-tty.
docker compose -f "$COMPOSE_FILE" exec -T postgres \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner --no-privileges \
  | gzip -9 > "$OUT"

# Permission tighten — backups contain everything.
chmod 600 "$OUT"

# Prune old backups (keep at least one even on a fresh install).
find "$BACKUP_DIR" -name 'longanh-*.sql.gz' -mtime "+$RETENTION_DAYS" -delete

# Quick verification — gzip integrity + reasonable size (DB shouldn't be 0 KB).
if ! gzip -t "$OUT" 2>/dev/null; then
  echo "[$(date -Iseconds)] BACKUP CORRUPT: $OUT"
  exit 1
fi
SIZE=$(stat -c%s "$OUT")
if [ "$SIZE" -lt 1024 ]; then
  echo "[$(date -Iseconds)] BACKUP TOO SMALL: $OUT ($SIZE bytes)"
  exit 1
fi

echo "[$(date -Iseconds)] backup ok: $OUT ($SIZE bytes)"
