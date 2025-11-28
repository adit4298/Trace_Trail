#!/usr/bin/env bash

# Build and deploy the AI module FastAPI service.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE_FILE="${ROOT_DIR}/deployment/Docker/docker-compose.yml"
DOCKERFILE="${ROOT_DIR}/deployment/Docker/Dockerfile.ai"
IMAGE_NAME="${IMAGE_NAME:-tracetrail-ai}"
TAG="${TAG:-$(git -C "$ROOT_DIR" rev-parse --short HEAD 2>/dev/null || echo latest)}"
FULL_IMAGE="${IMAGE_NAME}:${TAG}"

echo "→ Building AI module image ${FULL_IMAGE}"
docker build -f "$DOCKERFILE" -t "$FULL_IMAGE" "$ROOT_DIR/ai_module"

echo "→ Deploying AI module via docker compose"
docker compose -f "$COMPOSE_FILE" up -d ai

echo "✔ AI module deployed (image: $FULL_IMAGE)"
