# Backend API Reference

This document summarizes the primary REST endpoints exposed by the FastAPI
service (`backend/src/main.py`). Full, parameter-level descriptions live under
`docs/api/*.md`, but this file offers a module-by-module cheat sheet.

---

## Authentication (`/auth`)

- `POST /auth/signup` — Create an account. Validates payload with
  `auth/schemas.py::SignupRequest`.
- `POST /auth/login` — Returns access + refresh tokens.
- `POST /auth/refresh` — Issue new access token using refresh token.
- `POST /auth/logout` — (Optional) Invalidate refresh tokens.

Dependencies enforce rate limiting and password policies via
`auth/service.py` + `auth/constants.py`.

---

## Users (`/users`)

- `GET /users/me` — Returns profile + preferences.
- `PATCH /users/me` — Update profile fields, security settings, notification
  preferences.
- `GET /users/{id}` — Admin-only lookup (future).

Models: `users/models.py`, `users/schemas.py`.

---

## Dashboard (`/dashboard`)

- `GET /dashboard/summary` — Aggregated KPIs for the logged-in user.
- `GET /dashboard/activity` — Recent events feed.
- `GET /dashboard/insights` — Snapshot data consumed by `QuickStats`.

Logic lives in `dashboard/service.py`, combining analysis + challenges data.

---

## Analysis (`/analysis`)

- `POST /analysis/run` — Triggers `AnalysisService.run_privacy_analysis`.
- `GET /analysis/summary` — Latest score + key risks.
- `GET /analysis/history` — Paginated history of past runs.

See `docs/api/analysis_endpoints.md` for response shapes.

---

## Social Connections (`/connections`)

- `GET /connections` — List linked accounts + sync metadata.
- `POST /connections` — Add a new platform connection.
- `POST /connections/{id}/sync` — Force a resync job.
- `DELETE /connections/{id}` — Remove a connection.

Validation and platform-specific rules live in `social_connections/validator.py`.

---

## Challenges (`/challenges`)

- `GET /challenges` — Available challenges grouped by type.
- `POST /challenges/{id}/accept` — Start a challenge.
- `POST /challenges/{id}/progress` — Update completion percentage.
- `GET /challenges/leaderboard` — Competitive standings.

---

## Reports (`/reports`)

- `GET /reports` — List generated reports.
- `POST /reports` — Generate a new report (PDF/CSV).
- `GET /reports/{id}` — Download report artifact.

The generator orchestrates templates and underlying queries (`reports/generator.py`).

---

## Visualizations (`/visualizations`)

Provides specialized data slices for charts:

- `GET /visualizations/risk-trend`
- `GET /visualizations/platform-breakdown`
- `GET /visualizations/heatmap`

---

## Extension (`/extension` + `/ws/extension`)

- REST endpoints capture events from the Chrome extension (`extension/router.py`).
- Optional WebSocket (`/ws/extension`) streams live risk updates if
  `EXTENSION_WEBSOCKET_ENABLED` is true in config.

---

## Error Handling & Responses

- All endpoints return `TraceTrailResponse` DTOs with `status`, `data`, and
  `meta` fields.
- Exceptions bubble through `src.shared.exceptions` and are transformed via
  FastAPI handlers in `src.core.middleware`.

---

## Versioning

- Current API version: `v1` (implicit). Include versioning in headers or paths
  when we introduce breaking changes. Track releases in `CHANGELOG.md`.


