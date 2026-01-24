# TraceTrail - Master Documentation

**Version**: 2.0.0  
**Status**: DEMO / PROTOTYPE  
**Last Updated**: 2025

---

## Executive Summary

**What is TraceTrail?**

TraceTrail is a privacy intelligence platform that helps users monitor their digital footprint across social media platforms, assess privacy risk through automated analysis, and receive actionable recommendations to improve their privacy posture. The platform connects multiple social accounts (Google, Instagram, Facebook, Twitter/X) via OAuth, analyzes user data for security signals and anomalies, and provides a unified dashboard with risk scoring, trend analysis, and personalized recommendations.

**In Brief (3 Lines):**
- **Monitor**: Track your digital footprint across connected social media accounts (Google, Instagram, Facebook, Twitter/X) with real-time synchronization and signal detection.
- **Assess**: Automated privacy risk scoring, anomaly detection, and health score calculation based on connected accounts, signal volume, and detected threats.
- **Act**: Receive actionable, prioritized recommendations with impact scoring to improve your privacy posture and reduce digital exposure risks.

---

## Project Status

**Current Version**: DEMO / PROTOTYPE

This version of TraceTrail uses **demo data** due to security, privacy, and integration constraints. While the architecture and functionality reflect a production-ready design, the current implementation serves as a demonstration of the platform's capabilities. The system architecture, codebase structure, and feature set are designed to be production-ready, but actual OAuth integrations and real-time data processing are simulated for demonstration purposes.

---

## Technology Stack

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.0 | React framework with SSR/SSG, App Router |
| **React** | 18.3.1 | UI library for building interactive interfaces |
| **TypeScript** | 5.6.2 | Type safety and enhanced developer experience |
| **Tailwind CSS** | 3.4.14 | Utility-first CSS framework for styling |
| **Recharts** | 2.12.7 | Data visualization and charting library |
| **Lucide React** | 0.446.0 | Icon library for UI components |
| **date-fns** | 4.1.0 | Date utility library for formatting and manipulation |
| **clsx** | 2.1.1 | Utility for constructing className strings conditionally |

#### Frontend Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **@playwright/test** | 1.48.2 | End-to-end testing framework |
| **@tailwindcss/forms** | 0.5.9 | Tailwind plugin for form styling |
| **@testing-library/jest-dom** | 6.6.3 | Custom Jest matchers for DOM testing |
| **@testing-library/react** | 16.1.0 | React component testing utilities |
| **@testing-library/user-event** | 14.6.1 | User interaction simulation for tests |
| **@types/jest** | 29.5.12 | TypeScript types for Jest |
| **@types/node** | 20.16.10 | TypeScript types for Node.js |
| **@types/react** | 18.3.10 | TypeScript types for React |
| **@types/react-dom** | 18.3.0 | TypeScript types for React DOM |
| **@typescript-eslint/eslint-plugin** | 8.8.0 | ESLint plugin for TypeScript |
| **@typescript-eslint/parser** | 8.8.0 | ESLint parser for TypeScript |
| **autoprefixer** | 10.4.20 | PostCSS plugin for vendor prefixes |
| **eslint** | 8.57.1 | JavaScript/TypeScript linter |
| **eslint-plugin-import** | 2.31.0 | ESLint plugin for import/export syntax |
| **eslint-plugin-jsx-a11y** | 6.9.0 | ESLint plugin for accessibility rules |
| **eslint-plugin-tailwindcss** | 3.17.5 | ESLint plugin for Tailwind CSS |
| **identity-obj-proxy** | 3.0.0 | Identity object proxy for CSS modules in tests |
| **jest** | 29.7.0 | JavaScript testing framework |
| **postcss** | 8.4.47 | CSS transformation tool |
| **prettier** | 3.3.3 | Code formatter |
| **ts-jest** | 29.2.5 | TypeScript preprocessor for Jest |
| **eslint-config-next** | 14.2.0 | ESLint configuration for Next.js |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.11 | Runtime environment |
| **FastAPI** | 0.115.0 | Modern, high-performance web framework |
| **Uvicorn** | 0.32.0 | ASGI server for FastAPI |
| **SQLAlchemy** | 2.0.35 | ORM for database operations |
| **Alembic** | 1.13.3 | Database migration tool |
| **Pydantic** | 2.9.2 | Data validation using Python type annotations |
| **Pydantic Settings** | 2.6.0 | Settings management using Pydantic |
| **Python-JOSE** | 3.3.0 | JWT token handling and cryptography |
| **Passlib** | 1.7.4 | Password hashing library (bcrypt) |
| **psycopg2-binary** | 2.9.10 | PostgreSQL database adapter |
| **psycopg** | Latest | Modern PostgreSQL adapter |
| **httpx** | 0.27.2 | Async HTTP client for OAuth provider APIs |
| **APScheduler** | 3.10.4 | Advanced Python Scheduler for background tasks |
| **python-multipart** | 0.0.12 | Multipart form data parsing |
| **python-dotenv** | 1.0.1 | Environment variable management |
| **email-validator** | Latest | Email validation library |

