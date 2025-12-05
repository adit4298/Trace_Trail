"""Base OAuth client definitions."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Dict, List
from urllib.parse import urlencode
import uuid

import httpx
from jose import jwt

from ..core.config import Settings


@dataclass
class OAuthTokens:
    access_token: str
    refresh_token: str | None
    expires_at: datetime | None
    scope: str | None


class BaseOAuthClient:
    """Base class for OAuth2 providers."""

    provider: str = "base"
    auth_url: str = ""
    token_url: str = ""
    profile_url: str = ""
    metadata_url: str | None = None
    scopes: List[str] = ()

    def __init__(self, *, client_id: str, client_secret: str, redirect_uri: str, settings: Settings):
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri
        self.settings = settings

    def generate_state(self, user_id: uuid.UUID) -> str:
        payload = {
            "sub": str(user_id),
            "provider": self.provider,
            "exp": datetime.now(timezone.utc) + timedelta(minutes=10),
        }
        return jwt.encode(payload, self.settings.OAUTH_STATE_SECRET, algorithm=self.settings.JWT_ALGORITHM)

    def verify_state(self, state: str) -> uuid.UUID:
        payload = jwt.decode(
            state,
            self.settings.OAUTH_STATE_SECRET,
            algorithms=[self.settings.JWT_ALGORITHM],
        )
        if payload.get("provider") != self.provider:
            raise ValueError("State provider mismatch")
        return uuid.UUID(payload["sub"])

    def get_redirect_url(self, state: str) -> str:
        params = {
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "response_type": "code",
            "scope": " ".join(self.scopes),
            "state": state,
            "access_type": "offline",
            "prompt": "consent",
        }
        return f"{self.auth_url}?{urlencode(params)}"

    def exchange_code(self, code: str) -> OAuthTokens:
        data = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": self.redirect_uri,
        }
        response = httpx.post(self.token_url, data=data, timeout=30)
        response.raise_for_status()
        payload = response.json()
        expires_in = payload.get("expires_in")
        expires_at = datetime.now(timezone.utc) + timedelta(seconds=expires_in) if expires_in else None
        return OAuthTokens(
            access_token=payload["access_token"],
            refresh_token=payload.get("refresh_token"),
            expires_at=expires_at,
            scope=payload.get("scope"),
        )

    def refresh_access_token(self, refresh_token: str) -> OAuthTokens:
        data = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "refresh_token": refresh_token,
            "grant_type": "refresh_token",
        }
        response = httpx.post(self.token_url, data=data, timeout=30)
        response.raise_for_status()
        payload = response.json()
        expires_in = payload.get("expires_in")
        expires_at = datetime.now(timezone.utc) + timedelta(seconds=expires_in) if expires_in else None
        return OAuthTokens(
            access_token=payload["access_token"],
            refresh_token=payload.get("refresh_token", refresh_token),
            expires_at=expires_at,
            scope=payload.get("scope"),
        )

    def fetch_profile(self, access_token: str) -> Dict:
        headers = {"Authorization": f"Bearer {access_token}"}
        response = httpx.get(self.profile_url, headers=headers, timeout=30)
        response.raise_for_status()
        return response.json()

    def fetch_metadata(self, access_token: str) -> Dict:
        if not self.metadata_url:
            return {"activities": []}
        headers = {"Authorization": f"Bearer {access_token}"}
        response = httpx.get(self.metadata_url, headers=headers, timeout=30)
        response.raise_for_status()
        return response.json()

