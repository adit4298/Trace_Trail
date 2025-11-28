#!/usr/bin/env bash

# Build and deploy the React frontend as a static container.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE_FILE="${ROOT_DIR}/deployment/Docker/docker-compose.yml"
DOCKERFILE="${ROOT_DIR}/deployment/Docker/Dockerfile.frontend"
IMAGE_NAME="${IMAGE_NAME:-tracetrail-frontend}"
TAG="${TAG:-$(git -C "$ROOT_DIR" rev-parse --short HEAD 2>/dev/null || echo latest)}"
FULL_IMAGE="${IMAGE_NAME}:${TAG}"

echo "→ Building frontend image ${FULL_IMAGE}"
docker build -f "$DOCKERFILE" -t "$FULL_IMAGE" "$ROOT_DIR/frontend"

echo "→ Deploying frontend container via docker compose"
docker compose -f "$COMPOSE_FILE" up -d frontend

echo "✔ Frontend deployed (image: $FULL_IMAGE)"
