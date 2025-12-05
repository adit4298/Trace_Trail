"""JWT creation and validation helpers."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Dict

from jose import jwt

from .config import get_settings


def create_access_token(subject: str, expires_in_minutes: int | None = None, extra_claims: Dict[str, Any] | None = None) -> str:
    """Create a signed JWT for the given subject."""

    settings = get_settings()
    expires_delta = timedelta(minutes=expires_in_minutes or settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    now = datetime.now(timezone.utc)
    payload: Dict[str, Any] = {
        "sub": subject,
        "iat": int(now.timestamp()),
        "exp": int((now + expires_delta).timestamp()),
    }
    if extra_claims:
        payload.update(extra_claims)
    token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return token


def decode_token(token: str) -> Dict[str, Any]:
    """Decode and validate a JWT."""

    settings = get_settings()
    return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])