### Database

| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | 14+ | Relational database for data persistence |
| **psycopg2** | 2.9.10 | PostgreSQL adapter for Python |

### Deployment Platforms

| Platform | Service | Purpose | URL |
|----------|---------|---------|-----|
| **Vercel** | Frontend Hosting | Next.js application deployment | `https://app.tracetrail.in` |
| **Render** | Backend Hosting | FastAPI web service | `https://api.tracetrail.in` |
| **Render** | PostgreSQL Database | Database hosting (free tier) | Internal connection |
| **GoDaddy** | DNS Management | Domain and DNS configuration | `tracetrail.in` |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Docker** | Containerization for local development |
| **Docker Compose** | Multi-container orchestration |
| **Git** | Version control |
| **GitHub** | Repository hosting and CI/CD integration |

---

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Next.js    │    │   Chrome     │    │   API       │  │
│  │   Frontend   │    │  Extension   │    │  Consumers  │  │
│  │  (Vercel)    │    │  (Optional)  │    │ (Postman)   │  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘  │
│         │                    │                    │          │
└─────────┼────────────────────┼────────────────────┼──────────┘
          │                    │                    │
          │ HTTPS/REST         │ WebSocket/REST     │ REST
          │                    │                    │
┌─────────▼────────────────────▼────────────────────▼──────────┐
│                      API LAYER                                │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         FastAPI Backend (Render)                     │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │  Auth    │  │  OAuth   │  │  Sync    │           │   │
│  │  │  Routes  │  │  Routes   │  │  Routes  │           │   │
│  │  └──────────┘  └──────────┘  └──────────┘           │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │ Dashboard│  │ Signals │  │ Anomalies│           │   │
│  │  │  Routes  │  │  Routes  │  │  Routes  │           │   │
│  │  └──────────┘  └──────────┘  └──────────┘           │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │         Service Layer                        │  │   │
│  │  │  - AuthService                               │  │   │
│  │  │  - OAuthService                              │  │   │
│  │  │  - SyncService                               │  │   │
│  │  │  - HealthService                             │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────┬────────────────────────────────────────────────────┘
          │
          │ SQLAlchemy ORM
          │
┌─────────▼────────────────────────────────────────────────────┐
│                    DATA LAYER                                 │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         PostgreSQL Database (Render)                 │   │
│  │  - users                                             │   │
│  │  - oauth_connections                                 │   │
│  │  - signals                                           │   │
│  │  - anomalies                                         │   │
│  │  - system_health                                     │   │
│  │  - activities                                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                    AI/ML LAYER (Optional)                     │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         AI Module (Local/Development)                │   │
│  │  - Risk Scoring Engine                              │   │
│  │  - Anomaly Detection                                │   │
│  │  - Recommendation Engine                            │   │
│  │  - Trend Analysis                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

