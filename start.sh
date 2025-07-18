#!/bin/sh
set -e

echo "Running database migrations..."
npx drizzle-kit push --force

echo "Starting application..."
exec node /app/dist/index.js