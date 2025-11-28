#!/usr/bin/env bash

# Create a timestamped PostgreSQL dump using DATABASE_URL from backend/.env

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_FILE="${ROOT_DIR}/backend/.env"
BACKUP_DIR="${ROOT_DIR}/backups"
mkdir -p "$BACKUP_DIR"

function require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: $1 is required but not installed." >&2
    exit 1
  fi
}

function resolve_database_url() {
  if [[ -n "${DATABASE_URL:-}" ]]; then
    echo "$DATABASE_URL"
    return
  fi
  if [[ -f "$ENV_FILE" ]]; then
    local value
    value=$(grep -E '^DATABASE_URL=' "$ENV_FILE" | tail -1 | cut -d '=' -f2- | tr -d '\r')
    if [[ -n "$value" ]]; then
      echo "$value"
      return
    fi
  fi
  echo "Error: DATABASE_URL not set and not found in $ENV_FILE" >&2
  exit 1
}

require_cmd pg_dump

DATABASE_URL_VALUE="$(resolve_database_url)"
NORMALIZED_URL="${DATABASE_URL_VALUE//postgresql+psycopg/postgresql}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
TARGET_FILE="${BACKUP_DIR}/tracetrail-${TIMESTAMP}.sql"

echo "→ Backing up database to $TARGET_FILE"
PGPASSWORD="" pg_dump "$NORMALIZED_URL" > "$TARGET_FILE"
echo "✔ Backup complete"