1. **Frontend (Next.js 14)**
   - User interface and dashboard visualization
   - Account management UI
   - OAuth flow handling
   - Settings and preferences
   - Server-side rendering for SEO
   - Client-side interactivity

2. **Backend (FastAPI)**
   - REST API endpoints
   - JWT authentication
   - OAuth 2.0 implementation (Google, Instagram, Facebook, Twitter/X)
   - Account synchronization
   - Signal processing and anomaly detection
   - Health score calculation
   - Business logic and data validation

3. **Database (PostgreSQL)**
   - User accounts and authentication data
   - OAuth connections with encrypted tokens
   - Security signals and anomalies
   - System health snapshots
   - Activity logs

4. **AI Module (Optional)**
   - **Location**: `ai_module/`
   - **Status**: Development/Testing
   - **Framework**: FastAPI (standalone service, port 8100)
   - **Risk Scoring**: Weighted aggregation of Social Media Risk, Data Exposure Risk, and Privacy Settings Risk (0-100 scale)
   - **Anomaly Detection**: Statistical thresholds or tree-based models for unusual pattern detection
   - **Recommendation Engine**: Template-based recommendations with impact scoring
   - **Trend Analysis**: Data trend analysis over time
   - **Configuration**: Weights and thresholds in `config/model_config.json`
   - **Notebooks**: Jupyter notebooks for exploration, development, testing, and analysis

5. **Chrome Extension (Optional)**
   - **Location**: `chrome_extension/`
   - **Status**: Optional, for future telemetry collection
   - **Framework**: Chrome Manifest V3 (TypeScript)
   - **Purpose**: Capture live browsing signals and stream to backend
   - **Integration**: REST API or WebSocket (`/ws/extension` when enabled)

---

## Core Features

### 1. User Authentication
- JWT-based authentication system
- User registration and login
- Token refresh mechanism
- Secure password hashing (bcrypt)

### 2. OAuth Integration
- **Supported Providers**: Google, Instagram, Facebook, Twitter/X
- OAuth 2.0 Authorization Code flow
- Secure token storage (encrypted at rest)
- Automatic token refresh
- State validation for security

### 3. Account Management
- Connect/disconnect social accounts
- View connected accounts status
- Manual and automatic synchronization
- Last sync timestamp tracking
- Error handling and user feedback

### 4. Dashboard
- **Risk Score Visualization**: 3D health widget with color-coded status
- **Metrics & KPIs**: Key privacy metrics with trend indicators
- **Trend Charts**: Time-series visualization using Recharts
- **Activity Timeline**: Recent activity feed with detailed views
- **System Health Overview**: Comprehensive health breakdown

### 5. Signal Processing
- Automatic detection of security signals
- Signal categorization and prioritization
- Real-time signal updates
- Signal history and trends

### 6. Anomaly Detection
- Automated anomaly detection
- Severity classification (low, medium, high, critical)
- Anomaly correlation with signals
- Anomaly history and analysis

### 7. Health Scoring
- Automated health score calculation (0-100)
- Multi-factor scoring algorithm
- Health breakdown by category
- Historical health tracking

### 8. Settings & Preferences
- User profile management
- Notification preferences
- Theme switching (dark/light mode)
- Account settings

---

## Project Structure

