#!/usr/bin/env bash

# Install backend, frontend, and AI module dependencies.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

function setup_python_deps() {
  local path="$1"
  local requirements="$2"
  echo "→ Installing Python dependencies in $path"
  pushd "$path" >/dev/null
  python -m venv .venv
  if [[ -f .venv/bin/activate ]]; then
    # shellcheck disable=SC1090
    source .venv/bin/activate
  else
    # shellcheck disable=SC1090
    source .venv/Scripts/activate
  fi
  pip install --upgrade pip >/dev/null
  pip install -r "$requirements"
  deactivate || true
  popd >/dev/null
}

function setup_node_deps() {
  local path="$1"
  echo "→ Installing Node dependencies in $path"
  pushd "$path" >/dev/null
  if command -v pnpm >/dev/null 2>&1 && [[ -f pnpm-lock.yaml ]]; then
    pnpm install --frozen-lockfile
  else
    npm install
  fi
  popd >/dev/null
}

setup_python_deps "${ROOT_DIR}/backend" "requirements/base.txt"
setup_python_deps "${ROOT_DIR}/ai_module" "requirements.txt"
setup_node_deps "${ROOT_DIR}/frontend"

echo "✔ Dependencies installed"
