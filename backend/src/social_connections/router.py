from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from .schemas import (
    SocialConnectionCreate,
    SocialConnectionUpdate,
    SocialConnectionResponse,
    SocialConnectionsList,
    PlatformSyncRequest,
)
from .service import SocialConnectionService
from src.auth.models import User
from src.core.database import get_db
from src.core.security import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/connections", tags=["Social Connections"])


@router.post(
    "/",
    response_model=SocialConnectionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add social connection",
    description="Connect a social media platform",
)
async def add_connection(
    connection_data: SocialConnectionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add new social media connection"""
    service = SocialConnectionService(db)
    return await service.add_connection(current_user.id, connection_data)


@router.get(
    "/",
    response_model=SocialConnectionsList,
    summary="Get all connections",
    description="Get all connected social media platforms",
)
async def get_connections(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all social connections for current user"""
    service = SocialConnectionService(db)
    return await service.get_all_connections(current_user.id)


@router.put(
    "/{connection_id}",
    response_model=SocialConnectionResponse,
    summary="Update connection",
    description="Update social connection data",
)
async def update_connection(
    connection_id: int,
    update_data: SocialConnectionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update social connection"""
    service = SocialConnectionService(db)
    return await service.update_connection(connection_id, update_data)


@router.delete(
    "/{connection_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete connection",
    description="Disconnect social media platform",
)
async def delete_connection(
    connection_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete social connection"""
    service = SocialConnectionService(db)
    await service.delete_connection(connection_id)


@router.post(
    "/sync",
    response_model=SocialConnectionResponse,
    summary="Sync platform data",
    description="Sync data from social media platform (simulated for demo)",
)
async def sync_platform(
    sync_request: PlatformSyncRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Simulate syncing data from platform.

    In production, this would:
    1. Use OAuth to authenticate with platform
    2. Fetch real user data via platform API
    3. Update connection information

    For demo purposes, generates realistic random data.
    """
    service = SocialConnectionService(db)
    return await service.simulate_platform_sync(current_user.id, sync_request.platform)
