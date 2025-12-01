# System Architecture

This document outlines how Trace Trail components interact end-to-end. Refer to
`docs/architecture/architecture_diagram.png` for the visual counterpart.

---

## High-Level Components

1. **Clients**
   - React SPA (`frontend/`) served via CDN.
   - Chrome extension (`chrome_extension/`) for optional telemetry.
   - API consumers (Postman, partner integrations).
2. **API Layer**
   - FastAPI service (`backend/src/main.py`) exposing REST + WebSocket endpoints.
3. **AI/Risk Engine**
   - Standalone module (`ai_module/`) for scoring, recommendations, anomaly
     detection.
4. **Data Stores**
   - PostgreSQL for transactional data.
   - Optional object storage/S3 for generated reports (future).
5. **Messaging/Real-time**
   - WebSockets for extension push updates. Future support for message queues.

---

## Request Flow

1. User hits SPA (Vite build). React Router loads appropriate page.
2. Page calls Axios service (e.g. `analysisService.ts`) pointing to FastAPI.
3. FastAPI router (e.g. `src.analysis.router`) delegates to service class and
   repository.
4. SQLAlchemy queries Postgres via `src.core.database` engine/session.
5. Responses return to the SPA. Dashboard contexts update local state.
6. Optional: backend invokes `ai_module` via internal HTTP call or shared lib for
   advanced scoring before persisting results.

---

## WebSocket Interaction

When `EXTENSION_WEBSOCKET_ENABLED=true`:

1. Extension authenticates via JWT.
2. Connects to `/ws/extension`.
3. `extension.websocket` module validates session and streams events (live risk
   updates, sync status) to clients.

---

## Deployment Topology

- **Local:** Docker Compose stands up Postgres + backend; frontend runs via Vite.
- **Staging/Prod:** API deployed as container(s) behind a load balancer. SPA is
  hosted on static hosting (S3+CloudFront, Azure Static Web Apps, etc.). AI
  module can scale independently.
- **CI/CD:** Workflows under `deployment/` build/push images and run migrations.

---

## Security Layers

- JWT auth required for all protected routes.
- CORS restricted to trusted origins (configurable).
- Role-based guards inside dependencies.
- HTTPS termination handled by platform (Ingress, Application Gateway, etc.).

---

## Future Enhancements

- Introduce event streaming (Kafka/Redis Streams) for long-running analysis.
- Add GraphQL gateway once analytics queries grow complex.
- Expand observability (OpenTelemetry traces) across backend and AI module.


