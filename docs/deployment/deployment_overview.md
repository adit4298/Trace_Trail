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
   - FastAPI service deployed on Render (free tier).
   - Requires PostgreSQL + environment variables.
   - Uses dynamic port binding via `PORT` environment variable.
2. **Frontend (`frontend/`)**
   - Next.js application deployed on Vercel (free tier).
   - Server-side rendering with static optimization.
   - Environment variables configured via Vercel dashboard.
3. **AI Module (`ai_module/`)**
   - Optional service; can be deployed separately to scale ML workloads.
   - Currently used for local development and testing.
4. **Chrome Extension**
   - Packaged and submitted to Chrome Web Store (manual review).

---

## Release Flow

### Production (Current)

1. Merge PR into `main`.
2. **Vercel** automatically builds and deploys frontend on push to `main`.
3. **Render** automatically builds and deploys backend on push to `main`.
4. Database migrations run manually via Render Shell: `alembic upgrade head`
5. Verify deployment:
   - Frontend: `https://app.tracetrail.in`
   - Backend: `https://api.tracetrail.in/health`
   - API Docs: `https://api.tracetrail.in/docs`

### Local Development

- Use Docker Compose for local parity: `docker compose up --build`
- Or run services manually (see `getting_started.md`)

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


