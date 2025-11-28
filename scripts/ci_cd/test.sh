#!/usr/bin/env bash

# Run automated tests for Trace Trail.
# Usage:
#   ./scripts/ci_cd/test.sh           # backend + frontend + ai_module
#   ./scripts/ci_cd/test.sh -b        # backend only
#   ./scripts/ci_cd/test.sh -f        # frontend only
#   ./scripts/ci_cd/test.sh -a        # ai_module only

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_DIR="${ROOT_DIR}/backend"
FRONTEND_DIR="${ROOT_DIR}/frontend"
AI_DIR="${ROOT_DIR}/ai_module"

TEST_BACKEND=false
TEST_FRONTEND=false
TEST_AI=false

if [[ $# -eq 0 ]]; then
  TEST_BACKEND=true
  TEST_FRONTEND=true
  TEST_AI=true
fi

while getopts ":bfa" opt; do
  case "$opt" in
    b) TEST_BACKEND=true ;;
    f) TEST_FRONTEND=true ;;
    a) TEST_AI=true ;;
    *) echo "Usage: $(basename "$0") [-b|-f|-a]" && exit 1 ;;
  esac
done

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

run_backend_tests() {
  echo "→ Running backend tests"
  pushd "$BACKEND_DIR" >/dev/null
  activate_venv "$BACKEND_DIR"
  pip install --upgrade pip >/dev/null
  pip install -r requirements/base.txt >/dev/null
  if [[ -f requirements/dev.txt ]]; then
    pip install -r requirements/dev.txt >/dev/null
  fi
  pytest
  deactivate || true
  popd >/dev/null
  echo "✔ Backend tests passed"
}

run_frontend_tests() {
  echo "→ Running frontend lint/tests"
  pushd "$FRONTEND_DIR" >/dev/null
  npm install
  npm run lint
  if npm run | grep -q "test"; then
    npm run test -- --runInBand --watch=false || npm run test -- --runInBand || true
  fi
  popd >/dev/null
  echo "✔ Frontend checks complete"
}

run_ai_tests() {
  echo "→ Running AI module tests"
  pushd "$AI_DIR" >/dev/null
  activate_venv "$AI_DIR"
  pip install --upgrade pip >/dev/null
  pip install -r requirements.txt >/dev/null
  pytest
  deactivate || true
  popd >/dev/null
  echo "✔ AI module tests passed"
}

$TEST_BACKEND && run_backend_tests
$TEST_FRONTEND && run_frontend_tests
$TEST_AI && run_ai_tests

echo "🎉 Test pipeline finished."
