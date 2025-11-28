# API Overview

This page summarizes Trace Trail's public REST API. Individual endpoints are
documented in their own files (`analysis_endpoints.md`, `authentication_endpoints.md`,
`dashboard_endpoints.md`) and the Postman collection.

---

## Base URLs

| Environment | URL                                |
| ----------- | ---------------------------------- |
| Local       | `http://localhost:8000`            |
| Staging     | `https://api.staging.tracetrail.com` |
| Production  | `https://api.tracetrail.com`       |

All endpoints communicate over HTTPS (except local development).

---

## Authentication

- JWT Bearer tokens (see `authentication_endpoints.md`).
- Include header: `Authorization: Bearer <access_token>`.
- Refresh tokens via `/auth/refresh`.

---

## Response Envelope

```
{
  "status": "success",
  "data": {},
  "meta": {
    "requestId": "uuid",
    "timestamp": "ISO8601"
  }
}
```

Errors return `status="error"` and an `error` object.

---

## Common Headers

| Header             | Description                          |
| ------------------ | ------------------------------------ |
| `X-Request-Id`     | Returned for tracing; send your own to correlate logs |
| `X-API-Version`    | Optional; defaults to current release|
| `Content-Type`     | `application/json`                   |

---

## Rate Limiting

- Default: 60 requests/minute per access token.
- Extension ingest routes respect `EXTENSION_RATE_LIMIT`.
- Clients exceeding the limit receive HTTP 429 and `Retry-After` header.

---

## Tools

- Import `docs/api/postman_collection.json` into Postman for ready-made
  requests.
- Use `curl` or HTTPie for quick smoke tests:

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/dashboard/summary
```

---

## Versioning & Deprecation

- Breaking changes trigger a new version of the Postman collection and are
  logged in `CHANGELOG.md`.
- Deprecated endpoints respond with `Warning` headers before removal.


