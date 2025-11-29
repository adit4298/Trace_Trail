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
| `ai_module/` | `uvicorn main:app --reload --app-dir ai_module` (Prometheus metrics via `/metrics`) | `pytest` |

Use the top-level `docker-compose.yml` or scripts under `scripts/` for local orchestration once all services are configured.
