#!/usr/bin/env bash

# Build and deploy the FastAPI backend using the Docker artefacts in deployment/Docker.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE_FILE="${ROOT_DIR}/deployment/Docker/docker-compose.yml"
DOCKERFILE="${ROOT_DIR}/deployment/Docker/Dockerfile.backend"
IMAGE_NAME="${IMAGE_NAME:-tracetrail-backend}"
TAG="${TAG:-$(git -C "$ROOT_DIR" rev-parse --short HEAD 2>/dev/null || echo latest)}"
FULL_IMAGE="${IMAGE_NAME}:${TAG}"

echo "→ Building backend image ${FULL_IMAGE}"
docker build -f "$DOCKERFILE" -t "$FULL_IMAGE" "$ROOT_DIR"

echo "→ Deploying backend container via docker compose"
docker compose -f "$COMPOSE_FILE" up -d backend

echo "✔ Backend deployed (image: $FULL_IMAGE)"
