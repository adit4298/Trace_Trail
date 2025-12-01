# Backend Deployment Runbook

This runbook covers shipping the FastAPI service contained in `backend/` to
staging or production. Pair it with `docs/backend/deployment_guide.md` for
additional context on configuration and tooling decisions.

---

## 1. Prerequisites

- Container registry (ACR/ECR/GHCR) with push permissions.
- PostgreSQL instance reachable from the target environment.
- Secrets stored in a manager (Azure Key Vault, AWS Secrets Manager, etc.).
- CI/CD runner capable of running Docker + Python 3.11.

---

## 2. Build & Publish Image

```bash
cd backend
docker build -t tracetrail-api:$(git rev-parse --short HEAD) -f deployment/docker/backend.Dockerfile .
docker tag tracetrail-api:$(git rev-parse --short HEAD) registry.example.com/tracetrail/api:$(git rev-parse --short HEAD)
docker push registry.example.com/tracetrail/api:$(git rev-parse --short HEAD)
```

- Dockerfile installs dependencies from `requirements/base.txt` and copies
  `src/`.
- For reproducible builds pin Python base image digest.

---

## 3. Configure Environment

Required variables (see `docs/deployment/environment_variables.md`):

```
APP_NAME=TraceTrail API
APP_VERSION=1.0.0
DATABASE_URL=postgresql+psycopg://svc_user:strongpass@db-host:5432/tracetrail
SECRET_KEY=<generated>
CORS_ORIGINS=https://app.tracetrail.com
EXTENSION_WEBSOCKET_ENABLED=false
```

- Store secrets per environment; never bake into the image.
- Set `LOG_LEVEL` (optional) via extra env var consumed in `src/core/config.py`.

---

## 4. Database Migrations

1. Mount/clone repo on the deployment runner.
2. Run `alembic upgrade head` with the same `DATABASE_URL` used by the service.
3. For zero-downtime releases, ensure migrations are backward compatible; if
   not, plan a short maintenance window.

---

## 5. Deploy

### Option A — Container App / App Service

1. Update image tag in infrastructure template (Bicep/Terraform).
2. Apply IaC changes (`terraform apply`, etc.).
3. Platform restarts the container with the new image.

### Option B — Kubernetes

1. Update `Deployment` manifest (image tag + env vars).
2. `kubectl apply -f k8s/backend-deployment.yaml`.
3. Verify rollout: `kubectl rollout status deployment/tracetrail-api`.

---

## 6. Post-Deploy Verification

- `GET /hello` → expect `{"msg": "Demo working!", "status": "Backend is up"}`.
- `GET /docs` renders OpenAPI UI.
- Run smoke tests via Postman collection (`docs/api/postman_collection.json`).
- Check logs for database connection errors or missing env vars.

---

## 7. Observability & Scaling

- Stream stdout/stderr to centralized logging (Application Insights, CloudWatch).
- Configure health probes:
  - Liveness: `/hello`
  - Readiness: `/dashboard/summary` (authenticated) or create `/health`.
- Scale vertically (memory/CPU) or horizontally (replica count) depending on
  CPU saturation and latency metrics.

---

## 8. Rollback

1. Redeploy previous container image tag.
2. If schema changes broke compatibility, run `alembic downgrade <rev>` to the
   prior migration.
3. Document incident + follow-up actions in `CHANGELOG.md` or ops log.

---

## 9. Security Checklist

- Enforce HTTPS + WAF at the ingress layer.
- Rotate `SECRET_KEY` and DB credentials regularly.
- Restrict inbound traffic to trusted CIDRs or VNet integration.
- Enable alerting for repeated 401/403 spikes (could indicate attacks).

