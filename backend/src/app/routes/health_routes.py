"""System health endpoints."""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends

from ..core.config import get_settings
from ..core.dependencies import get_current_user, get_health_service
from ..models import User
from ..schemas import HealthStatusResponse, SystemHealthSchema
from ..services.health_service import SystemHealthService

router = APIRouter()


@router.get("/health", response_model=HealthStatusResponse, include_in_schema=False)
def health_probe() -> HealthStatusResponse:
    settings = get_settings()
    return HealthStatusResponse(
        status="healthy",
        timestamp=datetime.now(timezone.utc),
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
    )


@router.get("/system-health", response_model=SystemHealthSchema)
def get_system_health(
    current_user: User = Depends(get_current_user),
    service: SystemHealthService = Depends(get_health_service),
) -> SystemHealthSchema:
    record = service.update_score(current_user.id)
    return SystemHealthSchema.from_orm(record)

