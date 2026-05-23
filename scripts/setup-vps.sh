#!/bin/sh
# One-shot bootstrap for a fresh Ubuntu 22.04 / 24.04 VPS to run the
# LongAnh production stack. Idempotent — safe to re-run.
#
# Usage (as root or with sudo):
#   bash scripts/setup-vps.sh
#
# What it does:
#   1. Update apt + install Docker engine + compose plugin
#   2. Ensure a 2GB swapfile exists (helps the 4GB tier during builds)
#   3. Configure ufw (allow 22, 80, 443)
#   4. Install the daily backup cron entry
#
# Does NOT do:
#   - Clone the repo (do that manually, then cd into it before running)
#   - Touch .env.production (copy + edit `.env.production.example` yourself)
#   - Issue SSL certs (run `scripts/init-certs.sh` after DNS points here)

set -eu

if [ "$(id -u)" -ne 0 ]; then
  echo "Cần chạy với sudo. Ví dụ: sudo bash scripts/setup-vps.sh"
  exit 1
fi

# ─── 1. Docker ────────────────────────────────────────────────────────────
echo "==> 1/4 · Cài Docker engine + compose plugin"
if ! command -v docker >/dev/null 2>&1; then
  apt-get update
  apt-get install -y ca-certificates curl gnupg
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  UBUNTU_CODENAME=$(. /etc/os-release && echo "$VERSION_CODENAME")
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $UBUNTU_CODENAME stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker
fi
echo "    Docker: $(docker --version)"
echo "    Compose: $(docker compose version)"

# ─── 2. Swap (helps with Next build on 4GB tier) ──────────────────────────
echo "==> 2/4 · Bảo đảm có 2GB swap"
if ! swapon --show | grep -q '/swapfile'; then
  fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  # Lower swappiness — only swap under pressure.
  sysctl vm.swappiness=10 >/dev/null
  grep -q '^vm.swappiness' /etc/sysctl.conf || echo 'vm.swappiness=10' >> /etc/sysctl.conf
fi
echo "    $(free -h | awk '/Swap/{print "Swap: " $2 " total, " $3 " used"}')"

# ─── 3. Firewall ──────────────────────────────────────────────────────────
echo "==> 3/4 · Cấu hình ufw (cho phép 22/tcp, 80/tcp, 443/tcp)"
if ! command -v ufw >/dev/null 2>&1; then
  apt-get install -y ufw
fi
ufw allow 22/tcp >/dev/null
ufw allow 80/tcp >/dev/null
ufw allow 443/tcp >/dev/null
# Enable non-interactively only if currently inactive.
ufw status | grep -q 'Status: active' || ufw --force enable >/dev/null
echo "    $(ufw status | head -1)"

# ─── 4. Cron entry for daily backup ───────────────────────────────────────
echo "==> 4/4 · Cài cron backup DB hằng ngày (02:00)"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CRON_LINE="0 2 * * * cd $REPO_DIR && /bin/sh scripts/backup-db.sh >> /var/log/longanh-backup.log 2>&1"
( crontab -l 2>/dev/null | grep -v 'scripts/backup-db.sh' ; echo "$CRON_LINE" ) | crontab -
touch /var/log/longanh-backup.log
chmod 640 /var/log/longanh-backup.log
echo "    crontab: $CRON_LINE"

echo
echo "✓ VPS sẵn sàng. Bước tiếp theo:"
echo "  1. cp .env.production.example .env.production && chỉnh từng biến"
echo "  2. Trỏ DNS A record của domain về IP VPS này"
echo "  3. Chạy: bash scripts/init-certs.sh"
