#!/usr/bin/env bash

# Run Alembic migrations to the latest revision.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_DIR="${ROOT_DIR}/backend"

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
if [[ -f requirements/dev.txt ]]; then
  pip install -r requirements/dev.txt >/dev/null
fi

echo "→ Applying migrations"
alembic upgrade head
echo "✔ Database migrated"

deactivate || true
popd >/dev/null
