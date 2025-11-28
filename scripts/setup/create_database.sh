#!/usr/bin/env bash

# Create the Postgres database defined in backend/.env (idempotent).

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_FILE="${ROOT_DIR}/backend/.env"

if [[ ! -f "$ENV_FILE" ]] && [[ -z "${DATABASE_URL:-}" ]]; then
  echo "Error: backend/.env not found and DATABASE_URL not set." >&2
  exit 1
fi

python - <<'PY'
from pathlib import Path
import os
from sqlalchemy.engine.url import make_url
import psycopg2

root = Path(__file__).resolve().parents[2]
env_file = root / "backend" / ".env"

def read_env(path: Path) -> dict[str, str]:
    data = {}
    if path.exists():
        for line in path.read_text().splitlines():
            if not line or line.strip().startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            data[key.strip()] = value.strip()
    return data

env = read_env(env_file)
database_url = os.environ.get("DATABASE_URL") or env.get("DATABASE_URL")
if not database_url:
    raise SystemExit("DATABASE_URL missing.")

url = make_url(database_url.replace("+psycopg", ""))
target_db = url.database
if not target_db:
    raise SystemExit("Database name missing in DATABASE_URL.")

admin_url = url.set(database="postgres")

conn = psycopg2.connect(
    host=admin_url.host,
    port=admin_url.port or 5432,
    user=admin_url.username,
    password=admin_url.password,
    dbname=admin_url.database,
)
conn.autocommit = True

with conn, conn.cursor() as cur:
    cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (target_db,))
    exists = cur.fetchone()
    if exists:
        print(f"✔ Database '{target_db}' already exists.")
    else:
        cur.execute(f'CREATE DATABASE "{target_db}"')
        print(f"✔ Database '{target_db}' created.")

conn.close()
PY
