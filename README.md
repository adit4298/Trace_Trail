## TraceTrail Monorepo

This repository contains the primary services that power TraceTrail:

- `frontend/` – Next.js dashboard that visualizes trust & safety signals.
- `backend/` – FastAPI/PostgreSQL service for core business logic.
- `ai_module/` – FastAPI microservice exposing privacy-risk scoring, recommendations, trend insights, and anomaly detection (recently refactored with a unified pipeline).

### Getting started

```bash
git clone <repo>
cd Trace_Trail
```

Each subsystem ships with its own README containing setup instructions. At a glance:

| Directory | Dev server | Tests |
| --- | --- | --- |
| `frontend/` | `npm run dev` | `npm run test`, `npm run test:e2e` |
| `backend/` | `uvicorn src.main:app --reload` | `pytest` |
| `ai_module/` | `uvicorn ai_module.main:app --reload --app-dir ai_module` (Prometheus metrics via `/metrics`) | `pytest` |

### Run everything with Docker

```bash
docker compose up --build
```

This spins up:

- `frontend` on http://localhost:3000
- `backend` on http://localhost:8000 (FastAPI + Postgres + Redis)
- `ai_module` on http://localhost:8082 (metrics at `/metrics`)

Compose uses sensible defaults (see `docker-compose.yml`). Override variables by exporting them before running `docker compose` if needed.
