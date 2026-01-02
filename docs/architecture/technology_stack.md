# Technology Stack

Trace Trail combines a modern TypeScript frontend, a Python/FastAPI backend, and
a modular AI engine. This table summarizes the core technologies and why we
picked them.

---

## Frontend

- **Framework:** Next.js 14 + React 18 + TypeScript.
- **Tooling:** Next.js App Router, ESLint, Prettier, Tailwind CSS, PostCSS.
- **UI Libraries:** Recharts (visualizations), Lucide React (icons),
  React Context for state management.
- **State:** React Context + custom hooks, Next.js server components.
- **Deployment:** Vercel (automatic deployments, SSL, CDN).
- **Testing:** Jest + React Testing Library (configured).

Reasoning: Server-side rendering, excellent DX, automatic optimizations, zero-config deployment.

---

## Backend

- **Framework:** FastAPI (async Python web framework).
- **ORM:** SQLAlchemy + Alembic migrations.
- **Validation:** Pydantic models (request/response schemas).
- **Auth:** JWT via PyJWT/passlib.
- **Testing:** Pytest + httpx + pytest-asyncio.
- **Packaging:** Requirements split between `base` and `dev`.

Reasoning: Modern async stack, automatic docs, strong typing, easy scaling.

---

## AI Module

- **Runtime:** Python 3.11 virtual environment under `ai_module/`.
- **Libraries:** scikit-learn, numpy/pandas (see `requirements.txt`), custom
  modules for anomaly detection (`models/anomaly_detector.py`), recommendation
  engine, and trend analysis.
- **Data Tooling:** Synthetic data generators + preprocessing pipelines in
  `ai_module/data/`.
- **Experimentation:** Jupyter notebooks inside `ai_module/notebooks/`.

Reasoning: Keeps ML dependencies isolated while reusing Python expertise.

---

## DevOps & Tooling

- **Containerization:** Docker + docker-compose for local development.
- **CI/CD:** 
  - Vercel: Automatic deployments on Git push
  - Render: Automatic deployments on Git push (or manual)
- **Hosting:**
  - Frontend: Vercel (free tier, no credit card required)
  - Backend: Render (free tier, no credit card required)
  - Database: Render PostgreSQL (free tier)
- **Monitoring:** 
  - Vercel: Built-in analytics and logs
  - Render: Built-in logs and metrics
  - Health checks: `/health` endpoint on backend

---

## Supporting Services

- **Database:** PostgreSQL 14+.
- **Cache/Queue (optional):** Redis when background jobs are introduced.
- **Object Storage:** S3/Azure Blob for reports (planned).
- **Browser Extension:** Chrome MV3 extension (TypeScript) under
  `chrome_extension/`.

---

## Local Productivity

- **Task runners:** Makefile targets (coming soon) + `scripts/` for helper
  commands.
- **Formatters/Linters:** Prettier, ESLint, Black/Ruff (backend).
- **Pre-commit Hooks:** Configure once `.pre-commit-config.yaml` is added.

Update this document whenever the stack shifts (e.g. new databases, queueing,
analytics tooling).


