#!/bin/sh
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required"
  exit 1
fi

if [ -z "${SESSION_SECRET:-}" ]; then
  echo "SESSION_SECRET is required"
  exit 1
fi

echo "Applying Prisma schema..."
npx prisma db push --skip-generate

if [ "${SEED_DATABASE_ON_START:-false}" = "true" ]; then
  echo "Seeding database..."
  npm run db:seed
fi

exec node server.js
