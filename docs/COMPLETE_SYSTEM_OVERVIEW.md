# TraceTrail Complete System Overview

**Purpose**: This document provides a comprehensive overview of the TraceTrail system architecture, components, data flows, and integration points. It is designed to be AI-readable for generating detailed project reports.

**Last Updated**: 2025

---

## Table of Contents

1. [System Purpose and Goals](#system-purpose-and-goals)
2. [High-Level Architecture](#high-level-architecture)
3. [Component Breakdown](#component-breakdown)
4. [Data Flow Diagrams](#data-flow-diagrams)
5. [Technology Stack Details](#technology-stack-details)
6. [Integration Points](#integration-points)
7. [Deployment Architecture](#deployment-architecture)

---

## System Purpose and Goals

### What is TraceTrail?

TraceTrail is a **privacy intelligence platform** that helps users:
- Monitor their digital footprint across social media platforms
- Assess privacy risk through automated analysis
- Receive actionable recommendations to improve privacy posture
- Track privacy metrics over time
- Connect multiple social accounts (Google, Instagram, Facebook, Twitter/X) via OAuth

### Core Value Propositions

1. **Transparency**: Users can audit every data point tied to their identity
2. **Actionability**: Recommendations include impact, effort, and risk scoring
3. **Extensibility**: Chrome extension and AI module keep feeds fresh
4. **Privacy-First**: All data is encrypted and user-controlled

---

## High-Level Architecture

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

1. **Frontend (Next.js)**: User interface, dashboard, account management, visualization
2. **Backend (FastAPI)**: API endpoints, business logic, data persistence, OAuth handling
3. **Database (PostgreSQL)**: Data storage, relationships, transactions
4. **AI Module**: Risk scoring, anomaly detection, recommendations (optional, for advanced features)

---

## Component Breakdown

### 1. Frontend Component (Next.js 14)

**Location**: `frontend/`  
**Deployment**: Vercel at `https://app.tracetrail.in`  
**Framework**: Next.js 14 with App Router

#### Architecture Pattern

- **App Router**: File-based routing in `app/` directory
- **Server Components**: Default for data fetching
- **Client Components**: Marked with `'use client'` for interactivity
- **Server Actions**: For mutations (future)

#### Key Directories

```
frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Dashboard home page
│   ├── settings/          # Settings pages
│   ├── dashboard/         # Dashboard sub-pages
│   └── [section]/         # Dynamic route for sections
├── components/            # React components
│   ├── layout/            # Layout components (Navbar, Sidebar)
│   ├── dashboard/         # Dashboard-specific components
│   ├── accounts/          # Account management components
│   └── system-health/     # Health visualization
├── lib/                   # Utilities and types
│   ├── api.ts            # API client (server-side)
│   └── types.ts          # TypeScript type definitions
├── src/                   # Additional source files
│   └── services/         # API service clients (client-side)
└── styles/               # Global styles
```

#### Data Flow (Frontend)

1. **Page Load**:
   ```
   User Request → Next.js Server → fetchDashboardSnapshot() 
   → Backend API → Database → Response → Server Component 
   → HTML → Browser
   ```

2. **Client Interaction**:
   ```
   User Action → Client Component → API Service → Backend API 
   → Database → Response → State Update → UI Re-render
   ```

3. **OAuth Flow**:
   ```
   User Clicks "Connect" → Frontend calls /auth/{provider}/redirect 
   → Backend returns OAuth URL → Frontend redirects to OAuth provider 
   → User authorizes → OAuth provider redirects to /auth/{provider}/callback 
   → Backend processes → Redirects to frontend /oauth/callback
   ```

#### State Management

- **Server State**: Fetched via Server Components using `fetchDashboardSnapshot()`
- **Client State**: React Context + useState hooks
- **API State**: Custom hooks in `src/services/` for client-side API calls

#### Key Features

- **Dashboard**: Metrics, trends, activity timeline
- **Account Management**: Connect/disconnect OAuth accounts
- **Settings**: User preferences and account settings
- **Health Visualization**: 3D health score widget
- **Responsive Design**: Mobile and desktop support
- **Dark Theme**: Theme switching support

---

### 2. Backend Component (FastAPI)

**Location**: `backend/`  
**Deployment**: Render at `https://api.tracetrail.in`  
**Framework**: FastAPI (Python 3.11)

#### Architecture Pattern

- **Modular Structure**: Feature-based organization
- **Dependency Injection**: FastAPI dependencies for auth, database, etc.
- **Service Layer**: Business logic separated from routes
- **Repository Pattern**: Data access abstraction (via SQLAlchemy)

#### Key Directories

```
backend/
├── src/
│   ├── main.py              # Application entry point
│   ├── app/
│   │   ├── core/            # Core configuration
│   │   │   ├── app.py       # FastAPI app factory
│   │   │   ├── config.py    # Settings and environment
│   │   │   ├── database.py  # Database connection
│   │   │   └── dependencies.py  # DI functions
│   │   ├── routes/          # API route handlers
│   │   │   ├── auth_routes.py
│   │   │   ├── oauth_routes.py
│   │   │   ├── accounts_routes.py
│   │   │   ├── sync_routes.py
│   │   │   ├── signals_routes.py
│   │   │   ├── anomalies_routes.py
│   │   │   ├── insight_routes.py
│   │   │   └── health_routes.py
│   │   ├── services/        # Business logic
│   │   │   ├── sync_service.py
│   │   │   └── health_service.py
│   │   ├── models/          # SQLAlchemy models
│   │   │   └── __init__.py  # User, OAuthConnection, Signal, etc.
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── oauth/           # OAuth client implementations
│   │   │   ├── base.py      # Base OAuth client
│   │   │   ├── google.py
│   │   │   ├── instagram.py
│   │   │   ├── facebook.py
│   │   │   └── twitter.py
│   │   └── utils/           # Utilities (crypto, etc.)
│   └── core/                # Legacy core (being migrated)
├── alembic/                 # Database migrations
│   └── versions/           # Migration files
├── requirements/
│   ├── base.txt            # Production dependencies
│   └── dev.txt             # Development dependencies
└── tests/                   # Test suite
```

#### Request Flow (Backend)

1. **HTTP Request**:
   ```
   Client → FastAPI App → Middleware (CORS, Auth, Logging) 
   → Route Handler → Dependency Injection (Auth, DB) 
   → Service Layer → Repository/ORM → Database
   → Response → Middleware → Client
   ```

2. **OAuth Connection Flow**:
   ```
   User → /auth/{provider}/redirect → OAuthService.getRedirectUrl() 
   → Generate state token → Return OAuth URL → User authorizes 
   → OAuth provider → /auth/{provider}/callback → Verify state 
   → Exchange code for tokens → Store encrypted tokens → Sync data 
   → Return success
   ```

3. **Data Sync Flow**:
   ```
   Scheduled/Manual → SyncService.syncProvider() 
   → Decrypt OAuth tokens → Call provider API → Process data 
   → Detect anomalies → Update database → Return status
   ```

#### Key Services

- **SyncService**: Handles OAuth account synchronization
- **HealthService**: Calculates system health scores
- **OAuth Clients**: Google, Instagram, Facebook, Twitter implementations

#### Database Models

- **User**: User accounts and authentication
- **OAuthConnection**: Connected social accounts with encrypted tokens
- **Signal**: Security signals from connected accounts
- **Anomaly**: Detected anomalies in user data
- **SystemHealth**: Health score snapshots
- **Activity**: User activity log

---

### 3. Database Component (PostgreSQL)

**Location**: Render PostgreSQL  
**ORM**: SQLAlchemy 2.0  
**Migrations**: Alembic

#### Schema Overview

**Core Tables**:

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
   - `severity` (String)
   - `data` (JSON)
   - `detected_at` (DateTime)

5. **system_health**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key → users.id)
   - `score` (Float)
   - `breakdown` (JSON)
   - `updated_at` (DateTime)

6. **activities**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key → users.id)
   - `action_type` (String)
   - `message` (String)
   - `metadata` (JSON, Nullable)
   - `created_at` (DateTime)

#### Relationships

- `users` 1:N `oauth_connections`
- `users` 1:N `signals`
- `users` 1:N `anomalies`
- `users` 1:N `system_health`
- `users` 1:N `activities`
- `signals` 1:N `anomalies`

#### Data Encryption

- OAuth tokens are encrypted using Fernet (symmetric encryption)
- Encryption key stored in `ENCRYPTION_KEY` environment variable
- Tokens encrypted before storage, decrypted when needed

---

### 4. AI Module Component (Optional)

**Location**: `ai_module/`  
**Status**: Development/Testing  
**Framework**: FastAPI (standalone service)

#### Purpose

- Risk scoring algorithms
- Anomaly detection models
- Recommendation generation
- Trend analysis

#### Key Components

- **Risk Scorer**: Calculates privacy risk scores
- **Anomaly Detector**: Identifies unusual patterns
- **Recommender**: Generates actionable recommendations
- **Trend Analyzer**: Analyzes data trends over time

#### Integration

- Currently used for local development and testing
- Can be called by backend via HTTP or shared library
- Future: Deploy as separate service for production ML workloads

---

## Data Flow Diagrams

### 1. User Authentication Flow

```
┌─────────┐         ┌─────────┐         ┌─────────┐
│ Browser │         │Frontend │         │ Backend │
└────┬────┘         └────┬────┘         └────┬────┘
     │                   │                   │
     │ 1. Login Request  │                   │
     │──────────────────>│                   │
     │                   │ 2. POST /auth/login│
     │                   │───────────────────>│
     │                   │                   │ 3. Verify credentials
     │                   │                   │    Query users table
     │                   │                   │
     │                   │ 4. JWT Token      │
     │                   │<───────────────────│
     │ 5. Store Token    │                   │
     │<──────────────────│                   │
     │                   │                   │
```

### 2. OAuth Connection Flow

```
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐
│ Browser │  │Frontend │  │ Backend │  │OAuth Prov│
└────┬────┘  └────┬────┘  └────┬────┘  └────┬─────┘
     │            │            │            │
     │ 1. Click   │            │            │
     │ "Connect"  │            │            │
     │───────────>│            │            │
     │            │ 2. GET     │            │
     │            │ /auth/    │            │
     │            │ google/    │            │
     │            │ redirect  │            │
     │            │──────────>│            │
     │            │            │ 3. Generate│
     │            │            │ state token│
     │            │ 4. OAuth   │            │
     │            │ URL        │            │
     │            │<───────────│            │
     │ 5. Redirect│            │            │
     │ to OAuth   │            │            │
     │<───────────│            │            │
     │            │            │            │
     │ 6. Authorize│            │            │
     │────────────┼────────────┼───────────>│
     │            │            │            │
     │ 7. Callback│            │            │
     │ with code  │            │            │
     │<───────────┼────────────┼────────────│
     │            │            │            │
     │ 8. GET     │            │            │
     │ /auth/     │            │            │
     │ google/    │            │            │
     │ callback   │            │            │
     │───────────>│            │            │
     │            │ 9. Exchange│            │
     │            │ code for  │            │
     │            │ tokens    │            │
     │            │──────────>│            │
     │            │            │ 10. Store │
     │            │            │ encrypted │
     │            │            │ tokens    │
     │            │ 11. Sync   │            │
     │            │ data      │            │
     │            │<──────────│            │
     │ 12. Success│            │            │
     │ redirect   │            │            │
     │<───────────│            │            │
```

### 3. Dashboard Data Flow

```
┌─────────┐         ┌─────────┐         ┌─────────┐
│ Browser │         │Frontend │         │ Backend │
└────┬────┘         └────┬────┘         └────┬────┘
     │                   │                   │
     │ 1. Load Dashboard │                   │
     │──────────────────>│                   │
     │                   │ 2. Server Component│
     │                   │ fetchDashboard()   │
     │                   │───────────────────>│
     │                   │                   │ 3. Query DB
     │                   │                   │ - Get user
     │                   │                   │ - Get connections
     │                   │                   │ - Get signals
     │                   │                   │ - Get health
     │                   │ 4. Dashboard Data │
     │                   │<───────────────────│
     │ 5. Render HTML    │                   │
     │<──────────────────│                   │
     │                   │                   │
```

### 4. Account Sync Flow

```
┌─────────┐         ┌─────────┐         ┌─────────┐
│ Scheduler│         │ Backend │         │Database │
└────┬────┘         └────┬────┘         └────┬────┘
     │                   │                   │
     │ 1. Trigger Sync   │                   │
     │ (every 6 hours)   │                   │
     │──────────────────>│                   │
     │                   │ 2. Get all       │
     │                   │ OAuth connections │
     │                   │───────────────────>│
     │                   │ 3. Connections    │
     │                   │<───────────────────│
     │                   │                   │
     │                   │ 4. For each       │
     │                   │ connection:       │
     │                   │ - Decrypt tokens  │
     │                   │ - Call provider   │
     │                   │   API             │
     │                   │ - Process data   │
     │                   │ - Detect anomalies│
     │                   │ - Update DB      │
     │                   │───────────────────>│
     │                   │                   │
```

---

## Technology Stack Details

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.x | React framework with SSR/SSG |
| React | 18.3.x | UI library |
| TypeScript | 5.6.x | Type safety |
| Tailwind CSS | 3.4.x | Utility-first CSS |
| Recharts | 2.12.x | Data visualization |
| Lucide React | 0.446.x | Icon library |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11 | Runtime |
| FastAPI | 0.115.x | Web framework |
| SQLAlchemy | 2.0.x | ORM |
| Alembic | 1.13.x | Database migrations |
| Pydantic | 2.9.x | Data validation |
| PyJWT | 3.3.x | JWT handling |
| Passlib | 1.7.x | Password hashing |
| Cryptography | Latest | Token encryption |

### Database

| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | 14+ | Relational database |
| psycopg2 | 2.9.x | PostgreSQL adapter |

### Deployment

| Platform | Service | Purpose |
|----------|---------|---------|
| Vercel | Frontend | Next.js hosting |
| Render | Backend | FastAPI hosting |
| Render | PostgreSQL | Database hosting |
| GoDaddy | DNS | Domain management |

---

## Integration Points

### Frontend ↔ Backend

**Communication Protocol**: HTTPS REST API

**Base URL**: 
- Production: `https://api.tracetrail.in`
- Local: `http://localhost:8000`

**Authentication**: JWT Bearer tokens in `Authorization` header

**Key Endpoints**:
- `GET /health` - Health check
- `GET /dashboard/summary` - Dashboard data
- `GET /accounts` - User's connected accounts
- `POST /auth/{provider}/redirect` - Initiate OAuth
- `GET /auth/{provider}/callback` - OAuth callback
- `POST /sync/{provider}` - Manual sync
- `GET /dashboard/signals` - Security signals
- `GET /dashboard/anomalies` - Detected anomalies

**Error Handling**:
- Frontend gracefully handles API unavailability
- Falls back to mock data during build
- Shows user-friendly error messages

### Backend ↔ Database

**ORM**: SQLAlchemy 2.0

**Connection**: PostgreSQL via `DATABASE_URL` environment variable

**Pattern**: Repository pattern with SQLAlchemy models

**Transactions**: Automatic via SQLAlchemy sessions

**Migrations**: Alembic for schema changes

### Backend ↔ OAuth Providers

**Protocol**: OAuth 2.0

**Providers**: Google, Instagram, Facebook, Twitter/X

**Flow**: Authorization Code flow with PKCE (where supported)

**Token Storage**: Encrypted in database

**Refresh**: Automatic token refresh when expired

### Backend ↔ AI Module (Future)

**Protocol**: HTTP REST API

**Purpose**: Risk scoring, anomaly detection, recommendations

**Status**: Currently optional, used for local development

---

## Deployment Architecture

### Production Environment

```
Internet
    │
    ├─── app.tracetrail.in (CNAME → Vercel)
    │    │
    │    └─── Vercel CDN
    │         └─── Next.js Application
    │              └─── Static Assets + SSR
    │
    └─── api.tracetrail.in (CNAME → Render)
         │
         └─── Render Web Service
              ├─── FastAPI Application
              │    └─── Port: $PORT (dynamic)
              │
              └─── Render PostgreSQL
                   └─── Internal Database URL
```

### Environment Variables

**Frontend (Vercel)**:
- `NEXT_PUBLIC_API_URL=https://api.tracetrail.in`

**Backend (Render)**:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET_KEY` - JWT signing key
- `ENCRYPTION_KEY` - Token encryption key
- `CORS_ORIGINS` - Allowed frontend origins
- OAuth client credentials (if configured)

### SSL/TLS

- Automatic SSL certificates via Vercel and Render
- HTTPS enforced for all traffic
- Certificates auto-renewed

### Scaling Considerations

**Current (Free Tier)**:
- Frontend: Vercel handles scaling automatically
- Backend: Single instance, sleeps after inactivity
- Database: 1GB storage limit

**Future (Paid Tier)**:
- Backend: Multiple instances, always-on
- Database: Larger storage, automatic backups
- CDN: Enhanced caching

---

## Security Architecture

### Authentication

- JWT-based authentication
- Tokens stored in HTTP-only cookies (future) or localStorage
- Token expiration: 15 minutes (access), 7 days (refresh)

### Authorization

- Role-based access control (future)
- User-scoped data access
- OAuth state validation

### Data Protection

- OAuth tokens encrypted at rest
- Passwords hashed with bcrypt
- HTTPS for all communications
- CORS restrictions

### Secrets Management

- Environment variables in platform dashboards
- Never committed to repository
- Rotated regularly

---

## Monitoring and Observability

### Health Checks

- Backend: `GET /health` endpoint
- Returns: Status, version, environment, timestamp

### Logging

- Structured logging in backend
- Request ID tracking
- Error logging with stack traces

### Metrics (Future)

- Response times
- Error rates
- Database query performance
- OAuth sync success rates

---

## Development Workflow

### Local Development

1. **Backend**: `uvicorn src.main:app --reload`
2. **Frontend**: `npm run dev`
3. **Database**: Docker Compose or local PostgreSQL
4. **AI Module**: Optional, `uvicorn main:app --port 8082`

### Testing

- Backend: Pytest test suite
- Frontend: Jest + React Testing Library
- E2E: Postman collection

### Deployment

- **Frontend**: Automatic on push to `main` (Vercel)
- **Backend**: Automatic on push to `main` (Render)
- **Migrations**: Manual via Render Shell

---

## Future Enhancements

1. **AI Module Integration**: Deploy AI module as production service
2. **Real-time Updates**: WebSocket support for live data
3. **Advanced Analytics**: Enhanced reporting and insights
4. **Chrome Extension**: Production release
5. **Multi-tenant Support**: Organization-level features
6. **API Rate Limiting**: Enhanced rate limiting
7. **GraphQL**: Consider GraphQL for complex queries

---

## Conclusion

TraceTrail is a modern, privacy-focused platform built with:
- **Next.js** for a fast, SEO-friendly frontend
- **FastAPI** for a high-performance, type-safe backend
- **PostgreSQL** for reliable data storage
- **Free-tier platforms** for cost-effective deployment

The system is designed for:
- **Scalability**: Modular architecture allows independent scaling
- **Maintainability**: Clear separation of concerns
- **Security**: Encryption, authentication, and authorization
- **Developer Experience**: Type safety, clear structure, good documentation

---

**Document Version**: 1.0  
**Last Updated**: 2025  
**Maintained By**: Development Team

