# Authentication Guide

Trace Trail uses JWT-based authentication with short-lived access tokens and
refresh tokens. This guide explains the flow and where logic resides.

---

## Components

- `src/auth/router.py` — HTTP endpoints for signup, login, refresh, logout.
- `src/auth/service.py` — Business logic for password hashing, token creation,
  refresh token rotation.
- `src/core/security.py` — Helpers for hashing (`CryptContext`) and JWT
  encoding/decoding.
- `src/auth/dependencies.py` — FastAPI dependencies such as `get_current_user`
  and role guards.

---

## Token Strategy

| Token  | Lifetime | Storage                       | Use                                             |
| ------ | -------- | ----------------------------- | ----------------------------------------------- |
| Access | 30 mins  | Stored in memory/localStorage | Auth header `Authorization: Bearer <token>`     |
| Refresh| 30 days  | HTTP-only cookie or secure LS | Exchange for new access token via `/auth/refresh`|

Settings are configured in `.env` via `ACCESS_TOKEN_EXPIRE_MINUTES` and
`REFRESH_TOKEN_EXPIRE_DAYS`.

---

## Login Flow

1. Client sends credentials to `POST /auth/login`.
2. Service verifies password using `bcrypt` hash stored in `users/models.py`.
3. Access + refresh tokens are generated with payload:
   ```json
   {
     "sub": "<user_id>",
     "scopes": ["user"],
     "exp": "<expiry timestamp>"
   }
   ```
4. Tokens returned in JSON body. Frontend stores them via `AuthContext`.

---

## Protecting Routes

- Use `Depends(get_current_user)` in routers:

```python
@router.get("/me", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user
```

- For admin-only routes use `require_role("admin")`.

---

## Password Policies

- Minimum length 12 characters.
- At least one uppercase, lowercase, number, and special character.
- Enforced via validators in `auth/schemas.py` and helper functions in
  `auth/constants.py`.

---

## Refresh & Logout

- `POST /auth/refresh` accepts the refresh token and issues a new access token.
- Refresh tokens are invalidated on logout by deleting db records (future) or
  client-side removal.

---

## Security Tips

- Enable HTTPS + secure cookies in production.
- Rotate `SECRET_KEY` carefully; doing so invalidates all tokens.
- Monitor `src.extension.middleware` for WebSocket auth; tokens should be
  validated before establishing live sessions.

Document any additional auth flows (magic links, MFA) here when implemented.


