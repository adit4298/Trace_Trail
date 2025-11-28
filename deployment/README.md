# Deployment toolkit

The `deployment/` directory bundles everything required to run Trace Trail
locally with Docker Compose, publish production-grade container images, and roll
those images out to Kubernetes clusters. All assets mirror the real repository
layout so build commands in CI/CD match what developers use locally.

```
deployment/
├── Docker/           # Dockerfiles + docker-compose for local/single-node setups
├── environments/     # Sample .env bundles for dev/staging/prod
├── kubernetes/       # Namespaces, config, deployments, services, ingress
├── nginx/            # Reverse proxy configs + TLS placeholder
├── ci_cd/            # GitHub/GitLab workflows wired to scripts/ci_cd/*
└── README.md         # (this file)
```

---

## 1. Local runtime (Docker Compose)

1. Copy `environments/development.env` to `deployment/.env` and adjust any
   secrets or ports.
2. From the repository root run:

   ```bash
   docker compose --env-file deployment/.env \
     -f deployment/Docker/docker-compose.yml up --build
   ```

3. Available endpoints:
   - Backend API – http://localhost:${NGINX_HTTP_PORT}/api (Swagger at `/docs`)
   - Frontend SPA – http://localhost:${NGINX_HTTP_PORT}/
   - AI module – http://localhost:${AI_PORT}/docs
   - Postgres – `postgresql://POSTGRES_USER:POSTGRES_PASSWORD@localhost:POSTGRES_PORT/POSTGRES_DB`

The compose stack covers Postgres, optional Redis, backend, frontend, AI module,
and an nginx edge proxy. Source directories are mounted for fast iteration while
still using the production Dockerfiles for parity.

---

## 2. Kubernetes manifests

`deployment/kubernetes/` provides opinionated, environment-agnostic manifests:

- `service.yaml` — namespace + shared ConfigMap/Secret templates
- `postgres-deployment.yaml` — StatefulSet + PVC for the database
- `backend-deployment.yaml`, `frontend-deployment.yaml`, `ai-deployment.yaml`
  — Deployments & Services referencing tagged container images
- `ingress.yaml` — nginx ingress routing requests for SPA + API

Apply in order:

```bash
kubectl apply -f deployment/kubernetes/service.yaml
kubectl apply -f deployment/kubernetes/postgres-deployment.yaml
kubectl apply -f deployment/kubernetes/backend-deployment.yaml
kubectl apply -f deployment/kubernetes/frontend-deployment.yaml
kubectl apply -f deployment/kubernetes/ai-deployment.yaml
kubectl apply -f deployment/kubernetes/ingress.yaml
```

Customize image names/tags via `kubectl set image …` or by updating the YAML
before applying.

---

## 3. CI/CD pipelines

Automation blueprints live in `deployment/ci_cd/`:

- `.github/workflows/ai-ci.yml` — GitHub Actions pipeline that runs
  `scripts/ci_cd/test.sh`, builds/pushes Docker images, then deploys to
  Kubernetes when commits land on `main`.
- `gitlab-ci.yml` — Equivalent multi-stage pipeline for GitLab runners.

Both workflows rely on the helper scripts inside `scripts/ci_cd/` to ensure a
single source of truth for builds/tests.

Required secrets (GitHub or GitLab):

| Secret                  | Purpose                                 |
| ----------------------- | --------------------------------------- |
| `DOCKERHUB_USERNAME`    | Push images to Docker Hub / registry    |
| `DOCKERHUB_TOKEN`       | Registry token/API key                  |
| `KUBE_CONFIG`           | Base64 encoded kubeconfig for deploy job|
| `REGISTRY_USER/TOKEN`   | (GitLab example) registry credentials   |

---

## 4. Environment bundles

Sample `.env` files in `environments/` list every variable consumed by the
backend (`src/core/config.py`), frontend (`VITE_*`), AI service, and nginx.
Copy the appropriate template, set the real secrets in your secret manager, and
load them via `--env-file` (Docker) or as CI/CD job variables.

---

## 5. Extensibility guidelines

- Prefer editing `scripts/` or `docs/deployment/` when adding new operational
  flows. Reference those scripts from Compose, Kubernetes, and CI/CD to avoid
  duplication.
- Keep TLS material outside the repo—`nginx/ssl/.gitkeep` is only a placeholder.
- When adding new services, update the Compose file, create matching Dockerfiles,
  extend Kubernetes manifests, and document the change here.
