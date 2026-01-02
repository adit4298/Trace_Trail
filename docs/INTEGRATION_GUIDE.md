# TraceTrail Integration Guide

**Purpose**: Complete guide on how frontend, backend, and AI module integrate and communicate.

**Target Audience**: Developers and AI systems understanding system integration

---

## Table of Contents

1. [Integration Overview](#integration-overview)
2. [Frontend-Backend Integration](#frontend-backend-integration)
3. [Backend-Database Integration](#backend-database-integration)
4. [OAuth Provider Integration](#oauth-provider-integration)
5. [Data Synchronization Flow](#data-synchronization-flow)
6. [Error Handling Across Layers](#error-handling-across-layers)

---

## Integration Overview

### System Integration Map

```
┌─────────────────────────────────────────────────────────────┐
│                    INTEGRATION LAYERS                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: Frontend ↔ Backend                                 │
│  ┌──────────────┐         HTTPS REST         ┌──────────┐  │
│  │   Next.js    │ ◄─────────────────────────► │ FastAPI  │  │
│  │   Frontend   │    JWT Authentication       │ Backend  │  │
│  └──────────────┘                             └────┬─────┘  │
│                                                     │         │
│  Layer 2: Backend ↔ Database                        │         │
│                                                     │         │
│  ┌──────────────┐         SQLAlchemy ORM          │         │
│  │   FastAPI    │ ◄───────────────────────────────┘         │
│  │   Backend    │                                           │
│  └──────┬───────┘                                           │
│         │                                                   │
│  Layer 3: Backend ↔ OAuth Providers                         │
│         │                                                   │
│  ┌──────┴───────┐      OAuth 2.0 API Calls                 │
│  │   FastAPI    │ ◄─────────────────────────────────────── │
│  │   Backend    │    Google, Instagram, Facebook, Twitter  │
│  └──────────────┘                                           │
│                                                               │
│  Layer 4: Backend ↔ AI Module (Optional)                    │
│  ┌──────────────┐         HTTP REST         ┌──────────┐   │
│  │   FastAPI    │ ◄───────────────────────► │ AI Module│   │
│  │   Backend    │    Risk Scoring, Analysis │ (Future) │   │
│  └──────────────┘                           └──────────┘   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## Frontend-Backend Integration

### Communication Protocol

**Protocol**: HTTPS REST API  
**Authentication**: JWT Bearer tokens  
**Content-Type**: `application/json`  
**Base URL**: 
- Production: `https://api.tracetrail.in`
- Local: `http://localhost:8000`

### Authentication Flow

#### 1. Login

```
Frontend                    Backend                    Database
   │                           │                           │
   │  POST /auth/login         │                           │
   │  {email, password}         │                           │
   │──────────────────────────>│                           │
   │                           │  Query users table        │
   │                           │──────────────────────────>│
   │                           │  Verify password          │
   │                           │<──────────────────────────│
   │  {access_token,           │                           │
   │   refresh_token}           │                           │
   │<──────────────────────────│                           │
   │                           │                           │
   │  Store tokens             │                           │
   │                           │                           │
```

#### 2. Authenticated Request

```
Frontend                    Backend
   │                           │
   │  GET /accounts            │
   │  Authorization: Bearer    │
   │  <token>                  │
   │──────────────────────────>│
   │                           │  Verify JWT token
   │                           │  Extract user_id
   │                           │  Query database
   │  {accounts: [...]}         │
   │<──────────────────────────│
```

### Data Fetching Patterns

#### Server-Side (Next.js Server Components)

**Location**: `app/page.tsx`, `app/dashboard/accounts/page.tsx`

**Pattern**:
```typescript
// Server Component
export default async function DashboardPage() {
  // Fetch happens on server
  const snapshot = await fetchDashboardSnapshot();
  
  return <AppShell snapshot={snapshot}>...</AppShell>;
}
```

**Flow**:
1. Next.js server executes component
2. Calls `fetchDashboardSnapshot()` (server-side)
3. Makes HTTP request to backend
4. Backend queries database
5. Returns data
6. Server renders HTML with data
7. Client receives fully rendered page

**Benefits**:
- SEO-friendly (data in HTML)
- Faster initial load
- No client-side API calls needed
- Works even if JavaScript disabled

#### Client-Side (React Client Components)

**Location**: `components/accounts/ConnectedAccounts.tsx`

**Pattern**:
```typescript
'use client';

export const ConnectedAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  
  useEffect(() => {
    // Fetch happens on client
    getAccounts().then(setAccounts);
  }, []);
  
  return <div>...</div>;
};
```

**Flow**:
1. Component mounts in browser
2. `useEffect` triggers
3. Calls `getAccounts()` (client-side)
4. Makes HTTP request to backend
5. Backend queries database
6. Returns JSON data
7. Updates React state
8. Component re-renders

**Benefits**:
- Real-time updates
- User interactions
- Dynamic data fetching

### API Client Implementation

#### Server-Side Client

**File**: `lib/api.ts`

**Usage**: Server Components only

**Features**:
- Next.js caching support
- Revalidation tags
- Build-time safety (mock data fallback)

**Example**:
```typescript
export async function fetchDashboardSnapshot() {
  // During build, use mock data
  if (isBuildTime || !API_BASE_URL) {
    return mockDashboardSnapshot;
  }
  
  // Runtime: Fetch from API
  try {
    return await fetchJson(dashboardUrl, {
      revalidate: 60,
      tags: ['dashboard']
    });
  } catch {
    return mockDashboardSnapshot; // Fallback
  }
}
```

#### Client-Side Client

**File**: `src/services/api.ts`

**Usage**: Client Components

**Features**:
- Automatic base URL resolution
- Token handling
- Error handling
- Type safety

**Example**:
```typescript
export const apiGet = <T>(path: string, token?: string) => {
  const url = buildRequestUrl(path);
  return fetch(url, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined,
      'Content-Type': 'application/json'
    }
  }).then(res => res.json() as T);
};
```

### Error Handling

#### Frontend Error Handling

**Build-Time**:
- Uses mock data if API unavailable
- No build failures

**Runtime**:
- Try-catch blocks around API calls
- Fallback to mock data
- User-friendly error messages
- Buttons disabled when API unavailable

**Example**:
```typescript
try {
  const accounts = await getAccounts();
  setAccounts(accounts);
} catch (error) {
  // Graceful degradation
  setAccounts(initialState);
  setError('Unable to load accounts');
}
```

#### Backend Error Handling

**HTTP Status Codes**:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 422: Validation Error
- 500: Server Error

**Error Response Format**:
```json
{
  "detail": "Error message"
}
```

---

## Backend-Database Integration

### SQLAlchemy ORM

**File**: `src/app/core/database.py`

**Connection Management**:
```python
# Database engine
engine = create_engine(DATABASE_URL)

# Session factory
SessionLocal = sessionmaker(bind=engine)

# Dependency injection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Query Patterns

#### Simple Query

```python
@router.get("/accounts")
def get_accounts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    accounts = db.query(OAuthConnection).filter(
        OAuthConnection.user_id == current_user.id
    ).all()
    return accounts
```

#### Relationship Query

```python
# Eager loading
user = db.query(User).options(
    joinedload(User.oauth_connections)
).filter(User.id == user_id).first()

# Access relationships
connections = user.oauth_connections
```

#### Transaction Management

```python
try:
    connection = OAuthConnection(...)
    db.add(connection)
    db.commit()  # Commit transaction
except Exception:
    db.rollback()  # Rollback on error
    raise
```

### Data Encryption

**Location**: `src/app/utils/crypto.py`

**Process**:
1. **Store**: Encrypt token before saving
   ```python
   encrypted = encrypt_token(access_token)
   connection.access_token = encrypted
   ```

2. **Retrieve**: Decrypt token when needed
   ```python
   encrypted = connection.access_token
   access_token = decrypt_token(encrypted)
   ```

**Security**:
- Fernet symmetric encryption
- Key stored in environment variable
- Tokens never in plaintext

---

## OAuth Provider Integration

### Supported Providers

1. **Google**: OAuth 2.0
2. **Instagram**: Instagram Basic Display API
3. **Facebook**: Facebook Graph API
4. **Twitter/X**: Twitter OAuth 2.0

### OAuth Client Architecture

**Base Class**: `src/app/oauth/base.py`

**BaseOAuthClient** provides:
- State generation (JWT with user ID)
- State verification
- Authorization URL building
- Token exchange
- Token refresh
- Profile fetching

**Provider-Specific**:
- Each provider extends `BaseOAuthClient`
- Implements provider-specific URLs and parameters
- Handles provider-specific response formats

### OAuth Flow Integration

#### Step 1: Initiate OAuth

```
Frontend              Backend              OAuth Provider
   │                     │                       │
   │ GET /auth/google/   │                       │
   │ redirect            │                       │
   │────────────────────>│                       │
   │                     │ Generate state token  │
   │                     │ Build OAuth URL       │
   │ {authorization_url} │                       │
   │<────────────────────│                       │
   │                     │                       │
   │ Redirect user       │                       │
   │────────────────────────────────────────────>│
```

#### Step 2: User Authorization

```
User authorizes on OAuth provider site
```

#### Step 3: Callback Processing

```
OAuth Provider        Backend              Database
   │                     │                       │
   │ GET /auth/google/   │                       │
   │ callback?code=...  │                       │
   │────────────────────>│                       │
   │                     │ Verify state          │
   │                     │ Exchange code          │
   │                     │──────────────────────>│
   │                     │ Get tokens            │
   │                     │<──────────────────────│
   │                     │ Encrypt tokens        │
   │                     │ Store in DB           │
   │                     │──────────────────────>│
   │                     │ Sync data             │
   │                     │──────────────────────>│
   │                     │                       │
   │ Redirect to         │                       │
   │ frontend            │                       │
   │<────────────────────│                       │
```

### Token Management

**Storage**:
- Encrypted in `oauth_connections` table
- Never stored in plaintext
- Refresh tokens stored when available

**Usage**:
- Decrypted only when needed for API calls
- Automatically refreshed when expired
- Re-encrypted after refresh

**Security**:
- Encryption key in environment
- Tokens scoped to user
- Provider-specific scopes

---

## Data Synchronization Flow

### Sync Trigger

**Methods**:
1. **Scheduled**: Background scheduler (every 6 hours)
2. **Manual**: User clicks "Sync now"
3. **Automatic**: After OAuth connection

### Sync Process

```
Scheduler/User          Backend              OAuth Provider      Database
   │                     │                       │                   │
   │ POST /sync/google   │                       │                   │
   │────────────────────>│                       │                   │
   │                     │ Get OAuth connection │                   │
   │                     │──────────────────────────────────────────>│
   │                     │ Decrypt tokens        │                   │
   │                     │<──────────────────────────────────────────│
   │                     │                       │                   │
   │                     │ GET /api/endpoint     │                   │
   │                     │ Authorization: Bearer │                   │
   │                     │──────────────────────>│                   │
   │                     │ {data: [...]}         │                   │
   │                     │<──────────────────────│                   │
   │                     │                       │                   │
   │                     │ Process signals       │                   │
   │                     │ Detect anomalies      │                   │
   │                     │ Store in DB           │                   │
   │                     │──────────────────────────────────────────>│
   │                     │ Update health score   │                   │
   │                     │──────────────────────────────────────────>│
   │ {status: "queued"}  │                       │                   │
   │<────────────────────│                       │                   │
```

### Signal Processing

**Steps**:
1. Fetch data from provider API
2. Parse response
3. Create `signals` records
4. Analyze for anomalies
5. Create `anomalies` records if found
6. Update `system_health` score
7. Log activity

### Health Score Update

**Trigger**: After sync or anomaly detection

**Calculation**:
- Inputs: Anomalies, alerts, coverage, signal volume
- Algorithm: Weighted scoring
- Output: Score (0-100) and breakdown

**Storage**: `system_health` table

---

## Error Handling Across Layers

### Frontend Error Handling

**Build-Time Errors**:
- API unavailable → Use mock data
- No build failures

**Runtime Errors**:
- Network errors → Show user message
- API errors → Display error state
- Component errors → Graceful degradation

### Backend Error Handling

**Database Errors**:
- Connection failures → 500 error
- Query errors → Log and return 500
- Constraint violations → 400 error

**OAuth Errors**:
- Invalid state → 400 error
- Token exchange failure → 500 error
- Provider API errors → 502 error

**Validation Errors**:
- Pydantic validation → 422 error
- Missing required fields → 422 error

### Error Propagation

```
Frontend Request
    │
    ├─> Backend Route
    │       │
    │       ├─> Service Layer
    │       │       │
    │       │       ├─> Database Query
    │       │       │       │
    │       │       │       └─> Error: Database connection failed
    │       │       │
    │       │       └─> Error: Service error
    │       │
    │       └─> Error: HTTP 500
    │
    └─> Error: Display user-friendly message
```

---

## CORS Configuration

### Backend CORS Setup

**File**: `src/app/core/config.py`

**Configuration**:
```python
CORS_ORIGINS = [
    "https://app.tracetrail.in",  # Production
    "http://localhost:5173",      # Local dev
    "http://localhost:3000"        # Local dev
]
```

**Middleware**: CORSMiddleware in FastAPI

**Settings**:
- `allow_origins`: CORS_ORIGINS
- `allow_credentials`: True
- `allow_methods`: ["*"]
- `allow_headers`: ["*"]

### Frontend CORS

**No configuration needed** - handled by backend

**Preflight Requests**: Automatically handled by browser

---

## Data Flow Examples

### Example 1: User Views Dashboard

```
1. User navigates to https://app.tracetrail.in
2. Next.js server renders page
3. Server Component calls fetchDashboardSnapshot()
4. HTTP GET https://api.tracetrail.in/dashboard/summary
5. Backend verifies JWT token
6. Backend queries database:
   - Get user
   - Get oauth_connections
   - Get signals (recent)
   - Get anomalies (recent)
   - Get system_health
7. Backend aggregates data
8. Returns JSON response
9. Next.js renders HTML with data
10. Browser displays dashboard
```

### Example 2: User Connects Google Account

```
1. User clicks "Connect" on Google card
2. Frontend calls GET /auth/google/redirect
3. Backend generates state token (JWT with user_id)
4. Backend builds Google OAuth URL
5. Returns URL to frontend
6. Frontend redirects to Google
7. User authorizes on Google
8. Google redirects to /auth/google/callback?code=...&state=...
9. Backend verifies state token
10. Backend exchanges code for tokens
11. Backend encrypts tokens
12. Backend creates oauth_connections record
13. Backend calls Google API to fetch initial data
14. Backend creates signals records
15. Backend detects anomalies
16. Backend updates system_health
17. Backend redirects to frontend success page
18. Frontend shows success message
```

### Example 3: Scheduled Sync

```
1. Scheduler triggers (every 6 hours)
2. Backend gets all oauth_connections
3. For each connection:
   a. Decrypt tokens
   b. Check if expired → Refresh if needed
   c. Call provider API
   d. Process response
   e. Create/update signals
   f. Detect anomalies
   g. Update system_health
4. Log sync completion
```

---

## Performance Considerations

### Frontend Optimization

- Server-side rendering for initial load
- Client-side caching
- Code splitting
- Image optimization
- Lazy loading

### Backend Optimization

- Database connection pooling
- Query optimization (indexes)
- Eager loading for relationships
- Caching (future: Redis)
- Async operations

### Database Optimization

- Proper indexes
- Query optimization
- Connection pooling
- Transaction management

---

## Security Integration

### Authentication Flow

1. User logs in → Backend validates credentials
2. Backend generates JWT tokens
3. Frontend stores tokens
4. Frontend includes token in requests
5. Backend verifies token on each request

### Authorization

- User-scoped data access
- All queries filtered by user_id
- OAuth state validation
- Token encryption

### Data Protection

- HTTPS for all communications
- Encrypted token storage
- Hashed passwords
- CORS restrictions

---

## Monitoring Integration

### Health Checks

- Backend: `GET /health` endpoint
- Frontend: Build verification
- Database: Connection checks

### Logging

- Structured logging in backend
- Request ID tracking
- Error logging
- Activity logging

### Metrics (Future)

- Response times
- Error rates
- Database performance
- OAuth sync success rates

---

**This guide explains how all components integrate to form the complete TraceTrail system.**

**Document Version**: 1.0  
**Last Updated**: 2025

