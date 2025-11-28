# Technology Stack

Trace Trail combines a modern TypeScript frontend, a Python/FastAPI backend, and
a modular AI engine. This table summarizes the core technologies and why we
picked them.

---

## Frontend

- **Framework:** React 18 + TypeScript.
- **Tooling:** Vite, ESLint, Prettier, Tailwind CSS, PostCSS.
- **UI Libraries:** Recharts (visualizations), Framer Motion (animations),
  React Hook Form + Zod (forms/validation).
- **State:** React Context + custom hooks (`useAuth`, `useDashboard`).
- **Testing:** Vitest/RTL (to be enabled).

Reasoning: fast DX, HMR, strong typing, and small bundle sizes.

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

- **Containerization:** Docker + docker-compose for local parity.
- **CI/CD:** GitHub Actions / Azure DevOps templates stored in `deployment/`.
- **IaC:** Terraform/Bicep scripts (when added) live side-by-side in
  `deployment/`.
- **Monitoring:** Logging via platform (CloudWatch/App Insights). OTEL to be
  added.

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


