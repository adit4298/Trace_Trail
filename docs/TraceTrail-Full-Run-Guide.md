## TraceTrail – End‑to‑End Run & Demo Guide

This guide explains how to run the **entire TraceTrail stack** (frontend, backend, AI module, Postgres, Redis) for local development and demos, plus how to export this guide as a PDF for presentations.

---

## 1. High‑level architecture

- **Frontend (`frontend/`)**: Next.js 14 + TypeScript dashboard on **http://localhost:3000**.
- **Backend (`backend/`)**: FastAPI service with PostgreSQL + Redis on **http://localhost:8000**.
- **AI Module (`ai_module/`)**: FastAPI microservice for analytics on **http://localhost:8082**.
- **Shared infrastructure**:
  - **PostgreSQL** for application data.
  - **Redis** for caching / future background tasks.

All services are wired together in the root `docker-compose.yml`.

---

## 2. Fastest way: run everything with Docker

**Prerequisites**

- Docker Desktop installed and running.
- From the repository root (`Trace_Trail/`).

**Command (PowerShell or bash):**

```bash
cd Trace_Trail
docker compose up --build
```

This will:

- Build images for `frontend`, `backend`, and `ai_module`.
- Start **Postgres**, **Redis**, **backend**, **ai_module**, and **frontend**.

Once the containers are healthy, open:

- **Frontend UI**: `http://localhost:3000`
- **Backend API**:
  - Root: `http://localhost:8000/`
  - Health: `http://localhost:8000/health`
  - Docs: `http://localhost:8000/docs`
- **AI Module API**:
  - Root: `http://localhost:8082/`
  - Metrics: `http://localhost:8082/metrics`

**Stopping everything:**

```bash
docker compose down
```

This is the **recommended way to demo the full project** because it uses the exact same configuration every time.

---

## 3. Running everything manually (without Docker)

Sometimes you want to run services directly (for debugging or hot‑reloading). Below is a step‑by‑step flow on a single machine.

### 3.1. Start PostgreSQL and Redis

Choose one:

- **Option A – Docker only for infra (recommended)**:

  ```bash
  cd backend
  docker compose -f docker-compose.dev.yml up postgres redis
  ```

- **Option B – Local installations**:
  - Install PostgreSQL 15+ and Redis 7+.
  - Ensure Postgres is listening on `localhost:5432` and Redis on `localhost:6379`.

Make sure your `backend/.env` uses the same connection details as your running Postgres instance.

---

### 3.2. Start the backend (FastAPI)

From `Trace_Trail/backend`:

```bash
cd backend
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements/dev.txt
pip install -e .

cp .env.example .env   # only needed once; then edit .env
```

In `.env`, verify:

- `DATABASE_URL` matches your Postgres instance.
- `CORS_ORIGINS` includes `http://localhost:3000`.

Run migrations and start the server:

```bash
alembic upgrade head
uvicorn src.main:app --reload
```

Verify in the browser:

- `http://localhost:8000/` → basic JSON status.
- `http://localhost:8000/health` → health payload.
- `http://localhost:8000/docs` → interactive Swagger UI.

Leave this terminal **running**.

---

### 3.3. Start the AI module

In a **new terminal**, from `Trace_Trail/ai_module`:

```bash
cd ai_module
python -m venv .venv
.venv\Scripts\Activate.ps1   # Windows
# or: source .venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
```

Optional: create and edit `.env` for AI settings (or rely on defaults).

Start the AI FastAPI app:

```bash
uvicorn ai_module.main:app --reload --host 0.0.0.0 --port 8082
```

Check in the browser:

- `http://localhost:8082/` → AI module root.
- `http://localhost:8082/docs` → AI API docs.
- `http://localhost:8082/metrics` → Prometheus metrics.

Leave this terminal **running**.

---

### 3.4. Start the frontend (Next.js)

In a **third terminal**, from `Trace_Trail/frontend`:

```bash
cd frontend
npm install
```

Ensure the backend URL is configured. For local dev:

- Either set `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000` in a `.env.local` file.
- Or rely on any default in the code if provided.

Start the dev server:

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser. The dashboard should load and talk to the backend (and indirectly the AI module if wired).

---

## 4. Typical “demo flow” for a presentation

1. **Start everything with Docker (easiest):**
   - `docker compose up --build`
2. **Open key URLs in browser tabs:**
   - `http://localhost:3000` – main dashboard.
   - `http://localhost:8000/docs` – backend API docs.
   - `http://localhost:8082/docs` – AI module docs.
   - `http://localhost:8082/metrics` – AI observability.
3. **Walkthrough sequence:**
   - Show the **dashboard UI** and describe the metrics/cards and what data they represent.
   - Explain that the UI sends requests to the **backend** (FastAPI).
   - From FastAPI docs, trigger one or two endpoints and show responses.
   - Explain that certain backend routes call the **AI module** for risk scores / recommendations.
   - Show the AI module docs and, optionally, call one `/api/ai/*` endpoint.
   - Finally, open `/metrics` to highlight observability and monitoring.

For a deeper technical demo, you can also show:

- Backend logs in the container or terminal (structured logs with request IDs).
- How changing `.env` or model config in the AI module affects responses.

---

## 5. Health checks & verification endpoints

- **Backend**
  - Root: `GET /` → basic JSON `{"status": "ok", ...}`.
  - Health: `GET /health` → uptime and environment info.
  - Docs: `GET /docs`.
- **AI Module**
  - Root: `GET /` → basic status for the AI service.
  - Metrics: `GET /metrics` → Prometheus‑formatted metrics.
  - API: `GET /docs` → full AI API schema.
- **Frontend**
  - `GET /` on `http://localhost:3000` → dashboard.

If any of these return 500 or fail to connect, check the corresponding service logs (Docker container logs or the terminal where you ran the process).

---

## 6. Exporting this guide as a PDF

You can turn this markdown file into a PDF in several ways:

- **VS Code Markdown preview:**
  - Open `docs/TraceTrail-Full-Run-Guide.md`.
  - Use “Open Preview” (or `Ctrl+Shift+V`).
  - Use a Markdown‑to‑PDF extension, or copy into Word/Google Docs and export as PDF.
- **Browser print to PDF:**
  - Render the markdown in any viewer that opens in a browser and use **Print → Save as PDF**.

This PDF can then be shared alongside your presentation as a “how to run everything” handout.

---

## 7. One‑page summary (for slides)

- **One command (Docker, from repo root):**

  ```bash
  docker compose up --build
  ```

- **Key URLs:**
  - Frontend: `http://localhost:3000`
  - Backend: `http://localhost:8000` (`/health`, `/docs`)
  - AI Module: `http://localhost:8082` (`/docs`, `/metrics`)

- **Manual dev (3 terminals):**
  1. `backend/` → `uvicorn src.main:app --reload`
  2. `ai_module/` → `uvicorn ai_module.main:app --reload --port 8082`
  3. `frontend/` → `npm run dev`

This is usually all you need to **explain and demonstrate the full TraceTrail system end‑to‑end**.


