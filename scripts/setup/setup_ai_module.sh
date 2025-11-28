#!/usr/bin/env bash

# Prepare the AI module service for local work.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
AI_DIR="${ROOT_DIR}/ai_module"

python -m venv "${AI_DIR}/.venv"
if [[ -f "${AI_DIR}/.venv/bin/activate" ]]; then
  # shellcheck disable=SC1090
  source "${AI_DIR}/.venv/bin/activate"
else
  # shellcheck disable=SC1090
  source "${AI_DIR}/.venv/Scripts/activate"
fi

pip install --upgrade pip >/dev/null
pip install -r "${AI_DIR}/requirements.txt"
deactivate || true

echo "✔ AI module ready. Start with:"
echo "    source ${AI_DIR}/.venv/bin/activate && uvicorn main:app --reload --port 8100"
