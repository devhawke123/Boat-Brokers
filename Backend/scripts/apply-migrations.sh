#!/usr/bin/env bash
# Applies all pending Prisma migrations on the server (currently: Boat.solarPanels and
# Boat.bedroomWardrobeStorage) and restarts the API.
# Run from anywhere on the server:  bash Backend/scripts/apply-migrations.sh
#
# Safe to re-run: `prisma migrate deploy` only applies migrations that are not
# yet recorded in _prisma_migrations, so a second run is a no-op.
set -euo pipefail

cd "$(dirname "$0")/.."   # -> Backend/

if [ ! -f .env ]; then
  echo "Backend/.env not found - DATABASE_URL must be set on the server." >&2
  exit 1
fi

echo "==> Pending migration status"
npx prisma migrate status || true   # exits non-zero while migrations are pending

echo "==> Applying migrations"
npx prisma migrate deploy

echo "==> Regenerating Prisma client"
npx prisma generate

echo "==> Building"
npm run build

echo "==> Restarting API"
pm2 startOrRestart ecosystem.config.cjs --update-env
pm2 save

echo "Done. Verify with: npx prisma migrate status"