### Frontend Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Dashboard home
│   ├── [section]/               # Dynamic routes
│   ├── dashboard/accounts/       # Account management
│   └── settings/                # Settings pages
├── components/                   # React components
│   ├── layout/                  # Layout components
│   ├── dashboard/               # Dashboard components
│   ├── accounts/                # Account management
│   ├── system-health/           # Health visualization
│   ├── cards/                   # Card components
│   └── ui/                      # UI primitives
├── lib/                          # Utilities
│   ├── api.ts                   # Server-side API client
│   └── types.ts                 # TypeScript types
├── src/                          # Additional source
│   ├── services/                # API services
│   ├── components/              # Additional components
│   ├── context/                 # React contexts
│   ├── hooks/                   # Custom hooks
│   └── utils/                    # Utility functions
├── styles/                       # Global styles
├── public/                       # Static assets
└── package.json                  # Dependencies
```

### Backend Structure

```
backend/
├── src/
│   ├── main.py                  # Application entry point
│   ├── app/
│   │   ├── core/                # Core functionality
│   │   │   ├── app.py          # FastAPI app factory
│   │   │   ├── config.py       # Configuration
│   │   │   ├── database.py     # Database setup
│   │   │   └── dependencies.py # Dependency injection
│   │   ├── routes/              # API route handlers
│   │   │   ├── auth_routes.py
│   │   │   ├── oauth_routes.py
│   │   │   ├── accounts_routes.py
│   │   │   ├── sync_routes.py
│   │   │   ├── signals_routes.py
│   │   │   ├── anomalies_routes.py
│   │   │   ├── insight_routes.py
│   │   │   └── health_routes.py
│   │   ├── services/            # Business logic
│   │   │   ├── sync_service.py
│   │   │   ├── health_service.py
│   │   │   └── activity_service.py
│   │   ├── models/              # SQLAlchemy models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── oauth/               # OAuth clients
│   │   └── utils/               # Utilities
├── alembic/                     # Database migrations
├── requirements/
│   ├── base.txt                 # Production dependencies
│   └── dev.txt                  # Development dependencies
├── tests/                        # Test suite
└── render.yaml                   # Render deployment config
```

---

## Deployment Architecture

### Production Environment

- **Frontend**: Vercel at `https://app.tracetrail.in`
  - Automatic deployments on push to `main`
  - Global CDN
  - Automatic SSL certificates
  - Zero-config Next.js deployment

- **Backend**: Render at `https://api.tracetrail.in`
  - FastAPI web service
  - Automatic deployments on push to `main`
  - Automatic SSL certificates
  - Health check endpoint: `/health`

- **Database**: Render PostgreSQL
  - Free tier (1GB storage, 90-day retention)
  - Internal connection URL
  - Manual backups on free tier

### Environment Variables

#### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | REST API base URL | `https://api.tracetrail.in` |
| `NEXT_PUBLIC_WS_URL` | WebSocket base URL (optional) | `wss://api.tracetrail.in` |

**Production (Vercel)**:
- `NEXT_PUBLIC_API_URL=https://api.tracetrail.in`

**Local Development**:
- `NEXT_PUBLIC_API_URL=http://localhost:8000`

#### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+psycopg://user:pass@host:5432/db` |
| `JWT_SECRET_KEY` | JWT signing secret (32+ characters) | `<secret>` |
| `ENCRYPTION_KEY` | Token encryption key (Fernet) | `<key>` |
| `CORS_ORIGINS` | Comma-separated allowed origins | `https://app.tracetrail.in,http://localhost:3000` |
| `ENVIRONMENT` | Environment name | `production`, `development`, `staging` |
| `DEBUG` | Enable debug mode | `true`/`false` |
| `SHOW_DOCS` | Toggle FastAPI docs | `true`/`false` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token TTL | `15` (default) |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token TTL | `7` (default) |
| `EXTENSION_ENABLED` | Feature flag for extension routes | `false` |
| `EXTENSION_WEBSOCKET_ENABLED` | Enable WebSocket endpoint | `false` |
| `EXTENSION_RATE_LIMIT` | Requests per minute for extension | `100` |

**OAuth Provider Credentials** (if configured):
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `INSTAGRAM_CLIENT_ID`, `INSTAGRAM_CLIENT_SECRET`
- `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`
- `TWITTER_CLIENT_ID`, `TWITTER_CLIENT_SECRET`

#### AI Module Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AI_API_PORT` | Port for standalone FastAPI service | `8100` |
| `MODEL_CONFIG_PATH` | Path to model configuration JSON | `config/model_config.json` |
| `DATASET_PATH` | Base directory for datasets | `data/datasets/` |
| `LOG_LEVEL` | Logging verbosity | `INFO` |

