#!/usr/bin/env bash

# Smoke test the backend API by booting it locally and hitting key endpoints.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_DIR="${ROOT_DIR}/backend"
PORT="${PORT:-8105}"

function activate_venv() {
  local base="$1"
  local venv_path="$base/.venv"
  if [[ ! -d "$venv_path" ]]; then
    python -m venv "$venv_path"
  fi
  if [[ -f "$venv_path/bin/activate" ]]; then
    # shellcheck disable=SC1090
    source "$venv_path/bin/activate"
  else
    # shellcheck disable=SC1090
    source "$venv_path/Scripts/activate"
  fi
}

pushd "$BACKEND_DIR" >/dev/null
activate_venv "$BACKEND_DIR"
pip install -r requirements/base.txt >/dev/null

uvicorn src.main:app --host 127.0.0.1 --port "$PORT" --log-level warning &
APP_PID=$!

function cleanup() {
  kill "$APP_PID" >/dev/null 2>&1 || true
  deactivate || true
  popd >/dev/null || true
}
trap cleanup EXIT

echo "→ Waiting for backend to boot..."
for i in {1..15}; do
  if curl -fsS "http://127.0.0.1:${PORT}/hello" >/dev/null; then
    READY=true
    break
  fi
  sleep 1
done
if [[ "${READY:-false}" != "true" ]]; then
  echo "Backend failed to start." >&2
  exit 1
fi

echo "→ Running smoke checks"
if command -v jq >/dev/null 2>&1; then
  curl -fsS "http://127.0.0.1:${PORT}/hello" | jq '.status' >/dev/null
else
  curl -fsS "http://127.0.0.1:${PORT}/hello" >/dev/null
fi
curl -fsS "http://127.0.0.1:${PORT}/docs" >/dev/null

echo "✔ Integration smoke tests passed"
