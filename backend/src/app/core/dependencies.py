"""Dependency helpers for FastAPI routes."""

from __future__ import annotations

import uuid
from typing import Dict

from fastapi import Depends, Header, HTTPException, Request, status
from sqlalchemy.orm import Session

from .config import Settings, get_settings
from .jwt import decode_token
from ..db.session import get_db
from ..models import User
from ..oauth import BaseOAuthClient, build_oauth_registry
from ..services.auth_service import AuthService
from ..services.health_service import SystemHealthService
from ..services.insight_service import InsightService
from ..services.sync_service import SyncService

OAuthRegistry = Dict[str, BaseOAuthClient]

oauth_registry_cache: OAuthRegistry | None = None


def get_settings_dep() -> Settings:
    return get_settings()


def get_oauth_registry(settings: Settings = Depends(get_settings_dep)) -> OAuthRegistry:
    global oauth_registry_cache
    if oauth_registry_cache is None:
        oauth_registry_cache = build_oauth_registry(settings)
    return oauth_registry_cache


def get_current_user(
    db: Session = Depends(get_db),
    authorization: str | None = Header(default=None, alias="Authorization"),
) -> User:
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authorization header")

    try:
        payload = decode_token(token)
        user_id = uuid.UUID(payload["sub"])
    except Exception as exc:  # pylint: disable=broad-except
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc

    user = db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")

    return user


def get_auth_service(
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings_dep),
) -> AuthService:
    return AuthService(db=db, settings=settings)


def get_health_service(db: Session = Depends(get_db)) -> SystemHealthService:
    return SystemHealthService(db=db)


def get_insight_service(db: Session = Depends(get_db)) -> InsightService:
    return InsightService(db=db)


def get_sync_service(
    db: Session = Depends(get_db),
    oauth_registry: OAuthRegistry = Depends(get_oauth_registry),
) -> SyncService:
    health_service = SystemHealthService(db=db)
    return SyncService(db=db, oauth_registry=oauth_registry, health_service=health_service)

