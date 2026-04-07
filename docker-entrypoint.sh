#!/bin/sh
set -eu

echo "Container startup diagnostics:"
echo "  NODE_ENV: ${NODE_ENV:-<unset>}"
echo "  PORT: ${PORT:-<unset>}"
echo "  DATABASE_URL present: ${DATABASE_URL:+yes}"
echo "  SESSION_SECRET present: ${SESSION_SECRET:+yes}"
echo "  SEED_DATABASE_ON_START: ${SEED_DATABASE_ON_START:-false}"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required"
#  exit 1
fi

if [ -z "${SESSION_SECRET:-}" ]; then
  echo "SESSION_SECRET is required"
##  exit 1
fi

#echo "Applying Prisma schema..."
#npx prisma db push --skip-generate

#if [ "${SEED_DATABASE_ON_START:-false}" = "true" ]; then
#  echo "Seeding database..."
#  npm run db:seed
#fi

exec node server.js
