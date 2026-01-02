# TraceTrail API Specification

**Purpose**: Complete API documentation for TraceTrail backend endpoints, request/response formats, and integration examples.

**Base URL**: 
- Production: `https://api.tracetrail.in`
- Local: `http://localhost:8000`

**API Version**: 2.0.0

---

## Table of Contents

1. [Authentication](#authentication)
2. [OAuth Endpoints](#oauth-endpoints)
3. [Account Management](#account-management)
4. [Sync Operations](#sync-operations)
5. [Dashboard Endpoints](#dashboard-endpoints)
6. [Health Endpoints](#health-endpoints)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)

---

## Authentication

### Login

**Endpoint**: `POST /auth/login`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 900,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid credentials
- `422 Unprocessable Entity`: Validation error

### Register

**Endpoint**: `POST /auth/register`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response** (201 Created):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2025-01-01T00:00:00Z"
}
```

### Refresh Token

**Endpoint**: `POST /auth/refresh`

**Request**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 900
}
```

---

## OAuth Endpoints

### Get OAuth Redirect URL

**Endpoint**: `GET /auth/{provider}/redirect`

**Path Parameters**:
- `provider`: One of `google`, `instagram`, `facebook`, `twitter`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "authorization_url": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

**Example**:
```bash
curl -X GET "https://api.tracetrail.in/auth/google/redirect" \
  -H "Authorization: Bearer <token>"
```

### OAuth Callback

**Endpoint**: `GET /auth/{provider}/callback`

**Query Parameters**:
- `code`: Authorization code from OAuth provider
- `state`: State token for verification
- `error`: Error code (if OAuth failed)

**Response**: HTTP 302 Redirect to frontend

**Redirect URLs**:
- Success: `https://app.tracetrail.in/oauth/callback?provider={provider}&status=success`
- Error: `https://app.tracetrail.in/oauth/callback?provider={provider}&status=error&reason={reason}`

**Note**: This endpoint is called by OAuth provider, not directly by frontend.

---

## Account Management

### Get Connected Accounts

**Endpoint**: `GET /accounts`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
[
  {
    "provider": "google",
    "connected": true,
    "username": "user@gmail.com",
    "email": "user@gmail.com",
    "last_synced_at": "2025-01-01T12:00:00Z"
  },
  {
    "provider": "instagram",
    "connected": false,
    "last_synced_at": null
  }
]
```

### Disconnect Account

**Endpoint**: `POST /accounts/{provider}/disconnect`

**Path Parameters**:
- `provider`: One of `google`, `instagram`, `facebook`, `twitter`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (204 No Content)

**Example**:
```bash
curl -X POST "https://api.tracetrail.in/accounts/google/disconnect" \
  -H "Authorization: Bearer <token>"
```

---

## Sync Operations

### Sync Provider

**Endpoint**: `POST /sync/{provider}`

**Path Parameters**:
- `provider`: One of `google`, `instagram`, `facebook`, `twitter`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (202 Accepted):
```json
{
  "status": "queued",
  "provider": "google",
  "message": "Sync operation queued"
}
```

**Process**:
1. Validates OAuth connection exists
2. Decrypts stored tokens
3. Calls provider API to fetch data
4. Processes and stores signals
5. Detects anomalies
6. Updates last sync timestamp

### Sync All Accounts

**Endpoint**: `POST /sync/all`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (202 Accepted):
```json
{
  "status": "queued",
  "providers": ["google", "instagram"],
  "message": "Sync operations queued for all connected accounts"
}
```

---

## Dashboard Endpoints

### Get Dashboard Summary

**Endpoint**: `GET /dashboard/summary`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "navigation": [
    {
      "id": "overview",
      "label": "Overview",
      "href": "/",
      "icon": "overview"
    },
    {
      "id": "accounts",
      "label": "Accounts",
      "href": "/dashboard/accounts",
      "icon": "accounts"
    }
  ],
  "notifications": 4,
  "user": {
    "name": "John Doe",
    "title": "Director",
    "organization": "Company",
    "avatarUrl": "https://..."
  },
  "metrics": [
    {
      "id": "risk-score",
      "label": "Risk Score",
      "value": "23.4",
      "change": -5.8,
      "trend": "down",
      "status": "Stable"
    }
  ],
  "trends": {
    "title": "Anomaly Volume",
    "data": [
      {
        "timestamp": "2025-01-01",
        "value": 22
      }
    ]
  },
  "activities": [
    {
      "id": "act-1",
      "actor": "System",
      "action": "Account connected",
      "timestamp": "2025-01-01T00:00:00Z",
      "state": "success"
    }
  ]
}
```

### Get Signals

**Endpoint**: `GET /dashboard/signals`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20)
- `provider`: Filter by provider
- `signal_type`: Filter by signal type

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "uuid",
      "provider": "google",
      "signal_type": "login",
      "data": {
        "ip": "192.168.1.1",
        "location": "US"
      },
      "detected_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "page_size": 20
}
```

### Get Anomalies

**Endpoint**: `GET /dashboard/anomalies`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20)
- `severity`: Filter by severity (low, medium, high, critical)

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "uuid",
      "anomaly_type": "unusual_login",
      "severity": "high",
      "data": {
        "location": "Unknown",
        "device": "Unknown"
      },
      "detected_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "page_size": 20
}
```

### Get Insights

**Endpoint**: `GET /dashboard/insights`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "insights": [
    {
      "id": "uuid",
      "title": "Unusual Activity Detected",
      "description": "Multiple login attempts from new location",
      "severity": "high",
      "recommendations": [
        "Review login history",
        "Enable 2FA"
      ],
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

## Health Endpoints

### Health Check

**Endpoint**: `GET /health`

**No Authentication Required**

**Response** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00Z",
  "version": "2.0.0",
  "environment": "production"
}
```

**Use Cases**:
- Load balancer health checks
- Monitoring systems
- Deployment verification

### System Health

**Endpoint**: `GET /system-health`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "score": 85.5,
  "breakdown": {
    "anomalies": 5,
    "critical_alerts": 2,
    "coverage": 0.86,
    "signal_volume": 120000
  },
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

## Error Handling

### Error Response Format

```json
{
  "detail": "Error message",
  "status_code": 400
}
```

### Common Error Codes

| Status Code | Meaning | Example |
|-------------|---------|---------|
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation error |
| 500 | Internal Server Error | Server error |
| 502 | Bad Gateway | External API error |

### Validation Errors

**Response** (422 Unprocessable Entity):
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

## Rate Limiting

### Current Limits

- **Default**: 100 requests per minute per IP
- **OAuth Endpoints**: 10 requests per minute per user
- **Sync Endpoints**: 5 requests per minute per user

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Rate Limit Exceeded

**Response** (429 Too Many Requests):
```json
{
  "detail": "Rate limit exceeded. Please try again later.",
  "status_code": 429
}
```

---

## Authentication Flow

### Using JWT Tokens

1. **Login** to get access and refresh tokens
2. **Include token** in Authorization header:
   ```
   Authorization: Bearer <access_token>
   ```
3. **Refresh token** when access token expires
4. **Re-login** if refresh token expires

### Token Expiration

- **Access Token**: 15 minutes
- **Refresh Token**: 7 days

### Example Request

```bash
curl -X GET "https://api.tracetrail.in/accounts" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## API Documentation

### Interactive Documentation

- **Swagger UI**: `https://api.tracetrail.in/docs`
- **ReDoc**: `https://api.tracetrail.in/redoc`
- **OpenAPI JSON**: `https://api.tracetrail.in/openapi.json`

### Postman Collection

Location: `docs/api/postman_collection.json`

Import into Postman for testing and documentation.

---

## Integration Examples

### JavaScript/TypeScript

```typescript
const API_BASE_URL = 'https://api.tracetrail.in';

async function getAccounts(token: string) {
  const response = await fetch(`${API_BASE_URL}/accounts`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}
```

### Python

```python
import requests

API_BASE_URL = 'https://api.tracetrail.in'

def get_accounts(token: str):
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    response = requests.get(f'{API_BASE_URL}/accounts', headers=headers)
    response.raise_for_status()
    return response.json()
```

---

## Webhooks (Future)

Webhooks will be available for:
- Account sync completion
- Anomaly detection
- Health score updates

---

**API Version**: 2.0.0  
**Last Updated**: 2025

