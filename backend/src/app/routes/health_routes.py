"""System health endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Depends

from ..core.dependencies import get_current_user, get_health_service
from ..models import User
from ..schemas import SystemHealthSchema
from ..services.health_service import SystemHealthService

router = APIRouter()


@router.get("/system-health", response_model=SystemHealthSchema)
def get_system_health(
    current_user: User = Depends(get_current_user),
    service: SystemHealthService = Depends(get_health_service),
) -> SystemHealthSchema:
    record = service.update_score(current_user.id)
    return SystemHealthSchema.from_orm(record)

