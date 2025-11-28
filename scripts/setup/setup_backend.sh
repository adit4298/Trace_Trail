#!/usr/bin/env bash

# Prepare backend for local development (dependencies, migrations, seed data).

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_DIR="${ROOT_DIR}/backend"

echo "→ Installing backend dependencies"
python -m venv "${BACKEND_DIR}/.venv"
if [[ -f "${BACKEND_DIR}/.venv/bin/activate" ]]; then
  # shellcheck disable=SC1090
  source "${BACKEND_DIR}/.venv/bin/activate"
else
  # shellcheck disable=SC1090
  source "${BACKEND_DIR}/.venv/Scripts/activate"
fi
pip install --upgrade pip >/dev/null
pip install -r "${BACKEND_DIR}/requirements/base.txt"
if [[ -f "${BACKEND_DIR}/requirements/dev.txt" ]]; then
  pip install -r "${BACKEND_DIR}/requirements/dev.txt"
fi
deactivate || true

bash "${ROOT_DIR}/scripts/setup/create_database.sh"
bash "${ROOT_DIR}/scripts/database/migrate.sh"
python "${ROOT_DIR}/scripts/database/seed_data.py"

echo "✔ Backend ready"