### DNS Configuration

- **Domain**: `tracetrail.in` (GoDaddy)
- **Frontend**: `app.tracetrail.in` (CNAME → Vercel)
- **Backend**: `api.tracetrail.in` (CNAME → Render)

---

## API Endpoints

### Base URLs

| Environment | URL |
|-------------|-----|
| Production | `https://api.tracetrail.in` |
| Local | `http://localhost:8000` |

### Authentication

- `POST /auth/login` - User login (returns access + refresh tokens)
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - Logout (optional, clears tokens)

**Authentication**: JWT Bearer tokens in `Authorization: Bearer <token>` header

### OAuth

- `GET /auth/{provider}/redirect` - Get OAuth redirect URL
  - Providers: `google`, `instagram`, `facebook`, `twitter`
- `GET /auth/{provider}/callback` - OAuth callback handler

### Accounts

- `GET /accounts` - Get user's connected accounts
- `POST /accounts/{provider}/disconnect` - Disconnect account

### Sync

- `POST /sync/{provider}` - Sync specific provider
- `POST /sync/all` - Sync all connected accounts

### Dashboard

- `GET /dashboard/summary` - Dashboard summary data (metrics, health, trends)
- `GET /dashboard/signals` - Security signals
- `GET /dashboard/anomalies` - Detected anomalies
- `GET /dashboard/insights` - Insights and recommendations

### Health

- `GET /health` - Health check endpoint
  - Returns: `{"status": "healthy", "timestamp": "...", "version": "2.0.0", "environment": "production"}`
- `GET /system-health` - System health details

### Response Format

All API responses follow this envelope:

```json
{
  "status": "success",
  "data": {},
  "meta": {
    "requestId": "uuid",
    "timestamp": "ISO8601"
  }
}
```

Errors return `status="error"` with an `error` object.

### Rate Limiting

- Default: 60 requests/minute per access token
- Extension routes: Respect `EXTENSION_RATE_LIMIT` (default: 100/minute)
- Exceeding limit: HTTP 429 with `Retry-After` header

### Common Headers

| Header | Description |
|--------|-------------|
| `Authorization` | `Bearer <access_token>` |
| `X-Request-Id` | Optional request ID for tracing |
| `X-API-Version` | Optional API version |
| `Content-Type` | `application/json` |

**API Documentation**: `https://api.tracetrail.in/docs` (Swagger UI)  
**Postman Collection**: `docs/api/postman_collection.json`

---

## Database Schema

### Core Tables

1. **users**
   - `id` (UUID, Primary Key)
   - `email` (String, Unique)
   - `hashed_password` (String)
   - `created_at`, `updated_at` (Timestamps)

2. **oauth_connections**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key → users.id)
   - `provider` (String: google, instagram, facebook, twitter)
   - `access_token` (Encrypted String)
   - `refresh_token` (Encrypted String, Nullable)
   - `expires_at` (DateTime, Nullable)
   - `connected_at`, `updated_at` (Timestamps)
   - Unique constraint: (user_id, provider)

3. **signals**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key → users.id)
   - `provider` (String)
   - `signal_type` (String)
   - `data` (JSON)
   - `detected_at` (DateTime)

4. **anomalies**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key → users.id)
   - `signal_id` (UUID, Foreign Key → signals.id, Nullable)
   - `anomaly_type` (String)
   - `severity` (String: low, medium, high, critical)
   - `data` (JSON)
   - `detected_at` (DateTime)

5. **system_health**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key → users.id, Unique)
   - `score` (Float: 0-100)
   - `breakdown` (JSON)
   - `updated_at` (DateTime)

6. **activities**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key → users.id)
   - `action_type` (String)
   - `message` (String)
   - `metadata` (JSON, Nullable)
   - `created_at` (DateTime)

---

## Security Features

### Authentication & Authorization

