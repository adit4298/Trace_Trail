# Deployment Overview

This doc explains how all Trace Trail services move from local development to
staging and production. Use it to orient new DevOps contributors and to plan
release checklists.

---

## Environments

| Environment | Purpose                          | Notes                                      |
| ----------- | -------------------------------- | ------------------------------------------ |
| Local       | Developer machines               | Run via `docker-compose` or manual scripts |
| Staging     | QA/UAT, integration tests        | Mirrors production configurations          |
| Production  | Live users                       | High availability + stricter security      |

---

## Deployable Units

1. **Backend API (`backend/`)**
   - Docker image deployed to container host or Kubernetes.
   - Requires PostgreSQL + secrets.
2. **Frontend SPA (`frontend/`)**
   - Static assets built with Vite, served via CDN/storage.
3. **AI Module (`ai_module/`)**
   - Optional service; can be deployed separately to scale ML workloads.
4. **Chrome Extension**
   - Packaged and submitted to Chrome Web Store (manual review).

---

## Release Flow

1. Merge PR into `main`.
2. CI pipeline runs tests (backend, frontend, ai_module).
3. Build artifacts:
   - Backend Docker image.
   - Frontend `dist/` bundle uploaded to storage.
4. Apply database migrations.
5. Deploy to staging, run smoke tests (Postman collection, UI regression).
6. Promote to production upon approval.

---

## Configuration Management

- Store environment-specific values in `deployment/config/<env>.tfvars` or
  `.yaml` files (depending on IaC tooling).
- Secrets managed via cloud-native services (Azure Key Vault, AWS Secrets
  Manager, etc.).
- Document all required variables in `docs/deployment/environment_variables.md`.

---

## Monitoring & Alerts

- Hook application logs to centralized logging.
- Add uptime checks for `/hello` and `/docs`.
- Configure alerts for:
  - High error rate (≥5% 5xx responses).
  - DB connection saturation.
  - Queue backlog (future).

---

## Rollback Strategy

- Keep previous release artifacts available.
- DB migrations must be reversible (`alembic downgrade`).
- Automate rollback via pipeline or runbooks to reduce human error.

---

## Compliance & Access

- Limit production deploy rights to release engineers.
- Audit deployments via CI logs and Git tags.
- Store architecture diagrams and DR plans in `docs/architecture/`.


