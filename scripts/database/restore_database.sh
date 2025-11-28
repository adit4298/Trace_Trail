#!/usr/bin/env bash

# Restore a PostgreSQL dump into the database defined by DATABASE_URL.

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $(basename "$0") <path/to/backup.sql>"
  exit 1
fi

BACKUP_FILE="$1"
if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "Error: backup file '$BACKUP_FILE' not found." >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_FILE="${ROOT_DIR}/backend/.env"

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

require_cmd psql
DATABASE_URL_VALUE="$(resolve_database_url)"
NORMALIZED_URL="${DATABASE_URL_VALUE//postgresql+psycopg/postgresql}"

echo "→ Restoring database from $BACKUP_FILE"
psql "$NORMALIZED_URL" < "$BACKUP_FILE"
echo "✔ Restore complete"
