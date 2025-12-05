"""OAuth specific routes for initiating and handling callbacks."""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..core.constants import SUPPORTED_PROVIDERS
from ..core.config import Settings, get_settings
from ..core.dependencies import get_current_user, get_db, get_oauth_registry
from ..models import OAuthConnection, User
from ..schemas import OAuthRedirectResponse
from ..services.activity_service import record_activity
from ..services.health_service import SystemHealthService
from ..services.sync_service import SyncService
from ..utils.crypto import encrypt_token

router = APIRouter()


@router.get("/{provider}/redirect", response_model=OAuthRedirectResponse)
def oauth_redirect(
    provider: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    oauth_registry=Depends(get_oauth_registry),
) -> OAuthRedirectResponse:
    provider = provider.lower()
    if provider not in SUPPORTED_PROVIDERS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported provider")

    client = oauth_registry[provider]
    state = client.generate_state(current_user.id)
    url = client.get_redirect_url(state=state)
    record_activity(db, user_id=current_user.id, action_type="oauth_redirect", message=f"Started {provider} OAuth flow")
    db.commit()
    return OAuthRedirectResponse(authorization_url=url)


@router.get("/{provider}/callback")
def oauth_callback(
    request: Request,
    provider: str,
    code: str | None = Query(default=None),
    state: str | None = Query(default=None),
    error: str | None = Query(default=None),
    db: Session = Depends(get_db),
    oauth_registry=Depends(get_oauth_registry),
    settings: Settings = Depends(get_settings),
) -> RedirectResponse:
    provider = provider.lower()
    success_url = f"{settings.FRONTEND_OAUTH_CALLBACK_URL}?provider={provider}&status=success"
    error_url = f"{settings.FRONTEND_OAUTH_CALLBACK_URL}?provider={provider}&status=error"

    if error:
        return RedirectResponse(f"{error_url}&reason={error}")
    if not state or provider not in SUPPORTED_PROVIDERS:
        return RedirectResponse(f"{error_url}&reason=invalid_state")

    client = oauth_registry[provider]
    try:
        user_id = client.verify_state(state)
    except Exception:  # pylint: disable=broad-except
        return RedirectResponse(f"{error_url}&reason=state")

    user = db.get(User, user_id)
    if not user:
        return RedirectResponse(f"{error_url}&reason=user_missing")

    if not code:
        return RedirectResponse(f"{error_url}&reason=no_code")

    try:
        tokens = client.exchange_code(code)
    except Exception as exc:  # pylint: disable=broad-except
        return RedirectResponse(f"{error_url}&reason=token&detail={exc}")

    connection = db.scalar(
        select(OAuthConnection).where(OAuthConnection.user_id == user.id, OAuthConnection.provider == provider)
    )
    encrypted_access = encrypt_token(tokens.access_token)
    encrypted_refresh = encrypt_token(tokens.refresh_token) if tokens.refresh_token else None
    if connection:
        connection.access_token = encrypted_access
        if encrypted_refresh:
            connection.refresh_token = encrypted_refresh
        connection.expires_at = tokens.expires_at
        connection.scope = tokens.scope
        connection.updated_at = datetime.now(timezone.utc)
    else:
        connection = OAuthConnection(
            user_id=user.id,
            provider=provider,
            access_token=encrypted_access,
            refresh_token=encrypted_refresh,
            expires_at=tokens.expires_at,
            scope=tokens.scope,
            connected_at=datetime.now(timezone.utc),
        )
        db.add(connection)

    record_activity(
        db,
        user_id=user.id,
        action_type="oauth_connect",
        message=f"{provider} account connected",
        metadata={"ip": request.client.host if request.client else None},
    )

    db.commit()

    health_service = SystemHealthService(db=db)
    sync_service = SyncService(db=db, oauth_registry=oauth_registry, health_service=health_service)
    try:
        sync_service.sync_provider(user, provider)
    except Exception:  # pylint: disable=broad-except
        db.rollback()

    return RedirectResponse(success_url)