**JWT-Based Authentication**:
- Access tokens: Short-lived (15-30 minutes, configurable)
- Refresh tokens: Long-lived (7-30 days, configurable)
- Token storage: localStorage or HTTP-only cookies (future)
- Token refresh: Automatic via `/auth/refresh` endpoint

**Password Security**:
- Hashing: bcrypt with salt rounds
- Password policy:
  - Minimum 12 characters
  - At least one uppercase, lowercase, number, and special character
  - Enforced via Pydantic validators

**Route Protection**:
- `Depends(get_current_user)` for protected routes
- Role-based access control (future: `require_role("admin")`)

### Data Protection

**Token Encryption**:
- OAuth tokens encrypted at rest using Fernet symmetric encryption
- Encryption key stored in `ENCRYPTION_KEY` environment variable
- Tokens decrypted only when needed for API calls

**Communication Security**:
- HTTPS enforced for all production traffic
- Automatic SSL certificates via Vercel and Render
- CORS restrictions to trusted origins only

**Secrets Management**:
- Environment variables stored securely in platform dashboards
- Never committed to repository
- Rotated regularly

### Security Headers

- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (HSTS)
- X-XSS-Protection

### OAuth Security

- State token validation (JWT with user ID)
- PKCE support where available
- Secure token storage (encrypted)
- Automatic token refresh
- Scope validation

---

## Development Workflow

### Local Development Setup

**Prerequisites**:
- Node.js 20.x LTS
- Python 3.11
- PostgreSQL 14+ (or Docker)
- Docker (optional)

