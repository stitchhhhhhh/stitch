#!/bin/bash
set -e

LOG_DIR="/var/log/deploys"
LOG_FILE="$LOG_DIR/lms-sandbox.log"
sudo mkdir -p "$LOG_DIR"
sudo chown "$(whoami):$(whoami)" "$LOG_DIR"

REF="$1"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

exec > >(tee -a "$LOG_FILE") 2>&1

echo ""
echo "===================================================="
echo "[$TIMESTAMP] Deploy started — ref: $REF"
echo "===================================================="

trap 'echo "[$(date "+%Y-%m-%d %H:%M:%S")] DEPLOY FAILED — ref: $REF"; exit 1' ERR

cd /var/www/learningcompany-sandbox/app

echo "Checking out ref: $REF"
git fetch origin
git checkout "$REF"
git pull origin "$REF" || true

echo "Installing backend deps..."
cd backend && npm ci

echo "Syncing DB schema..."
npx prisma generate
npx prisma migrate deploy

echo "Installing frontend deps..."
cd ../frontend && npm ci

echo "Building frontend..."
npm run build

echo "Restarting backend..."
pm2 restart lms-backend-sandbox --update-env

echo "Verifying health..."
sleep 2
if curl -sf -o /dev/null https://sandbox.learningcompany.my.id/api/departments; then
  echo "Health check passed."
else
  echo "WARNING: health check failed after deploy — check pm2 logs manually."
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Deploy SUCCEEDED — ref: $REF"