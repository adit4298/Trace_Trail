# Backend Deployment Guide

Use this guide to ship the FastAPI service to staging or production. It covers
containerization, environment configuration, and operational checks.

---

## 1. Build Container Image

Create a Dockerfile (sample in `deployment/docker/backend.Dockerfile`) or use:

```Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY backend/pyproject.toml backend/requirements ./   # adjust if needed
RUN pip install --no-cache-dir -r requirements/base.txt
COPY backend/src ./src
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build + tag:

```bash
docker build -t registry.example.com/tracetrail-api:$(git rev-parse --short HEAD) -f deployment/docker/backend.Dockerfile .
```

---

## 2. Environment Configuration

Set the following secrets in your deployment platform (GitHub Actions, Azure
App Service, etc.):

- `DATABASE_URL`
- `SECRET_KEY`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `REFRESH_TOKEN_EXPIRE_DAYS`
- `EXTENSION_WEBSOCKET_ENABLED`
- `SOCIAL_MEDIA_API_KEY` (optional integrations)

Use distinct values per environment. Never bake secrets into images.

---

## 3. Database Management

- Run `alembic upgrade head` as part of release pipelines before starting the
  new container.
- For blue/green deployments, point both versions to the same database only if
  migrations are backward compatible.

---

## 4. Observability

- Enable FastAPI logging at INFO by default; set `LOG_LEVEL` env var to adjust.
- Pipe logs to your platform collector (e.g. Azure Monitor, CloudWatch).
- Add health probes:
  - Liveness: `GET /hello`
  - Readiness: `GET /health` (add route in `src/main.py` if missing)

---

## 5. Scaling & Performance

- Use `gunicorn` or `uvicorn` workers behind a process manager for production:

```bash
gunicorn -k uvicorn.workers.UvicornWorker src.main:app -w 4 -b 0.0.0.0:8000
```

- Horizontal scaling is supported because the app is stateless; session data
  lives in JWTs/DB.
- Enable connection pooling via SQLAlchemy engine args if needed.

---

## 6. Security Checklist

- Serve only over HTTPS.
- Rotate `SECRET_KEY` and DB credentials regularly.
- Restrict CORS origins in `.env` for prod (update `CORS_ORIGINS`).
- Configure rate limiting (via API gateway or middleware) for `/auth/*`.
- Keep dependencies updated (`pip install -r requirements/base.txt --upgrade`).

---

## 7. Rollback Plan

1. Keep the previous container image tagged (e.g. `:previous`).
2. To rollback, redeploy the prior image and, if necessary, downgrade database
   schemas with `alembic downgrade <rev>`.
3. Document the incident in `CHANGELOG.md` or runbooks.

---

## 8. CI/CD Hooks

- GitHub Actions workflow template lives in `deployment/github-actions/backend.yml`
  (if present). It should:
  1. Install dependencies.
  2. Run `pytest`.
  3. Build and push Docker image.
  4. Apply migrations.
  5. Deploy to the target environment.

Update this document whenever deployment tooling changes.


