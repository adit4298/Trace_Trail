# Getting Started

Use this guide to provision a local Trace Trail environment that mirrors the CI
build. It covers prerequisites, repo structure, and the commands needed to boot
backend, frontend, and AI services.

---

## 1. Prerequisites

| Component   | Version (minimum) | Notes                              |
| ----------- | ----------------- | ---------------------------------- |
| Node.js     | 20.x LTS          | For the Vite/React frontend        |
| Python      | 3.11              | Backend (`backend/`) + AI module   |
| PostgreSQL  | 14+               | Primary data store                 |
| Redis       | Optional          | Needed only if enabling job queue  |
| Docker/WSL2 | Optional          | Simplifies multi-service launches  |

Install platform dependencies with package managers (Homebrew/Chocolatey) or
use the scripts under `scripts/` for automated setup steps.

---

## 2. Repository Layout (abridged)

```
Trace_Trail/
├── backend/          # FastAPI + SQLAlchemy services
├── frontend/         # React + Vite SPA
├── ai_module/        # Risk, recommendation, and ML utilities
├── chrome_extension/ # Optional data capture surface
├── deployment/       # IaC templates & CI/CD helpers
└── docs/             # You are here
```

---

## 3. Environment Variables

1. Copy the sample file `deployment/.env.example` (or create one manually) into
   the `backend/` root as `.env`.
2. Provide at least:
   - `DATABASE_URL=postgresql+psycopg://user:pass@localhost:5432/tracetrail`
   - `SECRET_KEY=<random 32+ char string>`
   - `EXTENSION_WEBSOCKET_ENABLED=false` unless testing the extension.
3. Frontend consumes environment values prefixed with `VITE_` (see
   `frontend/.env.example` if available). By default it points to
   `http://localhost:8000`.

---

## 4. Backend Setup (`backend/`)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # PowerShell (use source for Unix shells)
pip install -r requirements/base.txt
alembic upgrade head          # Apply migrations under backend/alembic/
uvicorn src.main:app --reload
```

- Routers live under `backend/src/*/router.py`.
- `src/core/config.py` centralizes environment validation.
- Tests are stored in `backend/tests/`; run `pytest`.

---

## 5. Frontend Setup (`frontend/`)

```bash
cd frontend
npm install
npm run dev            # Starts Vite on http://localhost:5173
```

- Routes are defined in `src/App.tsx`.
- Shared UI sits inside `src/components/`.
- Global state lives in `src/context/` with dedicated React contexts.

---

## 6. AI Module (`ai_module/`)

The AI module exposes scoring/recommendation utilities and can be run as a
standalone FastAPI service:

```bash
cd ai_module
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8100
```

- Datasets for synthetic data live in `data/datasets/`.
- Training notebooks are under `notebooks/`.
- API schemas live in `api/schemas.py`.

---

## 7. Running Everything Together

Option A — Manual:

1. Start PostgreSQL.
2. Run the backend (`uvicorn ...`).
3. Run the frontend (`npm run dev`).
4. Run the AI module if tests or endpoints depend on it.

Option B — Docker Compose:

- Use `docker-compose.yml` (root) to spin up services with a single command:

```bash
docker compose up --build
```

The compose file currently covers the backend API and PostgreSQL. You still run
the frontend locally for rapid iteration.

---

## 8. Verification Checklist

- `http://localhost:8000/docs` renders the FastAPI swagger UI.
- `npm run lint` and `npm run test` (frontend, once tests are added) succeed.
- `pytest` (backend) completes without failures.
- The dashboard page pulls mocked data from `frontend/src/services/*Service.ts`.

If any step fails, see `docs/api/api_overview.md` and `docs/backend/backend_setup.md`
for additional troubleshooting tips.


