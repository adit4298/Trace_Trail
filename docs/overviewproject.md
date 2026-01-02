# Trace Trail — Project Overview

Trace Trail delivers privacy intelligence for consumers and analysts who need to
monitor their social footprint, quantify risk, and receive actionable guidance.
This document explains the “why” behind the stack and highlights the modules
you will touch most often.

---

## Mission

Give users a unified dashboard that reveals how their social accounts, shared
data, and behavioral signals translate into risk, then surface remediation steps
powered by an internal AI module.

Key promises:

- **Transparency** — users can audit every data point tied to their identity.
- **Actionability** — recommendations include impact, effort, and risk scoring.
- **Extensibility** — the chrome extension and AI module keep feeds fresh.

---

## Personas & Journeys

| Persona            | Goals                                           | Primary Modules                    |
| ------------------ | ----------------------------------------------- | ---------------------------------- |
| Privacy-minded user| Connect accounts, monitor risk, follow guidance | `frontend/`, `backend/src/analysis`|
| Analyst            | Compare cohorts, export reports, tune algorithms| `backend/src/reports`, `ai_module` |
| DevOps engineer    | Deploy safely, manage configs                   | `deployment/`, `docs/deployment/`  |

Typical flow:

1. User signs up through the React SPA (`frontend/src/pages/Signup.tsx`).
2. Authentication calls FastAPI (`backend/src/auth/router.py`) to issue JWTs.
3. Social connections sync via `backend/src/social_connections/`.
4. Analysis service persists scores and AI recommendations.
5. Dashboard UI (`frontend/src/pages/Dashboard.tsx`) fetches summaries via
   `frontend/src/services/dashboardService.ts`.

---

## High-Level Architecture

- **Frontend** — Next.js 14 + TypeScript, deployed on Vercel. Server-side rendering
  with client-side interactivity. Context providers handle auth, dashboard state, and themes.
- **Backend** — FastAPI service deployed on Render with modular routers for auth, analysis,
  OAuth connections, sync, signals, anomalies, and insights. SQLAlchemy + Alembic manage persistence.
- **AI Module** — Python service focused on scoring and recommendation engines.
  Feeds synthetic data, anomaly detection, and trend analysis back to the backend.
- **Chrome Extension** — Optional channel for capturing live browsing signals.
- **Deployment** — 
  - **Production**: Vercel (frontend) + Render (backend + PostgreSQL)
  - **Local**: Docker Compose for development parity
  - **Domain**: `tracetrail.in` with subdomains `app.tracetrail.in` and `api.tracetrail.in`

See `docs/architecture/system_architecture.md` for sequence diagrams.

---

## Feature Pillars

1. **Risk & Analysis**
   - `backend/src/analysis/risk_engine.py` calculates social/data exposure risk.
   - `analysis/router.py` exposes `/analysis/*` endpoints documented under
     `docs/api/analysis_endpoints.md`.

2. **Recommendations**
   - `RecommendationEngine` in the backend (and AI module) generates prioritized
     actions with impact scoring.
   - Surfaces on the frontend via `RecommendationCard` components.

3. **Challenges & Gamification**
   - `backend/src/challenges/` tracks progress; UI elements live in
     `frontend/src/components/challenges/`.

4. **Reports**
   - `backend/src/reports/` builds scheduled or on-demand PDFs/CSVs.

5. **Extensions & Integrations**
   - Chrome extension sends telemetry to `backend/src/extension/` via REST or
     WebSockets.

---

## Roadmap Snapshot

- ✅ Backend CRUD + analysis engine baseline.
- ✅ Frontend experience with dashboards, insights, recommendations.
- ✅ Production deployment on free platforms (Vercel + Render).
- ✅ OAuth integration (Google, Instagram, Facebook, Twitter/X).
- ✅ Frontend UI stabilization and error handling.
- 🚧 AI module integration into production workloads.
- 🚧 Automated report export & sharing.
- 🔜 Enhanced observability and monitoring.

Open product questions are tracked in `qa/` and surfaced as GitHub issues.

---

## Where to Go Next

- Implementation details → `docs/backend/` or `docs/frontend/`.
- Deployment and environment prep → `docs/deployment/`.
- API specifics → `docs/api/`.
- Decision records & diagrams → `docs/architecture/`.


