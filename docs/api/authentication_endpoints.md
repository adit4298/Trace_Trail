# Authentication Endpoints

Base path: `/auth`

All responses include `status`, `data`, and `meta` fields (see `api_overview.md`).

---

## POST `/auth/signup`

Create a new user.

### Request

```json
{
  "email": "user@example.com",
  "username": "trace_user",
  "password": "SuperSecure!234",
  "fullName": "Trace User"
}
```

### Response

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "trace_user"
    },
    "accessToken": "<jwt>",
    "refreshToken": "<jwt>"
  }
}
```

---

## POST `/auth/login`

Authenticates credentials and returns tokens.

```json
{
  "email": "user@example.com",
  "password": "SuperSecure!234"
}
```

Response identical to signup. Rate-limited to deter brute force attacks.

---

## POST `/auth/refresh`

Exchange refresh token for a new access token.

```json
{
  "refreshToken": "<jwt>"
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "accessToken": "<new access>",
    "refreshToken": "<new refresh>"
  }
}
```

---

## POST `/auth/logout`

Optional endpoint to revoke refresh tokens (implementation TBD). Clients should
still clear stored tokens locally.

---

## Error Codes

| HTTP | Code                 | Description                                |
| ---- | -------------------- | ------------------------------------------ |
| 400  | `VALIDATION_ERROR`   | Password complexity or missing fields      |
| 401  | `INVALID_CREDENTIALS`| Wrong username/password combo              |
| 409  | `USER_EXISTS`        | Email or username already registered       |
| 429  | `RATE_LIMITED`       | Too many login attempts                    |

All errors include `error.code`, `error.message`, and optional `details`.


