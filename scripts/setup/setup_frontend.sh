#!/usr/bin/env bash

# Prepare the React frontend for local development.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
FRONTEND_DIR="${ROOT_DIR}/frontend"

pushd "$FRONTEND_DIR" >/dev/null

if [[ -f .env.example && ! -f .env ]]; then
  cp .env.example .env
  echo "Copied .env.example → .env"
fi

echo "→ Installing npm dependencies"
if command -v pnpm >/dev/null 2>&1 && [[ -f pnpm-lock.yaml ]]; then
  pnpm install
else
  npm install
fi

echo "✔ Frontend ready. Start dev server with 'npm run dev'."

popd >/dev/null
