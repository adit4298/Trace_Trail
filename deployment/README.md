# Deployment Toolkit

The `deployment/` directory packages everything needed to run Trace Trail
locally with Docker, ship container images, and promote the stack into managed
Kubernetes clusters. Every artifact mirrors the real repository layout so that
CI/CD can reuse the same build logic used by developers.

```
deployment/
├── Docker/           # Dockerfiles + docker-compose for local + single-node installs
├── environments/     # Sample .env files for dev/staging/prod
├── kubernetes/       # K8s manifests for backend, frontend, AI module, and data plane
├── nginx/            # Reverse proxy configuration + TLS placeholders
└── ci_cd/            # Example GitHub / GitLab pipelines wired to scripts/ci_cd/*
```

## 1. Docker Compose (local + single VM)

1. Copy `environments/development.env` to `deployment/.env` and update secrets.
2. Build & run everything:
   ```bash
   docker compose --env-file deployment/.env \
     -f deployment/Docker/docker-compose.yml up --build
   ```
3. Services:
   - API: http://localhost:8000 (`/hello`, `/docs`)
   - Frontend: http://localhost:5173 (served by nginx in prod)
   - AI module: http://localhost:8100/docs
   - Postgres: localhost:5432 (configured via env file)

The compose file mirrors the repo structure (`backend/`, `frontend/`,
`ai_module/`) so code changes are rebuilt automatically.

## 2. Kubernetes

`deployment/kubernetes/` ships a minimal, environment-agnostic set of manifests:

- `postgres-deployment.yaml` — StatefulSet + PVC for Postgres.
- `backend-deployment.yaml`, `frontend-deployment.yaml`, `ai-deployment.yaml`
  — Deployments + Services referencing container images produced by CI.
- `ingress.yaml` — HTTP(S) routing via nginx or any Ingress controller.
- `service.yaml` — Namespace, ConfigMap, and Secret templates (fill in real
  values before applying).

Apply with:
```bash
kubectl apply -f deployment/kubernetes/service.yaml
kubectl apply -f deployment/kubernetes/postgres-deployment.yaml
kubectl apply -f deployment/kubernetes/backend-deployment.yaml
kubectl apply -f deployment/kubernetes/frontend-deployment.yaml
kubectl apply -f deployment/kubernetes/ai-deployment.yaml
kubectl apply -f deployment/kubernetes/ingress.yaml
```

## 3. CI/CD

Automation lives under `deployment/ci_cd/`:

- `gitlab-ci.yml` demonstrates a multi-stage pipeline (test → build → deploy).
- `.github/workflows/ai-ci.yml` mirrors the same flow for GitHub Actions and
  delegates build/test steps to `scripts/ci_cd/build.sh` & `scripts/ci_cd/test.sh`.

Both expect the following secrets to exist in the target CI platform:

| Secret                   | Purpose                                 |
| ------------------------ | --------------------------------------- |
| `REGISTRY_USER` / `_PW`  | Push Docker images                      |
| `KUBE_CONFIG`            | Apply Kubernetes manifests              |
| `SECRET_KEY`             | Backend JWT signing key for deploys     |

## 4. Environment Files

The templates under `environments/` contain the superset of variables required
by the backend (`src/core/config.py`), frontend (`VITE_*`), and AI module. Copy
the file that matches your target environment, adjust secrets, and load it when
running Docker compose or your CI pipeline.

## 5. Extending

- Prefer editing `scripts/` when adding new operational logic, then consume
  those scripts from CI workflows to avoid drift.
- Keep documentation in `docs/deployment/` in sync when you add new services or
  environment variables.
