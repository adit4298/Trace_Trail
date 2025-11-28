#!/usr/bin/env bash

# Build Trace Trail services for CI/CD pipelines.
# Usage:
#   ./scripts/ci_cd/build.sh            # build backend + frontend
#   ./scripts/ci_cd/build.sh -b         # backend only
#   ./scripts/ci_cd/build.sh -f         # frontend only

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_DIR="${ROOT_DIR}/backend"
FRONTEND_DIR="${ROOT_DIR}/frontend"
BUILD_BACKEND=true
BUILD_FRONTEND=true

while getopts ":bf" opt; do
  case "$opt" in
    b) BUILD_FRONTEND=false ;;
    f) BUILD_BACKEND=false ;;
    *) echo "Usage: $(basename "$0") [-b|-f]" && exit 1 ;;
  esac
done

function activate_venv() {
  local venv_path="$1/.venv"
  if [[ -f "${venv_path}/bin/activate" ]]; then
    # shellcheck disable=SC1090
    source "${venv_path}/bin/activate"
  elif [[ -f "${venv_path}/Scripts/Activate.ps1" ]]; then
    # PowerShell activate inside bash (Git Bash) is tricky; fall back to python -m venv invocation.
    python -m venv "$venv_path"
    # shellcheck disable=SC1090
    source "${venv_path}/bin/activate"
  else
    python -m venv "$venv_path"
    # shellcheck disable=SC1090
    source "${venv_path}/bin/activate"
  fi
}

function build_backend() {
  echo "→ Building backend"
  pushd "$BACKEND_DIR" >/dev/null
  activate_venv "$BACKEND_DIR"
  pip install --upgrade pip >/dev/null
  pip install -r requirements/base.txt >/dev/null
  if [[ -f requirements/dev.txt ]]; then
    pip install -r requirements/dev.txt >/dev/null
  fi
  # Byte-compile sources to catch syntax errors early.
  python -m compileall src >/dev/null
  deactivate || true
  popd >/dev/null
  echo "✔ Backend build complete"
}

function build_frontend() {
  echo "→ Building frontend"
  pushd "$FRONTEND_DIR" >/dev/null
  if command -v pnpm >/dev/null 2>&1 && [[ -f pnpm-lock.yaml ]]; then
    pnpm install --frozen-lockfile
    pnpm run build
  else
    npm install
    npm run build
  fi
  popd >/dev/null
  echo "✔ Frontend build complete"
}

$BUILD_BACKEND && build_backend
$BUILD_FRONTEND && build_frontend

echo "🎉 Build pipeline finished successfully."
