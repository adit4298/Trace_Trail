# System Architecture

This document outlines how Trace Trail components interact end-to-end. Refer to
`docs/architecture/architecture_diagram.png` for the visual counterpart.

---

## High-Level Components

### 1. Client Layer

**Next.js Frontend** (`frontend/`):
- **Technology**: Next.js 14 with App Router, React 18, TypeScript
- **Deployment**: Vercel at `https://app.tracetrail.in`
- **Features**: 
  - Server-side rendering for SEO
  - Client-side interactivity
  - Dashboard visualization
  - Account management UI
  - Settings and preferences
- **Communication**: REST API to backend

**Chrome Extension** (`chrome_extension/`):
- **Status**: Optional, for future telemetry collection
- **Purpose**: Capture browsing signals
- **Communication**: REST API or WebSocket to backend

**API Consumers**:
- Postman collections for testing
- Future: Partner integrations

### 2. API Layer

**FastAPI Backend** (`backend/`):
- **Technology**: FastAPI, Python 3.11, SQLAlchemy
- **Deployment**: Render at `https://api.tracetrail.in`
- **Features**:
  - REST API endpoints
  - OAuth 2.0 implementation
  - JWT authentication
  - Account synchronization
  - Signal processing
  - Anomaly detection
  - Health score calculation
- **Architecture**: Modular routes, service layer, repository pattern

### 3. AI/Risk Engine

**AI Module** (`ai_module/`):
- **Technology**: Python, scikit-learn, custom ML models
- **Status**: Development/testing, optional for production
- **Features**:
  - Risk scoring algorithms
  - Anomaly detection models
  - Recommendation engine
  - Trend analysis
- **Integration**: Called by backend via HTTP or shared library

### 4. Data Stores

**PostgreSQL Database**:
- **Location**: Render PostgreSQL (free tier)
- **Purpose**: Primary data store
- **Tables**: users, oauth_connections, signals, anomalies, system_health, activities
- **Features**: 
  - ACID compliance
  - JSONB for flexible schemas
  - Encrypted token storage
  - Relational integrity

**Future Storage**:
- Object storage for generated reports
- Cache layer (Redis) for performance

### 5. Messaging/Real-time

**Current**: REST API only

**Future**:
- WebSockets for real-time updates
- Message queues for background processing
- Event streaming for analytics

---

## Request Flow

### Server-Side Rendering (Next.js)

1. **User requests page** → Next.js server receives request
2. **Server Component executes** → Calls `fetchDashboardSnapshot()`
3. **API request** → HTTP request to FastAPI backend
4. **FastAPI router** → Route handler (e.g. `dashboard_routes.py`)
5. **Dependency injection** → Auth, database session injected
6. **Service layer** → Business logic (e.g. `HealthService`)
7. **Database query** → SQLAlchemy queries PostgreSQL
8. **Response** → Data returned to Next.js
9. **Server Component renders** → HTML generated with data
10. **Client receives** → Fully rendered HTML with data

### Client-Side Interaction

1. **User action** → Client Component event handler
2. **API service call** → `accountService.getAccounts()`
3. **HTTP request** → Fetch to FastAPI backend
4. **FastAPI processes** → Same flow as above
5. **Response** → JSON data returned
6. **State update** → React state updated
7. **UI re-render** → Component updates with new data

### OAuth Flow

1. **User clicks "Connect"** → Frontend calls `/auth/{provider}/redirect`
2. **Backend generates state** → JWT token with user ID
3. **OAuth URL returned** → Frontend redirects user
4. **User authorizes** → OAuth provider processes
5. **Provider callback** → Redirects to `/auth/{provider}/callback`
6. **Backend verifies state** → Validates JWT token
7. **Token exchange** → Exchanges code for access/refresh tokens
8. **Encrypt and store** → Tokens encrypted and saved to database
9. **Initial sync** → Backend fetches data from provider
10. **Process data** → Creates signals, detects anomalies
11. **Redirect to frontend** → Success/error redirect

---

## WebSocket Interaction

When `EXTENSION_WEBSOCKET_ENABLED=true`:

1. Extension authenticates via JWT.
2. Connects to `/ws/extension`.
3. `extension.websocket` module validates session and streams events (live risk
   updates, sync status) to clients.

---

## Deployment Topology

- **Local:** Docker Compose stands up Postgres + backend; frontend runs via Next.js dev server.
- **Production:** 
  - Frontend: Vercel (Next.js hosting with automatic deployments)
  - Backend: Render (FastAPI web service with PostgreSQL)
  - Domain: `tracetrail.in` with subdomains `app.tracetrail.in` and `api.tracetrail.in`
- **CI/CD:** 
  - Vercel: Automatic deployments on push to `main`
  - Render: Automatic deployments on push to `main` (or manual via dashboard)
  - Database migrations: Run manually via Render Shell

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


