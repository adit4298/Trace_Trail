"""Security helpers for hashing passwords and refresh tokens."""

from __future__ import annotations

import hashlib
import secrets

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt."""

    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""

    return pwd_context.verify(password, hashed_password)


def generate_refresh_token() -> str:
    """Generate a secure random refresh token."""

    return secrets.token_urlsafe(64)


def hash_refresh_token(token: str) -> str:
    """Hash refresh tokens before persisting."""

    return hashlib.sha256(token.encode("utf-8")).hexdigest()

