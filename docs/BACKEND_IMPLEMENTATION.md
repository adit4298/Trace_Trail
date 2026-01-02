# Backend Implementation Details

**Purpose**: Comprehensive documentation of the TraceTrail backend implementation, architecture, services, and data flows.

**Location**: `backend/`  
**Framework**: FastAPI (Python 3.11)  
**Deployment**: Render at `https://api.tracetrail.in`

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Application Factory](#application-factory)
4. [Routing System](#routing-system)
5. [Service Layer](#service-layer)
6. [Data Models](#data-models)
7. [OAuth Implementation](#oauth-implementation)
8. [Database Integration](#database-integration)
9. [Authentication & Authorization](#authentication--authorization)
10. [Error Handling](#error-handling)

---

## Architecture Overview

### FastAPI Framework

The backend uses **FastAPI**, a modern Python web framework that provides:
- **Automatic API Documentation**: OpenAPI/Swagger UI
- **Type Safety**: Pydantic models for validation
- **Async Support**: Native async/await
- **Dependency Injection**: Built-in DI system
- **Performance**: High performance, comparable to Node.js

### Architectural Patterns

1. **Modular Structure**: Feature-based organization
2. **Dependency Injection**: FastAPI dependencies for reusable logic
3. **Service Layer**: Business logic separated from routes
4. **Repository Pattern**: Data access via SQLAlchemy ORM
5. **Factory Pattern**: Application factory for configuration

---

## Project Structure

```
backend/
├── src/
│   ├── main.py                    # Application entry point
│   │
│   ├── app/                       # Main application package
│   │   ├── core/                  # Core functionality
│   │   │   ├── app.py            # FastAPI app factory
│   │   │   ├── config.py         # Settings and configuration
│   │   │   ├── database.py       # Database connection
│   │   │   ├── dependencies.py  # Dependency injection
│   │   │   └── constants.py      # Constants
│   │   │
│   │   ├── routes/               # API route handlers
│   │   │   ├── auth_routes.py   # Authentication endpoints
│   │   │   ├── oauth_routes.py  # OAuth flow endpoints
│   │   │   ├── accounts_routes.py # Account management
│   │   │   ├── sync_routes.py   # Sync operations
│   │   │   ├── signals_routes.py # Security signals
│   │   │   ├── anomalies_routes.py # Anomaly detection
│   │   │   ├── insight_routes.py # Insights
│   │   │   └── health_routes.py # Health checks
│   │   │
│   │   ├── services/            # Business logic layer
│   │   │   ├── sync_service.py  # Account synchronization
│   │   │   ├── health_service.py # Health score calculation
│   │   │   └── activity_service.py # Activity logging
│   │   │
│   │   ├── models/              # SQLAlchemy models
│   │   │   └── __init__.py     # User, OAuthConnection, Signal, etc.
│   │   │
│   │   ├── schemas/            # Pydantic schemas
│   │   │   └── __init__.py     # Request/response models
│   │   │
│   │   ├── oauth/              # OAuth client implementations
│   │   │   ├── __init__.py     # OAuth registry builder
│   │   │   ├── base.py         # Base OAuth client
│   │   │   ├── google.py      # Google OAuth
│   │   │   ├── instagram.py   # Instagram OAuth
│   │   │   ├── facebook.py    # Facebook OAuth
│   │   │   └── twitter.py     # Twitter/X OAuth
│   │   │
│   │   └── utils/              # Utilities
│   │       └── crypto.py      # Token encryption
│   │
│   └── core/                    # Legacy core (being migrated)
│       ├── config.py
│       ├── database.py
│       └── security.py
│
├── alembic/                    # Database migrations
│   ├── env.py                  # Alembic environment
│   ├── script.py.mako          # Migration template
│   └── versions/              # Migration files
│
├── requirements/
│   ├── base.txt               # Production dependencies
│   └── dev.txt                # Development dependencies
│
├── tests/                      # Test suite
│   ├── conftest.py            # Pytest configuration
│   └── test_*.py              # Test files
│
├── scripts/                    # Utility scripts
│   ├── create_demo_users.py
│   ├── reset_database.py
│   └── seed_data.py
│
├── Dockerfile                  # Container definition
├── render.yaml                 # Render deployment config
└── alembic.ini                 # Alembic configuration
```

---

## Application Factory

### Entry Point

**File**: `src/main.py`

```python
from fastapi import FastAPI
from src.app.core.app import create_app

app: FastAPI = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
```

### App Factory

**File**: `src/app/core/app.py`

**Function**: `create_app()`

**Responsibilities**:
1. Load settings from environment
2. Create FastAPI application instance
3. Configure middleware (CORS, GZip, Security Headers)
4. Register route handlers
5. Set up startup/shutdown events

**Middleware Stack**:
1. **CORSMiddleware**: Handles cross-origin requests
2. **GZipMiddleware**: Response compression
3. **TrustedHostMiddleware**: Host validation
4. **RequestIDMiddleware**: Request tracking
5. **SecurityHeadersMiddleware**: Security headers
6. **LoggingMiddleware**: Request/response logging
7. **RateLimitMiddleware**: Rate limiting (optional)

**Startup Events**:
- Initialize OAuth registry
- Start sync scheduler

**Shutdown Events**:
- Stop sync scheduler

---

## Routing System

### Route Organization

Routes are organized by feature in `src/app/routes/`:

| Route File | Prefix | Purpose |
|------------|--------|---------|
| `auth_routes.py` | `/auth` | Authentication (login, register) |
| `oauth_routes.py` | `/auth` | OAuth flow (redirect, callback) |
| `accounts_routes.py` | `/accounts` | Account management |
| `sync_routes.py` | `/sync` | Sync operations |
| `signals_routes.py` | `/dashboard` | Security signals |
| `anomalies_routes.py` | `/dashboard` | Anomalies |
| `insight_routes.py` | `/dashboard` | Insights |
| `health_routes.py` | `/` | Health checks |

### Route Registration

Routes are registered in `create_app()`:

```python
app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
app.include_router(oauth_routes.router, prefix="/auth", tags=["oauth"])
app.include_router(accounts_routes.router, prefix="/accounts", tags=["accounts"])
# ... etc
```

### Key Endpoints

#### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh JWT token

#### OAuth

- `GET /auth/{provider}/redirect` - Get OAuth redirect URL
- `GET /auth/{provider}/callback` - OAuth callback handler

#### Accounts

- `GET /accounts` - Get user's connected accounts
- `POST /accounts/{provider}/disconnect` - Disconnect account

#### Sync

- `POST /sync/{provider}` - Sync specific provider
- `POST /sync/all` - Sync all connected accounts

#### Dashboard

- `GET /dashboard/summary` - Dashboard summary data
- `GET /dashboard/signals` - Security signals
- `GET /dashboard/anomalies` - Detected anomalies
- `GET /dashboard/insights` - Insights

#### Health

- `GET /health` - Health check endpoint
- `GET /system-health` - System health details

---

## Service Layer

### SyncService

**File**: `src/app/services/sync_service.py`

**Purpose**: Handles OAuth account synchronization

**Key Methods**:
- `sync_provider(user, provider)`: Sync a specific provider
- `sync_all_providers(user)`: Sync all connected accounts

**Flow**:
1. Get OAuth connection from database
2. Decrypt stored tokens
3. Call provider API to fetch data
4. Process and store signals
5. Detect anomalies
6. Update last sync timestamp

**Error Handling**:
- Token expiration: Attempt refresh
- API errors: Log and continue
- Network errors: Retry with backoff

### HealthService

**File**: `src/app/services/health_service.py`

**Purpose**: Calculates system health scores

**Key Methods**:
- `update_score(user_id)`: Calculate and update health score
- `get_breakdown(user_id)`: Get detailed breakdown

**Calculation**:
- Based on connected accounts
- Signal volume and quality
- Anomaly count and severity
- Coverage percentage

### ActivityService

**File**: `src/app/services/activity_service.py`

**Purpose**: Logs user activities

**Key Methods**:
- `record_activity(db, user_id, action_type, message, metadata)`: Log activity

**Activity Types**:
- `oauth_redirect`: OAuth flow started
- `oauth_connect`: Account connected
- `oauth_disconnect`: Account disconnected
- `sync_started`: Sync operation started
- `sync_completed`: Sync operation completed

---

## Data Models

### User Model

**Location**: `src/app/models/__init__.py`

```python
class User(Base, TimestampMixin):
    __tablename__ = "users"
    
    id: Mapped[UUID] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    hashed_password: Mapped[str]
    # ... relationships
    oauth_connections: Mapped[list["OAuthConnection"]]
    signals: Mapped[list["Signal"]]
    anomalies: Mapped[list["Anomaly"]]
```

### OAuthConnection Model

```python
class OAuthConnection(Base, TimestampMixin):
    __tablename__ = "oauth_connections"
    
    id: Mapped[UUID] = mapped_column(primary_key=True)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
    provider: Mapped[str]  # google, instagram, facebook, twitter
    access_token: Mapped[str]  # Encrypted
    refresh_token: Mapped[str | None]  # Encrypted, nullable
    expires_at: Mapped[datetime | None]
    scope: Mapped[str | None]
    connected_at: Mapped[datetime]
    
    # Unique constraint: one connection per provider per user
    __table_args__ = (UniqueConstraint("user_id", "provider"),)
```

### Signal Model

```python
class Signal(Base, TimestampMixin):
    __tablename__ = "signals"
    
    id: Mapped[UUID] = mapped_column(primary_key=True)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
    provider: Mapped[str]
    signal_type: Mapped[str]
    data: Mapped[dict] = mapped_column(JSON)
    detected_at: Mapped[datetime]
```

### Anomaly Model

```python
class Anomaly(Base, TimestampMixin):
    __tablename__ = "anomalies"
    
    id: Mapped[UUID] = mapped_column(primary_key=True)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
    signal_id: Mapped[UUID | None] = mapped_column(ForeignKey("signals.id"))
    anomaly_type: Mapped[str]
    severity: Mapped[str]  # low, medium, high, critical
    data: Mapped[dict] = mapped_column(JSON)
    detected_at: Mapped[datetime]
```

### SystemHealth Model

```python
class SystemHealth(Base, TimestampMixin):
    __tablename__ = "system_health"
    
    id: Mapped[UUID] = mapped_column(primary_key=True)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), unique=True)
    score: Mapped[float]  # 0-100
    breakdown: Mapped[dict] = mapped_column(JSON)
    updated_at: Mapped[datetime]
```

---

## OAuth Implementation

### OAuth Client Architecture

**Base Class**: `src/app/oauth/base.py`

**BaseOAuthClient** provides:
- State generation and verification
- Authorization URL generation
- Token exchange
- Token refresh
- Profile fetching

**Provider Implementations**:
- `GoogleOAuthClient`: Google OAuth 2.0
- `InstagramOAuthClient`: Instagram Basic Display API
- `FacebookOAuthClient`: Facebook Graph API
- `TwitterOAuthClient`: Twitter OAuth 2.0

### OAuth Flow

#### 1. Initiate OAuth

**Endpoint**: `GET /auth/{provider}/redirect`

**Flow**:
1. User clicks "Connect" on frontend
2. Frontend calls `/auth/{provider}/redirect`
3. Backend generates state token (JWT with user ID)
4. Backend builds OAuth authorization URL
5. Returns URL to frontend
6. Frontend redirects user to OAuth provider

**Implementation**:
```python
@router.get("/{provider}/redirect")
def oauth_redirect(provider: str, current_user: User, ...):
    client = oauth_registry[provider]
    state = client.generate_state(current_user.id)
    url = client.get_redirect_url(state=state)
    return OAuthRedirectResponse(authorization_url=url)
```

#### 2. OAuth Callback

**Endpoint**: `GET /auth/{provider}/callback`

**Flow**:
1. OAuth provider redirects to callback URL
2. Backend receives `code` and `state`
3. Backend verifies state token
4. Backend exchanges code for access token
5. Backend encrypts and stores tokens
6. Backend triggers initial sync
7. Backend redirects to frontend success page

**Implementation**:
```python
@router.get("/{provider}/callback")
def oauth_callback(provider: str, code: str, state: str, ...):
    # Verify state
    user_id = client.verify_state(state)
    user = db.get(User, user_id)
    
    # Exchange code for tokens
    tokens = client.exchange_code(code)
    
    # Encrypt and store
    encrypted_access = encrypt_token(tokens.access_token)
    connection = OAuthConnection(
        user_id=user.id,
        provider=provider,
        access_token=encrypted_access,
        ...
    )
    db.add(connection)
    db.commit()
    
    # Sync data
    sync_service.sync_provider(user, provider)
    
    # Redirect to frontend
    return RedirectResponse(success_url)
```

### Token Encryption

**File**: `src/app/utils/crypto.py`

**Method**: Fernet symmetric encryption

**Process**:
1. Generate encryption key: `ENCRYPTION_KEY` environment variable
2. Encrypt tokens before storage
3. Decrypt tokens when needed for API calls

**Security**:
- Tokens never stored in plaintext
- Encryption key stored in environment
- Tokens decrypted only when needed

---

## Database Integration

### SQLAlchemy Setup

**File**: `src/app/core/database.py`

**Configuration**:
- Connection pool management
- Session management
- Transaction handling

**Session Lifecycle**:
1. Request starts → Create session
2. Route handler uses session
3. Request ends → Close session
4. Automatic rollback on errors

### Dependency Injection

**File**: `src/app/core/dependencies.py`

**Database Dependency**:
```python
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**Usage in Routes**:
```python
@router.get("/accounts")
def get_accounts(db: Session = Depends(get_db), ...):
    # Use db session
    accounts = db.query(OAuthConnection).filter(...).all()
    return accounts
```

### Migrations

**Tool**: Alembic

**Location**: `alembic/versions/`

**Commands**:
- `alembic upgrade head`: Apply all migrations
- `alembic downgrade -1`: Rollback one migration
- `alembic revision --autogenerate -m "message"`: Create new migration

**Migration Process**:
1. Modify SQLAlchemy models
2. Generate migration: `alembic revision --autogenerate`
3. Review generated migration
4. Apply: `alembic upgrade head`

---

## Authentication & Authorization

### JWT Authentication

**File**: `src/app/core/jwt.py`

**Token Structure**:
- **Header**: Algorithm (HS256)
- **Payload**: User ID, expiration, issued at
- **Signature**: Signed with `JWT_SECRET_KEY`

**Token Types**:
- **Access Token**: Short-lived (15 minutes)
- **Refresh Token**: Long-lived (7 days)

### Authentication Dependency

**File**: `src/app/core/dependencies.py`

```python
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    payload = decode_jwt_token(token)
    user = db.get(User, payload["sub"])
    if not user:
        raise HTTPException(401, "User not found")
    return user
```

### Protected Routes

**Usage**:
```python
@router.get("/accounts")
def get_accounts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Route is protected - requires valid JWT
    accounts = db.query(OAuthConnection).filter(
        OAuthConnection.user_id == current_user.id
    ).all()
    return accounts
```

### CORS Configuration

**File**: `src/app/core/config.py`

**Allowed Origins**:
- `https://app.tracetrail.in` (production)
- `http://localhost:5173` (local dev)
- `http://localhost:3000` (local dev)

**Configuration**:
```python
CORS_ORIGINS: List[str] = [
    "https://app.tracetrail.in",
    "http://localhost:5173",
    "http://localhost:3000",
]
```

---

## Error Handling

### Exception Hierarchy

**FastAPI Exceptions**:
- `HTTPException`: Standard HTTP errors
- Custom exceptions in `src/app/core/exceptions.py`

### Error Response Format

```json
{
  "detail": "Error message",
  "status_code": 400
}
```

### Common Error Scenarios

1. **Authentication Errors**:
   - Invalid token → 401 Unauthorized
   - Expired token → 401 Unauthorized
   - Missing token → 401 Unauthorized

2. **Validation Errors**:
   - Invalid request data → 422 Unprocessable Entity
   - Pydantic validation errors

3. **Not Found Errors**:
   - Resource not found → 404 Not Found

4. **Server Errors**:
   - Database errors → 500 Internal Server Error
   - External API errors → 502 Bad Gateway

---

## Configuration Management

### Settings

**File**: `src/app/core/config.py`

**Settings Class**: `Settings` (Pydantic BaseSettings)

**Configuration Sources**:
1. Environment variables
2. `.env` file (local development)
3. Default values

**Key Settings**:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET_KEY`: JWT signing key
- `ENCRYPTION_KEY`: Token encryption key
- `CORS_ORIGINS`: Allowed frontend origins
- OAuth client credentials

### Environment Variables

**Required**:
- `DATABASE_URL`
- `JWT_SECRET_KEY`
- `ENCRYPTION_KEY`

**Optional**:
- `DEBUG`: Enable debug mode
- `SHOW_DOCS`: Show API documentation
- `CORS_ORIGINS`: CORS configuration
- OAuth client IDs and secrets

---

## Deployment

### Render Configuration

**File**: `render.yaml`

**Service Configuration**:
- Type: Web Service
- Environment: Python 3
- Build Command: `pip install -r requirements/base.txt`
- Start Command: Dynamic port binding

**Port Binding**:
```python
port = int(os.environ.get('PORT', 8000))
uvicorn.run('src.main:app', host='0.0.0.0', port=port)
```

### Health Checks

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00Z",
  "version": "2.0.0",
  "environment": "production"
}
```

---

## Testing

### Test Structure

**Location**: `backend/tests/`

**Test Files**:
- `test_api.py`: API endpoint tests
- `test_services.py`: Service layer tests
- `conftest.py`: Pytest fixtures

### Running Tests

```bash
cd backend
pytest tests/ -v
```

---

## Performance Considerations

### Database Queries

- Use eager loading for relationships
- Index frequently queried columns
- Paginate large result sets

### Caching (Future)

- Cache frequently accessed data
- Use Redis for session storage
- Cache OAuth provider responses

### Async Operations

- Use async/await for I/O operations
- Background tasks for sync operations
- Async database queries

---

**Document Version**: 1.0  
**Last Updated**: 2025

