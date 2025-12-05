"""Account overview endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..core.constants import SUPPORTED_PROVIDERS
from ..core.dependencies import get_current_user, get_db
from ..models import OAuthConnection, User
from ..schemas import AccountsResponse
from ..services.activity_service import record_activity

router = APIRouter()


@router.get("", response_model=AccountsResponse)
def list_accounts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> AccountsResponse:
    connections = {
        conn.provider: conn
        for conn in db.query(OAuthConnection).filter(OAuthConnection.user_id == current_user.id).all()
    }
    profiles = {profile.platform: profile for profile in current_user.profiles}

    accounts = []
    for provider in SUPPORTED_PROVIDERS:
        connection = connections.get(provider)
        profile = profiles.get(provider)
        accounts.append(
            {
                "provider": provider,
                "connected": bool(connection),
                "status": "Connected" if connection else "Not connected",
                "username": profile.username if profile else None,
                "email": profile.email if profile else None,
                "last_synced_at": connection.updated_at if connection else None,
            }
        )
    return AccountsResponse(accounts=accounts)


@router.post("/{provider}/disconnect", response_model=AccountsResponse)
def disconnect_provider(
    provider: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AccountsResponse:
    provider = provider.lower()
    if provider not in SUPPORTED_PROVIDERS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported provider")

    connection = (
        db.query(OAuthConnection)
        .filter(OAuthConnection.user_id == current_user.id, OAuthConnection.provider == provider)
        .first()
    )
    if connection:
        db.delete(connection)
        record_activity(
            db,
            user_id=current_user.id,
            action_type="oauth_disconnect",
            message=f"{provider} connection revoked",
        )
        db.commit()
    return list_accounts(db=db, current_user=current_user)

