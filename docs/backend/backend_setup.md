# Backend Setup Guide

The Trace Trail backend is a FastAPI application located in `backend/`. It uses
SQLAlchemy, Alembic, and Pydantic settings. Follow the steps below to get a
local instance running.

---

## 1. Install Dependencies

```bash
cd backend
python -m venv .venv
. .venv/bin/activate           # PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements/base.txt
```

Optional tooling:

- `pip install -r requirements/dev.txt` for linters/test extras.
- `pre-commit install` if hooks are configured.

---

## 2. Configure Environment Variables

Create `backend/.env` with values expected by `src/core/config.py`:

```
APP_NAME=TraceTrail API
APP_VERSION=1.0.0
DATABASE_URL=postgresql+psycopg://user:pass@localhost:5432/tracetrail
SECRET_KEY=<32+ char string>
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=30
EXTENSION_WEBSOCKET_ENABLED=false
```

FastAPI automatically loads this file via `pydantic_settings`.

---

## 3. Database Migrations

```bash
alembic upgrade head   # apply migrations under backend/alembic/
```

- To create a new migration, run `alembic revision --autogenerate -m "desc"` and
  verify the generated SQL before committing.

---

## 4. Run the Server

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

- Browse interactive docs at `http://localhost:8000/docs`.
- Health endpoint: `GET /hello`.

---

## 5. Project Anatomy

```
src/
├── core/               # Config, DB session, middleware
├── auth/               # JWT issuance and guard dependencies
├── users/              # User profiles & preferences
├── analysis/           # Risk + recommendation engines
├── dashboard/          # Aggregate metrics
├── social_connections/ # Linked account management
├── challenges/         # Gamification services
├── reports/            # Report generation
├── visualizations/     # Data transformations for charts
└── extension/          # Browser extension endpoints + websockets
```

Service logic follows a consistent `router -> service -> repository -> models`
pattern to keep responsibilities isolated.

---

## 6. Testing

```bash
pytest
```

- Tests live in `backend/tests/`.
- Use `pytest.ini` for shared fixtures/markers.
- Add async tests via `pytest-asyncio` when exercising FastAPI endpoints.

---

## 7. Tooling

- **Formatting:** `black`/`ruff` (enable once configured in `requirements/dev.txt`).
- **Linting:** `mypy` for static types (optional but recommended).
- **Debugging:** Launch configurations can point to `src.main:app`.

Document any new tooling in this file to keep onboarding simple.


