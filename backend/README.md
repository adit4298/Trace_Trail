# TraceTrail Backend (FastAPI + PostgreSQL)

FastAPI service that powers TraceTrail’s dashboard, analytics, and extension APIs. The codebase now ships with an application factory, consistent middleware, observability, and an installable package layout so you can run or test it anywhere.

## Quick start

```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements/dev.txt
pip install -e .

cp .env.example .env  # configure DATABASE_URL, SECRET_KEY, etc.
uvicorn src.main:app --reload
```

Run migrations (from the `backend/` directory):

```bash
alembic upgrade head
```

## Tests & tooling

```bash
python -m pytest tests -q
black src tests
isort src tests
flake8 src tests
mypy src
```

## Docker

```
docker compose -f docker-compose.dev.yml up --build
```

This starts the FastAPI app (hot-reloaded) plus PostgreSQL and Redis for local development.

## Project layout

```
backend/
├─ src/              # Python package (importable as `src`)
│  ├─ core/          # config, app factory, database, middleware
│  ├─ auth/, users/, analysis/, …  # domain routers/services
│  └─ health/        # health check endpoint
├─ tests/            # pytest suite
├─ requirements/     # base + dev dependencies
├─ pyproject.toml    # editable install + tooling config
├─ docker-compose.dev.yml
└─ Dockerfile
```

## Helpful commands

| Command | Description |
| --- | --- |
| `pip install -e .` | Install the backend as a package (`src.*` imports work everywhere). |
| `uvicorn src.main:app --reload` | Run the API locally. |
| `python -m pytest tests -q` | Execute backend tests. |
| `alembic upgrade head` | Apply database migrations. |
| `docker compose -f docker-compose.dev.yml up --build` | Run app + Postgres + Redis locally. |