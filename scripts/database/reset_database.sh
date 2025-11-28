#!/usr/bin/env bash

# Drop all tables and re-run migrations (DANGEROUS IN PROD).

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "⚠️  This will DROP all tables pointed to by DATABASE_URL."
read -rp "Type 'reset' to continue: " confirmation
if [[ "$confirmation" != "reset" ]]; then
  echo "Aborted."
  exit 1
fi

python - <<'PY'
from pathlib import Path
import sys

root = Path(__file__).resolve().parents[2] / "backend"
sys.path.insert(0, str(root))

from src.core.database import drop_tables  # noqa: E402

print("→ Dropping tables...")
drop_tables()
print("✔ Tables dropped")
PY

bash "${ROOT_DIR}/scripts/database/migrate.sh"
