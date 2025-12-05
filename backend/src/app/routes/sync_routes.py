"""Endpoints to trigger manual sync operations."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from ..core.dependencies import get_current_user, get_sync_service
from ..models import User
from ..schemas import SyncResponse
from ..services.sync_service import SyncService

router = APIRouter()


@router.post("/{provider}", response_model=SyncResponse)
def sync_provider(
    provider: str,
    current_user: User = Depends(get_current_user),
    sync_service: SyncService = Depends(get_sync_service),
) -> SyncResponse:
    try:
        result = sync_service.sync_provider(current_user, provider)
    except ValueError as exc:  # pylint: disable=broad-except
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    return SyncResponse(
        provider=result.provider,
        status="completed",
        synced_signals=result.synced_signals,
        detected_anomalies=result.detected_anomalies,
    )


@router.post("/all", response_model=list[SyncResponse])
def sync_all(
    current_user: User = Depends(get_current_user),
    sync_service: SyncService = Depends(get_sync_service),
) -> list[SyncResponse]:
    results = sync_service.sync_all_for_user(current_user)
    return [
        SyncResponse(
            provider=result.provider,
            status="completed",
            synced_signals=result.synced_signals,
            detected_anomalies=result.detected_anomalies,
        )
        for result in results
    ]

