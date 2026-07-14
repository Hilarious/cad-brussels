#!/usr/bin/env bash
# One-shot setup for the CAD Brussels dev environment.
# Usage:  ./scripts/setup.sh

set -euo pipefail

cd "$(dirname "$0")/.."

echo "▶ 1. Activating pnpm via Corepack…"
corepack enable
corepack prepare pnpm@9.12.0 --activate

echo "▶ 2. Installing dependencies…"
pnpm install

echo "▶ 3. Starting Postgres + MinIO via docker compose…"
docker compose -f "../../🐳 Docker & Deployment/docker-compose.yml" up -d

echo "▶ 4. Bootstrapping .env (only if missing)…"
if [ ! -f .env ]; then
  cp .env.example .env
  if command -v openssl >/dev/null 2>&1; then
    SECRET="$(openssl rand -base64 48 | tr -d '\n')"
    # Replace the placeholder PAYLOAD_SECRET line
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' "s|^PAYLOAD_SECRET=.*|PAYLOAD_SECRET=${SECRET}|" .env
    else
      sed -i "s|^PAYLOAD_SECRET=.*|PAYLOAD_SECRET=${SECRET}|" .env
    fi
    echo "   ✓ generated random PAYLOAD_SECRET"
  else
    echo "   ⚠ openssl not found — please set PAYLOAD_SECRET manually in .env"
  fi
else
  echo "   ↳ .env already exists, leaving it untouched"
fi

echo "▶ 5. Waiting for Postgres to be ready…"
for _ in {1..30}; do
  if docker compose -f "../../🐳 Docker & Deployment/docker-compose.yml" exec -T postgres pg_isready -U cad >/dev/null 2>&1; then
    echo "   ✓ Postgres ready"
    break
  fi
  sleep 1
done

echo "▶ 6. Generating Payload types and import map…"
pnpm generate:types
pnpm generate:importmap

echo ""
echo "✅ Setup complete. Start the dev server with:"
echo ""
echo "   pnpm dev"
echo ""
echo "Then open:"
echo "   • Public site: http://localhost:3000"
echo "   • Payload admin: http://localhost:3000/admin"
echo "   • MinIO console: http://localhost:9001 (cadminio / cadminio-dev-secret)"
