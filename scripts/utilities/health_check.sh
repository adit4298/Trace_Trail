#!/usr/bin/env bash

# Simple health probes for backend, frontend, and AI module.

set -euo pipefail

BACKEND_URL="${BACKEND_URL:-http://localhost:8000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:5173}"
AI_URL="${AI_URL:-http://localhost:8100}"

function probe() {
  local name="$1"
  local url="$2"
  if curl -fsS "$url" >/dev/null; then
    echo "✔ ${name} healthy ($url)"
  else
    echo "✖ ${name} unreachable ($url)" >&2
    return 1
  fi
}

probe "Backend" "${BACKEND_URL}/hello"
probe "Frontend" "${FRONTEND_URL}"
probe "AI module" "${AI_URL}/docs"
