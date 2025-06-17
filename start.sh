#!/bin/bash
set -e

# echo "▶ Generating Prisma client..."
# npx prisma generate

echo "▶ Pushing Prisma schema to DB..."
npx prisma db push

echo "▶ Starting app..."
npm start