**Backend**:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements/base.txt
alembic upgrade head
uvicorn src.main:app --reload
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev  # Starts on http://localhost:3000
```

**Docker Compose**:
```bash
docker compose up --build
```

### Testing

**Backend**:
```bash
cd backend
pytest tests/ -v
```

**Frontend**:
```bash
cd frontend
npm run test
npm run test:e2e
```

---

## Known Limitations (Free Tier)

### Render Free Tier
- Services sleep after 15 minutes of inactivity
- First request after sleep may be slow (~10-30 seconds)
- Database: 90-day retention, manual backups only
- No always-on guarantee

### Vercel Free Tier
- Build time limits (usually sufficient)
- Bandwidth limits (generous for demos)
- No custom server configuration

---

## Future Enhancements

1. **AI Module Integration**: Deploy AI module as production service
2. **Real-time Updates**: WebSocket support for live data
3. **Advanced Analytics**: Enhanced reporting and insights
4. **Chrome Extension**: Production release
5. **Multi-tenant Support**: Organization-level features
6. **API Rate Limiting**: Enhanced rate limiting
7. **GraphQL**: Consider GraphQL for complex queries
8. **Automated Report Generation**: PDF/CSV export
9. **Enhanced Observability**: OpenTelemetry traces
10. **Event Streaming**: Kafka/Redis Streams for long-running analysis

---

## Component Architecture Details

### Frontend Components

**Layout Components** (`components/layout/`):
- `AppShell.tsx` - Main application wrapper
- `TopNavbar.tsx` - Top navigation with search, theme toggle, notifications
- `SidebarDrawer.tsx` - Mobile/tablet sidebar drawer
- `NavSidebar.tsx` - Navigation sidebar

**Dashboard Components** (`components/dashboard/`):
- `DashboardOverview.tsx` - Main dashboard view
- `MetricCard.tsx` - Metric display cards
- `TrendCard.tsx` - Trend visualization cards
- `TrendChart.tsx` - Time-series charts (Recharts)

**Account Management** (`components/accounts/`):
- `ConnectedAccounts.tsx` - Account connection management
- `ProviderCard.tsx` - Individual OAuth provider card

**System Health** (`components/system-health/`):
- `HealthCore.tsx` - 3D health visualization widget
- `HealthModal.tsx` - Detailed health breakdown modal
- `HealthTooltip.tsx` - Health score tooltip

**UI Primitives** (`components/ui/`):
- `Badge.tsx` - Badge component
- `Modal.tsx` - Modal dialog
- `Tooltip.tsx` - Tooltip component

### Backend Services

**Service Layer** (`src/app/services/`):
- `sync_service.py` - OAuth account synchronization
- `health_service.py` - Health score calculation
- `activity_service.py` - Activity logging

**OAuth Clients** (`src/app/oauth/`):
- `base.py` - Base OAuth client interface
- `google.py` - Google OAuth 2.0 implementation
- `instagram.py` - Instagram Basic Display API
- `facebook.py` - Facebook Graph API
- `twitter.py` - Twitter OAuth 2.0 implementation

## Documentation Index

### Getting Started
- **Getting Started**: `docs/getting_started.md` - Local development setup
- **Full Run Guide**: `docs/TraceTrail-Full-Run-Guide.md` - End-to-end demo guide

### Architecture & Design
- **System Architecture**: `docs/architecture/system_architecture.md` - Component interactions
- **Technology Stack**: `docs/architecture/technology_stack.md` - Technology choices
- **API Design**: `docs/architecture/api_design.md` - API design principles
- **Database Schema**: `docs/architecture/database_schema.md` - Database structure

### Implementation Details
- **Frontend Implementation**: `docs/FRONTEND_IMPLEMENTATION.md` - Complete frontend details
- **Backend Implementation**: `docs/BACKEND_IMPLEMENTATION.md` - Complete backend details
- **API Specification**: `docs/API_SPECIFICATION.md` - Complete API documentation
- **Database Schema**: `docs/DATABASE_SCHEMA.md` - Database structure and relationships

### Deployment
- **Production Deployment**: `docs/deployment/production_deployment.md` - Current production setup
- **Deployment Overview**: `docs/deployment/deployment_overview.md` - General concepts
- **Frontend Deployment**: `docs/deployment/frontend_deployment.md` - Frontend specifics
- **Backend Deployment**: `docs/deployment/backend_deployment.md` - Backend specifics
- **Environment Variables**: `docs/deployment/environment_variables.md` - Configuration reference

### Module-Specific
- **AI Module Setup**: `docs/ai_module/ai_setup.md` - AI module setup guide
- **Risk Algorithm**: `docs/ai_module/risk_algorithm_explanation.md` - Risk scoring details
- **Recommendation Engine**: `docs/ai_module/recommendation_engine.md` - Recommendation system
- **Frontend Setup**: `docs/frontend/frontend_setup.md` - Frontend development guide
- **Component Documentation**: `docs/frontend/component_documentation.md` - Component reference
- **Backend Setup**: `docs/backend/backend_setup.md` - Backend development guide
- **Authentication Guide**: `docs/backend/authentication_guide.md` - Auth implementation

### API Documentation
- **API Overview**: `docs/api/api_overview.md` - API summary
- **Authentication Endpoints**: `docs/api/authentication_endpoints.md` - Auth endpoints
- **Dashboard Endpoints**: `docs/api/dashboard_endpoints.md` - Dashboard endpoints
- **Analysis Endpoints**: `docs/api/analysis_endpoints.md` - Analysis endpoints
- **Postman Collection**: `docs/api/postman_collection.json` - Postman import file

### Project Management
- **Project Status**: `docs/PROJECT_STATUS.md` - Current status and roadmap
- **Complete System Overview**: `docs/COMPLETE_SYSTEM_OVERVIEW.md` - Comprehensive overview
- **Documentation Index**: `docs/DOCUMENTATION_INDEX.md` - Documentation navigation
- **Contributing**: `docs/contributing.md` - Contribution guidelines

---

## Support & Resources

- **Repository**: GitHub
- **Frontend URL**: https://app.tracetrail.in
- **Backend API**: https://api.tracetrail.in
- **API Documentation**: https://api.tracetrail.in/docs
- **Health Check**: https://api.tracetrail.in/health

---

**Document Version**: 1.0  
**Last Updated**: 2025  
**Maintained By**: Development Team

