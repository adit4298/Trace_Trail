#!/usr/bin/env bash

# Remove build artifacts, caches, and (optionally) virtualenv/node_modules.

set -euo pipefail

DEEP=false
while getopts ":d" opt; do
  case "$opt" in
    d) DEEP=true ;;
    *) echo "Usage: $(basename "$0") [-d]" && exit 1 ;;
  esac
done

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "→ Removing Python caches"
find "$ROOT_DIR" -name "__pycache__" -type d -prune -exec rm -rf {} +
rm -rf "$ROOT_DIR/backend/.pytest_cache" "$ROOT_DIR/backend/.coverage"
rm -rf "$ROOT_DIR/ai_module/.pytest_cache"

echo "→ Cleaning frontend build artifacts"
rm -rf "$ROOT_DIR/frontend/dist" "$ROOT_DIR/frontend/.vite"

if $DEEP; then
  echo "→ Deep clean: removing virtualenvs and node_modules"
  rm -rf "$ROOT_DIR/backend/.venv" "$ROOT_DIR/ai_module/.venv"
  rm -rf "$ROOT_DIR/frontend/node_modules"
fi

echo "✔ Cleanup complete"
