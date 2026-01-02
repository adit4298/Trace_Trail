# TraceTrail Database Schema

**Purpose**: Complete database schema documentation with table structures, relationships, indexes, and data flow.

**Database**: PostgreSQL 14+  
**ORM**: SQLAlchemy 2.0  
**Migrations**: Alembic

---

## Table of Contents

1. [Schema Overview](#schema-overview)
2. [Table Definitions](#table-definitions)
3. [Relationships](#relationships)
4. [Indexes](#indexes)
5. [Data Flow](#data-flow)
6. [Migration Strategy](#migration-strategy)

---

## Schema Overview

### Database: `trace_trail`

**Location**: Render PostgreSQL (production)  
**Connection**: Via `DATABASE_URL` environment variable

### Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `users` | User accounts | id, email, hashed_password |
| `oauth_connections` | OAuth account connections | user_id, provider, access_token |
| `signals` | Security signals | user_id, provider, signal_type, data |
| `anomalies` | Detected anomalies | user_id, signal_id, anomaly_type, severity |
| `system_health` | Health score snapshots | user_id, score, breakdown |
| `activities` | User activity log | user_id, action_type, message |

---

## Table Definitions

### users

**Purpose**: User accounts and authentication

**Columns**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | User identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | User email address |
| `hashed_password` | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | Account creation time |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT now() | Last update time |

**Indexes**:
- Primary key on `id`
- Unique index on `email`
- Index on `email` for fast lookups

**Relationships**:
- One-to-many with `oauth_connections`
- One-to-many with `signals`
- One-to-many with `anomalies`
- One-to-one with `system_health`
- One-to-many with `activities`

**SQLAlchemy Model**:
```python
class User(Base, TimestampMixin):
    __tablename__ = "users"
    
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    hashed_password: Mapped[str]
    
    # Relationships
    oauth_connections: Mapped[list["OAuthConnection"]]
    signals: Mapped[list["Signal"]]
    anomalies: Mapped[list["Anomaly"]]
    system_health: Mapped["SystemHealth"]
    activities: Mapped[list["Activity"]]
```

---

### oauth_connections

**Purpose**: Store OAuth account connections with encrypted tokens

**Columns**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Connection identifier |
| `user_id` | UUID | FOREIGN KEY → users.id, NOT NULL | User who owns connection |
| `provider` | VARCHAR(50) | NOT NULL | OAuth provider (google, instagram, facebook, twitter) |
| `access_token` | TEXT | NOT NULL | Encrypted access token |
| `refresh_token` | TEXT | NULLABLE | Encrypted refresh token |
| `expires_at` | TIMESTAMP | NULLABLE | Token expiration time |
| `scope` | TEXT | NULLABLE | OAuth scopes granted |
| `connected_at` | TIMESTAMP | NOT NULL, DEFAULT now() | Connection time |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT now() | Last update time |

**Constraints**:
- Unique constraint on (`user_id`, `provider`) - one connection per provider per user
- Foreign key constraint on `user_id` with CASCADE delete

**Indexes**:
- Primary key on `id`
- Unique index on (`user_id`, `provider`)
- Index on `user_id` for fast lookups
- Index on `provider` for filtering

**Security**:
- Tokens encrypted using Fernet symmetric encryption
- Encryption key stored in `ENCRYPTION_KEY` environment variable
- Tokens decrypted only when needed for API calls

**SQLAlchemy Model**:
```python
class OAuthConnection(Base, TimestampMixin):
    __tablename__ = "oauth_connections"
    __table_args__ = (
        UniqueConstraint("user_id", "provider", name="uq_oauth_user_provider"),
    )
    
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    provider: Mapped[str]
    access_token: Mapped[str]  # Encrypted
    refresh_token: Mapped[str | None]  # Encrypted
    expires_at: Mapped[datetime | None]
    scope: Mapped[str | None]
    connected_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="oauth_connections")
```

---

### signals

**Purpose**: Store security signals from connected accounts

**Columns**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Signal identifier |
| `user_id` | UUID | FOREIGN KEY → users.id, NOT NULL | User who owns signal |
| `provider` | VARCHAR(50) | NOT NULL | Source provider |
| `signal_type` | VARCHAR(100) | NOT NULL | Type of signal (login, post, etc.) |
| `data` | JSONB | NOT NULL | Signal data (flexible schema) |
| `detected_at` | TIMESTAMP | NOT NULL, DEFAULT now() | Detection time |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | Record creation time |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT now() | Last update time |

**Indexes**:
- Primary key on `id`
- Index on `user_id` for user queries
- Index on `provider` for filtering
- Index on `signal_type` for filtering
- Index on `detected_at` for time-based queries
- Composite index on (`user_id`, `detected_at`) for user timeline queries

**Data Schema** (JSONB):
```json
{
  "ip": "192.168.1.1",
  "location": "US",
  "device": "Chrome",
  "metadata": {}
}
```

**SQLAlchemy Model**:
```python
class Signal(Base, TimestampMixin):
    __tablename__ = "signals"
    
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    provider: Mapped[str]
    signal_type: Mapped[str]
    data: Mapped[dict] = mapped_column(JSON)
    detected_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="signals")
    anomalies: Mapped[list["Anomaly"]] = relationship("Anomaly", back_populates="signal")
```

---

### anomalies

**Purpose**: Store detected anomalies from signal analysis

**Columns**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Anomaly identifier |
| `user_id` | UUID | FOREIGN KEY → users.id, NOT NULL | User who owns anomaly |
| `signal_id` | UUID | FOREIGN KEY → signals.id, NULLABLE | Related signal (if any) |
| `anomaly_type` | VARCHAR(100) | NOT NULL | Type of anomaly |
| `severity` | VARCHAR(20) | NOT NULL | Severity (low, medium, high, critical) |
| `data` | JSONB | NOT NULL | Anomaly details |
| `detected_at` | TIMESTAMP | NOT NULL, DEFAULT now() | Detection time |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | Record creation time |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT now() | Last update time |

**Indexes**:
- Primary key on `id`
- Index on `user_id` for user queries
- Index on `signal_id` for signal relationships
- Index on `severity` for filtering
- Index on `detected_at` for time-based queries
- Composite index on (`user_id`, `severity`, `detected_at`) for dashboard queries

**Severity Values**:
- `low`: Minor issues
- `medium`: Moderate concerns
- `high`: Significant issues
- `critical`: Urgent attention required

**SQLAlchemy Model**:
```python
class Anomaly(Base, TimestampMixin):
    __tablename__ = "anomalies"
    
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    signal_id: Mapped[UUID | None] = mapped_column(ForeignKey("signals.id", ondelete="SET NULL"))
    anomaly_type: Mapped[str]
    severity: Mapped[str]
    data: Mapped[dict] = mapped_column(JSON)
    detected_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="anomalies")
    signal: Mapped["Signal | None"] = relationship("Signal", back_populates="anomalies")
```

---

### system_health

**Purpose**: Store system health score snapshots per user

**Columns**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Health record identifier |
| `user_id` | UUID | FOREIGN KEY → users.id, UNIQUE, NOT NULL | User (one health record per user) |
| `score` | FLOAT | NOT NULL | Health score (0-100) |
| `breakdown` | JSONB | NOT NULL | Detailed breakdown |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT now() | Last update time |

**Indexes**:
- Primary key on `id`
- Unique index on `user_id` (one-to-one relationship)
- Index on `score` for filtering/sorting

**Breakdown Schema** (JSONB):
```json
{
  "anomalies": 5,
  "critical_alerts": 2,
  "coverage": 0.86,
  "signal_volume": 120000,
  "trend": [85, 86, 87, 85, 84],
  "recommendations": [
    "Review login history",
    "Enable 2FA"
  ]
}
```

**SQLAlchemy Model**:
```python
class SystemHealth(Base, TimestampMixin):
    __tablename__ = "system_health"
    
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True
    )
    score: Mapped[float]
    breakdown: Mapped[dict] = mapped_column(JSON)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="system_health")
```

---

### activities

**Purpose**: Log user activities for audit and timeline

**Columns**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Activity identifier |
| `user_id` | UUID | FOREIGN KEY → users.id, NOT NULL | User who performed action |
| `action_type` | VARCHAR(100) | NOT NULL | Type of action |
| `message` | TEXT | NOT NULL | Human-readable message |
| `metadata` | JSONB | NULLABLE | Additional context |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | Activity time |

**Indexes**:
- Primary key on `id`
- Index on `user_id` for user activity queries
- Index on `action_type` for filtering
- Index on `created_at` for time-based queries
- Composite index on (`user_id`, `created_at`) for user timeline

**Action Types**:
- `oauth_redirect`: OAuth flow initiated
- `oauth_connect`: Account connected
- `oauth_disconnect`: Account disconnected
- `sync_started`: Sync operation started
- `sync_completed`: Sync operation completed
- `anomaly_detected`: Anomaly detected
- `health_updated`: Health score updated

**SQLAlchemy Model**:
```python
class Activity(Base, TimestampMixin):
    __tablename__ = "activities"
    
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    action_type: Mapped[str]
    message: Mapped[str]
    metadata: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="activities")
```

---

## Relationships

### Entity Relationship Diagram

```
users (1) ──< (N) oauth_connections
  │
  ├──< (N) signals
  │     │
  │     └──< (N) anomalies
  │
  ├──< (N) anomalies
  │
  ├──< (1) system_health
  │
  └──< (N) activities
```

### Relationship Details

#### users ↔ oauth_connections

- **Type**: One-to-Many
- **Foreign Key**: `oauth_connections.user_id → users.id`
- **Cascade**: DELETE CASCADE (deleting user deletes connections)
- **Access**: `user.oauth_connections` (list)
- **Access**: `connection.user` (single)

#### users ↔ signals

- **Type**: One-to-Many
- **Foreign Key**: `signals.user_id → users.id`
- **Cascade**: DELETE CASCADE
- **Access**: `user.signals` (list)
- **Access**: `signal.user` (single)

#### users ↔ anomalies

- **Type**: One-to-Many
- **Foreign Key**: `anomalies.user_id → users.id`
- **Cascade**: DELETE CASCADE
- **Access**: `user.anomalies` (list)
- **Access**: `anomaly.user` (single)

#### users ↔ system_health

- **Type**: One-to-One
- **Foreign Key**: `system_health.user_id → users.id`
- **Unique**: `user_id` is unique
- **Cascade**: DELETE CASCADE
- **Access**: `user.system_health` (single)
- **Access**: `health.user` (single)

#### users ↔ activities

- **Type**: One-to-Many
- **Foreign Key**: `activities.user_id → users.id`
- **Cascade**: DELETE CASCADE
- **Access**: `user.activities` (list)
- **Access**: `activity.user` (single)

#### signals ↔ anomalies

- **Type**: One-to-Many (optional)
- **Foreign Key**: `anomalies.signal_id → signals.id`
- **Cascade**: SET NULL (deleting signal doesn't delete anomaly)
- **Access**: `signal.anomalies` (list)
- **Access**: `anomaly.signal` (nullable)

---

## Indexes

### Performance Indexes

**users**:
- Primary key: `id`
- Unique: `email`
- Index: `email` (for fast lookups)

**oauth_connections**:
- Primary key: `id`
- Unique: (`user_id`, `provider`)
- Index: `user_id` (for user queries)
- Index: `provider` (for filtering)

**signals**:
- Primary key: `id`
- Index: `user_id` (for user queries)
- Index: `provider` (for filtering)
- Index: `signal_type` (for filtering)
- Index: `detected_at` (for time queries)
- Composite: (`user_id`, `detected_at`) (for user timeline)

**anomalies**:
- Primary key: `id`
- Index: `user_id` (for user queries)
- Index: `signal_id` (for signal relationships)
- Index: `severity` (for filtering)
- Index: `detected_at` (for time queries)
- Composite: (`user_id`, `severity`, `detected_at`) (for dashboard)

**system_health**:
- Primary key: `id`
- Unique: `user_id` (one-to-one)
- Index: `score` (for filtering/sorting)

**activities**:
- Primary key: `id`
- Index: `user_id` (for user queries)
- Index: `action_type` (for filtering)
- Index: `created_at` (for time queries)
- Composite: (`user_id`, `created_at`) (for user timeline)

---

## Data Flow

### OAuth Connection Flow

1. **User initiates OAuth**:
   - Frontend calls `/auth/{provider}/redirect`
   - Backend generates state token
   - Returns OAuth URL

2. **User authorizes**:
   - User authorizes on provider site
   - Provider redirects to callback

3. **Backend processes callback**:
   - Verifies state token
   - Exchanges code for tokens
   - Encrypts tokens
   - Creates `oauth_connections` record
   - Logs activity: `oauth_connect`

4. **Initial sync**:
   - Backend calls provider API
   - Processes response
   - Creates `signals` records
   - Detects anomalies
   - Creates `anomalies` records
   - Updates `system_health`

### Signal Processing Flow

1. **Sync operation**:
   - Scheduled or manual trigger
   - Get `oauth_connections` for user
   - Decrypt tokens
   - Call provider API

2. **Process signals**:
   - Parse API response
   - Create `signals` records
   - Detect anomalies
   - Create `anomalies` records

3. **Update health**:
   - Calculate health score
   - Update `system_health` record
   - Log activity: `health_updated`

### Health Score Calculation

**Inputs**:
- Number of anomalies
- Critical alerts count
- Coverage percentage
- Signal volume
- Historical trends

**Calculation**:
```python
score = base_score
score -= (anomalies * anomaly_penalty)
score -= (critical_alerts * critical_penalty)
score += (coverage * coverage_bonus)
score += (signal_volume_factor)
```

**Output**:
- Score: 0-100
- Breakdown: Detailed metrics
- Stored in `system_health` table

---

## Migration Strategy

### Alembic Migrations

**Location**: `backend/alembic/versions/`

**Naming**: `{revision}_{description}.py`

**Creating Migrations**:
```bash
cd backend
alembic revision --autogenerate -m "description"
```

**Applying Migrations**:
```bash
alembic upgrade head
```

**Rolling Back**:
```bash
alembic downgrade -1
```

### Migration Best Practices

1. **Backward Compatibility**: Migrations should be backward compatible when possible
2. **Data Migration**: Include data migration scripts if schema changes affect data
3. **Testing**: Test migrations on staging before production
4. **Rollback Plan**: Ensure migrations can be rolled back

---

## Data Retention

### Current Policy

- **Signals**: Retained indefinitely
- **Anomalies**: Retained indefinitely
- **Activities**: Retained indefinitely
- **OAuth Connections**: Retained until user disconnects
- **System Health**: Latest snapshot retained

### Future Considerations

- Implement data retention policies
- Archive old data
- Compliance with data protection regulations

---

## Security Considerations

### Encryption

- **OAuth Tokens**: Encrypted using Fernet
- **Passwords**: Hashed using bcrypt
- **Sensitive Data**: Consider encryption for PII

### Access Control

- **User Isolation**: All queries filtered by `user_id`
- **Foreign Keys**: Ensure referential integrity
- **Cascade Deletes**: Proper cleanup on user deletion

---

**Schema Version**: 2.0  
**Last Updated**: 2025

