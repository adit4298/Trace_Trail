#!/usr/bin/env bash

# Redeploy a service with a previously published image tag.

set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $(basename "$0") <service: backend|frontend|ai> <tag> [image_name]"
  exit 1
fi

SERVICE="$1"
TAG="$2"
IMAGE_OVERRIDE="${3:-}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

case "$SERVICE" in
  backend)
    SCRIPT="${ROOT_DIR}/scripts/deployment/deploy_backend.sh"
    DEFAULT_IMAGE="tracetrail-backend"
    ;;
  frontend)
    SCRIPT="${ROOT_DIR}/scripts/deployment/deploy_frontend.sh"
    DEFAULT_IMAGE="tracetrail-frontend"
    ;;
  ai)
    SCRIPT="${ROOT_DIR}/scripts/deployment/deploy_ai_module.sh"
    DEFAULT_IMAGE="tracetrail-ai"
    ;;
  *)
    echo "Unknown service '$SERVICE'. Valid options: backend, frontend, ai." >&2
    exit 1
    ;;
esac

IMAGE_NAME="${IMAGE_OVERRIDE:-$DEFAULT_IMAGE}"

echo "→ Rolling back $SERVICE to ${IMAGE_NAME}:${TAG}"
IMAGE_NAME="$IMAGE_NAME" TAG="$TAG" bash "$SCRIPT"
echo "✔ Rollback complete"
