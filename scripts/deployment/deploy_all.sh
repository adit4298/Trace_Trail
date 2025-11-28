#!/usr/bin/env bash

# Deploy backend, frontend, and AI module sequentially.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DEPLOY_BACKEND=true
DEPLOY_FRONTEND=true
DEPLOY_AI=true

while getopts ":bfa" opt; do
  case "$opt" in
    b) DEPLOY_FRONTEND=false; DEPLOY_AI=false ;;
    f) DEPLOY_BACKEND=false; DEPLOY_AI=false ;;
    a) DEPLOY_BACKEND=false; DEPLOY_FRONTEND=false ;;
    *) echo "Usage: $(basename "$0") [-b|-f|-a]" && exit 1 ;;
  esac
done

$DEPLOY_BACKEND && bash "${ROOT_DIR}/scripts/deployment/deploy_backend.sh"
$DEPLOY_FRONTEND && bash "${ROOT_DIR}/scripts/deployment/deploy_frontend.sh"
$DEPLOY_AI && bash "${ROOT_DIR}/scripts/deployment/deploy_ai_module.sh"

echo "🎯 Deployment run complete."
